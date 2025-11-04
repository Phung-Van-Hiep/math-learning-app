from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_type: str
    video_url: str
    duration: Optional[int] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    key_points: Optional[List[str]] = None
    attachments: Optional[List[Dict[str, str]]] = None
    is_published: bool = False

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
