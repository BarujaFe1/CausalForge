from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_cases_list():
    r = client.get("/api/cases")
    assert r.status_code == 200
    ids = {c["id"] for c in r.json()["cases"]}
    assert "promo_campaign" in ids
    assert "support_sla" in ids


def test_demo_summary_promo():
    r = client.get("/api/demo", params={"case_id": "promo_campaign"})
    assert r.status_code == 200
    body = r.json()
    assert body["rows"] > 0
    assert "revenue" in body["columns"]


def test_demo_summary_support():
    r = client.get("/api/demo", params={"case_id": "support_sla"})
    assert r.status_code == 200
    body = r.json()
    assert "resolution_hours" in body["columns"]


def test_methodology():
    r = client.get("/api/methodology")
    assert r.status_code == 200
    assert "mvp_methods" in r.json()


def test_estimate_did_promo():
    r = client.post(
        "/api/estimate",
        json={
            "case_id": "promo_campaign",
            "method": "diff_in_diff",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["case_id"] == "promo_campaign"
    assert "effect_estimate" in body
    assert "caveats" in body
    assert len(body["caveats"]) >= 1
    assert body["evidence_label"] in {"suggestive", "inconclusive", "not_estimable"}
    assert "disclaimer" in body


def test_estimate_matching_support():
    r = client.post(
        "/api/estimate",
        json={
            "case_id": "support_sla",
            "method": "matching",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["method"] == "matching"
    assert "decision_memo" in body
    assert "INCONCLUSIVE" in body["decision_memo"] or "SUGGESTIVE" in body["decision_memo"]
