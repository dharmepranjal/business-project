"""
Signals API — Signal retrieval and refresh
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.company import Company
from ..models.signal import Signal
from ..engine.signals.hiring import collect_hiring_signals
from ..engine.signals.funding import collect_funding_signals
from ..engine.signals.techstack import collect_techstack_signals

router = APIRouter(prefix="/api/signals", tags=["signals"])


@router.get("/{company_id}")
def get_signals(company_id: int, db: Session = Depends(get_db)):
    signal = db.query(Signal).filter(Signal.company_id == company_id).first()
    if not signal:
        return {"error": "No signals found for this company"}
    
    return {
        "company_id": signal.company_id,
        "hiring_score": signal.hiring_score,
        "funding_score": signal.funding_score,
        "pain_score": signal.pain_score,
        "tech_score": signal.tech_score,
        "timing_score": signal.timing_score,
        "raw_data": signal.raw_data,
        "last_updated": signal.last_updated,
    }


@router.post("/refresh")
def refresh_signals(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Trigger signal recollection for all companies."""
    background_tasks.add_task(_refresh_all_signals, db)
    return {"message": "Signal refresh started in background"}


def _refresh_all_signals(db: Session):
    """Background task: re-collect all signals."""
    companies = db.query(Company).all()
    
    for company in companies:
        hiring = collect_hiring_signals(company.name, seed=company.id)
        funding = collect_funding_signals(company.name, company.funding_stage, seed=company.id)
        techstack = collect_techstack_signals(company.name, company.tech_stack, seed=company.id)

        signal = db.query(Signal).filter(Signal.company_id == company.id).first()
        if signal:
            signal.hiring_score = hiring["hiring_score"]
            signal.funding_score = funding["funding_score"]
            signal.pain_score = hiring.get("pain_topics", {}).get("infrastructure_scaling", 0.3)
            signal.tech_score = techstack["tech_score"]
            signal.timing_score = 0.5  # Placeholder for timing
            signal.raw_data = {
                "hiring": hiring,
                "funding": funding,
                "techstack": techstack,
            }
    
    db.commit()
