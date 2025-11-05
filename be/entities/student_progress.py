"""
Student Progress entity - tracks lesson completion
"""
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from core.database import Base


class StudentProgress(Base):
    """Student progress tracking for lessons"""
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)

    # Progress tracking
    progress_percentage = Column(Float, default=0.0)  # 0-100
    is_completed = Column(Boolean, default=False)
    time_spent = Column(Integer, default=0)  # in seconds

    # Section-level tracking (stores list of completed section IDs as JSON)
    completed_sections = Column(Text, nullable=True)  # JSON array as string

    # Scores
    quiz_score = Column(Float, nullable=True)  # Best quiz score
    average_score = Column(Float, nullable=True)  # Average of all attempts

    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    last_accessed = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_progress")
    lesson = relationship("Lesson", back_populates="student_progress")

    def __repr__(self):
        return f"<Progress User:{self.user_id} Lesson:{self.lesson_id} {self.progress_percentage}%>"
