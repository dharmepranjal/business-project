from sqlalchemy import Column, Integer, String, BigInteger, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from ..database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(100))
    employees = Column(Integer)
    revenue_estimate = Column(BigInteger)
    location = Column(String(255))
    funding_stage = Column(String(50))
    tech_stack = Column(JSONB, default=[])
    metadata_json = Column(JSONB, default={})
    created_at = Column(DateTime, server_default=func.now())
