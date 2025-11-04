from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class AssessmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    assessment_type: str
    embed_url: Optional[str] = None
    instructions: Optional[str] = None
    grading_scale: Optional[Dict[str, float]] = None
    time_limit: Optional[int] = None
    is_published: bool = False

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TestResultBase(BaseModel):
    assessment_id: int
    score: float
    max_score: float
    answers: Optional[Dict[str, Any]] = None
    time_spent: Optional[int] = None

class TestResultCreate(TestResultBase):
    pass

class TestResultResponse(TestResultBase):
    id: int
    student_id: int
    completed_at: datetime

    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    assessment_id: int
    progress: int = 0
    answers: Optional[Dict[str, Any]] = None

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: int
    student_id: int
    status: str
    started_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
