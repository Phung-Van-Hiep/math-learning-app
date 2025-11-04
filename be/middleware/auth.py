"""
Authentication middleware and dependencies
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional

from core.database import get_db
from entities.user import User, UserRole
from utils.security import decode_access_token
from services.auth_service import AuthService

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from token
    Args:
        token: JWT access token
        db: Database session
    Returns:
        Current user
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # Get user from database
    try:
        user = AuthService.get_current_user(db, int(user_id))
    except Exception:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure user is active
    Args:
        current_user: Current authenticated user
    Returns:
        Active user
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Dependency to ensure user is admin
    Args:
        current_user: Current authenticated user
    Returns:
        Admin user
    Raises:
        HTTPException: If user is not admin
    """
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required."
        )
    return current_user


async def get_current_teacher_or_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Dependency to ensure user is teacher or admin
    Args:
        current_user: Current authenticated user
    Returns:
        Teacher or admin user
    Raises:
        HTTPException: If user is neither teacher nor admin
    """
    if not (current_user.is_admin() or current_user.is_teacher()):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Teacher or admin access required."
        )
    return current_user


async def get_current_student_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Dependency to ensure user is student
    Args:
        current_user: Current authenticated user
    Returns:
        Student user
    Raises:
        HTTPException: If user is not student
    """
    if not current_user.is_student():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    return current_user
