"""
Feedback service
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List, Optional

from entities.feedback import Feedback
from entities.lesson import Lesson
from entities.user import User
from schemas.feedback import FeedbackCreate, FeedbackUpdate


class FeedbackService:
    """Feedback management service"""

    @staticmethod
    def create_feedback(db: Session, user_id: int, feedback_data: FeedbackCreate) -> Feedback:
        """
        Create a new feedback
        Args:
            db: Database session
            user_id: User ID
            feedback_data: Feedback creation data
        Returns:
            Created feedback
        Raises:
            HTTPException: If lesson not found or duplicate feedback
        """
        # Check if lesson exists
        lesson = db.query(Lesson).filter(Lesson.id == feedback_data.lesson_id).first()
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )

        # Check if user already provided feedback for this lesson
        existing = db.query(Feedback).filter(
            Feedback.user_id == user_id,
            Feedback.lesson_id == feedback_data.lesson_id
        ).first()

        if existing:
            # Update existing feedback instead of creating new one
            existing.rating = feedback_data.rating
            existing.comment = feedback_data.comment
            db.commit()
            db.refresh(existing)

            # Update lesson rating
            FeedbackService._update_lesson_rating(db, feedback_data.lesson_id)

            return existing

        # Create new feedback
        feedback = Feedback(
            user_id=user_id,
            lesson_id=feedback_data.lesson_id,
            rating=feedback_data.rating,
            comment=feedback_data.comment
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)

        # Update lesson rating
        FeedbackService._update_lesson_rating(db, feedback_data.lesson_id)

        return feedback

    @staticmethod
    def get_feedback_by_id(db: Session, feedback_id: int) -> Optional[Feedback]:
        """Get feedback by ID"""
        return db.query(Feedback).filter(Feedback.id == feedback_id).first()

    @staticmethod
    def get_user_feedback(db: Session, user_id: int, lesson_id: Optional[int] = None) -> List[Feedback]:
        """
        Get all feedback from a user
        Args:
            db: Database session
            user_id: User ID
            lesson_id: Optional lesson ID filter
        Returns:
            List of feedback
        """
        query = db.query(Feedback).filter(Feedback.user_id == user_id)

        if lesson_id:
            query = query.filter(Feedback.lesson_id == lesson_id)

        return query.order_by(Feedback.created_at.desc()).all()

    @staticmethod
    def get_lesson_feedback(db: Session, lesson_id: int, limit: int = 100) -> List[Feedback]:
        """
        Get all feedback for a lesson
        Args:
            db: Database session
            lesson_id: Lesson ID
            limit: Maximum number of feedback to return
        Returns:
            List of feedback
        """
        return db.query(Feedback).filter(
            Feedback.lesson_id == lesson_id
        ).order_by(Feedback.created_at.desc()).limit(limit).all()

    @staticmethod
    def update_feedback(db: Session, feedback_id: int, user_id: int, feedback_data: FeedbackUpdate) -> Feedback:
        """
        Update feedback
        Args:
            db: Database session
            feedback_id: Feedback ID
            user_id: User ID (must match feedback owner)
            feedback_data: Update data
        Returns:
            Updated feedback
        Raises:
            HTTPException: If feedback not found or unauthorized
        """
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )

        if feedback.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this feedback"
            )

        # Update fields
        if feedback_data.rating is not None:
            feedback.rating = feedback_data.rating
        if feedback_data.comment is not None:
            feedback.comment = feedback_data.comment

        db.commit()
        db.refresh(feedback)

        # Update lesson rating
        FeedbackService._update_lesson_rating(db, feedback.lesson_id)

        return feedback

    @staticmethod
    def delete_feedback(db: Session, feedback_id: int, user_id: int) -> bool:
        """
        Delete feedback
        Args:
            db: Database session
            feedback_id: Feedback ID
            user_id: User ID (must match feedback owner)
        Returns:
            True if deleted
        Raises:
            HTTPException: If feedback not found or unauthorized
        """
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )

        if feedback.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this feedback"
            )

        lesson_id = feedback.lesson_id
        db.delete(feedback)
        db.commit()

        # Update lesson rating
        FeedbackService._update_lesson_rating(db, lesson_id)

        return True

    @staticmethod
    def _update_lesson_rating(db: Session, lesson_id: int):
        """
        Update lesson's average rating and review count
        Args:
            db: Database session
            lesson_id: Lesson ID
        """
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            return

        # Calculate average rating
        stats = db.query(
            func.avg(Feedback.rating).label('avg_rating'),
            func.count(Feedback.id).label('count')
        ).filter(Feedback.lesson_id == lesson_id).first()

        if stats and stats.count > 0:
            lesson.rating = round(float(stats.avg_rating), 2)
            lesson.review_count = stats.count
        else:
            lesson.rating = 0.0
            lesson.review_count = 0

        db.commit()
