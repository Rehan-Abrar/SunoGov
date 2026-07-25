import json
import os
import re
import logging

from openai import OpenAI, APIError, APITimeoutError, APIConnectionError

logger = logging.getLogger(__name__)

MODEL_NAME = "Qwen-Ambassador/Qwen3.7-Plus"
BASE_URL = "https://api-inference.modelscope.ai/v1"

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("MODELSCOPE_API_KEY", "")
        if not api_key:
            raise RuntimeError("MODELSCOPE_API_KEY not set in environment")
        _client = OpenAI(base_url=BASE_URL, api_key=api_key)
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
        "Given a user complaint (text or image description), return ONLY this JSON:\n"
        "{\n"
        '  "issue_id": "<one of the valid issue IDs>",\n'
        '  "city": "<Pakistani city name>",\n'
        '  "language": "urdu" | "english" | "roman_urdu",\n'
        '  "confidence": <0.0 to 1.0>\n'
        "}\n\n"
        f"Valid issue_ids: [{ids_str}]\n"
        f"Valid cities: [{cities_str}]\n\n"
        "If city is not mentioned or not determinable, return \"city\": null.\n"
        "If the input is an image, describe the civic issue shown.\n"
        "Return ONLY valid JSON. No explanation, no markdown."
    )


def classify_text(
    text: str,
    issue_ids: list[str],
    cities: list[str],
) -> dict:
    client = _get_client()
    system_prompt = _build_classification_prompt(issue_ids, cities)

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text},
            ],
            timeout=30,
        )
        content = response.choices[0].message.content or ""
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
        raise ValueError(f"Could not parse classification response")

    result.setdefault("issue_id", "")
    result.setdefault("city", None)
    result.setdefault("language", "english")
    result.setdefault("confidence", 0.0)

    if isinstance(result["confidence"], (int, float)):
        result["confidence"] = max(0.0, min(1.0, float(result["confidence"])))
    else:
        result["confidence"] = 0.0

    return result


def classify_image(
    image_base64: str,
    text: str,
    issue_ids: list[str],
    cities: list[str],
) -> dict:
    client = _get_client()
    system_prompt = _build_classification_prompt(issue_ids, cities)

    data_url = f"data:image/jpeg;base64,{image_base64}"

    user_content = [
        {
            "type": "image_url",
            "image_url": {"url": data_url},
        },
    ]
    if text:
        user_content.insert(0, {"type": "text", "text": text})

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            timeout=45,
        )
        content = response.choices[0].message.content or ""
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

    result.setdefault("issue_id", "")
    result.setdefault("city", None)
    result.setdefault("language", "english")
    result.setdefault("confidence", 0.0)

    if isinstance(result["confidence"], (int, float)):
        result["confidence"] = max(0.0, min(1.0, float(result["confidence"])))
    else:
        result["confidence"] = 0.0

    return result
