"""Trojan PALS — Course and research roadmap chat router."""

import json
import logging
import re
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from .chat_service import (
    ChatRequest,
    ChatResponse,
    ChatTurn,
    chat,
)
from .llm_client import generate_text
from .roadmap_generator import generate_roadmap

logger = logging.getLogger(__name__)


class RoutedChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: List[ChatTurn] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)
    student: Dict[str, Any] = Field(default_factory=dict)
    selected_professor: Optional[str] = None


class RoutedChatResponse(ChatResponse):
    intent: str = "course"
    roadmap: Optional[Dict[str, Any]] = None


RESEARCH_WORDS = (
    "research", "lab", "laboratory", "publication",
    "paper", "professor", "faculty",
)

ROADMAP_WORDS = (
    "how can i", "how do i", "roadmap", "pathway",
    "prepare", "get involved", "work with",
    "join", "reach out", "contact",
)


def normalize_name(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).casefold()


def find_professor(
    message: str,
    selected_professor: Optional[str] = None,
) -> Optional[str]:
    """Identify a professor using known faculty records."""

    if selected_professor:
        return selected_professor.strip()

    from pathlib import Path
    import csv

    path = (
        Path(__file__).resolve().parent.parent
        / "data"
        / "faculty_lab_verified.csv"
    )

    if not path.exists():
        return None

    with path.open(encoding="utf-8-sig", newline="") as f:
        faculty = list(csv.DictReader(f))

    normalized_message = normalize_name(message)

    for row in faculty:
        name = (
            row.get("professor")
            or row.get("professor_name")
            or row.get("faculty_name")
            or row.get("name")
            or ""
        ).strip()

        if name and normalize_name(name) in normalized_message:
            return name

    return None


def detect_intent(
    message: str,
    professor: Optional[str] = None,
) -> str:
    """Classify course, research, or roadmap requests."""

    q = message.casefold()

    mentions_research = any(
        word in q for word in RESEARCH_WORDS
    )

    wants_pathway = any(
        phrase in q for phrase in ROADMAP_WORDS
    )

    if professor and (
        mentions_research or wants_pathway
    ):
        return "roadmap"

    if mentions_research and wants_pathway:
        return "roadmap"

    if mentions_research:
        return "research"

    return "course"


def roadmap_to_reply(
    roadmap: Dict[str, Any],
    student: Dict[str, Any],
    message: str,
) -> str:
    """Use Groq to explain an evidence-grounded roadmap."""

    system_prompt = """
You are Trojan PALS, a friendly USC research advisor.

Explain the supplied research roadmap to the student.

Rules:
- Use only the provided roadmap evidence.
- Never invent professors, publications, courses,
  prerequisites, openings, or student mentors.
- Distinguish historical professor teaching from
  confirmed upcoming teaching.
- Synthetic student profiles are fictional examples,
  not real contactable mentors.
- Never claim that joining a lab is guaranteed.
- Do not display match percentages.
- Do not use tables.
- Keep the response concise and conversational.
- Use numbered steps separated by blank lines.
- Mention completed coursework when relevant.
- Suggest concrete preparation and outreach actions.
- Do not mention missing data unless necessary
  to avoid a misleading recommendation.
"""

    payload = {
        "student_message": message,
        "student_profile": student,
        "roadmap": roadmap,
    }

    try:
        reply = generate_text(
            prompt=json.dumps(
                payload,
                ensure_ascii=False,
                default=str,
            ),
            system_prompt=system_prompt,
        )

        if reply.strip():
            return reply.strip()

    except Exception as exc:
        logger.warning(
            "Roadmap explanation failed: %s", exc
        )

    # Deterministic fallback if Groq is unavailable.
    professor = roadmap.get("professor", "the professor")

    lines = [
        f"Here's a research pathway toward "
        f"{professor}'s work:"
    ]

    for i, step in enumerate(
        roadmap.get("steps", [])[:5], 1
    ):
        lines.append(
            f"{i}. {step.get('title', 'Next step')}\n"
            f"{step.get('detail', '')}"
        )

    return "\n\n".join(lines)


def route_chat(
    request: RoutedChatRequest,
) -> RoutedChatResponse:
    """Route messages to course or research workflows."""

    message = request.message.strip()

    professor = find_professor(
        message,
        request.selected_professor,
    )

    # Reuse an explicitly mentioned professor from
    # recent history for follow-up questions.
    if not professor:
        for turn in reversed(request.history[-6:]):
            professor = find_professor(turn.content)
            if professor:
                break

    intent = detect_intent(message, professor)

    # COURSE WORKFLOW
    if intent == "course":
        course_request = ChatRequest(
            message=message,
            history=request.history,
            preferences=request.preferences,
        )

        result = chat(course_request)

        return RoutedChatResponse(
            **result.model_dump(),
            intent="course",
            roadmap=None,
        )

    # RESEARCH DISCOVERY
    # Your teammate's research recommender will
    # be connected here once it's available.
    if intent == "research":
        return RoutedChatResponse(
            reply=(
                "I can help you explore research at USC. "
                "Which professor or research area "
                "would you like to focus on?"
            ),
            preferences=request.preferences,
            recommendations=[],
            intent="research",
            roadmap=None,
        )

    # ROADMAP WORKFLOW
    if not professor:
        return RoutedChatResponse(
            reply=(
                "I can build a personalized research "
                "roadmap. Which USC professor or lab "
                "are you interested in?"
            ),
            preferences=request.preferences,
            recommendations=[],
            intent="roadmap",
            roadmap=None,
        )

    student = dict(request.student)

    # Use previously extracted academic interests
    # if the student profile does not contain them.
    if not student.get("interests"):
        student["interests"] = (
            request.preferences.get("interests") or []
        )

    if not student.get("completed_courses"):
        student["completed_courses"] = (
            request.preferences.get("completed_courses") or []
        )

    roadmap = generate_roadmap(
        student=student,
        selected_professor=professor,
    )

    if roadmap.get("status") != "ok":
        return RoutedChatResponse(
            reply=(
                "I couldn't find enough faculty "
                "information to build that roadmap. "
                "Could you check the professor's name?"
            ),
            preferences=request.preferences,
            recommendations=[],
            intent="roadmap",
            roadmap=roadmap,
        )

    reply = roadmap_to_reply(
        roadmap=roadmap,
        student=student,
        message=message,
    )

    return RoutedChatResponse(
        reply=reply,
        preferences=request.preferences,
        recommendations=[],
        intent="roadmap",
        roadmap=roadmap,
    )