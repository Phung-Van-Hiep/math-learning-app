"""
Authentication routes - login, logout, register
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.user import UserCreate, UserLogin, LoginResponse, UserResponse
from schemas.user_settings import UserSettingsUpdate, PasswordChange
from services.auth_service import AuthService
from middleware.auth import get_current_active_user
from entities.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user (student, teacher, or admin)

    - **username**: Unique username (3-50 characters)
    - **email**: Valid email address
    - **password**: Password (minimum 6 characters)
    - **full_name**: Full name of the user
    - **role**: User role (student, teacher, admin) - defaults to student
    - **grade**: Grade level for students (6-9)
    - **class_name**: Class name for students (e.g., "8A")
    """
    user = AuthService.register_user(db, user_data)
    return user


@router.post("/login", response_model=LoginResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with username and password

    Returns JWT access token and user information

    - **username**: Username
    - **password**: Password
    """
    return AuthService.login(db, credentials)


@router.post("/login/form", response_model=LoginResponse)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with OAuth2 password flow (for compatibility with Swagger UI)

    Returns JWT access token and user information
    """
    credentials = UserLogin(username=form_data.username, password=form_data.password)
    return AuthService.login(db, credentials)


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """
    Logout current user

    Note: Since we're using stateless JWT tokens, logout is handled client-side
    by removing the token. This endpoint is here for API completeness.

    In production, you might want to implement token blacklisting.
    """
    return {
        "message": "Successfully logged out",
        "detail": "Please remove the token from client storage"
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Get current authenticated user information
    """
    return current_user


@router.get("/verify")
async def verify_token(current_user: User = Depends(get_current_active_user)):
    """
    Verify if current token is valid

    Returns user role and status
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "is_active": current_user.is_active
    }

@router.put("/settings", response_model=UserResponse)
async def update_settings(
    settings: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update user settings/profile

    - **full_name**: Update full name
    - **email**: Update email (must be unique)
    - **grade**: Update grade (students only)
    - **class_name**: Update class name (students only)
    """
    from sqlalchemy.exc import IntegrityError

    try:
        # Update fields if provided
        if settings.full_name:
            current_user.full_name = settings.full_name
        if settings.email:
            # Check if email is already taken by another user
            existing = db.query(User).filter(
                User.email == settings.email,
                User.id != current_user.id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already taken"
                )
            current_user.email = settings.email
        if settings.grade is not None:
            current_user.grade = settings.grade
        if settings.class_name is not None:
            current_user.class_name = settings.class_name

        db.commit()
        db.refresh(current_user)
        return current_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Change user password

    - **current_password**: Current password for verification
    - **new_password**: New password
    """
    # Verify current password
    if not AuthService.verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )

    # Hash and update password
    current_user.hashed_password = AuthService.get_password_hash(password_data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}
