"""
User settings schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserSettingsUpdate(BaseModel):
    """Schema for updating user settings"""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    grade: Optional[int] = None
    class_name: Optional[str] = None


class PasswordChange(BaseModel):
    """Schema for changing password"""
    current_password: str
    new_password: str
