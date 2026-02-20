"""
ICP (Ideal Customer Profile) Engine
Filters companies based on configurable ICP criteria.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from ..models.company import Company


def filter_companies(
    db: Session,
    industries: Optional[List[str]] = None,
    min_employees: Optional[int] = None,
    max_employees: Optional[int] = None,
    min_revenue: Optional[int] = None,
    max_revenue: Optional[int] = None,
    funding_stages: Optional[List[str]] = None,
    location: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> List[Company]:
    """
    Filter companies by ICP criteria using indexed queries.
    """
    query = db.query(Company)

    if industries:
        query = query.filter(Company.industry.in_(industries))
    
    if min_employees is not None:
        query = query.filter(Company.employees >= min_employees)
    
    if max_employees is not None:
        query = query.filter(Company.employees <= max_employees)
    
    if min_revenue is not None:
        query = query.filter(Company.revenue_estimate >= min_revenue)
    
    if max_revenue is not None:
        query = query.filter(Company.revenue_estimate <= max_revenue)
    
    if funding_stages:
        query = query.filter(Company.funding_stage.in_(funding_stages))
    
    if location:
        query = query.filter(Company.location.ilike(f"%{location}%"))

    return query.offset(offset).limit(limit).all()


def count_filtered(
    db: Session,
    industries: Optional[List[str]] = None,
    min_employees: Optional[int] = None,
    max_employees: Optional[int] = None,
    min_revenue: Optional[int] = None,
    max_revenue: Optional[int] = None,
    funding_stages: Optional[List[str]] = None,
) -> int:
    """Count companies matching ICP filter."""
    query = db.query(Company)

    if industries:
        query = query.filter(Company.industry.in_(industries))
    if min_employees is not None:
        query = query.filter(Company.employees >= min_employees)
    if max_employees is not None:
        query = query.filter(Company.employees <= max_employees)
    if min_revenue is not None:
        query = query.filter(Company.revenue_estimate >= min_revenue)
    if max_revenue is not None:
        query = query.filter(Company.revenue_estimate <= max_revenue)
    if funding_stages:
        query = query.filter(Company.funding_stage.in_(funding_stages))

    return query.count()
