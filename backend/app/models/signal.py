from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from .database import Base

class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    hiring_score = Column(Float, default=0.0)
    funding_score = Column(Float, default=0.0)
    pain_score = Column(Float, default=0.0)
    tech_score = Column(Float, default=0.0)
    timing_score = Column(Float, default=0.0)
    raw_data = Column(JSONB, default={})
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
