"""
Outreach Angle Generator
Uses OpenAI API for AI generation, falls back to template-based generation.
"""
from typing import List, Dict, Any
import os


TEMPLATES = [
    {
        "signal": "hiring",
        "angles": [
            {
                "angle": "Growth Enablement",
                "subject_line": "Scaling {industry}? Here's how top teams do it",
                "opening": "I noticed {company} is hiring aggressively in engineering. Companies at your growth stage often hit infrastructure bottlenecks that slow delivery by 40%. We helped {similar_company} eliminate that."
            },
            {
                "angle": "Talent Amplification",
                "subject_line": "Make every new hire 3x more productive at {company}",
                "opening": "Your job postings for {role} tell me you're investing in {area}. What if each new hire could ship 3x faster from day one?"
            },
        ],
    },
    {
        "signal": "funding",
        "angles": [
            {
                "angle": "Post-Funding Acceleration",
                "subject_line": "Congrats on the {stage} — here's what winners do next",
                "opening": "After raising {amount}, the clock starts. The best-performing companies in your cohort invested immediately in {area} to capture market share. Here's the playbook."
            },
            {
                "angle": "Board-Ready Infrastructure",
                "subject_line": "Your investors want to see this metric, {name}",
                "opening": "Post-{stage} companies that implement {solution} see a 2.5x improvement in the metrics boards care about most."
            },
        ],
    },
    {
        "signal": "pain",
        "angles": [
            {
                "angle": "Pain Point Direct",
                "subject_line": "The {pain_topic} problem at {company}",
                "opening": "I've been studying how {industry} companies handle {pain_topic}. Most spend 15+ engineering hours/week on it. We cut that to near-zero for {similar_company}."
            },
        ],
    },
    {
        "signal": "tech",
        "angles": [
            {
                "angle": "Tech Stack Evolution",
                "subject_line": "Moving beyond {old_tech}? {company}'s next step",
                "opening": "I see {company} is running {old_tech}. Teams migrating to {new_tech} typically see a 40% reduction in operational overhead. Here's a 3-step transition plan."
            },
        ],
    },
    {
        "signal": "timing",
        "angles": [
            {
                "angle": "New Leadership Opportunity",
                "subject_line": "Welcome aboard at {company} — quick thought for you",
                "opening": "Congrats on the new role. New {role}s at {industry} companies typically re-evaluate {area} in their first 90 days. Happy to share what category leaders are doing differently."
            },
        ],
    },
]


def generate_outreach_angles(
    company: Dict[str, Any],
    signals: Dict[str, Any],
    score_data: Dict[str, Any],
    num_angles: int = 3,
) -> List[Dict[str, str]]:
    """
    Generate outreach angles based on company signals.
    Uses template-based generation (MVP).
    """
    # Determine the strongest signal
    signal_scores = {
        "hiring": signals.get("hiring_score", 0),
        "funding": signals.get("funding_score", 0),
        "pain": signals.get("pain_score", 0),
        "tech": signals.get("tech_score", 0),
        "timing": signals.get("timing_score", 0),
    }
    
    # Sort signals by strength
    sorted_signals = sorted(signal_scores.items(), key=lambda x: x[1], reverse=True)

    angles = []
    for signal_type, strength in sorted_signals:
        if len(angles) >= num_angles:
            break
        
        template_group = next((t for t in TEMPLATES if t["signal"] == signal_type), None)
        if not template_group:
            continue

        for template in template_group["angles"]:
            if len(angles) >= num_angles:
                break

            angle = {
                "angle": template["angle"],
                "subject_line": _fill_template(template["subject_line"], company, signals),
                "opening": _fill_template(template["opening"], company, signals),
                "signal_type": signal_type,
                "signal_strength": round(strength, 2),
            }
            angles.append(angle)

    return angles


def _fill_template(template: str, company: Dict, signals: Dict) -> str:
    """Fill template placeholders with company data."""
    replacements = {
        "{company}": company.get("name", "your company"),
        "{industry}": company.get("industry", "your industry"),
        "{name}": company.get("name", "there"),
        "{stage}": company.get("funding_stage", "latest round"),
        "{amount}": _format_amount(signals.get("raw_data", {}).get("last_funding_amount", 0)),
        "{role}": "engineering",
        "{area}": "developer infrastructure",
        "{similar_company}": "leading companies in your space",
        "{solution}": "modern tooling",
        "{pain_topic}": "operational efficiency",
        "{old_tech}": "legacy infrastructure",
        "{new_tech}": "modern cloud-native solutions",
    }
    
    result = template
    for key, value in replacements.items():
        result = result.replace(key, str(value))
    
    return result


def _format_amount(amount: int) -> str:
    if amount >= 1_000_000_000:
        return f"${amount / 1_000_000_000:.1f}B"
    elif amount >= 1_000_000:
        return f"${amount / 1_000_000:.0f}M"
    elif amount >= 1_000:
        return f"${amount / 1_000:.0f}K"
    else:
        return f"${amount}"
