"""
Dashboard API — Aggregated stats and KPIs
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models.company import Company
from ..models.score import Score

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get aggregated dashboard KPIs."""
    total = db.query(func.count(Company.id)).scalar() or 0
    tier1 = db.query(func.count(Score.id)).filter(Score.priority_tier == "T1").scalar() or 0
    
    # Sum of (buy_probability * revenue_estimate) for all companies
    revenue_result = db.query(
        func.sum(Score.buy_probability * Company.revenue_estimate)
    ).join(Company, Score.company_id == Company.id).scalar() or 0
    
    avg_prob = db.query(func.avg(Score.buy_probability)).scalar() or 0

    # Tier distribution
    tier_dist = {}
    for tier, count in db.query(Score.priority_tier, func.count()).group_by(Score.priority_tier).all():
        tier_dist[tier] = count

    # Industry distribution
    industry_dist = {}
    for ind, count in db.query(Company.industry, func.count()).group_by(Company.industry).all():
        industry_dist[ind] = count

    # Top 5 accounts
    top_accounts = []
    top_query = db.query(Company, Score).join(
        Score, Company.id == Score.company_id
    ).order_by(Score.total_score.desc()).limit(5)
    
    for company, score in top_query.all():
        top_accounts.append({
            "id": company.id,
            "name": company.name,
            "industry": company.industry,
            "score": score.total_score,
            "buy_probability": score.buy_probability,
            "priority_tier": score.priority_tier,
        })

    return {
        "total_accounts": total,
        "tier1_count": tier1,
        "revenue_potential": round(revenue_result, 2),
        "avg_probability": round(float(avg_prob), 3),
        "tier_distribution": tier_dist,
        "industry_distribution": industry_dist,
        "top_accounts": top_accounts,
    }
