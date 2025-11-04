from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from services.database import get_db
from services.models import Student
from be.entities.student_schemas import StudentResponse, StudentUpdate, PasswordChange
from services.auth import get_current_student, verify_password, get_password_hash

router = APIRouter()

@router.get("/profile", response_model=StudentResponse)
async def get_profile(
    current_student: Student = Depends(get_current_student)
):
    """Get current student profile"""
    return current_student

@router.put("/profile", response_model=StudentResponse)
async def update_profile(
    update_data: StudentUpdate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update student profile"""
    if update_data.name is not None:
        current_student.name = update_data.name
    if update_data.class_name is not None:
        current_student.class_name = update_data.class_name
    if update_data.avatar is not None:
        current_student.avatar = update_data.avatar

    db.commit()
    db.refresh(current_student)
    return current_student

@router.put("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Change student password"""
    if not verify_password(password_data.old_password, current_student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )

    current_student.hashed_password = get_password_hash(password_data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}

@router.put("/settings")
async def update_settings(
    settings: dict,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update student settings"""
    current_student.settings = settings
    db.commit()

    return {"message": "Settings updated successfully"}

@router.delete("/account")
async def delete_account(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Delete student account"""
    db.delete(current_student)
    db.commit()

    return {"message": "Account deleted successfully"}
