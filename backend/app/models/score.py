from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from ..database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), unique=True)
    total_score = Column(Float, default=0.0)
    buy_probability = Column(Float, default=0.0)
    priority_tier = Column(String(10))  # "T1", "T2", "T3"
    explanation_json = Column(JSONB, default={})
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
