from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from services.database import get_db
from services.models import Feedback, FAQ, ContactInfo, Student
from services.schemas import FeedbackCreate, FeedbackResponse
from services.auth import get_current_student

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_student: Optional[Student] = Depends(get_current_student)
):
    """Submit feedback"""
    feedback = Feedback(
        student_id=current_student.id if current_student else None,
        **feedback_data.dict()
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback

@router.get("/faq")
async def get_faq(db: Session = Depends(get_db)):
    """Get all published FAQs"""
    faqs = db.query(FAQ).filter(FAQ.is_published == True).order_by(FAQ.order).all()
    return faqs

@router.get("/contact")
async def get_contact_info(db: Session = Depends(get_db)):
    """Get contact information"""
    contact = db.query(ContactInfo).first()
    return contact if contact else {}
