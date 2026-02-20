"""
Feature Engineering Layer
Transforms raw signal data into normalized 0-1 company vectors.
"""
import numpy as np
from typing import Dict, List, Any


def normalize_min_max(values: List[float]) -> List[float]:
    """Min-max normalization to [0, 1]."""
    if not values:
        return []
    min_v = min(values)
    max_v = max(values)
    if max_v == min_v:
        return [0.5] * len(values)
    return [(v - min_v) / (max_v - min_v) for v in values]


def compute_icp_score(
    company: Dict[str, Any],
    target_industries: List[str] = None,
    min_employees: int = 50,
    max_employees: int = 5000,
    min_revenue: int = 1_000_000,
    max_revenue: int = 500_000_000,
    target_stages: List[str] = None,
) -> float:
    """
    Compute ICP (Ideal Customer Profile) alignment score.
    Returns a value between 0 and 1.
    """
    score = 0.0
    checks = 0

    # Industry match
    if target_industries:
        checks += 1
        if company.get("industry") in target_industries:
            score += 1.0

    # Employee range
    checks += 1
    emp = company.get("employees", 0)
    if min_employees <= emp <= max_employees:
        score += 1.0
    elif emp > 0:
        # Partial credit based on proximity
        if emp < min_employees:
            score += max(0, 1 - (min_employees - emp) / min_employees)
        else:
            score += max(0, 1 - (emp - max_employees) / max_employees)

    # Revenue range
    checks += 1
    rev = company.get("revenue_estimate", 0)
    if rev and min_revenue <= rev <= max_revenue:
        score += 1.0
    elif rev > 0:
        if rev < min_revenue:
            score += max(0, 1 - (min_revenue - rev) / min_revenue)
        else:
            score += max(0, 1 - (rev - max_revenue) / max_revenue)

    # Funding stage match
    if target_stages:
        checks += 1
        if company.get("funding_stage") in target_stages:
            score += 1.0

    return round(score / max(checks, 1), 3)


def build_company_vector(
    icp_score: float,
    hiring_score: float,
    funding_score: float,
    pain_score: float,
    tech_score: float,
    timing_score: float,
) -> List[float]:
    """
    Assemble normalized company feature vector.
    All inputs should already be in [0, 1] range.
    """
    return [
        max(0.0, min(1.0, icp_score)),
        max(0.0, min(1.0, hiring_score)),
        max(0.0, min(1.0, funding_score)),
        max(0.0, min(1.0, pain_score)),
        max(0.0, min(1.0, tech_score)),
        max(0.0, min(1.0, timing_score)),
    ]


def batch_normalize_scores(companies_data: List[Dict[str, float]]) -> List[Dict[str, float]]:
    """
    Normalize scores across a batch of companies using min-max scaling.
    """
    if not companies_data:
        return []

    fields = ["hiring_score", "funding_score", "pain_score", "tech_score", "timing_score"]
    
    # Collect all values per field
    field_values = {f: [c.get(f, 0.0) for c in companies_data] for f in fields}
    
    # Normalize each field
    normalized_fields = {f: normalize_min_max(vals) for f, vals in field_values.items()}
    
    # Rebuild
    result = []
    for i, company in enumerate(companies_data):
        normalized = dict(company)
        for f in fields:
            normalized[f] = round(normalized_fields[f][i], 3)
        result.append(normalized)
    
    return result
