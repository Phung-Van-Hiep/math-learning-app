from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from services.geogebra_service import GeoGebraService
from schemas.geogebra import GeoGebraCreate, GeoGebraUpdate, GeoGebraResponse
from entities.user import UserRole
from middleware.auth import require_role, get_current_active_user

router = APIRouter(prefix="/geogebra", tags=["GeoGebra"])

@router.post("/", response_model=GeoGebraResponse)
def create(data: GeoGebraCreate, db: Session = Depends(get_db), user=Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))):
    return GeoGebraService.create_geogebra(db, data)

@router.get("/lesson/{lesson_id}", response_model=List[GeoGebraResponse])
def get_by_lesson(lesson_id: int, db: Session = Depends(get_db), user=Depends(get_current_active_user)):
    return GeoGebraService.get_by_lesson(db, lesson_id)

@router.get("/{id}", response_model=GeoGebraResponse)
def get_one(id: int, db: Session = Depends(get_db), user=Depends(get_current_active_user)):
    return GeoGebraService.get_by_id(db, id)

@router.put("/{id}", response_model=GeoGebraResponse)
def update(id: int, data: GeoGebraUpdate, db: Session = Depends(get_db), user=Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))):
    return GeoGebraService.update_geogebra(db, id, data)

@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), user=Depends(require_role([UserRole.ADMIN, UserRole.TEACHER]))):
    GeoGebraService.delete_geogebra(db, id)
    return {"message": "Deleted"}