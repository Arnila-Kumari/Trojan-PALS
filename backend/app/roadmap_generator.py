"""Trojan PALS — Personalized Research Roadmap Generator.

Connects USC faculty, labs, courses, and demo research peers.
Does not require an LLM or modify the course recommender.
"""

import csv
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_csv(filename: str) -> List[Dict[str, str]]:
    """Read a CSV dataset safely."""
    path = DATA_DIR / filename

    if not path.exists():
        return []

    with path.open(
        "r", encoding="utf-8-sig", newline=""
    ) as file:
        return list(csv.DictReader(file))


def normalize(value: Any) -> str:
    """Normalize text for matching."""
    return re.sub(
        r"\s+", " ", str(value or "").strip()
    ).casefold()


def normalize_course(code: str) -> str:
    """Normalize course codes such as CSCI 544 / CSCI-544."""
    return re.sub(r"[^A-Z0-9]", "", str(code).upper())


def get_value(row: Dict, *keys: str) -> str:
    """Get the first nonempty value from possible column names."""
    for key in keys:
        value = row.get(key)
        if value is not None and str(value).strip():
            return str(value).strip()
    return ""


def find_professor(
    professor_name: str,
    faculty: List[Dict[str, str]]
) -> Optional[Dict[str, str]]:
    """Find a professor in the faculty dataset."""
    target = normalize(professor_name)

    for row in faculty:
        name = get_value(
            row, "professor", "professor_name", "faculty_name", "name"
        )
        if normalize(name) == target:
            return row

    return None


def find_professor_courses(
    professor_name: str,
    teaching: List[Dict[str, str]]
) -> List[Dict[str, Any]]:
    """Retrieve historical professor teaching relationships."""
    matches = []

    for row in teaching:
        name = get_value(
            row, "professor_name", "faculty_name", "instructor"
        )

        if normalize(name) != normalize(professor_name):
            continue

        matches.append({
            "course_id": get_value(
                row, "course_id", "course_code"
            ),
            "course_title": get_value(
                row, "course_title", "course_name"
            ),
            "semester": get_value(row, "semester"),
            "source_url": get_value(
                row, "source_url", "url"
            ),
            "historical": True,
        })

    return matches


def find_demo_peers(
    professor_name: str,
    lab_name: str,
    peers: List[Dict[str, str]]
) -> List[Dict[str, Any]]:
    """Match fictional demo student profiles to a professor or lab."""
    matches = []

    for row in peers:
        peer_professor = get_value(
            row, "professor", "professor_name"
        )
        peer_lab = get_value(
            row, "lab_name", "lab"
        )

        same_professor = (
            peer_professor
            and normalize(peer_professor)
            == normalize(professor_name)
        )

        same_lab = (
            lab_name
            and peer_lab
            and (
                normalize(lab_name) in normalize(peer_lab)
                or normalize(peer_lab) in normalize(lab_name)
            )
        )

        if same_professor or same_lab:
            matches.append({
                "display_name": get_value(
                    row, "display_name", "student"
                ),
                "lab_name": peer_lab,
                "research_activity": get_value(
                    row, "research_activity", "lab_work"
                ),
                "research_interests": get_value(
                    row, "research_interests", "research_topic"
                ),
                "synthetic": True,
                "contactable": False,
            })

    return matches


def tokenize(value: str) -> set:
    """Extract meaningful words for course-topic matching."""
    stopwords = {
        "and", "the", "for", "with", "from", "into",
        "this", "that", "course", "computer", "science",
        "research", "systems", "introduction", "advanced",
        "design", "large", "software", "applications",
    }

    return {
        token
        for token in re.findall(
            r"[a-z]{3,}", normalize(value)
        )
        if token not in stopwords
    }


def course_level_bonus(course_id: str) -> float:
    """Prefer 500, then 600, then 400 level courses."""
    match = re.search(r"(\d{3})", course_id)

    if not match:
        return 0.0

    level = int(match.group(1)) // 100

    return {
        5: 0.3,
        6: 0.2,
        4: 0.1,
    }.get(level, 0.0)


def recommend_preparation_courses(
    interests: List[str],
    research_areas: str,
    courses: List[Dict[str, str]],
    completed_courses: List[str],
    professor_courses: List[Dict[str, Any]],
    limit: int = 3,
) -> List[Dict[str, Any]]:
    """Rank courses based on research-topic overlap."""

    query = " ".join(interests) + " " + research_areas
    query_tokens = tokenize(query)

    completed = {
        normalize_course(code)
        for code in completed_courses
    }

    professor_taught = {
        normalize_course(row["course_id"])
        for row in professor_courses
    }

    ranked = []

    for course in courses:
        code = get_value(
            course, "course_id", "course_code"
        )

        title = get_value(
            course, "course_title", "course_name"
        )

        if not code or not title:
            continue

        if normalize_course(code) in completed:
            continue

        academic_text = " ".join([
            title,
            get_value(course, "description"),
            get_value(course, "topics"),
        ])

        course_tokens = tokenize(academic_text)

        overlap = query_tokens & course_tokens

        # Require meaningful academic overlap.
        if not overlap:
            continue

        score = len(overlap)

        # A relevant course taught by the professor
        # is especially valuable.
        if normalize_course(code) in professor_taught:
            score += 1.5

        score += course_level_bonus(code)

        ranked.append((
            score,
            {
                "course_id": code,
                "course_title": title,
                "reason": (
                    "Develops knowledge related to "
                    + ", ".join(sorted(overlap)[:3])
                    + "."
                ),
                "source_url": get_value(
                    course, "source_url", "official_source_url"
                ),
            }
        ))

    ranked.sort(
        key=lambda item: (
            -item[0],
            item[1]["course_id"]
        )
    )

    return [
        course
        for _, course in ranked[:limit]
    ]


