
"""Trojan PALS — Course recommendation engine.

Supports:
- Neural semantic interest matching
- Academic subject relevance
- Professor-specific historical reviews
- Multiple instructors per course
- Courses without reviews
- Difficulty, workload, and assessment preferences
- Dynamic recommendation priorities
- 500 > 600 > 400 course-level preference
"""

import re
from collections import Counter

from .data_loader import build_catalog, number
from .models import (
    Recommendation,
    RecommendationResponse,
    StudentPreferences,
)
from .semantic_matcher import calculate_semantic_scores


# --------------------------------------------------
# Recommendation weights
# --------------------------------------------------

WEIGHTS = {
    "interest": {
        "interest": 0.65,
        "assessment": 0.20,
        "difficulty": 0.075,
        "workload": 0.075,
    },
    "balanced": {
        "interest": 0.45,
        "assessment": 0.20,
        "difficulty": 0.175,
        "workload": 0.175,
    },
    "workload": {
        "interest": 0.25,
        "assessment": 0.15,
        "difficulty": 0.25,
        "workload": 0.35,
    },
    "assessment": {
        "interest": 0.35,
        "assessment": 0.45,
        "difficulty": 0.10,
        "workload": 0.10,
    },
}


# --------------------------------------------------
# Academic subject matching
# --------------------------------------------------

SUBJECT_TERMS = {
    "nlp": (
        "nlp",
        "natural language",
        "language model",
        "text processing",
        "linguistics",
    ),
    "database": (
        "database",
        "sql",
        "relational",
    ),
    "deep_learning": (
        "deep learning",
        "neural network",
    ),
    "machine_learning": (
        "machine learning",
        "predictive modeling",
    ),
    "algorithms": (
        "algorithm",
        "dynamic programming",
        "complexity",
    ),
    "sustainability": (
        "sustainab",
        "environment",
        "climate",
    ),
}


def groups(text):
    text = (text or "").lower().replace("-", " ")

    return {
        key
        for key, terms in SUBJECT_TERMS.items()
        if any(term in text for term in terms)
    }


def academic_text(course):
    """Text used for semantic academic matching."""

    return " | ".join(
        str(course.get(key) or "")
        for key in (
            "course_title",
            "description",
            "topics",
        )
    )


# --------------------------------------------------
# Course-level preference
# --------------------------------------------------

def course_level_bonus(course_id, interest_score=None):
    """Small ranking bonus for preferred course levels.

    Preference order:
        500-level > 600-level > 400-level

    Only applies when academic interest relevance
    is sufficiently strong.

    This is a ranking preference, not a requirement.
    """

    if interest_score is None or interest_score < 0.20:
        return 0.0

    match = re.search(r"(\d{3})", course_id or "")

    if not match:
        return 0.0

    level = int(match.group(1)) // 100

    bonuses = {
        5: 5.0,
        6: 3.0,
        4: 1.0,
    }

    return bonuses.get(level, 0.0)


# --------------------------------------------------
# Assessment compatibility
# --------------------------------------------------

def assessment(review, preference):

    if preference == "any":
        return None

    mid = number(review.get("midterms_count"))
    final = number(review.get("final_exam"))
    projects = number(review.get("projects_count"))
    hw = number(review.get("homework_count"))

    style = (
        review.get("assessment_style") or ""
    ).lower()

    notes = (
        review.get("assessment_notes") or ""
    ).lower()

    has_exam = (
        (mid or 0) > 0
        or final == 1
    )

    if preference in ("exams", "no_exams"):

        if mid is None and final is None:
            return None

        if preference == "exams":
            return float(has_exam)

        return float(not has_exam)

    if preference == "homework":
        return (
            float(hw > 0)
            if hw is not None
            else None
        )

    if projects is None and "project" not in style:
        return None

    if not projects and "project" not in style:
        return 0.0

    dominant = any(
        term in style + " " + notes
        for term in (
            "project-heavy",
            "55%",
            "group project",
            "individual project",
        )
    )

    if dominant and not has_exam:
        return 1.0

    if dominant:
        return 0.75

    if not has_exam:
        return 0.55

    return 0.30


