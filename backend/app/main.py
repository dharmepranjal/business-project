from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.companies import router as companies_router
from .api.scores import router as scores_router
from .api.signals import router as signals_router
from .api.optimize import router as optimize_router
from .api.outreach import router as outreach_router
from .api.dashboard import router as dashboard_router

app = FastAPI(
    title="SignalRank API",
    description="B2B Account Intelligence & Scoring Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(companies_router)
app.include_router(scores_router)
app.include_router(signals_router)
app.include_router(optimize_router)
app.include_router(outreach_router)
app.include_router(dashboard_router)


@app.get("/")
async def root():
    return {"message": "SignalRank API is running", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
