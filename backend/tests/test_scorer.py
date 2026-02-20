"""Tests for the scoring engine."""
import pytest
from app.engine.scorer import weighted_score, logistic_regression_score, bayesian_update


class TestWeightedScorer:
    def test_perfect_score(self):
        result = weighted_score(1.0, 1.0, 1.0, 1.0, 1.0)
        assert result["total_score"] == 100.0
        assert result["priority_tier"] == "T1"
        assert result["buy_probability"] > 0.99

    def test_zero_score(self):
        result = weighted_score(0.0, 0.0, 0.0, 0.0, 0.0)
        assert result["total_score"] == 0.0
        assert result["priority_tier"] == "T3"
        assert result["buy_probability"] < 0.01

    def test_mid_score(self):
        result = weighted_score(0.5, 0.5, 0.5, 0.5, 0.5)
        assert result["total_score"] == 50.0
        assert result["priority_tier"] == "T2"
        assert 0.4 < result["buy_probability"] < 0.6

    def test_custom_weights(self):
        weights = {"icp": 1.0, "hiring": 0.0, "funding": 0.0, "pain": 0.0, "timing": 0.0}
        result = weighted_score(1.0, 0.0, 0.0, 0.0, 0.0, weights=weights)
        assert result["total_score"] == 100.0

    def test_tier_boundaries(self):
        # T1 threshold = 0.7
        result_t1 = weighted_score(0.8, 0.8, 0.8, 0.8, 0.8)
        assert result_t1["priority_tier"] == "T1"

        # T3 threshold < 0.4
        result_t3 = weighted_score(0.1, 0.1, 0.1, 0.1, 0.1)
        assert result_t3["priority_tier"] == "T3"

    def test_explanation_generated(self):
        result = weighted_score(0.9, 0.3, 0.2, 0.1, 0.1)
        assert "explanation" in result
        assert "top_signal" in result["explanation"]
        assert result["explanation"]["top_signal"] == "icp"


class TestLogisticRegression:
    def test_default_coefficients(self):
        vector = [0.8, 0.7, 0.6, 0.9, 0.5, 0.3]
        result = logistic_regression_score(vector)
        assert 0 < result["buy_probability"] < 1
        assert result["priority_tier"] in ["T1", "T2", "T3"]

    def test_feature_importance(self):
        vector = [1.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        result = logistic_regression_score(vector)
        assert "feature_importance" in result["explanation"]


class TestBayesianUpdate:
    def test_positive_update(self):
        result = bayesian_update(0.5, "hiring", 0.8)
        assert result["buy_probability"] > 0.5

    def test_prior_preserved(self):
        result = bayesian_update(0.5, "hiring", 0.0)
        # With zero signal strength, update should be moderate
        assert 0.4 < result["buy_probability"] < 0.85

    def test_high_prior_stays_high(self):
        result = bayesian_update(0.9, "funding", 0.5)
        assert result["buy_probability"] > 0.85
