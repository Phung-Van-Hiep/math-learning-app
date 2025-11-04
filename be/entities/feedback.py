"""
Feedback entity - for lesson ratings and comments
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from core.database import Base


class Feedback(Base):
    """Feedback model - student feedback on lessons"""
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)

    # Rating and comment
    rating = Column(Float, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="feedbacks")
    lesson = relationship("Lesson", back_populates="feedbacks")

    def __repr__(self):
        return f"<Feedback User:{self.user_id} Lesson:{self.lesson_id} Rating:{self.rating}>"
