"""
Companies API — CRUD + ICP filtering
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ..database import get_db
from ..models.company import Company
from ..models.signal import Signal
from ..models.score import Score
from ..schemas.schemas import CompanyOut, CompanyDetail, SignalOut, ScoreOut

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("", response_model=List[CompanyOut])
def list_companies(
    industry: Optional[str] = Query(None),
    min_employees: Optional[int] = Query(None),
    max_employees: Optional[int] = Query(None),
    min_revenue: Optional[int] = Query(None),
    max_revenue: Optional[int] = Query(None),
    funding_stage: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: Session = Depends(get_db),
):
    query = db.query(Company)

    if industry:
        query = query.filter(Company.industry == industry)
    if min_employees is not None:
        query = query.filter(Company.employees >= min_employees)
    if max_employees is not None:
        query = query.filter(Company.employees <= max_employees)
    if min_revenue is not None:
        query = query.filter(Company.revenue_estimate >= min_revenue)
    if max_revenue is not None:
        query = query.filter(Company.revenue_estimate <= max_revenue)
    if funding_stage:
        query = query.filter(Company.funding_stage == funding_stage)
    if location:
        query = query.filter(Company.location.ilike(f"%{location}%"))

    return query.offset(offset).limit(limit).all()


@router.get("/{company_id}")
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return {"error": "Company not found"}

    signal = db.query(Signal).filter(Signal.company_id == company_id).first()
    score = db.query(Score).filter(Score.company_id == company_id).first()

    return {
        "id": company.id,
        "name": company.name,
        "industry": company.industry,
        "employees": company.employees,
        "revenue_estimate": company.revenue_estimate,
        "location": company.location,
        "funding_stage": company.funding_stage,
        "tech_stack": company.tech_stack,
        "signals": {
            "hiring_score": signal.hiring_score if signal else 0,
            "funding_score": signal.funding_score if signal else 0,
            "pain_score": signal.pain_score if signal else 0,
            "tech_score": signal.tech_score if signal else 0,
            "timing_score": signal.timing_score if signal else 0,
            "raw_data": signal.raw_data if signal else {},
        } if signal else None,
        "score": {
            "total_score": score.total_score if score else 0,
            "buy_probability": score.buy_probability if score else 0,
            "priority_tier": score.priority_tier if score else "T3",
            "explanation_json": score.explanation_json if score else {},
        } if score else None,
    }
