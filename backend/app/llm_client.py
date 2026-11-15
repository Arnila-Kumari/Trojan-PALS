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