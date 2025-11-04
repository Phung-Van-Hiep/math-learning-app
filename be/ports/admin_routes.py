from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from typing import List
import shutil
import os

from services.database import get_db
from services.models import (
    Admin, Student, Video, Content, Interactive, Assessment,
    TestResult, Feedback, Introduction, ContactInfo, FAQ
)
from be.entities.auth_schemas import AdminLogin
from be.entities.introduction_schemas import IntroductionBase, IntroductionResponse
from be.entities.video_schemas import VideoCreate, VideoResponse
from be.entities.content_schemas import ContentCreate, ContentResponse
from be.entities.assessment_schemas import AssessmentCreate, AssessmentResponse
from be.entities.feedback_schemas import FeedbackResponse
from be.entities.dashboard_schemas import DashboardStats
from services.auth import (
    verify_password, get_password_hash, create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_admin
)

router = APIRouter()

# ==================== ADMIN AUTH ====================
@router.post("/auth/login")
async def admin_login(credentials: AdminLogin, db: Session = Depends(get_db)):
    """Admin login"""
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()

    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email, "type": "admin"},
        expires_delta=access_token_expires
    )

    return {
        "admin": {"id": admin.id, "name": admin.name, "email": admin.email},
        "token": access_token
    }

@router.post("/auth/logout")
async def admin_logout(current_admin: Admin = Depends(get_current_admin)):
    """Admin logout"""
    return {"message": "Logged out successfully"}

@router.get("/auth/verify")
async def verify_admin_token(current_admin: Admin = Depends(get_current_admin)):
    """Verify admin token"""
    return {"admin": {"id": current_admin.id, "name": current_admin.name, "email": current_admin.email}}

# ==================== DASHBOARD ====================
@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    total_views = db.query(func.sum(Video.views)).scalar() or 0
    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_submissions = db.query(func.count(TestResult.id)).scalar() or 0
    total_feedback = db.query(func.count(Feedback.id)).scalar() or 0

    return {
        "total_views": total_views,
        "total_students": total_students,
        "total_submissions": total_submissions,
        "total_feedback": total_feedback
    }

# ==================== INTRODUCTION ====================
@router.get("/introduction", response_model=IntroductionResponse)
async def get_introduction_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get introduction (admin)"""
    intro = db.query(Introduction).first()
    if not intro:
        intro = Introduction()
        db.add(intro)
        db.commit()
        db.refresh(intro)
    return intro

@router.put("/introduction", response_model=IntroductionResponse)
async def update_introduction(
    intro_data: IntroductionBase,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update introduction"""
    intro = db.query(Introduction).first()
    if not intro:
        intro = Introduction()
        db.add(intro)

    for key, value in intro_data.dict(exclude_unset=True).items():
        setattr(intro, key, value)

    db.commit()
    db.refresh(intro)
    return intro

# ==================== VIDEOS ====================
@router.get("/videos", response_model=List[VideoResponse])
async def get_all_videos_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all videos (admin)"""
    return db.query(Video).all()

@router.post("/videos", response_model=VideoResponse)
async def create_video(
    video_data: VideoCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new video"""
    video = Video(**video_data.dict())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

@router.put("/videos/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_data: VideoCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update video"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    for key, value in video_data.dict(exclude_unset=True).items():
        setattr(video, key, value)

    db.commit()
    db.refresh(video)
    return video

@router.delete("/videos/{video_id}")
async def delete_video(
    video_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete video"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    db.delete(video)
    db.commit()
    return {"message": "Video deleted successfully"}

# ==================== CONTENT ====================
@router.get("/content", response_model=List[ContentResponse])
async def get_all_content_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all content (admin)"""
    return db.query(Content).order_by(Content.order).all()

@router.post("/content", response_model=ContentResponse)
async def create_content(
    content_data: ContentCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new content"""
    content = Content(**content_data.dict())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content

@router.put("/content/{content_id}", response_model=ContentResponse)
async def update_content(
    content_id: int,
    content_data: ContentCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update content"""
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    for key, value in content_data.dict(exclude_unset=True).items():
        setattr(content, key, value)

    db.commit()
    db.refresh(content)
    return content

@router.delete("/content/{content_id}")
async def delete_content(
    content_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete content"""
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    db.delete(content)
    db.commit()
    return {"message": "Content deleted successfully"}

# ==================== ASSESSMENTS ====================
@router.get("/assessments", response_model=List[AssessmentResponse])
async def get_all_assessments_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all assessments (admin)"""
    return db.query(Assessment).all()

@router.post("/assessments", response_model=AssessmentResponse)
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new assessment"""
    assessment = Assessment(**assessment_data.dict())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

@router.get("/assessments/{assessment_id}/results")
async def get_assessment_results(
    assessment_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all results for an assessment"""
    results = db.query(TestResult).filter(TestResult.assessment_id == assessment_id).all()
    return results

# ==================== FEEDBACK ====================
@router.get("/feedback", response_model=List[FeedbackResponse])
async def get_all_feedback(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all feedback"""
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()

@router.put("/feedback/{feedback_id}/read")
async def mark_feedback_read(
    feedback_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mark feedback as read"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    feedback.is_read = True
    db.commit()

    return {"message": "Feedback marked as read"}
