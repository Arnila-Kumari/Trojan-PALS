import os
from functools import lru_cache

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)


@lru_cache(maxsize=1)
def get_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is missing from .env"
        )

    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
        timeout=12.0,
        max_retries=1,
    )


def generate_text(
    prompt: str,
    system_prompt: str = (
        "You are Trojan PALS, a helpful USC "
        "academic course recommendation assistant."
    ),
) -> str:
    """Generate text using Groq."""

    try:
        response = get_client().chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
            max_tokens=700,
        )

        return (
            response.choices[0].message.content or ""
        ).strip()

    except Exception as exc:
        raise RuntimeError(
            f"Groq request failed: {exc}"
        ) from exc
        
def generate_structured_json(
    prompt: str,
    system_prompt: str,
) -> str:
    """Generate JSON for research method extraction.

    Uses a larger token budget and requests JSON output.
    Does not change the existing generate_text() behavior.
    """
    import json

    try:
        response = get_client().chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        system_prompt
                        + "\nReturn a valid JSON object only."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
            max_completion_tokens=2500,
            response_format={"type": "json_object"},
        )

        choice = response.choices[0]
        content = (choice.message.content or "").strip()

        if not content:
            raise RuntimeError(
                "Groq returned empty JSON. "
                f"finish_reason={choice.finish_reason}"
            )

        # Validate JSON before passing it to the analyzer.
        parsed = json.loads(content)

        if not isinstance(parsed, dict):
            raise RuntimeError(
                "Expected a JSON object from Groq."
            )

        return content

    except Exception as exc:
        raise RuntimeError(
            f"Groq structured extraction failed: {exc}"
        ) from exc
