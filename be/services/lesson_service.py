"""
Lesson service
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from entities.lesson import Lesson
from entities.student_progress import StudentProgress
from schemas.lesson import LessonCreate, LessonUpdate, LessonResponse, LessonWithProgress


class LessonService:
    """Lesson management service"""

    @staticmethod
    def create_lesson(db: Session, lesson_data: LessonCreate) -> Lesson:
        """
        Create a new lesson
        Args:
            db: Database session
            lesson_data: Lesson creation data
        Returns:
            Created lesson
        Raises:
            HTTPException: If slug already exists
        """
        # Check if slug exists
        existing = db.query(Lesson).filter(Lesson.slug == lesson_data.slug).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson slug already exists"
            )

        # Create lesson
        db_lesson = Lesson(**lesson_data.model_dump())
        db.add(db_lesson)
        db.commit()
        db.refresh(db_lesson)

        return db_lesson

    @staticmethod
    def get_lesson(db: Session, lesson_id: int) -> Lesson:
        """Get lesson by ID"""
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        return lesson

    @staticmethod
    def get_lesson_by_slug(db: Session, slug: str) -> Lesson:
        """Get lesson by slug"""
        lesson = db.query(Lesson).filter(Lesson.slug == slug).first()
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        return lesson

    @staticmethod
    def get_lessons(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        grade: Optional[int] = None,
        difficulty: Optional[str] = None,
        is_published: Optional[bool] = None
    ) -> List[Lesson]:
        """
        Get list of lessons with filters
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records
            grade: Filter by grade (6, 7, 8, 9)
            difficulty: Filter by difficulty
            is_published: Filter by published status
        Returns:
            List of lessons
        """
        query = db.query(Lesson)

        if grade is not None:
            query = query.filter(Lesson.grade == grade)

        if difficulty is not None:
            query = query.filter(Lesson.difficulty == difficulty)

        if is_published is not None:
            query = query.filter(Lesson.is_published == is_published)

        return query.order_by(Lesson.order, Lesson.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_lessons_with_progress(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        grade: Optional[int] = None
    ) -> List[LessonWithProgress]:
        """
        Get lessons with student progress
        Args:
            db: Database session
            user_id: Student user ID
            skip: Number of records to skip
            limit: Maximum number of records
            grade: Filter by grade
        Returns:
            List of lessons with progress data
        """
        query = db.query(Lesson).filter(Lesson.is_published == True)

        if grade is not None:
            query = query.filter(Lesson.grade == grade)

        lessons = query.order_by(Lesson.order, Lesson.created_at.desc()).offset(skip).limit(limit).all()

        # Get progress for each lesson
        result = []
        for lesson in lessons:
            progress = db.query(StudentProgress).filter(
                StudentProgress.user_id == user_id,
                StudentProgress.lesson_id == lesson.id
            ).first()

            lesson_data = LessonWithProgress.from_orm(lesson)
            if progress:
                lesson_data.progress = progress.progress_percentage
                lesson_data.is_completed = progress.is_completed

                # Parse completed sections if available
                if progress.completed_sections:
                    import json
                    try:
                        lesson_data.completed_sections = json.loads(progress.completed_sections)
                    except:
                        lesson_data.completed_sections = []
                else:
                    lesson_data.completed_sections = []
            else:
                lesson_data.completed_sections = []

            result.append(lesson_data)

        return result

    @staticmethod
    def update_lesson(db: Session, lesson_id: int, lesson_data: LessonUpdate) -> Lesson:
        """Update lesson"""
        lesson = LessonService.get_lesson(db, lesson_id)

        # Update only provided fields
        update_data = lesson_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(lesson, field, value)

        db.commit()
        db.refresh(lesson)

        return lesson

    @staticmethod
    def delete_lesson(db: Session, lesson_id: int) -> bool:
        """Delete lesson"""
        lesson = LessonService.get_lesson(db, lesson_id)
        db.delete(lesson)
        db.commit()
        return True

    @staticmethod
    def update_lesson_progress(
        db: Session,
        user_id: int,
        lesson_id: int,
        progress_percentage: float,
        completed_sections: list = None,
        time_spent: int = None
    ) -> StudentProgress:
        """
        Update student progress for a lesson
        Args:
            db: Database session
            user_id: Student user ID
            lesson_id: Lesson ID
            progress_percentage: Progress percentage (0-100)
            completed_sections: List of completed section IDs (optional)
            time_spent: Time spent in seconds (optional)
        Returns:
            Updated or created StudentProgress
        """
        # Get or create progress record
        progress = db.query(StudentProgress).filter(
            StudentProgress.user_id == user_id,
            StudentProgress.lesson_id == lesson_id
        ).first()

        if not progress:
            progress = StudentProgress(
                user_id=user_id,
                lesson_id=lesson_id
            )
            db.add(progress)

        # Update progress
        progress.progress_percentage = min(progress_percentage, 100.0)
        progress.is_completed = progress.progress_percentage >= 100.0

        # Update completed sections if provided
        if completed_sections is not None:
            import json
            progress.completed_sections = json.dumps(completed_sections)

        # Update time spent if provided
        if time_spent is not None:
            progress.time_spent = time_spent

        if progress.is_completed and not progress.completed_at:
            from datetime import datetime
            progress.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(progress)

        return progress
