from sqlalchemy.orm import Session
from sqlalchemy import join
from entities.student_progress import StudentProgress
from entities.quiz import QuizAttempt, Quiz
from entities.lesson import Lesson
from entities.feedback import Feedback
from entities.user import User
from schemas.admin import SettingsUpdate, PasswordChange
from utils.security import verify_password, get_password_hash
from fastapi import HTTPException, status

class AdminService:
    @staticmethod
    def get_all_lesson_progress(db: Session):
        progress_list = db.query(StudentProgress, User.full_name, Lesson.title).join(User, StudentProgress.user_id == User.id).join(Lesson, StudentProgress.lesson_id == Lesson.id).all()
        return [
            {
                "id": p.StudentProgress.id,
                "user_name": p.full_name,
                "lesson_title": p.title,
                "progress": p.StudentProgress.progress_percentage,
                "time_spent": p.StudentProgress.time_spent,
                "last_updated": p.StudentProgress.last_accessed
            } for p in progress_list
        ]

    @staticmethod
    def get_all_quiz_attempts(db: Session):
        attempts = db.query(QuizAttempt, User.full_name, Lesson.title).join(User, QuizAttempt.user_id == User.id).join(Quiz, QuizAttempt.quiz_id == Quiz.id).join(Lesson, Quiz.lesson_id == Lesson.id).all()
        return [
            {
                "id": a.QuizAttempt.id,
                "user_name": a.full_name,
                "lesson_title": a.title,
                "score": a.QuizAttempt.score,
                "time_spent": a.QuizAttempt.time_spent,
                "submitted_at": a.QuizAttempt.submitted_at
            } for a in attempts
        ]

    @staticmethod
    def get_all_feedback(db: Session):
        # Join 3 bảng: Feedback, User, Lesson
        # Lưu ý: feedback table trong DB của bạn tên cột nội dung là 'comment' hay 'content'?
        # Dựa vào schema cũ bạn gửi, nó là 'comment'.
        
        results = db.query(Feedback, User, Lesson)\
            .join(User, Feedback.user_id == User.id)\
            .join(Lesson, Feedback.lesson_id == Lesson.id)\
            .order_by(Feedback.created_at.desc())\
            .all()
            
        list_data = []
        for f, u, l in results:
            # f là Feedback, u là User, l là Lesson
            list_data.append({
                "id": f.id,
                "rating": f.rating,
                "comment": f.comment,   # 👈 Quan trọng: phải đúng tên cột trong DB
                "created_at": f.created_at,
                
                # Thông tin từ bảng User và Lesson
                "user_name": u.full_name,
                "user_email": u.email,
                "lesson_title": l.title
            })
            
        return list_data

    @staticmethod
    def mark_feedback_as_read(db: Session, feedback_id: int):
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")
        
        # ⚠️ LƯU Ý: Database của bạn (dựa trên schema) KHÔNG CÓ cột 'status'.
        # Nếu bạn chưa thêm cột này vào DB, dòng dưới đây sẽ gây lỗi.
        # Tạm thời tôi comment lại để code chạy được. Nếu muốn dùng, bạn phải migrate DB thêm cột status.
        
        # feedback.status = "read" 
        # db.commit()
        # db.refresh(feedback)
        
        return feedback

    @staticmethod
    def delete_feedback(db: Session, feedback_id: int):
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")
        db.delete(feedback)
        db.commit()

    @staticmethod
    def get_settings(db: Session):
        # Giả sử settings lưu trong bảng hoặc file .env
        return {
            "site_title": "Học Toán THCS Như Quỳnh",
            "site_description": "Website học Toán online cho học sinh THCS",
            "admin_email": "admin@nhuquynh.edu.vn",
            "allow_registration": True
        }

    @staticmethod
    def update_settings(db: Session, settings_data: SettingsUpdate):
        # Thực tế: cập nhật vào bảng hoặc file .env
        return settings_data.model_dump(exclude_unset=True)

    @staticmethod
    def change_admin_password(db: Session, admin_id: int, password_data: PasswordChange):
        admin = db.query(User).filter(User.id == admin_id).first()
        if not admin or not verify_password(password_data.current_password, admin.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        admin.hashed_password = get_password_hash(password_data.new_password)
        db.commit()