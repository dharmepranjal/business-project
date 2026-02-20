"""
Portfolio Optimization Engine
Maximizes expected revenue under sales capacity and diversification constraints.
Uses PuLP linear programming solver.
"""
from typing import List, Dict, Any
import numpy as np

try:
    from pulp import LpProblem, LpMaximize, LpVariable, LpBinary, lpSum, value, PULP_CBC_CMD
    HAS_PULP = True
except ImportError:
    HAS_PULP = False


def optimize_portfolio(
    accounts: List[Dict[str, Any]],
    capacity: int = 50,
    diversify: bool = True,
    max_industry_pct: float = 0.40,
    min_tier1_pct: float = 0.20,
) -> Dict[str, Any]:
    """
    Optimize account portfolio selection using linear programming.
    
    Maximize: Sum(buy_probability * revenue_estimate) for selected accounts
    Subject to:
      - Total selected <= capacity
      - No single industry > max_industry_pct of portfolio
      - At least min_tier1_pct of portfolio is Tier 1
    """
    if not HAS_PULP:
        return _fallback_optimizer(accounts, capacity)

    n = len(accounts)
    if n == 0:
        return {"selected": [], "total_expected_revenue": 0, "method": "pulp"}

    # Create problem
    prob = LpProblem("SignalRank_Portfolio", LpMaximize)

    # Decision variables: binary (select or not)
    x = [LpVariable(f"x_{i}", cat=LpBinary) for i in range(n)]

    # Objective: maximize expected revenue
    expected_rev = [
        a.get("buy_probability", 0) * a.get("revenue_estimate", 1_000_000)
        for a in accounts
    ]
    prob += lpSum([expected_rev[i] * x[i] for i in range(n)])

    # Constraint 1: Sales capacity
    prob += lpSum(x) <= capacity

    # Constraint 2: Industry diversification
    if diversify:
        industries = set(a.get("industry", "Unknown") for a in accounts)
        max_per_industry = int(capacity * max_industry_pct)
        for ind in industries:
            ind_indices = [i for i, a in enumerate(accounts) if a.get("industry") == ind]
            if ind_indices:
                prob += lpSum([x[i] for i in ind_indices]) <= max_per_industry

    # Constraint 3: Minimum Tier 1 representation
    tier1_indices = [i for i, a in enumerate(accounts) if a.get("priority_tier") == "T1"]
    min_tier1 = max(1, int(capacity * min_tier1_pct))
    if tier1_indices:
        prob += lpSum([x[i] for i in tier1_indices]) >= min(min_tier1, len(tier1_indices))

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Extract selected accounts
    selected = []
    total_expected = 0.0
    for i in range(n):
        if x[i].varValue and x[i].varValue > 0.5:
            account = dict(accounts[i])
            account["expected_revenue"] = round(expected_rev[i], 2)
            selected.append(account)
            total_expected += expected_rev[i]

    # Sort by expected revenue descending
    selected.sort(key=lambda a: a["expected_revenue"], reverse=True)

    # Industry distribution
    industry_dist = {}
    for a in selected:
        ind = a.get("industry", "Unknown")
        industry_dist[ind] = industry_dist.get(ind, 0) + 1

    return {
        "selected": selected,
        "total_selected": len(selected),
        "total_expected_revenue": round(total_expected, 2),
        "industry_distribution": industry_dist,
        "method": "pulp_cbc",
        "capacity": capacity,
        "constraints_applied": {
            "diversification": diversify,
            "max_industry_pct": max_industry_pct,
            "min_tier1_pct": min_tier1_pct,
        },
    }


def _fallback_optimizer(
    accounts: List[Dict[str, Any]], capacity: int
) -> Dict[str, Any]:
    """Simple greedy fallback when PuLP is not available."""
    scored = []
    for a in accounts:
        ev = a.get("buy_probability", 0) * a.get("revenue_estimate", 1_000_000)
        scored.append((ev, a))
    
    scored.sort(key=lambda x: x[0], reverse=True)
    selected = [dict(a) | {"expected_revenue": round(ev, 2)} for ev, a in scored[:capacity]]

    return {
        "selected": selected,
        "total_selected": len(selected),
        "total_expected_revenue": round(sum(s["expected_revenue"] for s in selected), 2),
        "method": "greedy_fallback",
    }
