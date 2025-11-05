"""
Quiz service - business logic for quiz operations
"""
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import random

from entities.quiz import Quiz, QuizQuestion, QuizAnswer, QuizAttempt
from entities.student_progress import StudentProgress
from schemas.quiz import (
    QuizCreate, QuizUpdate, QuizResponse, QuizStudentResponse,
    QuizSubmitRequest, QuizAttemptResponse
)


class QuizService:
    """Service for quiz operations"""

    @staticmethod
    def create_quiz(db: Session, quiz_data: QuizCreate) -> Quiz:
        """Create a new quiz with questions and answers"""
        # Create quiz
        quiz = Quiz(
            lesson_id=quiz_data.lesson_id,
            title=quiz_data.title,
            description=quiz_data.description,
            duration=quiz_data.duration,
            passing_score=quiz_data.passing_score,
            is_active=quiz_data.is_active,
            shuffle_questions=quiz_data.shuffle_questions,
            show_answers=quiz_data.show_answers
        )
        db.add(quiz)
        db.flush()  # Get quiz ID

        # Create questions and answers
        for question_data in quiz_data.questions:
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_text=question_data.question_text,
                question_type=question_data.question_type,
                points=question_data.points,
                order=question_data.order,
                image_url=question_data.image_url
            )
            db.add(question)
            db.flush()  # Get question ID

            # Create answers
            for answer_data in question_data.answers:
                answer = QuizAnswer(
                    question_id=question.id,
                    answer_text=answer_data.answer_text,
                    is_correct=answer_data.is_correct,
                    order=answer_data.order
                )
                db.add(answer)

        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def get_quiz_by_id(db: Session, quiz_id: int) -> Optional[Quiz]:
        """Get quiz by ID with all relationships"""
        return db.query(Quiz).filter(Quiz.id == quiz_id).first()

    @staticmethod
    def get_quiz_by_lesson(db: Session, lesson_id: int) -> Optional[Quiz]:
        """Get active quiz for a lesson"""
        return db.query(Quiz).filter(
            Quiz.lesson_id == lesson_id,
            Quiz.is_active == True
        ).first()

    @staticmethod
    def get_all_quizzes(db: Session, lesson_id: Optional[int] = None) -> List[Quiz]:
        """Get all quizzes, optionally filtered by lesson"""
        query = db.query(Quiz)
        if lesson_id:
            query = query.filter(Quiz.lesson_id == lesson_id)
        return query.all()

    @staticmethod
    def update_quiz(db: Session, quiz_id: int, quiz_data: QuizUpdate) -> Optional[Quiz]:
        """Update quiz details"""
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            return None

        update_data = quiz_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(quiz, field, value)

        quiz.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def delete_quiz(db: Session, quiz_id: int) -> bool:
        """Delete a quiz"""
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            return False

        db.delete(quiz)
        db.commit()
        return True

    @staticmethod
    def get_quiz_for_student(db: Session, quiz_id: int, shuffle: bool = False) -> Optional[Quiz]:
        """Get quiz formatted for students (hides correct answers)"""
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            return None

        # Shuffle questions if enabled
        if shuffle and quiz.shuffle_questions:
            random.shuffle(quiz.questions)
            for question in quiz.questions:
                random.shuffle(question.answers)

        return quiz

    @staticmethod
    def submit_quiz(
        db: Session,
        user_id: int,
        quiz_id: int,
        submit_data: QuizSubmitRequest
    ) -> tuple[QuizAttempt, bool, Optional[List[Dict]]]:
        """
        Submit quiz answers and calculate score
        Returns: (attempt, passed, correct_answers)
        """
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise ValueError("Quiz not found")

        # Calculate score
        total_points = 0.0
        earned_points = 0.0
        correct_answers_list = []

        for question in quiz.questions:
            total_points += question.points
            user_answer = submit_data.answers.get(str(question.id))

            # Find correct answer
            correct_answer = None
            for answer in question.answers:
                if answer.is_correct:
                    correct_answer = answer
                    break

            # Check if answer is correct
            is_correct = False
            if question.question_type == "multiple_choice":
                is_correct = user_answer == correct_answer.id if correct_answer else False
            elif question.question_type == "true_false":
                is_correct = user_answer == correct_answer.id if correct_answer else False
            elif question.question_type == "short_answer":
                # For short answer, compare text (case insensitive, trimmed)
                if correct_answer and user_answer:
                    is_correct = str(user_answer).strip().lower() == correct_answer.answer_text.strip().lower()

            if is_correct:
                earned_points += question.points

            # Collect correct answer info
            correct_answers_list.append({
                "question_id": question.id,
                "question_text": question.question_text,
                "user_answer": user_answer,
                "correct_answer_id": correct_answer.id if correct_answer else None,
                "correct_answer_text": correct_answer.answer_text if correct_answer else None,
                "is_correct": is_correct,
                "points": question.points if is_correct else 0
            })

        # Calculate percentage score
        score = (earned_points / total_points * 100) if total_points > 0 else 0
        passed = score >= quiz.passing_score

        # Create quiz attempt
        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz_id,
            score=score,
            points_earned=earned_points,
            total_points=total_points,
            answers=submit_data.answers,
            submitted_at=datetime.utcnow(),
            time_spent=submit_data.time_spent,
            is_completed=True
        )
        db.add(attempt)

        # Update student progress if passed
        if passed:
            progress = db.query(StudentProgress).filter(
                StudentProgress.user_id == user_id,
                StudentProgress.lesson_id == quiz.lesson_id
            ).first()

            if progress:
                progress.quiz_score = score
                if progress.average_score:
                    progress.average_score = (progress.average_score + score) / 2
                else:
                    progress.average_score = score

        db.commit()
        db.refresh(attempt)

        # Return correct answers only if show_answers is enabled
        return_answers = correct_answers_list if quiz.show_answers else None

        return attempt, passed, return_answers

    @staticmethod
    def get_user_attempts(db: Session, user_id: int, quiz_id: Optional[int] = None) -> List[QuizAttempt]:
        """Get all quiz attempts for a user"""
        query = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id)
        if quiz_id:
            query = query.filter(QuizAttempt.quiz_id == quiz_id)
        return query.order_by(QuizAttempt.submitted_at.desc()).all()

    @staticmethod
    def get_attempt_by_id(db: Session, attempt_id: int, user_id: int) -> Optional[QuizAttempt]:
        """Get a specific attempt"""
        return db.query(QuizAttempt).filter(
            QuizAttempt.id == attempt_id,
            QuizAttempt.user_id == user_id
        ).first()

    @staticmethod
    def get_best_attempt(db: Session, user_id: int, quiz_id: int) -> Optional[QuizAttempt]:
        """Get the best attempt for a user on a specific quiz"""
        return db.query(QuizAttempt).filter(
            QuizAttempt.user_id == user_id,
            QuizAttempt.quiz_id == quiz_id,
            QuizAttempt.is_completed == True
        ).order_by(QuizAttempt.score.desc()).first()
