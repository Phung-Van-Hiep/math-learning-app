"""
Pydantic schemas for Quiz entities
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# Quiz Answer Schemas
class QuizAnswerBase(BaseModel):
    answer_text: str
    is_correct: bool = False
    order: int = 0


class QuizAnswerCreate(QuizAnswerBase):
    pass


class QuizAnswerResponse(QuizAnswerBase):
    id: int
    question_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class QuizAnswerStudentResponse(BaseModel):
    """Answer schema for students (hides is_correct)"""
    id: int
    answer_text: str
    order: int

    class Config:
        from_attributes = True


# Quiz Question Schemas
class QuizQuestionBase(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"  # multiple_choice, true_false, short_answer
    points: float = 1.0
    order: int = 0
    image_url: Optional[str] = None


class QuizQuestionCreate(QuizQuestionBase):
    answers: List[QuizAnswerCreate] = []


class QuizQuestionResponse(QuizQuestionBase):
    id: int
    quiz_id: int
    answers: List[QuizAnswerResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuizQuestionStudentResponse(QuizQuestionBase):
    """Question schema for students (hides correct answers)"""
    id: int
    quiz_id: int
    answers: List[QuizAnswerStudentResponse] = []

    class Config:
        from_attributes = True


# Quiz Schemas
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: Optional[int] = None  # in minutes
    passing_score: float = 60.0
    is_active: bool = True
    shuffle_questions: bool = False
    show_answers: bool = True


class QuizCreate(QuizBase):
    lesson_id: int
    questions: List[QuizQuestionCreate] = []


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    passing_score: Optional[float] = None
    is_active: Optional[bool] = None
    shuffle_questions: Optional[bool] = None
    show_answers: Optional[bool] = None


class QuizResponse(QuizBase):
    id: int
    lesson_id: int
    questions: List[QuizQuestionResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuizStudentResponse(BaseModel):
    """Quiz schema for students taking the quiz"""
    id: int
    lesson_id: int
    title: str
    description: Optional[str] = None
    duration: Optional[int] = None
    passing_score: float
    shuffle_questions: bool
    questions: List[QuizQuestionStudentResponse] = []

    class Config:
        from_attributes = True


# Quiz Attempt Schemas
class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: Dict[int, Any]  # {question_id: answer_id or answer_text}


class QuizAttemptResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    score: float
    points_earned: float
    total_points: float
    answers: Optional[Dict[int, Any]] = None
    started_at: datetime
    submitted_at: Optional[datetime] = None
    time_spent: int  # in seconds
    is_completed: bool

    class Config:
        from_attributes = True


class QuizSubmitRequest(BaseModel):
    answers: Dict[int, Any]  # {question_id: answer_id or answer_text}
    time_spent: int  # in seconds


class QuizSubmitResponse(BaseModel):
    attempt: QuizAttemptResponse
    passed: bool
    correct_answers: Optional[List[Dict[str, Any]]] = None  # Shown if show_answers is True

    class Config:
        from_attributes = True
