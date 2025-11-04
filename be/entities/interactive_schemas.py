from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InteractiveBase(BaseModel):
    tool_type: str  # 'geogebra', 'maple', 'mindmap', 'other'
    title: str
    description: Optional[str] = None
    embed_code: Optional[str] = None
    file_url: Optional[str] = None
    order: int = 0
    is_published: bool = False

class InteractiveCreate(InteractiveBase):
    pass

class InteractiveResponse(InteractiveBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
