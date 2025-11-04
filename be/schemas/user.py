"""
User Pydantic schemas
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from entities.user import UserRole


# Base schemas
class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)


# Request schemas
class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.STUDENT
    grade: Optional[int] = Field(None, ge=6, le=9)
    class_name: Optional[str] = Field(None, max_length=20)


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class UserUpdate(BaseModel):
    """Schema for user update"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    grade: Optional[int] = Field(None, ge=6, le=9)
    class_name: Optional[str] = Field(None, max_length=20)


class PasswordChange(BaseModel):
    """Schema for password change"""
    old_password: str
    new_password: str = Field(..., min_length=6)


# Response schemas
class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    role: UserRole
    grade: Optional[int] = None
    class_name: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LoginResponse(TokenResponse):
    """Schema for login response"""
    pass
