"""
Feedback Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FeedbackBase(BaseModel):
    """Base feedback schema"""
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating from 1 to 5 stars")
    comment: Optional[str] = Field(None, max_length=1000)


class FeedbackCreate(FeedbackBase):
    """Schema for creating feedback"""
    lesson_id: int


class FeedbackUpdate(BaseModel):
    """Schema for updating feedback"""
    rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    comment: Optional[str] = Field(None, max_length=1000)


class FeedbackResponse(FeedbackBase):
    """Schema for feedback response"""
    id: int
    user_id: int
    lesson_id: int
    created_at: datetime
    updated_at: datetime

    # User info (optional, can be populated)
    user_name: Optional[str] = None
    lesson_title: Optional[str] = None

    class Config:
        from_attributes = True
