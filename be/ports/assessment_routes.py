from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from services.database import get_db
from services.models import Assessment, TestResult, Assignment, Student
from services.schemas import AssessmentResponse, TestResultCreate, TestResultResponse, AssignmentResponse
from services.auth import get_current_student

router = APIRouter()

@router.get("", response_model=List[AssessmentResponse])
async def get_assessments(db: Session = Depends(get_db)):
    """Get all published assessments"""
    assessments = db.query(Assessment).filter(Assessment.is_published == True).all()
    return assessments

@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get specific assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.post("/{assessment_id}/submit", response_model=TestResultResponse)
async def submit_assessment(
    assessment_id: int,
    result_data: TestResultCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Submit assessment and save result"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Create test result
    test_result = TestResult(
        student_id=current_student.id,
        **result_data.dict()
    )
    db.add(test_result)

    # Update or delete corresponding assignment
    assignment = db.query(Assignment).filter(
        Assignment.student_id == current_student.id,
        Assignment.assessment_id == assessment_id,
        Assignment.status == "in_progress"
    ).first()

    if assignment:
        db.delete(assignment)

    db.commit()
    db.refresh(test_result)

    return test_result

@router.get("/results", response_model=List[TestResultResponse])
async def get_results(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get all test results for current student"""
    results = db.query(TestResult).filter(TestResult.student_id == current_student.id).all()
    return results

@router.get("/results/{result_id}", response_model=TestResultResponse)
async def get_result(
    result_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get specific test result"""
    result = db.query(TestResult).filter(
        TestResult.id == result_id,
        TestResult.student_id == current_student.id
    ).first()

    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    return result
