from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SocialEngagementStats(BaseModel):
    views: int = 0
    likes: int = 0
    shares: int = 0
    comments: int = 0
    virality_score: float = Field(0.0, description="Hệ số lan truyền tính toán từ tương tác (0.0 - 1.0)")


class SocialUrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="Đường dẫn bài viết Facebook hoặc video TikTok")
    platform: Optional[str] = Field(None, description="FACEBOOK, TIKTOK hoặc tự động nhận diện (AUTO)")
    analyze_cascade: bool = Field(True, description="Có phân tích đồ thị lan truyền GNN không")


class SocialUrlAnalysisResponse(BaseModel):
    session_id: int
    url: str
    platform: str  # "TIKTOK" hoặc "FACEBOOK"
    author_name: str
    caption: str
    hashtags: List[str] = []
    engagement: SocialEngagementStats
    predicted_label: str  # "SAI_SU_THAT", "CHINH_XAC", "CAN_KIEM_CHUNG"
    confidence_score: float
    multimodal_summary: str
    tokens_highlight: Optional[List[Dict[str, Any]]] = None
    keyframes: Optional[List[Dict[str, Any]]] = None
    audio_transcript: Optional[str] = None
    propagation_risk_level: str  # "CAO", "TRUNG_BINH", "THAP"
    cascade_nodes_predicted: int
    model_name: str
    analyzed_at: datetime


class SocialApiQueryRequest(BaseModel):
    platform: str = Field(..., description="TIKTOK_RESEARCH hoặc META_GRAPH")
    keyword: Optional[str] = Field(None, description="Từ khóa tìm kiếm nội dung nóng")
    hashtag: Optional[str] = Field(None, description="Hashtag (ví dụ: #tintuc, #canhbao)")
    max_results: int = Field(10, ge=1, le=50)


class SocialPostItem(BaseModel):
    post_id: str
    platform: str
    author: str
    content: str
    media_type: str  # "VIDEO", "IMAGE", "TEXT"
    media_url: Optional[str] = None
    engagement: SocialEngagementStats
    published_at: str
    is_flagged: bool = False


class SocialApiResponse(BaseModel):
    platform: str
    query: str
    total_found: int
    results: List[SocialPostItem]
    api_status: str  # "ACTIVE_RESEARCH_API" hoặc "SIMULATED_RESEARCH_SANDBOX"