# --------------------------------------------------
# Workload compatibility
# --------------------------------------------------

def workload(review, preference):

    if preference == "any":
        return None

    label = (
        review.get("workload_level") or ""
    ).lower()

    if "very light" in label:
        level = 0

    elif "light" in label or "manageable" in label:
        level = 1

    elif "moderate" in label:
        level = 2

    elif "high" in label:
        level = 3

    else:
        return None

    target = {
        "light": 0,
        "moderate": 2,
        "high": 3,
    }[preference]

    if preference == "light":
        return max(
            0.0,
            1 - level / 3
        )

    return max(
        0.0,
        1 - abs(level - target) / 3
    )


# --------------------------------------------------
# Difficulty compatibility
# --------------------------------------------------

def difficulty(review, maximum):

    d = number(
        review.get("difficulty_1_5")
    )

    if d is None or maximum is None:
        return None

    if d <= maximum:
        return 1.0

    return max(
        0.0,
        1 - (d - maximum) / 2
    )


# --------------------------------------------------
# Utility functions
# --------------------------------------------------

def avg(values):

    values = [
        value
        for value in values
        if value is not None
    ]

    if not values:
        return None

    return sum(values) / len(values)


def most_common_value(reviews, key):

    values = [
        review.get(key)
        for review in reviews
        if review.get(key)
    ]

    if not values:
        return None

    return Counter(values).most_common(1)[0][0]


# --------------------------------------------------
# Main recommendation engine
# --------------------------------------------------

