"""
Feedback routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from middleware.auth import get_current_user
from schemas.user import UserResponse
from schemas.feedback import FeedbackCreate, FeedbackUpdate, FeedbackResponse
from services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Create or update feedback for a lesson

    - **lesson_id**: ID of the lesson
    - **rating**: Rating from 1 to 5 stars
    - **comment**: Optional text comment
    """
    feedback = FeedbackService.create_feedback(db, current_user.id, feedback_data)
    return feedback


@router.get("/my-feedback", response_model=List[FeedbackResponse])
def get_my_feedback(
    lesson_id: int = None,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all feedback submitted by the current user"""
    feedbacks = FeedbackService.get_user_feedback(db, current_user.id, lesson_id)
    return feedbacks


@router.get("/lesson/{lesson_id}", response_model=List[FeedbackResponse])
def get_lesson_feedback(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all feedback for a specific lesson"""
    feedbacks = FeedbackService.get_lesson_feedback(db, lesson_id)
    return feedbacks


@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get specific feedback by ID"""
    feedback = FeedbackService.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    return feedback


@router.put("/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(
    feedback_id: int,
    feedback_data: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Update your own feedback"""
    feedback = FeedbackService.update_feedback(db, feedback_id, current_user.id, feedback_data)
    return feedback


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete your own feedback"""
    FeedbackService.delete_feedback(db, feedback_id, current_user.id)
    return None
