from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class GeoGebraContent(Base):
    __tablename__ = "geogebra_contents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    ggb_base64 = Column(Text, nullable=False) # Lưu chuỗi Base64 của hình
    width = Column(Integer, default=800)
    height = Column(Integer, default=600)
    show_toolbar = Column(Boolean, default=False)
    
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    lesson = relationship("Lesson", back_populates="geogebra_figures")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)