"""
Outreach API — AI outreach angle generation
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.company import Company
from ..models.signal import Signal
from ..models.score import Score
from ..nlp.outreach_gen import generate_outreach_angles

router = APIRouter(prefix="/api/outreach", tags=["outreach"])


@router.post("/{company_id}")
def generate_outreach(company_id: int, db: Session = Depends(get_db)):
    """Generate outreach angles for a specific company."""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return {"error": "Company not found"}
    
    signal = db.query(Signal).filter(Signal.company_id == company_id).first()
    score = db.query(Score).filter(Score.company_id == company_id).first()
    
    company_data = {
        "name": company.name,
        "industry": company.industry,
        "employees": company.employees,
        "funding_stage": company.funding_stage,
    }
    
    signal_data = {
        "hiring_score": signal.hiring_score if signal else 0,
        "funding_score": signal.funding_score if signal else 0,
        "pain_score": signal.pain_score if signal else 0,
        "tech_score": signal.tech_score if signal else 0,
        "timing_score": signal.timing_score if signal else 0,
        "raw_data": signal.raw_data if signal else {},
    }
    
    score_data = {
        "total_score": score.total_score if score else 0,
        "buy_probability": score.buy_probability if score else 0,
        "priority_tier": score.priority_tier if score else "T3",
    }
    
    angles = generate_outreach_angles(company_data, signal_data, score_data)
    
    return {
        "company_id": company_id,
        "company_name": company.name,
        "angles": angles,
    }
