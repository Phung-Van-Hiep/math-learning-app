from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContentBase(BaseModel):
    section_type: str
    title: str
    content_html: str
    order: int = 0
    geogebra_embed: Optional[str] = None
    is_published: bool = False

class ContentCreate(ContentBase):
    pass

class ContentResponse(ContentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
