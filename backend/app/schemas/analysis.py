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
    shap_score: Optional[str] = None
    type: Optional[str] = "normal"


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
    shap_values: Optional[List[Dict[str, Any]]] = None
    heatmap_grid: Optional[List[Dict[str, Any]]] = None
    gradcam_conclusion: Optional[str] = None
    high_attention_bbox: Optional[Dict[str, Any]] = None
    uncertainty_score: Optional[float] = None
    uncertainty_level: Optional[str] = None
    modality_weights: Optional[List[Dict[str, Any]]] = None
    cross_modal_inconsistency: Optional[float] = None
    social_impact: Optional[SocialImpactAssessment] = None
    keyframes: Optional[List[Dict[str, Any]]] = None
    audio_transcript: Optional[str] = None
    file_name: Optional[str] = None
    file_size_bytes: Optional[int] = None
    model_name: str
    created_at: datetime


class ExtractUrlRequest(BaseModel):
    url: str = Field(..., min_length=5, description="Đường dẫn URL bài báo, video hoặc mạng xã hội")


class ExtractUrlResponse(BaseModel):
    url: str
    platform: str
    title: str
    description: str
    content_text: str
    author_name: str
    thumbnail_url: Optional[str] = None
    video_url: Optional[str] = None
    media_type: str = "ARTICLE"
    metadata_source: str


class MultimodalAnalysisResponse(BaseModel):
    session_id: int
    title: str
    predicted_label: str  # SAI_SU_THAT, GAY_HIEU_LAM, CHINH_XAC
    confidence_score: float
    uncertainty_score: float
    uncertainty_level: str
    cross_modal_inconsistency: float
    summary: str
    summary_reasoning: str
    modality_contributions: List[Dict[str, Any]]
    tokens_highlight: Optional[List[TokenHighlight]] = None
    shap_values: Optional[List[Dict[str, Any]]] = None
    heatmap_grid: Optional[List[Dict[str, Any]]] = None
    gradcam_conclusion: Optional[str] = None
    high_attention_bbox: Optional[Dict[str, Any]] = None
    social_impact: Optional[SocialImpactAssessment] = None
    file_name: Optional[str] = None
    model_name: str = "Multimodal Gated Cross-Attention + XAI"
    created_at: datetime


class XAIExplainRequest(BaseModel):
    text: Optional[str] = Field(None, description="Nội dung văn bản")
    confidence: Optional[float] = Field(0.85, ge=0.0, le=1.0)
    inconsistency: Optional[float] = Field(0.70, ge=0.0, le=1.0)
    label: Optional[str] = Field("SAI_SU_THAT")
