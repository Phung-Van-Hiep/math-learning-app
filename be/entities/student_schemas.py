from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    class_name: str

class StudentResponse(StudentBase):
    id: int
    avatar: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    avatar: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(min_length=6)
