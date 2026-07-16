import pytest
import pandas as pd
import io
from app.services.gpa_calculator import calculate_current_gpa_from_file, predict_required_gpa

def test_calculate_current_gpa_from_file_valid_csv():
    # Tạo một CSV giả lập với 3 cột cần thiết
    csv_content = """Tên môn học,Số tín chỉ,Điểm,Cột thừa 1,Cột thừa 2
Toán,3,8.0,A,x
Lý,2,9.0,A+,y
Hóa,abc,10.0,A+,z
Dòng tổng kết, ,, ,
"""
    # Toán: 3 * 8.0 = 24.0
    # Lý: 2 * 9.0 = 18.0
    # Dòng "Hóa" có số tín chỉ không hợp lệ ("abc") nên sẽ bị bỏ qua
    # Dòng tổng kết có số tín chỉ trống nên cũng bị bỏ qua
    # Tổng tín chỉ = 3 + 2 = 5
    # Tổng điểm = 24.0 + 18.0 = 42.0
    # GPA = 42.0 / 5 = 8.4
    
    total_credits, current_gpa = calculate_current_gpa_from_file(csv_content.encode('utf-8'), "test.csv")
    assert total_credits == 5
    assert current_gpa == 8.4

def test_calculate_current_gpa_from_file_invalid_extension():
    with pytest.raises(ValueError, match="Định dạng file không được hỗ trợ"):
        calculate_current_gpa_from_file(b"content", "test.txt")

def test_predict_required_gpa_possible():
    # Hiện tại 10 tín chỉ GPA 8.0, còn 5 tín chỉ, mục tiêu 8.5
    # Điểm hiện tại = 10 * 8 = 80
    # Mục tiêu tổng = 15 * 8.5 = 127.5
    # Cần đạt = 127.5 - 80 = 47.5
    # GPA cần = 47.5 / 5 = 9.5
    result = predict_required_gpa(current_credits=10, current_gpa=8.0, remaining_credits=5, target_gpa=8.5)
    assert result["required_gpa"] == 9.5
    assert result["is_possible"] is True

def test_predict_required_gpa_impossible():
    # Hiện tại 10 tín chỉ GPA 7.0, còn 5 tín chỉ, mục tiêu 9.0
    # Điểm hiện tại = 10 * 7 = 70
    # Mục tiêu tổng = 15 * 9.0 = 135
    # Cần đạt = 135 - 70 = 65
    # GPA cần = 65 / 5 = 13.0 (> 10.0)
    result = predict_required_gpa(current_credits=10, current_gpa=7.0, remaining_credits=5, target_gpa=9.0)
    assert result["required_gpa"] == 13.0
    assert result["is_possible"] is False

def test_predict_required_gpa_zero_remaining():
    result = predict_required_gpa(current_credits=10, current_gpa=8.0, remaining_credits=0, target_gpa=8.0)
    assert result["required_gpa"] == 0.0
    assert result["is_possible"] is False
    assert "lớn hơn 0" in result["message"]
