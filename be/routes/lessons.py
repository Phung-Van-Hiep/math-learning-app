"""
Lesson routes
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from schemas.lesson import LessonCreate, LessonUpdate, LessonResponse, LessonWithProgress
from services.lesson_service import LessonService
from middleware.auth import get_current_active_user, get_current_teacher_or_admin, get_current_student_user
from entities.user import User

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.post("/", response_model=LessonResponse)
async def create_lesson(
    lesson_data: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher_or_admin)
):
    """
    Create a new lesson (Teacher/Admin only)

    - **title**: Lesson title
    - **slug**: URL-friendly slug (must be unique)
    - **description**: Lesson description
    - **grade**: Grade level (6-9)
    - **duration**: Duration in minutes
    - **difficulty**: Difficulty level (easy, medium, hard)
    - **thumbnail**: Thumbnail image URL
    - **video_url**: Video URL
    - **content**: Lesson content (HTML or Markdown)
    - **is_published**: Whether lesson is published
    """
    return LessonService.create_lesson(db, lesson_data)


@router.get("/", response_model=List[LessonResponse])
async def get_lessons(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    grade: Optional[int] = Query(None, ge=6, le=9),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher_or_admin)
):
    """
    Get all lessons with filters (Teacher/Admin only - includes unpublished)

    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **grade**: Filter by grade (6-9)
    - **difficulty**: Filter by difficulty (easy, medium, hard)
    """
    return LessonService.get_lessons(
        db,
        skip=skip,
        limit=limit,
        grade=grade,
        difficulty=difficulty
    )


@router.get("/published", response_model=List[LessonResponse])
async def get_published_lessons(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    grade: Optional[int] = Query(None, ge=6, le=9),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get published lessons (Public access)

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records
    - **grade**: Filter by grade
    - **difficulty**: Filter by difficulty
    """
    return LessonService.get_lessons(
        db,
        skip=skip,
        limit=limit,
        grade=grade,
        difficulty=difficulty,
        is_published=True
    )


@router.get("/my-lessons", response_model=List[LessonWithProgress])
async def get_my_lessons(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    grade: Optional[int] = Query(None, ge=6, le=9),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student_user)
):
    """
    Get lessons with progress for current student

    Returns published lessons with student's progress data

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records
    - **grade**: Filter by grade
    """
    return LessonService.get_lessons_with_progress(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        grade=grade
    )


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get lesson by ID

    - **lesson_id**: Lesson ID
    """
    return LessonService.get_lesson(db, lesson_id)


@router.get("/slug/{slug}", response_model=LessonResponse)
async def get_lesson_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get lesson by slug

    - **slug**: Lesson slug
    """
    return LessonService.get_lesson_by_slug(db, slug)


@router.put("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: int,
    lesson_data: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher_or_admin)
):
    """
    Update lesson (Teacher/Admin only)

    - **lesson_id**: Lesson ID
    """
    return LessonService.update_lesson(db, lesson_id, lesson_data)


@router.delete("/{lesson_id}")
async def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher_or_admin)
):
    """
    Delete lesson (Teacher/Admin only)

    - **lesson_id**: Lesson ID
    """
    LessonService.delete_lesson(db, lesson_id)
    return {"message": "Lesson deleted successfully"}


@router.post("/{lesson_id}/progress")
async def update_lesson_progress(
    lesson_id: int,
    progress_percentage: float = Query(..., ge=0, le=100),
    completed_sections: Optional[str] = Query(None),  # Comma-separated section IDs
    time_spent: Optional[int] = Query(None, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student_user)
):
    """
    Update student progress for a lesson

    - **lesson_id**: Lesson ID
    - **progress_percentage**: Progress percentage (0-100)
    - **completed_sections**: Optional comma-separated list of completed section IDs
    - **time_spent**: Optional time spent in seconds
    """
    # Parse completed sections if provided
    sections_list = None
    if completed_sections:
        try:
            sections_list = [int(s.strip()) for s in completed_sections.split(',') if s.strip()]
        except ValueError:
            pass  # Ignore invalid format

    progress = LessonService.update_lesson_progress(
        db,
        user_id=current_user.id,
        lesson_id=lesson_id,
        progress_percentage=progress_percentage,
        completed_sections=sections_list,
        time_spent=time_spent
    )

    return {
        "message": "Progress updated successfully",
        "progress_percentage": progress.progress_percentage,
        "is_completed": progress.is_completed,
        "time_spent": progress.time_spent
    }
