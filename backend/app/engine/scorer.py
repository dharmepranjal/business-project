"""
Scoring Model — Three Tiers
Tier 1: Weighted Strategic Model (transparent, explainable)
Tier 2: Logistic Regression (ML-based probability)
Tier 3: Bayesian Updating (real-time adaptive)
"""
import numpy as np
from typing import Dict, Any, List, Tuple


# ─────────────────────────────────────
# Default Weights (Tier 1)
# ─────────────────────────────────────
DEFAULT_WEIGHTS = {
    "icp": 0.25,
    "hiring": 0.20,
    "funding": 0.15,
    "pain": 0.25,
    "timing": 0.15,
}


def weighted_score(
    icp: float, hiring: float, funding: float, pain: float, timing: float,
    weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Tier 1 — Weighted Strategic Model.
    Transparent, configurable, explainable.
    """
    w = weights or DEFAULT_WEIGHTS

    # Normalize weights to sum to 1
    total_w = sum(w.values())
    if total_w > 0:
        w = {k: v / total_w for k, v in w.items()}

    score = (
        w.get("icp", 0.25) * icp +
        w.get("hiring", 0.20) * hiring +
        w.get("funding", 0.15) * funding +
        w.get("pain", 0.25) * pain +
        w.get("timing", 0.15) * timing
    )

    # Sigmoid mapping for buy probability
    probability = 1 / (1 + np.exp(-10 * (score - 0.5)))

    # Priority tier assignment
    if score >= 0.7:
        tier = "T1"
    elif score >= 0.4:
        tier = "T2"
    else:
        tier = "T3"

    # Explanation
    signals = {"icp": icp, "hiring": hiring, "funding": funding, "pain": pain, "timing": timing}
    top_signal = max(signals, key=signals.get)
    
    explanation = {
        "scoring_method": "weighted_strategic",
        "weights_used": w,
        "component_scores": signals,
        "top_signal": top_signal,
        "top_signal_value": signals[top_signal],
        "reasoning": _generate_reasoning(signals, top_signal, tier),
    }

    return {
        "total_score": round(score * 100, 1),
        "buy_probability": round(float(probability), 3),
        "priority_tier": tier,
        "explanation": explanation,
    }


def logistic_regression_score(
    feature_vector: List[float],
    coefficients: List[float] = None,
    intercept: float = None,
) -> Dict[str, Any]:
    """
    Tier 2 — Logistic Regression.
    Uses pre-trained coefficients if available, otherwise synthetic defaults.
    """
    if coefficients is None:
        coefficients = [0.35, 0.25, 0.15, 0.30, 0.20, -0.05]
    if intercept is None:
        intercept = -1.5

    z = sum(c * f for c, f in zip(coefficients, feature_vector)) + intercept
    probability = 1 / (1 + np.exp(-z))

    score = float(probability)
    tier = "T1" if score >= 0.7 else "T2" if score >= 0.4 else "T3"

    # Feature importance
    feature_names = ["icp", "hiring", "funding", "pain", "tech", "timing"]
    importance = {
        name: round(abs(c * f), 3)
        for name, c, f in zip(feature_names, coefficients, feature_vector)
    }

    return {
        "total_score": round(score * 100, 1),
        "buy_probability": round(score, 3),
        "priority_tier": tier,
        "explanation": {
            "scoring_method": "logistic_regression",
            "feature_importance": importance,
            "top_feature": max(importance, key=importance.get),
        },
    }


def bayesian_update(
    prior_probability: float,
    signal_type: str,
    signal_strength: float,
) -> Dict[str, Any]:
    """
    Tier 3 — Bayesian Updating.
    Update buy probability when new signals arrive.
    P(buy | signal) ∝ P(signal | buy) * P(buy)
    """
    # Likelihood ratios by signal type
    likelihood_ratios = {
        "hiring": 1.5 + signal_strength,
        "funding": 1.3 + signal_strength * 0.8,
        "pain": 1.4 + signal_strength * 1.2,
        "tech": 1.1 + signal_strength * 0.5,
        "timing": 1.6 + signal_strength * 0.9,
    }

    lr = likelihood_ratios.get(signal_type, 1.2 + signal_strength * 0.5)

    # Bayes update
    prior_odds = prior_probability / (1 - prior_probability + 1e-10)
    posterior_odds = prior_odds * lr
    posterior = posterior_odds / (1 + posterior_odds)
    posterior = max(0.01, min(0.99, posterior))

    tier = "T1" if posterior >= 0.7 else "T2" if posterior >= 0.4 else "T3"

    return {
        "total_score": round(posterior * 100, 1),
        "buy_probability": round(posterior, 3),
        "priority_tier": tier,
        "explanation": {
            "scoring_method": "bayesian_update",
            "prior": round(prior_probability, 3),
            "posterior": round(posterior, 3),
            "signal_type": signal_type,
            "likelihood_ratio": round(lr, 3),
        },
    }


def _generate_reasoning(signals: Dict[str, float], top_signal: str, tier: str) -> str:
    """Generate human-readable reasoning for the score."""
    reasons = {
        "icp": "Strong ICP alignment — this company matches your ideal customer profile.",
        "hiring": "Significant hiring activity signals growth and potential infrastructure needs.",
        "funding": "Recent funding suggests available budget and expansion plans.",
        "pain": "Job postings and content indicate pain points your product addresses.",
        "timing": "Executive changes or strategic shifts create a favorable buying window.",
    }
    
    base = reasons.get(top_signal, "Multiple signals contribute to the score.")
    
    if tier == "T1":
        return f"HIGH PRIORITY: {base} Multiple strong signals converge on this account."
    elif tier == "T2":
        return f"MONITOR: {base} Worth nurturing — look for additional trigger events."
    else:
        return f"LOW PRIORITY: {base} Signals are weak. Re-evaluate next quarter."
