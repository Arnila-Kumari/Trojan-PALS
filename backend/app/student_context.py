"""Pure helpers for profile-aware recommendations; no database or LLM calls."""
import re
from typing import Any, Dict, Iterable, List, Mapping


def normalize_course_code(value: str) -> str:
    """Normalize CSCI 544, csci-544, and CSCI544 to CSCI-544."""
    compact = re.sub(r"[^A-Z0-9]", "", str(value or "").upper())
    match = re.fullmatch(r"([A-Z]{2,6})(\d{3}[A-Z]?)", compact)
    return f"{match.group(1)}-{match.group(2)}" if match else compact


def completed_course_codes(values: Iterable[str]) -> set:
    return {normalize_course_code(v) for v in values if normalize_course_code(v)}


def exclude_completed(courses: List[Dict[str, Any]], completed: Iterable[str]) -> List[Dict[str, Any]]:
    """Exclude all sections of a completed course; preserve ordering."""
    blocked = completed_course_codes(completed)
    return [course for course in courses if normalize_course_code(course.get("course_id", "")) not in blocked]


def profile_to_preferences(profile: Mapping[str, Any]) -> Dict[str, Any]:
    """Map frontend profile fields; leave numeric weekly workload unmapped."""
    assessment = str(profile.get("assessment") or "").lower()
    return {
        "interests": [v for v in profile.get("interests", []) if isinstance(v, str)],
        "completed_courses": [v for v in profile.get("completed", []) if isinstance(v, str)],
        "preferred_assessment": {"projects": "projects", "exams": "exams"}.get(assessment, "any"),
    }
