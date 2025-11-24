"""
Authentication service
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from entities.user import User
from schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from utils.security import verify_password, get_password_hash, create_access_token


class AuthService:
    """Authentication service for login/logout/register"""
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password wrapper"""
        return verify_password(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash password wrapper"""
        return get_password_hash(password)
    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        """
        Register a new user
        Args:
            db: Database session
            user_data: User registration data
        Returns:
            Created user
        Raises:
            HTTPException: If username or email already exists
        """
        # Check if username exists
        existing_user = db.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Check if email exists
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            role=user_data.role,
            grade=user_data.grade,
            class_name=user_data.class_name
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    @staticmethod
    def login(db: Session, credentials: UserLogin) -> TokenResponse:
        """
        Authenticate user and return token
        Args:
            db: Database session
            credentials: Login credentials
        Returns:
            Token response with user data
        Raises:
            HTTPException: If credentials are invalid
        """
        # Find user by username
        user = db.query(User).filter(User.username == credentials.username).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()

        # Create access token
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "username": user.username,
                "role": user.role.value
            }
        )

        # Return token and user data
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )

    @staticmethod
    def get_current_user(db: Session, user_id: int) -> User:
        """
        Get current authenticated user
        Args:
            db: Database session
            user_id: User ID from token
        Returns:
            User object
        Raises:
            HTTPException: If user not found
        """
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        return user
