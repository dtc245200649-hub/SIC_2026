from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_user_optional, get_db
from app.models.user import User
from app.models.analysis import AnalysisSession, AnalysisResult
from app.schemas.analysis import (
    TextAnalysisRequest,
    SingleModalAnalysisResponse,
    MultimodalAnalysisResponse,
    XAIExplainRequest,
)
from app.services.pipeline_service import SingleModalPipelineService
from ai_engine.xai.fusion_explainer import MultimodalXAIOrchestrator

router = APIRouter()


@router.post(
    "/text",
    response_model=SingleModalAnalysisResponse,
    summary="Phân tích tin giả Văn bản (PhoBERT v2)",
    description="Nhập trực tiếp nội dung văn bản tiếng Việt để trích xuất đặc trưng và xác định trọng số từ ngữ then chốt.",
)
def analyze_text(
    payload: TextAnalysisRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    return SingleModalPipelineService.analyze_text(
        db=db,
        user=current_user,
        text=payload.text,
        title=payload.title,
    )


@router.post(
    "/image",
    response_model=SingleModalAnalysisResponse,
    summary="Phân tích tin giả Hình ảnh (Vision Transformer ViT)",
    description="Tải lên tệp ảnh (PNG, JPG, WEBP) để trích xuất đặc trưng thị giác patch-based và kiểm tra chỉnh sửa.",
)
def analyze_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    return SingleModalPipelineService.analyze_image(
        db=db,
        user=current_user,
        file=file,
    )


@router.post(
    "/video",
    response_model=SingleModalAnalysisResponse,
    summary="Phân tích tin giả Video (Keyframe Extraction & Temporal)",
    description="Tải lên tệp video để trích xuất các khung hình đại diện (keyframes) bằng OpenCV và bóc băng âm thanh.",
)
def analyze_video(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    return SingleModalPipelineService.analyze_video(
        db=db,
        user=current_user,
        file=file,
    )


@router.post(
    "/audio",
    response_model=SingleModalAnalysisResponse,
    summary="Phân tích tin giả Âm thanh (Whisper STT & Librosa)",
    description="Tải lên tệp âm thanh (MP3, WAV, M4A) để chuyển giọng nói sang văn bản và phân tích giọng nhân tạo TTS.",
)
def analyze_audio(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    return SingleModalPipelineService.analyze_audio(
        db=db,
        user=current_user,
        file=file,
    )


@router.post(
    "/multimodal",
    response_model=MultimodalAnalysisResponse,
    summary="Phân tích Học sâu Đa phương thức (Multimodal Fusion + XAI)",
    description="Hợp nhất Văn bản (PhoBERT v2) và Hình ảnh (ViT) bằng Cross-Attention & Gated Fusion, giải thích qua SHAP & Grad-CAM.",
)
def analyze_multimodal(
    text: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    if not text and not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng cung cấp ít nhất nội dung văn bản hoặc tệp ảnh đa phương thức.",
        )
    return SingleModalPipelineService.analyze_multimodal(
        db=db,
        user=current_user,
        text=text,
        file=file,
        title=title,
    )


@router.post(
    "/xai/explain",
    summary="Sinh báo cáo Giải thích Mô hình AI (Explainable AI - XAI Report)",
    description="Tính toán Token SHAP values, ma trận Grad-CAM 196 patches và phân rã trọng số đa phương thức.",
)
def explain_xai(
    payload: XAIExplainRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    orchestrator = MultimodalXAIOrchestrator()
    return orchestrator.generate_explanation_report(
        text_content=payload.text,
        image_input=None,
        inconsistency_score=payload.inconsistency or 0.65,
        confidence_score=payload.confidence or 0.88,
        predicted_label=payload.label or "SAI_SU_THAT",
    )


@router.get(
    "/history",
    summary="Lấy lịch sử các phiên phân tích của người dùng",
    description="Truy xuất danh sách các phiên phân tích đã thực hiện trong CSDL.",
)
def get_analysis_history(
    limit: int = 20,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    stmt = (
        select(AnalysisSession)
        .where(AnalysisSession.user_id == current_user.id)
        .order_by(desc(AnalysisSession.created_at))
        .offset(offset)
        .limit(limit)
    )
    sessions = db.scalars(stmt).all()

    items = []
    for s in sessions:
        res = s.results[0] if s.results else None
        items.append({
            "id": s.id,
            "title": s.title,
            "modality": s.primary_modality,
            "status": s.status,
            "predicted_label": res.overall_prediction if res else "CHUA_DU_THONG_TIN",
            "confidence_score": res.confidence_score if res else 0.0,
            "created_at": s.created_at.strftime("%d/%m/%Y %H:%M"),
        })

    return items


@router.get(
    "/stats",
    summary="Thống kê phân tích thực tế từ CSDL",
    description="Truy xuất số liệu phân tích thực tế được tính toán từ các phiên đã ghi nhận.",
)
def get_analysis_stats(
    db: Session = Depends(get_db),
):
    from sqlalchemy import func
    total = db.scalar(select(func.count(AnalysisSession.id))) or 0
    fake_count = db.scalar(
        select(func.count(AnalysisResult.id)).where(AnalysisResult.overall_prediction == "SAI_SU_THAT")
    ) or 0
    verified_count = db.scalar(
        select(func.count(AnalysisResult.id)).where(AnalysisResult.overall_prediction == "CHINH_XAC")
    ) or 0
    warning_count = db.scalar(
        select(func.count(AnalysisResult.id)).where(AnalysisResult.overall_prediction == "GAY_HIEU_LAM")
    ) or 0

    return {
        "total": total,
        "fake": fake_count,
        "verified": verified_count,
        "warning": warning_count,
    }
