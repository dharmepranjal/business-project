from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ───── Company Schemas ─────
class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    employees: Optional[int] = None
    revenue_estimate: Optional[int] = None
    location: Optional[str] = None
    funding_stage: Optional[str] = None
    tech_stack: Optional[List[str]] = []

class CompanyCreate(CompanyBase):
    pass

class CompanyOut(CompanyBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ───── Signal Schemas ─────
class SignalBase(BaseModel):
    hiring_score: float = 0.0
    funding_score: float = 0.0
    pain_score: float = 0.0
    tech_score: float = 0.0
    timing_score: float = 0.0

class SignalOut(SignalBase):
    id: int
    company_id: int
    last_updated: Optional[datetime] = None
    raw_data: Optional[dict] = {}

    class Config:
        from_attributes = True


# ───── Score Schemas ─────
class ScoreBase(BaseModel):
    total_score: float = 0.0
    buy_probability: float = 0.0
    priority_tier: Optional[str] = None

class ScoreOut(ScoreBase):
    id: int
    company_id: int
    explanation_json: Optional[dict] = {}
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ───── Combined Views ─────
class CompanyDetail(CompanyOut):
    signals: Optional[SignalOut] = None
    score: Optional[ScoreOut] = None

class AccountRow(BaseModel):
    id: int
    name: str
    industry: Optional[str]
    score: float
    buy_probability: float
    priority_tier: Optional[str]
    key_signal: Optional[str] = None
    suggested_angle: Optional[str] = None

class DashboardStats(BaseModel):
    total_accounts: int
    tier1_count: int
    revenue_potential: float
    avg_probability: float

class WeightsSchema(BaseModel):
    icp: float = 0.25
    hiring: float = 0.20
    funding: float = 0.15
    pain: float = 0.25
    timing: float = 0.15

class OptimizeRequest(BaseModel):
    capacity: int = 50
    diversify: bool = True
    max_industry_pct: float = 0.40
    min_tier1_pct: float = 0.20

class OutreachAngle(BaseModel):
    angle: str
    subject_line: str
    opening: str
