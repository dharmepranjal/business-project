"""
Pain Topic Extractor
Uses keyword-based similarity scoring (MVP).
Can be upgraded to sentence-transformers when model is available.
"""
from typing import List, Dict, Tuple
import numpy as np


PAIN_KEYWORDS = {
    "Infrastructure Bottleneck": [
        "scaling", "performance", "downtime", "latency",
        "infrastructure", "cloud migration", "capacity"
    ],
    "Security & Compliance": [
        "security", "compliance", "audit", "soc2", "gdpr",
        "vulnerability", "breach", "risk"
    ],
    "Developer Productivity": [
        "developer experience", "ci/cd", "deployment",
        "automation", "testing", "code quality"
    ],
    "Data & Analytics": [
        "data pipeline", "analytics", "reporting",
        "machine learning", "data warehouse", "insights"
    ],
    "Cost Optimization": [
        "cost reduction", "efficiency", "optimization",
        "budget", "spend management", "ROI"
    ],
}


def extract_pain_topics(
    text_signals: List[str],
    top_n: int = 3,
) -> List[Dict[str, any]]:
    """
    Extract pain topics from job postings or company signals.
    Uses keyword overlap scoring (MVP approach).
    """
    if not text_signals:
        return []

    combined_text = " ".join(text_signals).lower()
    
    topic_scores = []
    for topic, keywords in PAIN_KEYWORDS.items():
        # Count keyword matches
        matches = sum(1 for kw in keywords if kw.lower() in combined_text)
        score = matches / len(keywords)
        
        if score > 0:
            matched_keywords = [kw for kw in keywords if kw.lower() in combined_text]
            topic_scores.append({
                "topic": topic,
                "relevance_score": round(score, 3),
                "matched_keywords": matched_keywords,
                "match_count": matches,
            })

    # Sort by relevance
    topic_scores.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    return topic_scores[:top_n]


def compute_pain_score(topics: List[Dict]) -> float:
    """Compute aggregate pain score from extracted topics."""
    if not topics:
        return 0.0
    
    # Weighted average of top topic relevance scores
    scores = [t["relevance_score"] for t in topics]
    weights = [1.0 / (i + 1) for i in range(len(scores))]  # Rank-weighted
    
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    weight_total = sum(weights)
    
    return round(min(weighted_sum / weight_total, 1.0), 3)
