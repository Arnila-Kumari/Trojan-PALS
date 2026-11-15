"""/research endpoints. Mounted in main.py with: app.include_router(research_router)"""

from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from .research_engine import course_research, prep_courses, research_plan

router = APIRouter(prefix="/research", tags=["research"])


class Student(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = Field(default=None, description="e.g. \"Master's in CS\", \"Undergraduate\", \"PhD\"")
    program: Optional[str] = Field(default=None, description="e.g. \"MS Data Science\" -> DSCI-590 in the roadmap")
    background: Optional[str] = Field(default=None, max_length=600, description="Student's own words; used verbatim in the email")
    interests: Optional[str] = None


class ResearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=1000)
    student: Student = Field(default_factory=Student)
    top_k: int = Field(default=5, ge=1, le=15)
    cs_only: bool = False
    explain: bool = False


@router.post("/match")
def match(req: ResearchRequest):
    """Researchers (with evidence, labs, Spring 2027 courses they teach) + a 5-stage roadmap + email draft."""
    return research_plan(req.query, req.student.model_dump(exclude_none=True), req.top_k, req.cs_only, req.explain)


@router.get("/course/{course_id}")
def course(course_id: str):
    """Research badge for a course page. course_id may be 'CSCI 544', 'CSCI544' or 'CSCI-544'."""
    out = course_research(course_id)
    if out["type"] is None:
        raise HTTPException(status_code=404, detail=f"Unknown course {course_id}")
    return out


@router.get("/prep")
def prep(query: str, level: Optional[Literal["Undergraduate", "Master's", "PhD"]] = None, top_k: int = 5):
    """Spring 2027 electives that build toward a research topic, filtered by level."""
    return prep_courses(query, level, top_k)
