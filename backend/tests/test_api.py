"""Tests for the API endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthCheck:
    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "SignalRank" in response.json()["message"]

    def test_health(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestWeightsAPI:
    def test_get_weights(self):
        response = client.get("/api/scores/weights")
        assert response.status_code == 200
        data = response.json()
        assert "icp" in data
        assert "hiring" in data

    def test_update_weights(self):
        new_weights = {
            "icp": 0.30,
            "hiring": 0.20,
            "funding": 0.20,
            "pain": 0.20,
            "timing": 0.10,
        }
        response = client.put("/api/scores/weights", json=new_weights)
        assert response.status_code == 200
        assert response.json()["weights"]["icp"] == 0.30
