"""
Lesson entity
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from core.database import Base


class LessonDifficulty(str, enum.Enum):
    """Lesson difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Lesson(Base):
    """Lesson model"""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    # Content
    thumbnail = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    content = Column(Text, nullable=True)  # HTML content or markdown

    # Metadata
    grade = Column(Integer, nullable=False, index=True)  # 6, 7, 8, 9
    duration = Column(Integer, nullable=False)  # in minutes
    difficulty = Column(Enum(LessonDifficulty), default=LessonDifficulty.MEDIUM)

    # Rating (calculated from student feedback)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)

    # Ordering and visibility
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_progress = relationship("StudentProgress", back_populates="lesson", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="lesson", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Lesson {self.title} (Grade {self.grade})>"
    # Thêm vào cuối class Lesson
    geogebra_figures = relationship("GeoGebraContent", back_populates="lesson", cascade="all, delete-orphan")