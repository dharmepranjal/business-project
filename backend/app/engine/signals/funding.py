"""
Funding & Growth Signal Collector
Simulates funding round data and computes recency-weighted scores.
"""
import numpy as np
import math
from typing import Dict, Any


FUNDING_ROUNDS = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D", "IPO"]

FUNDING_RANGES = {
    "Pre-Seed": (100_000, 1_000_000),
    "Seed": (500_000, 5_000_000),
    "Series A": (5_000_000, 20_000_000),
    "Series B": (15_000_000, 60_000_000),
    "Series C": (40_000_000, 150_000_000),
    "Series D": (80_000_000, 300_000_000),
    "IPO": (200_000_000, 2_000_000_000),
}


def collect_funding_signals(company_name: str, funding_stage: str = None, seed: int = None) -> Dict[str, Any]:
    """
    Simulate funding signals for a company.
    Returns funding_score with recency decay and amount normalization.
    """
    rng = np.random.RandomState(seed)

    if funding_stage is None:
        funding_stage = rng.choice(FUNDING_ROUNDS)

    # Simulate funding amount
    low, high = FUNDING_RANGES.get(funding_stage, (1_000_000, 10_000_000))
    amount = rng.randint(low, high)

    # Months since funding (0-36)
    months_since = rng.randint(0, 36)

    # Revenue growth rate (simulated)
    revenue_growth = rng.uniform(-0.1, 0.8)

    # Log-scale normalization of funding amount (range: ~11 to ~21 for $100K to $2B)
    amount_norm = (math.log(amount + 1) - math.log(100_000)) / (math.log(2_000_000_000) - math.log(100_000))
    amount_norm = max(0.0, min(amount_norm, 1.0))

    # Recency decay: exponential decay over months
    recency_factor = math.exp(-months_since / 12.0)

    # Composite funding score
    funding_score = amount_norm * 0.5 + recency_factor * 0.3 + max(revenue_growth, 0) * 0.2

    return {
        "funding_score": round(min(funding_score, 1.0), 3),
        "recent_funding": 1 if months_since <= 6 else 0,
        "months_since_funding": months_since,
        "funding_amount": amount,
        "funding_stage": funding_stage,
        "amount_normalized": round(amount_norm, 3),
        "recency_factor": round(recency_factor, 3),
        "revenue_growth": round(revenue_growth, 3),
    }
