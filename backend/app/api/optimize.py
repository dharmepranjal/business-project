"""
Optimize API — Portfolio optimization endpoint
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.company import Company
from ..models.score import Score
from ..schemas.schemas import OptimizeRequest
from ..engine.optimizer import optimize_portfolio

router = APIRouter(prefix="/api/optimize", tags=["optimize"])


@router.post("")
def run_optimization(request: OptimizeRequest, db: Session = Depends(get_db)):
    """Run portfolio optimization with constraints."""
    
    # Fetch all scored accounts
    results = db.query(Company, Score).join(Score, Company.id == Score.company_id).all()
    
    accounts = []
    for company, score in results:
        accounts.append({
            "id": company.id,
            "name": company.name,
            "industry": company.industry,
            "revenue_estimate": company.revenue_estimate or 1_000_000,
            "buy_probability": score.buy_probability,
            "priority_tier": score.priority_tier,
            "total_score": score.total_score,
        })
    
    result = optimize_portfolio(
        accounts=accounts,
        capacity=request.capacity,
        diversify=request.diversify,
        max_industry_pct=request.max_industry_pct,
        min_tier1_pct=request.min_tier1_pct,
    )
    
    return result
