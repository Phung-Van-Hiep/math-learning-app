"""
Quiz entities - for lesson assessments
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from core.database import Base


class Quiz(Base):
    """Quiz model"""
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=True)  # Time limit in minutes
    passing_score = Column(Float, default=60.0)  # Minimum score to pass

    # Settings
    is_active = Column(Boolean, default=True)
    shuffle_questions = Column(Boolean, default=False)
    show_answers = Column(Boolean, default=True)  # Show answers after submission

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Quiz {self.title}>"


class QuizQuestion(Base):
    """Quiz question model"""
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)

    question_text = Column(Text, nullable=False)
    question_type = Column(String(20), default="multiple_choice")  # multiple_choice, true_false, short_answer
    points = Column(Float, default=1.0)
    order = Column(Integer, default=0)

    # Image support
    image_url = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("QuizAnswer", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<QuizQuestion {self.id}>"


class QuizAnswer(Base):
    """Quiz answer options model"""
    __tablename__ = "quiz_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False, index=True)

    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    question = relationship("QuizQuestion", back_populates="answers")

    def __repr__(self):
        return f"<QuizAnswer {self.id} {'(Correct)' if self.is_correct else ''}>"


class QuizAttempt(Base):
    """Quiz attempt model - tracks student quiz submissions"""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)

    # Results
    score = Column(Float, nullable=False)  # Percentage score
    points_earned = Column(Float, default=0.0)
    total_points = Column(Float, default=0.0)

    # Answers submitted (JSON format: {question_id: answer_id or answer_text})
    answers = Column(JSON, nullable=True)

    # Timing
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_spent = Column(Integer, default=0)  # in seconds

    # Status
    is_completed = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

    def __repr__(self):
        return f"<QuizAttempt User:{self.user_id} Quiz:{self.quiz_id} Score:{self.score}%>"
