from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field

class StudentPreferences(BaseModel):
    interests: List[str] = Field(default_factory=list)
    max_difficulty: Optional[float] = Field(default=None, ge=1, le=5)
    preferred_assessment: Literal['any','projects','exams','homework','no_exams'] = 'any'
    workload_preference: Literal['any','light','moderate','high'] = 'any'
    priority: Literal['interest','balanced','workload','assessment'] = 'interest'
    top_k: int = Field(default=5, ge=1, le=50)

class Recommendation(BaseModel):
    course_id: str
    course_title: str
    instructor: Optional[str] = None
    section_id: Optional[str] = None
    instructor_verified: bool
    semester: str
    score: float
    difficulty: Optional[float] = None
    workload: Optional[str] = None
    assessment_style: Optional[str] = None
    review_count: int
    reviews: List[dict] = Field(default_factory=list)
    explanation: List[str]
    warnings: List[str]
    breakdown: Dict[str, float]

class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]
    eligible_courses: int
    note: str
