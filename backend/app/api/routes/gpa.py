from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.gpa import GPACalculationResult, GPAPredictionRequest, GPAPredictionResult
from app.services.gpa_calculator import calculate_current_gpa_from_file, predict_required_gpa

router = APIRouter()

@router.post("/calculate", response_model=GPACalculationResult)
async def calculate_gpa(file: UploadFile = File(...)):
    """
    Endpoint để upload file CSV/Excel và trả về tổng tín chỉ, điểm trung bình hệ 10 và danh sách môn học.
    """
    try:
        content = await file.read()
        total_credits, current_gpa, subjects = calculate_current_gpa_from_file(content, file.filename)
        return GPACalculationResult(
            total_credits=total_credits,
            current_gpa=current_gpa,
            subjects=subjects
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý file: {str(e)}")

@router.post("/predict", response_model=GPAPredictionResult)
def predict_gpa(request: GPAPredictionRequest):
    """
    Endpoint để dự đoán điểm cần đạt được trong tương lai để được GPA mục tiêu.
    """
    try:
        result = predict_required_gpa(
            current_credits=request.current_credits,
            current_gpa=request.current_gpa,
            remaining_credits=request.remaining_credits,
            target_gpa=request.target_gpa
        )
        return GPAPredictionResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tính toán: {str(e)}")
