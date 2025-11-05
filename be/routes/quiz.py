"""
Quiz routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from entities.user import UserRole
from middleware.auth import get_current_user, require_role
from schemas.user import UserResponse
from schemas.quiz import (
    QuizCreate, QuizUpdate, QuizResponse, QuizStudentResponse,
    QuizSubmitRequest, QuizSubmitResponse, QuizAttemptResponse
)
from services.quiz_service import QuizService

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


# Admin/Teacher endpoints
@router.post("/", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """Create a new quiz (Admin/Teacher only)"""
    try:
        quiz = QuizService.create_quiz(db, quiz_data)
        return quiz
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating quiz: {str(e)}"
        )


@router.get("/", response_model=List[QuizResponse])
def get_all_quizzes(
    lesson_id: int = None,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """Get all quizzes (Admin/Teacher only)"""
    quizzes = QuizService.get_all_quizzes(db, lesson_id)
    return quizzes


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """Get quiz by ID (Admin/Teacher only)"""
    quiz = QuizService.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return quiz


@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(
    quiz_id: int,
    quiz_data: QuizUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """Update quiz (Admin/Teacher only)"""
    quiz = QuizService.update_quiz(db, quiz_id, quiz_data)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return quiz


@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """Delete quiz (Admin/Teacher only)"""
    success = QuizService.delete_quiz(db, quiz_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return None


# Student endpoints
@router.get("/lesson/{lesson_id}/quiz", response_model=QuizStudentResponse)
def get_lesson_quiz(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get active quiz for a lesson (Student)"""
    quiz = QuizService.get_quiz_by_lesson(db, lesson_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active quiz found for this lesson"
        )

    # Get quiz with shuffled questions if enabled
    quiz = QuizService.get_quiz_for_student(db, quiz.id, shuffle=quiz.shuffle_questions)
    return quiz


@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    quiz_id: int,
    submit_data: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Submit quiz answers and get results (Student)"""
    try:
        attempt, passed, correct_answers = QuizService.submit_quiz(
            db, current_user.id, quiz_id, submit_data
        )

        return QuizSubmitResponse(
            attempt=attempt,
            passed=passed,
            correct_answers=correct_answers
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error submitting quiz: {str(e)}"
        )


@router.get("/attempts/my-attempts", response_model=List[QuizAttemptResponse])
def get_my_attempts(
    quiz_id: int = None,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all quiz attempts for current user"""
    attempts = QuizService.get_user_attempts(db, current_user.id, quiz_id)
    return attempts


@router.get("/attempts/{attempt_id}", response_model=QuizAttemptResponse)
def get_attempt(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get specific attempt details"""
    attempt = QuizService.get_attempt_by_id(db, attempt_id, current_user.id)
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )
    return attempt


@router.get("/{quiz_id}/best-attempt", response_model=QuizAttemptResponse)
def get_best_attempt(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get best attempt for a quiz"""
    attempt = QuizService.get_best_attempt(db, current_user.id, quiz_id)
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No attempts found for this quiz"
        )
    return attempt
