from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class IntroductionBase(BaseModel):
    teacher_name: Optional[str] = None
    teacher_title: Optional[str] = None
    teacher_email: Optional[EmailStr] = None
    target_students: Optional[str] = None
    objectives: Optional[Dict[str, List[str]]] = None
    duration: Optional[str] = None
    references: Optional[List[Dict[str, str]]] = None

class IntroductionResponse(IntroductionBase):
    id: int
    teacher_image: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True
