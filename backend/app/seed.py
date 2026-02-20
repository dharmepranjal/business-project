import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from .models.company import Company
from .models.signal import Signal
from .models.score import Score
from .database import engine, SessionLocal, Base

def seed_data():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    industries = ["SaaS", "FinTech", "HealthTech", "DevTools", "E-commerce", "AI/ML", "CyberSecurity", "Infrastructure"]
    funding_stages = ["Seed", "Series A", "Series B", "Series C", "Public"]
    
    companies = []
    for i in range(60):
        industry = np.random.choice(industries)
        stage = np.random.choice(funding_stages)
        rev = np.random.randint(1, 500) * 1000000
        
        company = Company(
            name=f"Company {i+1}",
            industry=industry,
            employees=np.random.randint(10, 5000),
            revenue_estimate=rev,
            location="San Francisco, CA",
            funding_stage=stage,
            tech_stack=["AWS", "React", "PostgreSQL", "Python" if i % 2 == 0 else "Node.js"]
        )
        db.add(company)
        db.flush()
        
        # Create Signals
        hiring = np.random.random()
        funding = np.random.random()
        pain = np.random.random()
        tech = np.random.random()
        timing = np.random.random()
        
        signal = Signal(
            company_id=company.id,
            hiring_score=hiring,
            funding_score=funding,
            pain_score=pain,
            tech_score=tech,
            timing_score=timing,
            raw_data={"hiring_count": 5, "last_funding_amount": 10000000}
        )
        db.add(signal)
        
        # Create Scores
        total = (hiring * 0.25) + (funding * 0.2) + (pain * 0.25) + (tech * 0.15) + (timing * 0.15)
        prob = 1 / (1 + np.exp(-10 * (total - 0.5))) # Sigmoid mapping
        
        tier = "T1" if total > 0.7 else "T2" if total > 0.4 else "T3"
        
        score = Score(
            company_id=company.id,
            total_score=round(total * 100, 1),
            buy_probability=round(prob, 2),
            priority_tier=tier,
            explanation_json={"reason": "High hiring spike in target departments"}
        )
        db.add(score)
        
    db.commit()
    db.close()
    print("Successfully seeded 60 companies with signals and scores.")

if __name__ == "__main__":
    seed_data()
