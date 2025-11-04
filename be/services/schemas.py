from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    class_name: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Student Schemas
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    class_name: str

class StudentResponse(StudentBase):
    id: int
    avatar: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    avatar: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(min_length=6)

# Introduction Schemas
class IntroductionBase(BaseModel):
    teacher_name: Optional[str] = None
    teacher_title: Optional[str] = None
    teacher_email: Optional[EmailStr] = None
    target_students: Optional[str] = None
    objectives: Optional[Dict[str, List[str]]] = None
    duration: Optional[str] = None
    references: Optional[List[Dict[str, str]]] = None

class IntroductionResponse(IntroductionBase):
    id: int
    teacher_image: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

# Video Schemas
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_type: str
    video_url: str
    duration: Optional[int] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    key_points: Optional[List[str]] = None
    attachments: Optional[List[Dict[str, str]]] = None
    is_published: bool = False

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Content Schemas
class ContentBase(BaseModel):
    section_type: str
    title: str
    content_html: str
    order: int = 0
    geogebra_embed: Optional[str] = None
    is_published: bool = False

class ContentCreate(ContentBase):
    pass

class ContentResponse(ContentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Assessment Schemas
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

# Test Result Schemas
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

# Assignment Schemas
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

# Feedback Schemas
class FeedbackBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    student_id: Optional[int] = None
    reply: Optional[str] = None
    is_read: bool
    created_at: datetime
    replied_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_views: int
    total_students: int
    total_submissions: int
    total_feedback: int
