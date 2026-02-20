"""
Hiring Intelligence Signal Collector
Simulates hiring data and uses NLP-style keyword matching to detect pain signals.
"""
import numpy as np
from typing import Dict, Any


# Pain keyword clusters that indicate buying intent
PAIN_CLUSTERS = {
    "infrastructure_scaling": [
        "scale infrastructure", "cloud migration", "kubernetes",
        "devops", "site reliability", "platform engineer"
    ],
    "security_compliance": [
        "security", "compliance", "soc2", "gdpr", "penetration testing",
        "vulnerability", "iso 27001", "information security"
    ],
    "data_engineering": [
        "data pipeline", "data engineer", "etl", "data warehouse",
        "analytics", "machine learning engineer", "mlops"
    ],
    "developer_productivity": [
        "developer experience", "ci/cd", "internal tools",
        "developer platform", "automation"
    ],
}

# Simulated job posting templates
JOB_TEMPLATES = [
    "We're looking for a {role} to help us {mission}.",
    "Join our growing {dept} team to {mission}.",
    "Seeking experienced {role} with background in {skill}.",
]

SAMPLE_ROLES = [
    ("DevOps Engineer", "infrastructure_scaling"),
    ("Security Analyst", "security_compliance"),
    ("Data Engineer", "data_engineering"),
    ("Platform Engineer", "developer_productivity"),
    ("Backend Engineer", None),
    ("Frontend Engineer", None),
    ("Product Manager", None),
    ("Sales Development Rep", None),
]


def collect_hiring_signals(company_name: str, seed: int = None) -> Dict[str, Any]:
    """
    Simulate hiring intelligence for a company.
    Returns hiring_score (0-1), growth_rate, and detected pain topics.
    """
    rng = np.random.RandomState(seed)

    # Simulate number of open roles
    num_roles = rng.poisson(lam=5)
    num_roles = max(1, min(num_roles, 20))

    # Pick random roles
    role_indices = rng.choice(len(SAMPLE_ROLES), size=num_roles, replace=True)
    roles = [SAMPLE_ROLES[i] for i in role_indices]

    # Detect pain clusters
    detected_pains = {}
    for role_name, pain_cluster in roles:
        if pain_cluster:
            detected_pains[pain_cluster] = detected_pains.get(pain_cluster, 0) + 1

    # Compute hiring growth rate (simulated)
    prev_month = rng.poisson(lam=3)
    growth_rate = (num_roles - prev_month) / max(prev_month, 1)
    growth_rate = max(-1.0, min(growth_rate, 3.0))

    # Compute hiring score based on volume + pain relevance
    volume_score = min(num_roles / 10.0, 1.0)
    pain_score = min(len(detected_pains) / 3.0, 1.0)
    hiring_score = 0.6 * volume_score + 0.4 * pain_score

    # Similarity scores for each pain cluster (simulated NLP)
    pain_similarities = {}
    for cluster_name, count in detected_pains.items():
        sim = min(0.5 + count * 0.15 + rng.uniform(0, 0.2), 1.0)
        pain_similarities[cluster_name] = round(sim, 3)

    return {
        "hiring_score": round(hiring_score, 3),
        "hiring_growth_rate": round(growth_rate, 3),
        "open_roles": num_roles,
        "pain_topics": pain_similarities,
        "top_roles": [r[0] for r in roles[:5]],
        "dev_hiring_spike": 1 if growth_rate > 0.5 else 0,
    }
