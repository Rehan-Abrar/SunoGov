import json
import os
import re
import logging
import base64
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

from openai import AsyncOpenAI, APITimeoutError, APIConnectionError, APIError
from PIL import Image

logger = logging.getLogger(__name__)

MODEL_NAME = os.getenv("QWEN_MODEL_NAME", "Qwen-Ambassador/Qwen3.7-Plus")
BASE_URL = os.getenv("QWEN_BASE_URL", "https://api-inference.modelscope.ai/v1")

_client: AsyncOpenAI | None = None
_executor = ThreadPoolExecutor(max_workers=2)


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("MODELSCOPE_API_KEY", "")
        if not api_key:
            raise RuntimeError("MODELSCOPE_API_KEY not set in environment")
        _client = AsyncOpenAI(base_url=BASE_URL, api_key=api_key)
    return _client


def _strip_markdown_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _parse_json_response(content: str) -> dict | None:
    cleaned = _strip_markdown_fences(content)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{[^{}]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return None


def _build_classification_prompt(issue_ids: list[str], cities: list[str]) -> str:
    ids_str = ", ".join(issue_ids)
    cities_str = ", ".join(cities)
    return (
        "You are a civic complaint classifier for Pakistan.\n\n"
        "Given a user complaint (text or image), return ONLY this JSON:\n"
        "{\n"
        '  "issue_id": "<one of the valid issue IDs or null if not a civic issue>",\n'
        '  "city": "<Pakistani city name or null if not determinable>",\n'
        '  "language": "urdu" | "english" | "roman_urdu",\n'
        '  "confidence": <0.0 to 1.0>\n'
        "}\n\n"
        f"Valid issue_ids: [{ids_str}]\n"
        f"Valid cities: [{cities_str}]\n\n"
        "IMPORTANT RULES:\n"
        "1. If city is not mentioned or not determinable, return \"city\": null.\n"
        "2. If the input (especially images) does NOT clearly show a civic issue "
        "(e.g., selfie, pet, random object, meme, landscape, non-civic content), "
        "return \"issue_id\": null.\n"
        "3. Only classify into one of the valid issue_ids listed above.\n"
        "4. For images, analyze the visual content to identify the civic issue.\n"
        "Return ONLY valid JSON. No explanation, no markdown."
    )


def _to_jpeg_base64_sync(image_base64: str, max_dim: int = 2048) -> str:
    """Convert any image format to JPEG base64 and resize to fit within max_dim."""
    try:
        raw = base64.b64decode(image_base64)
        img = Image.open(BytesIO(raw))
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")
        w, h = img.size
        if w > max_dim or h > max_dim:
            ratio = min(max_dim / w, max_dim / h)
            new_size = (int(w * ratio), int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)
            logger.info(f"Resized image from {w}x{h} to {new_size[0]}x{new_size[1]}")
        buf = BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception as e:
        logger.warning(f"Failed to convert image to JPEG: {e}")
        return image_base64


async def _to_jpeg_base64(image_base64: str, max_dim: int = 2048) -> str:
    """Run CPU-bound image conversion in a thread pool to avoid blocking the event loop."""
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _to_jpeg_base64_sync, image_base64, max_dim)


async def classify_text(
    text: str,
    issue_ids: list[str],
    cities: list[str],
) -> dict:
    client = _get_client()
    system_prompt = _build_classification_prompt(issue_ids, cities)

    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text},
            ],
            timeout=30,
        )
        content = response.choices[0].message.content or ""
        logger.info(f"Raw Qwen response: {content}")
    except APITimeoutError:
        logger.error("Qwen API timeout")
        raise
    except APIConnectionError:
        logger.error("Qwen API connection error")
        raise
    except APIError as e:
        logger.error(f"Qwen API error: {e}")
        raise

    result = _parse_json_response(content)
    if result is None:
        logger.error(f"Failed to parse Qwen response: {content[:500]}")
        raise ValueError("Could not parse classification response")

    result.setdefault("issue_id", None)
    result.setdefault("city", None)
    result.setdefault("language", "english")
    result.setdefault("confidence", 0.0)

    if isinstance(result["confidence"], (int, float)):
        result["confidence"] = max(0.0, min(1.0, float(result["confidence"])))
    else:
        result["confidence"] = 0.0

    return result


async def classify_image(
    image_base64: str,
    text: str,
    issue_ids: list[str],
    cities: list[str],
) -> dict:
    client = _get_client()
    system_prompt = _build_classification_prompt(issue_ids, cities)

    jpeg_b64 = await _to_jpeg_base64(image_base64)

    data_url = f"data:image/jpeg;base64,{jpeg_b64}"
    user_content = [
        {"type": "image_url", "image_url": {"url": data_url}},
    ]
    if text:
        user_content.insert(0, {"type": "text", "text": text})

    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            timeout=45,
        )
        content = response.choices[0].message.content or ""
        logger.info(f"Raw Qwen vision response: {content}")
    except APITimeoutError:
        logger.error("Qwen Vision API timeout")
        raise
    except APIConnectionError:
        logger.error("Qwen Vision API connection error")
        raise
    except APIError as e:
        logger.error(f"Qwen Vision API error: {e}")
        raise

    result = _parse_json_response(content)
    if result is None:
        logger.error(f"Failed to parse Qwen vision response: {content[:500]}")
        raise ValueError("Could not parse image classification response")

    result.setdefault("issue_id", None)
    result.setdefault("city", None)
    result.setdefault("language", "english")
    result.setdefault("confidence", 0.0)

    if isinstance(result["confidence"], (int, float)):
        result["confidence"] = max(0.0, min(1.0, float(result["confidence"])))
    else:
        result["confidence"] = 0.0

    return result
