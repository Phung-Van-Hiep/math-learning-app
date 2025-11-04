from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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
