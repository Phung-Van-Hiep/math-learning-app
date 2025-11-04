from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    class_name = Column(String(10))  # e.g., "6A", "7B"
    avatar = Column(String(255))
    is_active = Column(Boolean, default=True)
    settings = Column(JSON)  # Store notification preferences, etc.
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    test_results = relationship("TestResult", back_populates="student")
    assignments = relationship("Assignment", back_populates="student")
    feedback = relationship("Feedback", back_populates="student")

class Introduction(Base):
    __tablename__ = "introduction"

    id = Column(Integer, primary_key=True, index=True)
    teacher_name = Column(String(100))
    teacher_title = Column(String(100))
    teacher_email = Column(String(100))
    teacher_image = Column(String(255))
    target_students = Column(Text)
    objectives = Column(JSON)  # {knowledge: [], skills: [], qualities: [], competencies: []}
    duration = Column(String(50))
    references = Column(JSON)  # [{title, link}]
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    video_type = Column(String(20))  # 'youtube', 'drive', 'direct'
    video_url = Column(String(500), nullable=False)
    duration = Column(Integer)  # in minutes
    timeline = Column(JSON)  # [{time, description}]
    key_points = Column(JSON)  # [string]
    attachments = Column(JSON)  # [{title, url}]
    views = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    section_type = Column(String(50))  # 'theory', 'example', 'sgk_exercise', 'practice'
    title = Column(String(200), nullable=False)
    content_html = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    geogebra_embed = Column(Text)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Interactive(Base):
    __tablename__ = "interactive_tools"

    id = Column(Integer, primary_key=True, index=True)
    tool_type = Column(String(50))  # 'geogebra', 'maple', 'mindmap', 'other'
    title = Column(String(200), nullable=False)
    description = Column(Text)
    embed_code = Column(Text)
    file_url = Column(String(500))
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    assessment_type = Column(String(50))  # 'google_form', 'quizizz', 'custom'
    embed_url = Column(String(500))
    instructions = Column(Text)
    grading_scale = Column(JSON)  # {max_score, passing_score}
    time_limit = Column(Integer)  # in minutes
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    results = relationship("TestResult", back_populates="assessment")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    answers = Column(JSON)  # Store student answers
    time_spent = Column(Integer)  # in seconds
    completed_at = Column(DateTime, server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="test_results")
    assessment = relationship("Assessment", back_populates="results")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    status = Column(String(20))  # 'in_progress', 'completed'
    progress = Column(Integer, default=0)  # percentage
    answers = Column(JSON)  # Current answers
    started_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime)

    # Relationships
    student = relationship("Student", back_populates="assignments")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    name = Column(String(100))
    email = Column(String(100))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    reply = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    replied_at = Column(DateTime)

    # Relationships
    student = relationship("Student", back_populates="feedback")

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100))
    phone = Column(String(20))
    zalo = Column(String(20))
    address = Column(String(200))
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class FAQ(Base):
    __tablename__ = "faq"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
