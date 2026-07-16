import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_predict_gpa_endpoint():
    payload = {
        "current_credits": 10,
        "current_gpa": 8.0,
        "remaining_credits": 5,
        "target_gpa": 8.5
    }
    response = client.post("/api/gpa/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["required_gpa"] == 9.5
    assert data["is_possible"] is True

def test_calculate_gpa_endpoint():
    # Giả lập file upload
    csv_content = b"T\xc3\xaan m\xc3\xb4n h\xc3\xab\xc3\xabc,S\xc3\xb4\xc3\xac t\xc3\xadn ch\xc3\xa1\xc3\xadc,\xc3\x90i\xc3\xa1\xc3\xabm\nMath,3,8.0\nPhysics,2,9.0\n"
    # Do lỗi encode utf-8 ở mock string trên cho đơn giản, ta gõ mock rõ ràng
    csv_content = """Tên môn học,Số tín chỉ,Điểm,Cột thừa
Môn 1,3,8.0,A
Môn 2,2,9.0,B
"""
    files = {'file': ('test.csv', csv_content.encode('utf-8'), 'text/csv')}
    response = client.post("/api/gpa/calculate", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["total_credits"] == 5
    # (3*8 + 2*9) / 5 = 42 / 5 = 8.4
    assert data["current_gpa"] == 8.4