def generate_roadmap(
    student: Dict[str, Any],
    selected_professor: str,
    research_recommendation: Optional[Dict[str, Any]] = None,
    course_recommendations: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """Generate a personalized USC research pathway."""

    faculty = load_csv("faculty_lab_verified.csv")
    teaching = load_csv("professor_courses_verified.csv")
    peers = load_csv("research_mentors_demo.csv")
    courses = load_csv("courses.csv")

    professor = find_professor(
        selected_professor, faculty
    )

    if not professor:
        return {
            "status": "not_found",
            "professor": selected_professor,
            "message": "Professor not found in the available faculty data.",
        }

    professor_name = get_value(
        professor, "professor", "professor_name", "faculty_name", "name"
    )

    research_areas = get_value(
        professor, "research_areas", "research_interests"
    )

    lab_name = get_value(
        professor, "lab_name", "lab"
    )

    lab_url = get_value(
        professor, "lab_url", "source_url", "website"
    )

    interests = student.get("interests") or []
    skills = student.get("skills") or []
    completed = student.get("completed_courses") or []

    teaching_matches = find_professor_courses(
        professor_name, teaching
    )

    completed_normalized = {
        normalize_course(code)
        for code in completed
    }

    for row in teaching_matches:
        row["already_completed"] = (
            normalize_course(row["course_id"])
            in completed_normalized
        )

    # Use research recommender output when available.
    papers = []

    if research_recommendation:
        papers = (
            research_recommendation.get("relevant_papers")
            or research_recommendation.get("papers")
            or []
        )

    # Use the existing course recommender's results
    # if supplied; otherwise use local topic matching.
    if course_recommendations:
        preparation = [
            {
                "course_id": row.get(
                    "course_id", row.get("course_code", "")
                ),
                "course_title": row.get(
                    "course_title", row.get("course_name", "")
                ),
                "reason": row.get(
                    "reason", "Relevant academic preparation."
                ),
                "source_url": row.get("source_url", ""),
            }
            for row in course_recommendations
            if normalize_course(
                row.get("course_id", row.get("course_code", ""))
            ) not in completed_normalized
        ][:3]

    else:
        preparation = recommend_preparation_courses(
            interests=interests,
            research_areas=research_areas,
            courses=courses,
            completed_courses=completed,
            professor_courses=teaching_matches,
        )

    demo_peers = find_demo_peers(
        professor_name, lab_name, peers
    )

    steps = []

    steps.append({
        "type": "explore",
        "title": "Explore the professor's research",
        "detail": (
            f"Explore {professor_name}'s work on "
            f"{research_areas}."
        ),
        "url": lab_url,
    })

    if preparation:
        first = preparation[0]

        steps.append({
            "type": "prepare",
            "title": "Build relevant research skills",
            "detail": (
                f"Consider {first['course_id']} — "
                f"{first['course_title']} as preparation. "
                "Check prerequisites and course availability."
            ),
        })

    if teaching_matches:
        available = [
            row
            for row in teaching_matches
            if not row["already_completed"]
        ]

        if available:
            first = available[0]

            steps.append({
                "type": "faculty_course",
                "title": "Learn from the professor",
                "detail": (
                    f"{professor_name} previously taught "
                    f"{first['course_id']}. Consider this "
                    "course if it is offered again."
                ),
            })

    if demo_peers:
        steps.append({
            "type": "peer_demo",
            "title": "Explore a student research example",
            "detail": (
                "Review the fictional peer research profile "
                "to understand the kinds of skills and "
                "activities involved in lab research."
            ),
        })

    steps.append({
        "type": "outreach",
        "title": "Prepare professor outreach",
        "detail": (
            "Read a relevant publication, describe your "
            "existing skills, and ask a specific question "
            "about possible research involvement."
        ),
    })

    return {
        "status": "ok",
        "professor": professor_name,
        "research_areas": research_areas,
        "lab": {
            "name": lab_name,
            "source_url": lab_url,
        },
        "papers": papers,
        "preparation_courses": preparation,
        "professor_courses": teaching_matches,
        "mentors": [],
        "demo_peer_examples": demo_peers,
        "steps": steps,
        "notes": [
            "Course suggestions are preparation ideas, not official prerequisites.",
            "Historical teaching does not guarantee future offerings.",
            "Demo student profiles are fictional and cannot be contacted.",
        ],
    }