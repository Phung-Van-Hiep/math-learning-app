from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from middleware.auth import require_role
from entities.user import UserRole
from schemas.admin import (
    StudentAdminResponse, StudentCreate, StudentUpdate,
    LessonProgressAdminResponse, QuizAttemptAdminResponse,
    FeedbackResponse, SettingsResponse, SettingsUpdate, PasswordChange
)
from services.user_service import UserService
from services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---------------- STUDENT MANAGEMENT ----------------
@router.get("/students", response_model=List[StudentAdminResponse])
def get_students(db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return UserService.get_all_students(db)

@router.post("/students", response_model=StudentAdminResponse, status_code=status.HTTP_201_CREATED)
def create_student(student_data: StudentCreate, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return UserService.create_student(db, student_data)

@router.put("/students/{student_id}", response_model=StudentAdminResponse)
def update_student(student_id: int, student_data: StudentUpdate, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return UserService.update_student(db, student_id, student_data)

@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    UserService.delete_student(db, student_id)
    return None

# ---------------- ACADEMIC RESULTS ----------------
@router.get("/results/lesson-progress", response_model=List[LessonProgressAdminResponse])
def get_lesson_progress(db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.get_all_lesson_progress(db)

@router.get("/results/quiz-attempts", response_model=List[QuizAttemptAdminResponse])
def get_quiz_attempts(db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.get_all_quiz_attempts(db)

# ---------------- FEEDBACK MANAGEMENT ----------------
@router.get("/feedback", response_model=List[FeedbackResponse])
def get_feedback(db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.get_all_feedback(db)

@router.patch("/feedback/{feedback_id}/read", response_model=FeedbackResponse)
def mark_feedback_read(feedback_id: int, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.mark_feedback_as_read(db, feedback_id)

@router.delete("/feedback/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    AdminService.delete_feedback(db, feedback_id)
    return None

# ---------------- SETTINGS ----------------
@router.get("/settings", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.get_settings(db)

@router.put("/settings", response_model=SettingsResponse)
def update_settings(settings_data: SettingsUpdate, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    return AdminService.update_settings(db, settings_data)

@router.post("/settings/change-password")
def change_admin_password(password_data: PasswordChange, db: Session = Depends(get_db), current_user=Depends(require_role([UserRole.ADMIN]))):
    AdminService.change_admin_password(db, current_user.id, password_data)
    return {"message": "Password changed successfully"}