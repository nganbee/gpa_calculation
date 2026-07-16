import pandas as pd
import io

def calculate_current_gpa_from_file(file_content: bytes, filename: str) -> tuple[int, float]:
    """
    Đọc file CSV/Excel và tính toán GPA hệ 10 hiện tại.
    Chỉ lấy 3 cột đầu tiên tương ứng với: Môn học, Số tín chỉ, Điểm
    """
    if filename.endswith('.csv'):
        # Lấy 3 cột đầu (0, 1, 2) và gán lại tên cột cho đồng nhất
        df = pd.read_csv(io.BytesIO(file_content), usecols=[0, 1, 2], names=['Môn học', 'Số tín chỉ', 'Điểm'], header=0)
    elif filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(file_content), usecols=[0, 1, 2], names=['Môn học', 'Số tín chỉ', 'Điểm'], header=0)
    else:
        raise ValueError("Định dạng file không được hỗ trợ (chỉ hỗ trợ csv, xls, xlsx)")

    # Xóa các dòng trống hoặc dòng chứa text ở phần tổng kết
    df = df.dropna(subset=['Số tín chỉ', 'Điểm'])
    
    # Chuyển kiểu dữ liệu sang số, các text không hợp lệ sẽ thành NaN
    df['Số tín chỉ'] = pd.to_numeric(df['Số tín chỉ'], errors='coerce')
    df['Điểm'] = pd.to_numeric(df['Điểm'], errors='coerce')
    df = df.dropna(subset=['Số tín chỉ', 'Điểm']) # Xóa lần nữa các dòng vừa bị ép thành NaN
    
    if df.empty:
        return 0, 0.0

    total_credits = int(df['Số tín chỉ'].sum())
    total_score = (df['Số tín chỉ'] * df['Điểm']).sum()
    
    current_gpa = total_score / total_credits if total_credits > 0 else 0.0
    return total_credits, round(current_gpa, 2)


def predict_required_gpa(current_credits: int, current_gpa: float, remaining_credits: int, target_gpa: float) -> dict:
    """
    Dự đoán điểm trung bình cần thiết cho các tín chỉ còn lại để đạt GPA mục tiêu.
    """
    if remaining_credits <= 0:
        return {
            "required_gpa": 0.0,
            "is_possible": False,
            "message": "Số tín chỉ còn lại phải lớn hơn 0."
        }
        
    total_expected_credits = current_credits + remaining_credits
    target_total_score = target_gpa * total_expected_credits
    current_total_score = current_gpa * current_credits
    
    required_score_for_remaining = target_total_score - current_total_score
    required_gpa_avg = required_score_for_remaining / remaining_credits
    
    # Làm tròn 2 chữ số thập phân
    required_gpa_avg = round(required_gpa_avg, 2)
    
    # Hệ 10: tối đa là 10.0
    if required_gpa_avg > 10.0:
        return {
            "required_gpa": required_gpa_avg,
            "is_possible": False,
            "message": f"Không khả thi! Bạn cần trung bình {required_gpa_avg} cho các môn còn lại, nhưng điểm tối đa chỉ là 10.0."
        }
    elif required_gpa_avg <= 0:
        return {
            "required_gpa": 0.0,
            "is_possible": True,
            "message": f"Mục tiêu đã được đảm bảo (hoặc quá dễ dàng), bạn chỉ cần {required_gpa_avg}."
        }
    else:
        return {
            "required_gpa": required_gpa_avg,
            "is_possible": True,
            "message": f"Khả thi. Bạn cần đạt trung bình {required_gpa_avg} cho {remaining_credits} tín chỉ còn lại."
        }
