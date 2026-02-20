# SignalRank

B2B Account Intelligence & Scoring Platform.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (for PostgreSQL + Redis)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt  # or use pyproject.toml
python -m app.seed               # Seed 60 sample companies
uvicorn app.main:app --reload    # Starts on :8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                      # Starts on :3000
```

### 4. Run Tests
```bash
cd backend
python -m pytest tests/ -v
```

## Architecture

```
Frontend (Next.js + TailwindCSS + Recharts)
        |
FastAPI Backend (Python)
        |
---------------------------------------
| Signal Engine | Scoring Model | NLP |
---------------------------------------
        |
PostgreSQL + Redis
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/companies` | GET | List + ICP filter |
| `/api/companies/{id}` | GET | Company detail |
| `/api/scores/ranked` | GET | Ranked accounts |
| `/api/scores/weights` | GET/PUT | Manage weights |
| `/api/scores/recalculate` | POST | Recalculate |
| `/api/optimize` | POST | Portfolio optimizer |
| `/api/outreach/{id}` | POST | AI outreach angles |
| `/api/dashboard/stats` | GET | Dashboard KPIs |
