from pydantic import BaseModel, Field

class GPACalculationResult(BaseModel):
    total_credits: int = Field(..., description="Tổng số tín chỉ đã học")
    current_gpa: float = Field(..., description="Điểm trung bình (hệ 10) hiện tại")
    subjects: list[dict] = Field(default=[], description="Danh sách các môn học đã được trích xuất từ file")

class GPAPredictionRequest(BaseModel):
    current_credits: int = Field(..., description="Tổng số tín chỉ đã học")
    current_gpa: float = Field(..., description="Điểm trung bình (hệ 10) hiện tại")
    remaining_credits: int = Field(..., description="Số tín chỉ còn lại dự kiến sẽ học")
    target_gpa: float = Field(..., description="Điểm trung bình mục tiêu (hệ 10) muốn đạt được")

class GPAPredictionResult(BaseModel):
    required_gpa: float = Field(..., description="Điểm trung bình cần đạt cho các tín chỉ còn lại")
    is_possible: bool = Field(..., description="Có khả thi không (điểm yêu cầu <= 10.0)")
    message: str = Field(..., description="Thông báo kết quả")
