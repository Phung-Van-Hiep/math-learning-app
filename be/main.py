"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path

from core.config import settings
from core.database import init_db

# Import routers
from routes import auth, lessons, quiz, upload, feedback,geogebra, admin
from entities.geogebra import GeoGebraContent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    """
    # Startup
    print("🚀 Starting THCS Math Website API...")
    print(f"📦 Version: {settings.APP_VERSION}")
    print(f"🔧 Debug mode: {settings.DEBUG}")

    # Initialize database
    print("🗄️  Initializing database...")
    init_db()
    print("✅ Database initialized")

    yield

    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API for THCS Như Quỳnh Math Learning Platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(lessons.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(geogebra.router, prefix="/api")

# Mount static files for uploads
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount static files for default images
default_dir = Path("default")
default_dir.mkdir(exist_ok=True)
app.mount("/default", StaticFiles(directory="default"), name="default")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "THCS Math Website API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
