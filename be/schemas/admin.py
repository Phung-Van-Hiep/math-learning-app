from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Student
class StudentAdminResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    grade: Optional[int]
    class_name: Optional[str]
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class StudentCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    grade: Optional[int]
    class_name: Optional[str]

class StudentUpdate(BaseModel):
    email: Optional[EmailStr]
    full_name: Optional[str]
    grade: Optional[int]
    class_name: Optional[str]
    is_active: Optional[bool]

# Academic
class LessonProgressAdminResponse(BaseModel):
    id: int
    user_name: str
    lesson_title: str
    progress: float
    time_spent: int
    last_updated: datetime

class QuizAttemptAdminResponse(BaseModel):
    id: int
    user_name: str
    lesson_title: str
    score: float
    time_spent: int
    submitted_at: datetime

# Feedback
class FeedbackResponse(BaseModel):
    id: int
    rating: float
    comment: Optional[str] = None  # Đảm bảo dùng 'comment'
    created_at: datetime
    
    # Các thông tin hiển thị thêm
    user_name: str
    user_email: Optional[str] = None
    lesson_title: str

    class Config:
        from_attributes = True

# Settings
class SettingsResponse(BaseModel):
    site_title: str
    site_description: str
    admin_email: EmailStr
    allow_registration: bool

class SettingsUpdate(BaseModel):
    site_title: Optional[str]
    site_description: Optional[str]
    admin_email: Optional[EmailStr]
    allow_registration: Optional[bool]

class PasswordChange(BaseModel):
    current_password: str
    new_password: str