def recommend(
    preferences: StudentPreferences,
    catalog=None,
    semantic_scores=None,
):

    # 1. Load course catalog

    rows = (
        build_catalog()
        if catalog is None
        else catalog
    )

    if not rows:
        return RecommendationResponse(
            recommendations=[],
            eligible_courses=0,
            note="No courses available.",
        )

    # 2. Build distinct academic descriptions

    texts = list(
        dict.fromkeys(
            academic_text(row)
            for row in rows
        )
    )

    # 3. Neural semantic similarity

    if semantic_scores is None:

        sims = calculate_semantic_scores(
            preferences.interests,
            texts,
        )

    else:
        sims = semantic_scores

    if len(sims) != len(texts):
        raise ValueError(
            "semantic_scores must contain one score "
            "per distinct academic course text"
        )

    similarity_by_text = dict(
        zip(texts, sims)
    )

    # 4. Determine student academic interests

    qgroups = groups(
        " ".join(preferences.interests)
    )

    weights = WEIGHTS[
        preferences.priority
    ]

    ranked = []

    # 5. Score each course / professor offering

    for row in rows:

        reviews = row.get("reviews") or []

        similarity = similarity_by_text[
            academic_text(row)
        ]

        course_groups = groups(
            academic_text(row)
        )

        overlap = (
            len(qgroups & course_groups) / len(qgroups)
            if qgroups
            else None
        )

        # Combine semantic and keyword-group relevance

        if (
            similarity is not None
            and overlap is not None
        ):

            interest = (
                0.5 * similarity
                + 0.5 * overlap
            )

        else:
            interest = similarity

        # 6. Calculate preference components

        components = {
            "interest": interest,

            "assessment": avg([
                assessment(
                    review,
                    preferences.preferred_assessment
                )
                for review in reviews
            ]),

            "difficulty": avg([
                difficulty(
                    review,
                    preferences.max_difficulty
                )
                for review in reviews
            ]),

            "workload": avg([
                workload(
                    review,
                    preferences.workload_preference
                )
                for review in reviews
            ]),
        }

        # 7. Include only requested preference dimensions

        requested = {}

        if preferences.interests:
            requested["interest"] = components["interest"]

        if preferences.preferred_assessment != "any":
            requested["assessment"] = components["assessment"]

        if preferences.max_difficulty is not None:
            requested["difficulty"] = components["difficulty"]

        if preferences.workload_preference != "any":
            requested["workload"] = components["workload"]

        total_weight = sum(
            weights[key]
            for key in requested
        )

        weighted_sum = sum(
            weights[key] * (
                value if value is not None else 0
            )
            for key, value in requested.items()
        )

        raw = (
            weighted_sum / total_weight
            if total_weight
            else 0.0
        )

        # 8. Prevent unrelated easy courses
        # from outranking relevant courses.

        if (
            preferences.priority == "interest"
            and qgroups
            and overlap == 0
        ):
            raw = min(raw, 0.39)

        # 9. Apply course-level preference.
        # This bonus cannot rescue a weak subject match.

        score = raw * 100

        if preferences.interests:
            bonus = course_level_bonus(
                row.get("course_id"),
                interest,
            )

            if (
                preferences.priority == "interest"
                and qgroups
                and overlap == 0
            ):
                bonus = 0.0

            score = min(
                100.0,
                score + bonus
            )

        score = round(score, 1)

        # 10. Evidence warnings (internal API metadata)

        warnings = []

        if not row.get("instructor_verified"):
            warnings.append(
                "Spring 2027 instructor not verified; "
                "professor-specific reviews cannot "
                "yet be attached."
            )

        if not reviews:
            warnings.append(
                "No verified professor-matched "
                "historical reviews available; "
                "difficulty and assessments are unknown."
            )

        else:
            warnings.append(
                "Historical student reviews may not "
                "reflect the current section "
                "assessment policy."
            )

        if not row.get("description"):
            warnings.append(
                "Official course description not "
                "yet populated; subject matching "
                "may be limited."
            )

        # 11. Evidence-based explanations

        explanations = []

        if interest is not None:
            explanations.append(
                f"Academic interest match: "
                f"{interest * 100:.1f}% "
                f"(heuristic similarity, "
                f"not a probability)."
            )

        if reviews:
            explanations.append(
                f"{len(reviews)} historical review(s) "
                f"matched to this course and professor."
            )

        else:
            explanations.append(
                "No professor-specific review evidence "
                "for workload, difficulty, "
                "or assessments."
            )

        # 12. Build recommendation object

        ranked.append(
            Recommendation(
                course_id=(
                    row.get("course_id") or ""
                ),

                course_title=(
                    row.get("course_title") or ""
                ),

                instructor=row.get("instructor"),

                section_id=row.get("section_id"),

                instructor_verified=bool(
                    row.get("instructor_verified")
                ),

                semester=(
                    row.get("semester")
                    or "Spring 2027"
                ),

                score=score,

                difficulty=avg([
                    number(
                        review.get("difficulty_1_5")
                    )
                    for review in reviews
                ]),

                workload=most_common_value(
                    reviews,
                    "workload_level",
                ),

                assessment_style=most_common_value(
                    reviews,
                    "assessment_style",
                ),

                review_count=len(reviews),

                reviews=reviews,

                explanation=explanations,

                warnings=warnings,

                breakdown={
                    key: round(value * 100, 1)
                    for key, value in components.items()
                    if value is not None
                },
            )
        )

    # 13. Sort recommendations

    ranked.sort(
        key=lambda rec: (
            -rec.score,
            rec.course_id,
            rec.instructor or "",
        )
    )

    # 14. Return top courses

    return RecommendationResponse(
        recommendations=ranked[:preferences.top_k],

        eligible_courses=len(rows),

        note=(
            "Scores are heuristic, not grade predictions. "
            "Reviews match course and verified instructor "
            "across semesters. Missing information is not "
            "treated as favorable. Spring 2027 instructor "
            "assignments still require verification."
        ),
    )