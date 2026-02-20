"""
Tech Stack Detection Signal Collector
Simulates tech stack detection and competitor usage analysis.
"""
import numpy as np
from typing import Dict, Any, List


TECH_CATEGORIES = {
    "cloud": ["AWS", "Azure", "GCP", "DigitalOcean", "Heroku"],
    "frontend": ["React", "Vue", "Angular", "Svelte", "Next.js"],
    "backend": ["Node.js", "Python", "Java", "Go", "Ruby"],
    "database": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
    "devops": ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions"],
    "monitoring": ["Datadog", "New Relic", "Grafana", "Splunk", "PagerDuty"],
}

# Define what we consider "competitor" products and "ideal" tech
COMPETITOR_PRODUCTS = ["Salesforce", "HubSpot", "Outreach", "Gong", "ZoomInfo"]
IDEAL_TECH_INDICATORS = ["AWS", "Python", "PostgreSQL", "Docker", "Kubernetes", "React"]


def collect_techstack_signals(
    company_name: str,
    known_stack: List[str] = None,
    seed: int = None
) -> Dict[str, Any]:
    """
    Simulate tech stack detection for a company.
    Returns tech_score based on alignment and competitor usage.
    """
    rng = np.random.RandomState(seed)

    if known_stack is None:
        # Simulate detected tech stack
        stack = []
        for category, techs in TECH_CATEGORIES.items():
            n = rng.randint(1, min(3, len(techs)))
            chosen = rng.choice(techs, size=n, replace=False).tolist()
            stack.extend(chosen)
        known_stack = stack

    # Check competitor product usage
    uses_competitor = any(t in COMPETITOR_PRODUCTS for t in known_stack)

    # Check ideal tech alignment
    ideal_matches = sum(1 for t in IDEAL_TECH_INDICATORS if t in known_stack)
    alignment_score = ideal_matches / len(IDEAL_TECH_INDICATORS)

    # Modernity score — newer tech = higher score
    modern_tech = {"Kubernetes", "Docker", "React", "Next.js", "Go", "Svelte", "Terraform"}
    modern_count = sum(1 for t in known_stack if t in modern_tech)
    modernity = min(modern_count / 4.0, 1.0)

    # Composite tech score
    tech_score = alignment_score * 0.4 + modernity * 0.3
    if uses_competitor:
        tech_score += 0.3  # Big bonus — they're using a competitor
    tech_score = min(tech_score, 1.0)

    return {
        "tech_score": round(tech_score, 3),
        "uses_competitor": 1 if uses_competitor else 0,
        "tech_alignment": round(alignment_score, 3),
        "modernity_score": round(modernity, 3),
        "detected_stack": known_stack[:10],
        "stack_size": len(known_stack),
    }
