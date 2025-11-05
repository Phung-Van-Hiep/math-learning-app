"""
File upload routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import Optional
import os
import uuid
from pathlib import Path
import shutil

from entities.user import UserRole
from middleware.auth import require_role
from schemas.user import UserResponse

router = APIRouter(prefix="/upload", tags=["upload"])

# Configure upload directories
UPLOAD_DIR = Path("uploads")
IMAGES_DIR = UPLOAD_DIR / "images"
VIDEOS_DIR = UPLOAD_DIR / "videos"

# Create directories if they don't exist
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".avi"}

# Max file sizes (in bytes)
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB


def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()


def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename using UUID"""
    ext = get_file_extension(original_filename)
    return f"{uuid.uuid4()}{ext}"


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """
    Upload an image file (Admin/Teacher only)
    Returns the URL to access the uploaded image
    """
    # Check file extension
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )

    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning

    if file_size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {MAX_IMAGE_SIZE / 1024 / 1024}MB"
        )

    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = IMAGES_DIR / unique_filename

    try:
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return URL (adjust based on your server configuration)
        file_url = f"/uploads/images/{unique_filename}"

        return {
            "success": True,
            "filename": unique_filename,
            "url": file_url,
            "size": file_size
        }

    except Exception as e:
        # Clean up file if something went wrong
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """
    Upload a video file (Admin/Teacher only)
    Returns the URL to access the uploaded video
    """
    # Check file extension
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}"
        )

    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {MAX_VIDEO_SIZE / 1024 / 1024}MB"
        )

    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = VIDEOS_DIR / unique_filename

    try:
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return URL
        file_url = f"/uploads/videos/{unique_filename}"

        return {
            "success": True,
            "filename": unique_filename,
            "url": file_url,
            "size": file_size
        }

    except Exception as e:
        # Clean up file if something went wrong
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.delete("/{file_type}/{filename}")
async def delete_file(
    file_type: str,
    filename: str,
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))
):
    """
    Delete an uploaded file (Admin/Teacher only)
    file_type: 'images' or 'videos'
    """
    if file_type not in ['images', 'videos']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Must be 'images' or 'videos'"
        )

    file_path = UPLOAD_DIR / file_type / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    try:
        file_path.unlink()
        return {
            "success": True,
            "message": "File deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )
