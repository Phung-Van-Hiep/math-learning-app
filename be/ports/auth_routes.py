from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from services.database import get_db
from services.models import Student
from be.entities.auth_schemas import StudentRegister, StudentLogin, Token
from be.entities.student_schemas import StudentResponse
from services.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_student
)

router = APIRouter()

@router.post("/register", response_model=dict)
async def register_student(
    student_data: StudentRegister,
    db: Session = Depends(get_db)
):
    """Register a new student account"""
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == student_data.email).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new student
    hashed_password = get_password_hash(student_data.password)
    new_student = Student(
        name=student_data.name,
        email=student_data.email,
        hashed_password=hashed_password,
        class_name=student_data.class_name
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_student.email, "type": "student"},
        expires_delta=access_token_expires
    )

    return {
        "user": {
            "id": new_student.id,
            "name": new_student.name,
            "email": new_student.email,
            "class": new_student.class_name
        },
        "token": access_token
    }

@router.post("/login", response_model=dict)
async def login_student(
    credentials: StudentLogin,
    db: Session = Depends(get_db)
):
    """Login student"""
    student = db.query(Student).filter(Student.email == credentials.email).first()

    if not student or not verify_password(credentials.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not student.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": student.email, "type": "student"},
        expires_delta=access_token_expires
    )

    return {
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "class": student.class_name
        },
        "token": access_token
    }

@router.post("/logout")
async def logout_student(current_student: Student = Depends(get_current_student)):
    """Logout student (client should remove token)"""
    return {"message": "Logged out successfully"}

@router.get("/verify")
async def verify_token(current_student: Student = Depends(get_current_student)):
    """Verify authentication token"""
    return {
        "user": {
            "id": current_student.id,
            "name": current_student.name,
            "email": current_student.email,
            "class": current_student.class_name
        }
    }

@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    """Send password reset email (to be implemented)"""
    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        # Don't reveal if email exists or not
        return {"message": "If the email exists, a reset link will be sent"}

    # TODO: Implement email sending
    return {"message": "Password reset email sent"}
