"""Research Readiness API for Trojan PALS.

Uses the existing OpenAlex paper dataset, USC course
catalog, Groq client, and skill-gap analyzer.
"""

import csv
import logging
import re
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from .skill_gap_analyzer import generate_skill_gap_analysis
from .llm_client import generate_structured_json

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/research",
    tags=["Research Readiness"],
)

DATA_DIR = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "research"
)


class ReadinessRequest(BaseModel):
    professor: str = Field(min_length=2, max_length=150)
    interests: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    completed_courses: List[str] = Field(default_factory=list)


def load_csv(filename):
    path = DATA_DIR / filename

    if not path.is_file():
        raise HTTPException(
            status_code=503,
            detail="Required research dataset unavailable: " + filename,
        )

    with path.open(
        encoding="utf-8-sig",
        newline="",
    ) as file:
        return list(csv.DictReader(file))


def normalize(value):
    return " ".join(str(value or "").casefold().split())


def relevant_papers(professor, interests, papers, limit=3):
    """Select usable papers attributed to this professor.

    REVIEW papers are excluded until author identity
    has been manually checked.
    """

    matches = [
        paper for paper in papers
        if normalize(paper.get("professor")) == normalize(professor)
        and str(paper.get("status", "")).upper() == "OK"
        and str(paper.get("abstract", "")).strip()
        and str(paper.get("link", "")).strip()
    ]

    query = " ".join(interests).casefold()
    query_terms = set(
        re.findall(r"[a-z]{3,}", query)
    )

    stopwords = {
        "the", "and", "for", "with", "from",
        "research", "interested", "want",
    }

    query_terms -= stopwords

    def score(paper):
        content = (
            str(paper.get("paper_title", "")) + " "
            + str(paper.get("abstract", ""))
            + " " + str(paper.get("topics", ""))
        ).casefold()

        title = str(
            paper.get("paper_title", "")
        ).casefold()

        words = set(
            re.findall(r"[a-z]{3,}", content)
        )

        title_words = set(
            re.findall(r"[a-z]{3,}", title)
        )

        return (
            len(query_terms & words)
            + 2 * len(query_terms & title_words)
        )

    ranked = sorted(
        matches,
        key=score,
        reverse=True,
    )

    # If interests were provided, avoid using papers
    # with no matching topic terms.
    # Student interests help rank papers, but do not
    # exclude all research evidence for the selected professor.
    # Only papers with status OK are eligible.
    # Papers with zero topic overlap remain available
    # as a fallback.
    # if query_terms:
    #     ranked = [
    #         paper for paper in ranked
    #         if score(paper) > 0
    #     ]

    return ranked[:limit]


@router.post("/readiness")
def analyze_readiness(request: ReadinessRequest):

    papers = load_csv("papers.csv")
    courses = load_csv("courses.csv")

    # Verify that the requested professor is present
    # in the research faculty dataset.
    faculty = load_csv("research_mentors.csv")

    professor_row = next(
        (
            row for row in faculty
            if normalize(row.get("professor"))
            == normalize(request.professor)
        ),
        None,
    )

    if professor_row is None:
        raise HTTPException(
            status_code=404,
            detail="Professor not found in research dataset.",
        )

    selected = relevant_papers(
        professor=request.professor,
        interests=request.interests,
        papers=papers,
    )

    student = {
        "interests": request.interests,
        "skills": request.skills,
        "completed_courses": request.completed_courses,
    }

    research_match = {
        "professor": request.professor,
        "papers": selected,
    }

    # Only invoke Groq when relevant paper evidence exists.
    llm_generate = None

    if selected:
        def llm_generate(prompt, system):
            return generate_structured_json(
                prompt,
                system_prompt=system,
            )

    try:
        analysis = generate_skill_gap_analysis(
            student=student,
            research_match=research_match,
            courses=courses,
            generate=llm_generate,
        )
    except Exception:
        logger.exception("Research readiness analysis failed")
        raise HTTPException(
            status_code=502,
            detail="Research readiness analysis unavailable.",
        )

    analysis["papers_analyzed"] = [
        {
            "title": paper.get("paper_title"),
            "year": paper.get("year"),
            "url": paper.get("link"),
            "status": paper.get("status"),
        }
        for paper in selected
    ]

    analysis["research_interests"] = request.interests

    return analysis