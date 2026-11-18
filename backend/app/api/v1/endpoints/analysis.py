from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.analysis import AnalysisSession, AnalysisResult
from app.schemas.analysis import (
    TextAnalysisRequest,
    SingleModalAnalysisResponse,
)
from app.services.pipeline_service import SingleModalPipelineService

router = APIRouter()


@router.post(
    "/text",
    response_model=SingleModalAnalysisResponse,
    summary="Phân tích tin giả Văn bản (PhoBERT v2)",
    description="Nhập trực tiếp nội dung văn bản tiếng Việt để trích xuất đặc trưng và xác định trọng số từ ngữ then chốt.",
)
def analyze_text(
    payload: TextAnalysisRequest,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return SingleModalPipelineService.analyze_audio(
        db=db,
        user=current_user,
        file=file,
    )


@router.get(
    "/history",
    summary="Lấy lịch sử các phiên phân tích của người dùng",
    description="Truy xuất danh sách các phiên phân tích đã thực hiện trong CSDL.",
)
def get_analysis_history(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
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
