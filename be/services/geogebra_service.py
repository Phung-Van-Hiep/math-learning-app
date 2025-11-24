from sqlalchemy.orm import Session
from entities.geogebra import GeoGebraContent
from schemas.geogebra import GeoGebraCreate, GeoGebraUpdate

class GeoGebraService:
    @staticmethod
    def create_geogebra(db: Session, data: GeoGebraCreate):
        new_ggb = GeoGebraContent(**data.dict())
        db.add(new_ggb)
        db.commit()
        db.refresh(new_ggb)
        return new_ggb

    @staticmethod
    def get_by_lesson(db: Session, lesson_id: int):
        return db.query(GeoGebraContent).filter(GeoGebraContent.lesson_id == lesson_id).all()

    @staticmethod
    def get_by_id(db: Session, id: int):
        return db.query(GeoGebraContent).filter(GeoGebraContent.id == id).first()

    @staticmethod
    def update_geogebra(db: Session, id: int, data: GeoGebraUpdate):
        ggb = db.query(GeoGebraContent).filter(GeoGebraContent.id == id).first()
        if ggb:
            for key, value in data.dict(exclude_unset=True).items():
                setattr(ggb, key, value)
            db.commit()
            db.refresh(ggb)
        return ggb

    @staticmethod
    def delete_geogebra(db: Session, id: int):
        ggb = db.query(GeoGebraContent).filter(GeoGebraContent.id == id).first()
        if ggb:
            db.delete(ggb)
            db.commit()