"""
Lesson Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from entities.lesson import LessonDifficulty


# Base schemas
class LessonBase(BaseModel):
    """Base lesson schema"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    grade: int = Field(..., ge=6, le=9)
    duration: int = Field(..., gt=0)
    difficulty: LessonDifficulty = LessonDifficulty.MEDIUM


# Request schemas
class LessonCreate(LessonBase):
    """Schema for lesson creation"""
    slug: str = Field(..., min_length=1, max_length=250)
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    content: Optional[str] = None
    is_published: bool = False


class LessonUpdate(BaseModel):
    """Schema for lesson update"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    content: Optional[str] = None
    grade: Optional[int] = Field(None, ge=6, le=9)
    duration: Optional[int] = Field(None, gt=0)
    difficulty: Optional[LessonDifficulty] = None
    is_published: Optional[bool] = None


# Response schemas
class LessonResponse(LessonBase):
    """Schema for lesson response"""
    id: int
    slug: str
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    content: Optional[str] = None
    rating: float
    review_count: int
    order: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LessonListResponse(BaseModel):
    """Schema for lesson list item (minimal data)"""
    id: int
    title: str
    slug: str
    thumbnail: Optional[str] = None
    grade: int
    duration: int
    rating: float
    review_count: int
    difficulty: LessonDifficulty

    class Config:
        from_attributes = True


class LessonWithProgress(LessonListResponse):
    """Schema for lesson with student progress"""
    progress: float = 0.0  # 0-100
    is_completed: bool = False
    completed_sections: Optional[List[int]] = []  # List of completed section IDs

    class Config:
        from_attributes = True
