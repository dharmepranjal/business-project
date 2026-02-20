"""
Scores API — Scoring, ranking, and weight management
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.company import Company
from ..models.signal import Signal
from ..models.score import Score
from ..schemas.schemas import WeightsSchema
from ..engine.scorer import weighted_score, DEFAULT_WEIGHTS

router = APIRouter(prefix="/api/scores", tags=["scores"])

# In-memory weights (can be persisted to DB)
current_weights = dict(DEFAULT_WEIGHTS)


@router.get("/weights")
def get_weights():
    return current_weights


@router.put("/weights")
def update_weights(weights: WeightsSchema):
    global current_weights
    current_weights = {
        "icp": weights.icp,
        "hiring": weights.hiring,
        "funding": weights.funding,
        "pain": weights.pain,
        "timing": weights.timing,
    }
    return {"message": "Weights updated", "weights": current_weights}


@router.post("/recalculate")
def recalculate_scores(db: Session = Depends(get_db)):
    """Recalculate all scores based on current weights."""
    signals = db.query(Signal).all()
    updated = 0

    for signal in signals:
        result = weighted_score(
            icp=0.5,  # Default ICP for recalculation
            hiring=signal.hiring_score,
            funding=signal.funding_score,
            pain=signal.pain_score,
            timing=signal.timing_score,
            weights=current_weights,
        )

        score = db.query(Score).filter(Score.company_id == signal.company_id).first()
        if score:
            score.total_score = result["total_score"]
            score.buy_probability = result["buy_probability"]
            score.priority_tier = result["priority_tier"]
            score.explanation_json = result["explanation"]
            updated += 1
        else:
            new_score = Score(
                company_id=signal.company_id,
                total_score=result["total_score"],
                buy_probability=result["buy_probability"],
                priority_tier=result["priority_tier"],
                explanation_json=result["explanation"],
            )
            db.add(new_score)
            updated += 1

    db.commit()
    return {"message": f"Recalculated {updated} scores", "weights": current_weights}


@router.get("/ranked")
def get_ranked(
    tier: str = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Get ranked accounts sorted by total score."""
    query = db.query(Company, Score).join(Score, Company.id == Score.company_id)
    
    if tier:
        query = query.filter(Score.priority_tier == tier)
    
    query = query.order_by(Score.total_score.desc()).limit(limit)
    
    results = []
    for company, score in query.all():
        signal = db.query(Signal).filter(Signal.company_id == company.id).first()
        
        # Determine key signal
        if signal:
            signal_map = {
                "Hiring Spike": signal.hiring_score,
                "Recent Funding": signal.funding_score,
                "Pain Match": signal.pain_score,
                "Tech Alignment": signal.tech_score,
                "Timing Signal": signal.timing_score,
            }
            key_signal = max(signal_map, key=signal_map.get)
        else:
            key_signal = "Unknown"
        
        results.append({
            "id": company.id,
            "name": company.name,
            "industry": company.industry,
            "score": score.total_score,
            "buy_probability": score.buy_probability,
            "priority_tier": score.priority_tier,
            "key_signal": key_signal,
            "suggested_angle": score.explanation_json.get("reasoning", "") if score.explanation_json else "",
        })
    
    return results
