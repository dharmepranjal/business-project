"""
Background task: Signal refresh and score recalculation.
"""
from sqlalchemy.orm import Session
from ..models.company import Company
from ..models.signal import Signal
from ..models.score import Score
from ..engine.signals.hiring import collect_hiring_signals
from ..engine.signals.funding import collect_funding_signals
from ..engine.signals.techstack import collect_techstack_signals
from ..engine.scorer import weighted_score


def refresh_all(db: Session, weights: dict = None):
    """Refresh all signals and recalculate scores."""
    companies = db.query(Company).all()
    refreshed = 0

    for company in companies:
        # Collect signals
        hiring = collect_hiring_signals(company.name, seed=company.id)
        funding = collect_funding_signals(company.name, company.funding_stage, seed=company.id)
        techstack = collect_techstack_signals(company.name, company.tech_stack or [], seed=company.id)

        # Update signal record
        signal = db.query(Signal).filter(Signal.company_id == company.id).first()
        if signal:
            signal.hiring_score = hiring["hiring_score"]
            signal.funding_score = funding["funding_score"]
            signal.pain_score = sum(hiring.get("pain_topics", {}).values()) / max(len(hiring.get("pain_topics", {})), 1)
            signal.tech_score = techstack["tech_score"]
            signal.timing_score = 0.5  # Placeholder
            signal.raw_data = {
                "hiring": hiring,
                "funding": funding,
                "techstack": techstack,
            }

        # Recalculate score
        if signal:
            result = weighted_score(
                icp=0.5,
                hiring=signal.hiring_score,
                funding=signal.funding_score,
                pain=signal.pain_score,
                timing=signal.timing_score,
                weights=weights,
            )

            score = db.query(Score).filter(Score.company_id == company.id).first()
            if score:
                score.total_score = result["total_score"]
                score.buy_probability = result["buy_probability"]
                score.priority_tier = result["priority_tier"]
                score.explanation_json = result["explanation"]

        refreshed += 1

    db.commit()
    return refreshed
