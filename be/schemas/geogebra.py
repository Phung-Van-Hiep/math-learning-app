from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GeoGebraBase(BaseModel):
    title: str
    width: Optional[int] = 800
    height: Optional[int] = 600
    show_toolbar: bool = False

class GeoGebraCreate(GeoGebraBase):
    lesson_id: int
    ggb_base64: str

class GeoGebraUpdate(BaseModel):
    title: Optional[str] = None
    ggb_base64: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    show_toolbar: Optional[bool] = None

class GeoGebraResponse(GeoGebraBase):
    id: int
    lesson_id: int
    ggb_base64: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True