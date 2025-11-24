from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from entities.user import User, UserRole
from schemas.admin import StudentCreate, StudentUpdate
from utils.security import get_password_hash

class UserService:
    @staticmethod
    def get_all_students(db: Session):
        return db.query(User).filter(User.role == UserRole.STUDENT).all()

    @staticmethod
    def create_student(db: Session, student_data: StudentCreate):
        # Kiểm tra username tồn tại
        if db.query(User).filter(User.username == student_data.username).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

        # Xử lý trạng thái is_active
        is_active = True  # mặc định
        if hasattr(student_data, "is_active") and student_data.is_active is not None:
            is_active = student_data.is_active

        # Tạo user
        user = User(
            username=student_data.username,
            email=student_data.email,
            full_name=student_data.full_name,
            hashed_password=get_password_hash(student_data.password),
            role=UserRole.STUDENT,
            grade=student_data.grade,
            class_name=student_data.class_name,
            is_active=is_active,
            is_verified=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_student(db: Session, student_id: int, student_data: StudentUpdate):
        user = db.query(User).filter(User.id == student_id, User.role == UserRole.STUDENT).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        for field, value in student_data.model_dump(exclude_unset=True).items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_student(db: Session, student_id: int):
        user = db.query(User).filter(User.id == student_id, User.role == UserRole.STUDENT).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        db.delete(user)
        db.commit()