from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Nội dung văn bản tiếng Việt cần phân tích")
    title: Optional[str] = Field(default=None, description="Tiêu đề hoặc mô tả bài đăng")


class TokenHighlight(BaseModel):
    word: str
    weight: float
    is_influential: bool


class SocialImpactAssessment(BaseModel):
    risk_level: str  # CAO, TRUNG_BINH, THAP
    risk_score: float  # Điểm rủi ro 1.0 - 10.0
    cascade_r0: float  # Hệ số lây lan dịch tễ R0
    propagation_speed: str
    predicted_exposure: str
    psychological_impact: str
    affected_demographics: List[str]
    action_recommendation: str


class SingleModalAnalysisResponse(BaseModel):
    session_id: int
    title: str
    modality: str  # TEXT, IMAGE, VIDEO, AUDIO
    predicted_label: str  # CHINH_XAC, GAY_HIEU_LAM, SAI_SU_THAT, CHUA_DU_THONG_TIN
    confidence_score: float
    summary: str
    tokens_highlight: Optional[List[TokenHighlight]] = None
    social_impact: Optional[SocialImpactAssessment] = None
    keyframes: Optional[List[Dict[str, Any]]] = None
    audio_transcript: Optional[str] = None
    file_name: Optional[str] = None
    file_size_bytes: Optional[int] = None
    model_name: str
    created_at: datetime
