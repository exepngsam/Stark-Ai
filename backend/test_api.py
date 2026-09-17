from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# 1. Health check
res = client.get("/api/health")
print("Health:", res.status_code, res.json())
assert res.status_code == 200

# 2. Analyze Text - Fake UPI PIN
res = client.post("/api/analyze/text", json={"message": "Congratulations! You won Rs. 4999 cashback. Open GPay and enter your UPI PIN to claim."})
print("Analyze UPI:", res.status_code, res.json()["scam_category"], "Risk:", res.json()["risk_score"])
assert res.status_code == 200
assert res.json()["risk_score"] >= 80

# 3. Analyze Text - Electricity Cutoff
res = client.post("/api/analyze/text", json={"message": "Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office. Contact officer 9876543210."})
print("Analyze Elec:", res.status_code, res.json()["scam_category"], "Risk:", res.json()["risk_score"])
assert res.status_code == 200

# 4. Simulator Scenarios
res = client.get("/api/simulator")
print("Simulator count:", len(res.json()))
assert len(res.json()) == 5

# 5. Simulator Verify
res = client.post("/api/simulator/verify", json={"scenario_id": 1, "selected_option_id": "opt_b"})
print("Simulator verify:", res.status_code, res.json()["verdict"])
assert res.json()["is_safe"] is True

print("All backend tests PASSED successfully!")
