import os

import httpx

QWEN_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


async def extract_issue(text: str, image_url: str | None = None) -> dict:
    api_key = os.getenv("QWEN_API_KEY", "")
    if not api_key:
        return {"issue_id": "", "language": "en", "confidence": 0}

    messages = [
        {
            "role": "system",
            "content": (
                "You are a civic issue classifier for Pakistan. "
                "Extract issue_id, city, language (en/ur), and confidence (0-1). "
                "Return only valid JSON."
            ),
        },
        {"role": "user", "content": text},
    ]

    if image_url:
        messages[1]["content"] = [
            {"type": "text", "text": text},
            {"type": "image_url", "image_url": {"url": image_url}},
        ]

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            QWEN_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={"model": "qwen-vl-max", "messages": messages},
        )
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"]
    import json
    return json.loads(content)
