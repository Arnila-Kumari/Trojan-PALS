"""Research matching + roadmap for Trojan PALS (the research side of the app).

Uses app/research (offline TF-IDF matching over sourced data) and, when GROQ_API_KEY is set,
the team's existing Groq client (app/llm_client.generate_text) for optional explanations and
email polish. Every LLM output is guarded; any LLM failure falls back to template text.

    from app.research_engine import research_plan, course_research
    research_plan("NLP in healthcare", {"name": "Ari", "level": "Master's in CS"})
    course_research("CSCI 644")
"""

import csv
import os
import re
from functools import lru_cache
from pathlib import Path

from .research import Research
from .research import llm as research_llm

DATA = Path(__file__).resolve().parents[1] / "data" / "research"   # research keeps its own data; course files untouched


def norm_course_id(value: str) -> str:
    """'CSCI 544', 'csci544', 'CSCI-544' -> 'CSCI-544' (the data files' format)."""
    m = re.match(r"^\s*([A-Za-z]{2,5})\s*-?\s*(\d{3}[A-Za-z]?)\s*$", value or "")
    return f"{m.group(1).upper()}-{m.group(2).upper()}" if m else (value or "").strip().upper()


@lru_cache(maxsize=1)
def engine() -> Research:
    if os.getenv("GROQ_API_KEY"):
        from .llm_client import generate_text
        research_llm.set_client(lambda system, user: generate_text(user, system_prompt=system))
    return Research(DATA)


def research_plan(query: str, student: dict | None = None, top_k: int = 5, cs_only: bool = False,
                  explain: bool = False) -> dict:
    """Researchers + 5-stage roadmap + outreach draft. See app/research/__init__.py for the shape."""
    return engine().match(query, student=student or {}, k=top_k, cs_only=cs_only, explain=explain)


def course_research(course_id: str) -> dict:
    """Research badge for a course card: who teaches it (if a researcher) or related researchers."""
    return engine().course_badge(norm_course_id(course_id))


def prep_courses(query: str, level: str | None = None, top_k: int = 5) -> list[dict]:
    return engine().prep_courses(query, level=level, k=top_k)


def write_professor_courses(path: Path = DATA / "professor_courses.csv") -> int:
    """Fill data/professor_courses.csv: researcher -> Spring 2027 course they teach (from the schedule)."""
    pc = engine().data.prof_courses
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["professor", "course_id", "course_title", "term", "source_url"])
        w.writeheader()
        for r in pc.itertuples(index=False):
            w.writerow({"professor": r.professor, "course_id": r.course_id, "course_title": r.course_title,
                        "term": "Spring 2027", "source_url": r.source_url})
    return len(pc)


if __name__ == "__main__":
    print(f"wrote {write_professor_courses()} professor-course links to data/professor_courses.csv")
