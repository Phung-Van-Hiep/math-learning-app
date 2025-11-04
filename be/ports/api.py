from fastapi import APIRouter

from .auth_routes import router as auth_router
from .student_routes import router as student_router
from .admin_routes import router as admin_router
from .content_routes import router as content_router
from .assessment_routes import router as assessment_router
from .feedback_routes import router as feedback_router

router = APIRouter()

# Include all route modules
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(student_router, prefix="/students", tags=["Students"])
router.include_router(content_router, prefix="/content", tags=["Content"])
router.include_router(assessment_router, prefix="/assessments", tags=["Assessments"])
router.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])

# Admin routes
router.include_router(admin_router, prefix="/admin", tags=["Admin"])
