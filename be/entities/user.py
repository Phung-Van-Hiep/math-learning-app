"""
User entity - for both students and admins
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from core.database import Base


class UserRole(str, enum.Enum):
    """User roles"""
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    """User model - handles both students and admins"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)

    # Student-specific fields
    grade = Column(Integer, nullable=True)  # Lớp 6, 7, 8, 9
    class_name = Column(String(20), nullable=True)  # e.g., "8A", "9B"

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    student_progress = relationship("StudentProgress", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"

    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN

    def is_teacher(self) -> bool:
        """Check if user is teacher"""
        return self.role == UserRole.TEACHER

    def is_student(self) -> bool:
        """Check if user is student"""
        return self.role == UserRole.STUDENT
