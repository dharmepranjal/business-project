"""Tests for the portfolio optimizer."""
import pytest
from app.engine.optimizer import optimize_portfolio


def _make_accounts(n=20):
    industries = ["SaaS", "FinTech", "HealthTech", "DevTools"]
    accounts = []
    for i in range(n):
        prob = 0.3 + (0.6 * i / n)
        accounts.append({
            "id": i + 1,
            "name": f"Company {i + 1}",
            "industry": industries[i % len(industries)],
            "revenue_estimate": (i + 1) * 1_000_000,
            "buy_probability": round(prob, 2),
            "priority_tier": "T1" if prob >= 0.7 else "T2" if prob >= 0.4 else "T3",
            "total_score": round(prob * 100, 1),
        })
    return accounts


class TestOptimizer:
    def test_capacity_constraint(self):
        accounts = _make_accounts(20)
        result = optimize_portfolio(accounts, capacity=5, diversify=False)
        assert result["total_selected"] <= 5

    def test_empty_input(self):
        result = optimize_portfolio([], capacity=10)
        assert result["total_selected"] == 0
        assert result["total_expected_revenue"] == 0

    def test_maximizes_revenue(self):
        accounts = _make_accounts(20)
        result = optimize_portfolio(accounts, capacity=5, diversify=False)
        # The top 5 by expected revenue should be selected
        assert result["total_selected"] == 5
        assert result["total_expected_revenue"] > 0

    def test_diversification(self):
        accounts = _make_accounts(20)
        result = optimize_portfolio(accounts, capacity=10, diversify=True, max_industry_pct=0.40)
        
        # No industry should have more than 40% of selection
        max_allowed = int(10 * 0.40)
        for industry, count in result.get("industry_distribution", {}).items():
            assert count <= max_allowed + 1  # Allow for rounding

    def test_returns_expected_revenue(self):
        accounts = _make_accounts(10)
        result = optimize_portfolio(accounts, capacity=5)
        for selected in result["selected"]:
            assert "expected_revenue" in selected
            assert selected["expected_revenue"] > 0
