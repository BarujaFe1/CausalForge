from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_demo_summary():
    r = client.get("/api/demo")
    assert r.status_code == 200
    body = r.json()
    assert body["rows"] > 0
    assert "revenue" in body["columns"]


def test_methodology():
    r = client.get("/api/methodology")
    assert r.status_code == 200
    assert "mvp_methods" in r.json()


def test_estimate_did():
    r = client.post(
        "/api/estimate",
        json={
            "method": "diff_in_diff",
            "outcome": "revenue",
            "intervention": "promo_campaign",
            "treated_region": "South",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "effect_estimate" in body
    assert "limitations" in body
    assert len(body["limitations"]) >= 1
    assert "disclaimer" in body


def test_estimate_matching():
    r = client.post(
        "/api/estimate",
        json={
            "method": "matching",
            "outcome": "revenue",
            "intervention": "promo_campaign",
            "treated_region": "South",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["method"] == "matching"
    assert "decision_memo" in body
