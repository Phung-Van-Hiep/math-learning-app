from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from services.database import get_db
from services.models import Introduction, Video, Content, Interactive
from services.schemas import IntroductionResponse, VideoResponse, ContentResponse

router = APIRouter()

@router.get("/introduction", response_model=IntroductionResponse)
async def get_introduction(db: Session = Depends(get_db)):
    """Get introduction content"""
    intro = db.query(Introduction).first()
    if not intro:
        # Return empty intro if not exists
        intro = Introduction()
    return intro

@router.get("/videos", response_model=List[VideoResponse])
async def get_videos(db: Session = Depends(get_db)):
    """Get all published videos"""
    videos = db.query(Video).filter(Video.is_published == True).all()
    return videos

@router.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    """Get specific video and increment views"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if video:
        video.views += 1
        db.commit()
    return video

@router.get("/math", response_model=List[ContentResponse])
async def get_math_content(db: Session = Depends(get_db)):
    """Get all published math content"""
    contents = db.query(Content).filter(Content.is_published == True).order_by(Content.order).all()
    return contents

@router.get("/interactive")
async def get_interactive_tools(db: Session = Depends(get_db)):
    """Get all published interactive tools"""
    tools = db.query(Interactive).filter(Interactive.is_published == True).order_by(Interactive.order).all()
    return tools
