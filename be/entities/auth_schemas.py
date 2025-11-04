from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    class_name: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
