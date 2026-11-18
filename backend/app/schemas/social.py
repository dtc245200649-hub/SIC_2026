from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SocialEngagementStats(BaseModel):
    views: int = Field(0, description="Lượt xem (0 nếu nền tảng ẩn hoặc cần quyền API)")
    likes: int = Field(0, description="Lượt thích")
    shares: int = Field(0, description="Lượt chia sẻ")
    comments: int = Field(0, description="Lượt bình luận")
    virality_score: float = Field(0.0, description="Hệ số lan truyền chuẩn hóa [0.0 - 1.0] tính theo mô hình động lực học")
    is_live_scraped: bool = Field(False, description="Xác thực số liệu bóc tách thời gian thực từ nền tảng")
    notes: Optional[str] = Field(None, description="Ghi chú về nguồn gốc số liệu")


class SocialUrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="Đường dẫn bài viết Facebook hoặc video TikTok")
    platform: Optional[str] = Field(None, description="FACEBOOK, TIKTOK hoặc tự động nhận diện (AUTO)")
    analyze_cascade: bool = Field(True, description="Có kích hoạt mô hình lan truyền GNN không")
    user_provided_caption: Optional[str] = Field(
        None,
        description="Nội dung bài viết do người dùng cung cấp nếu nền tảng bị khóa đăng nhập",
    )


class EvidenceMatchItem(BaseModel):
    source_name: str
    title: str
    url: str
    similarity_score: float
    verdict: str  # "SUPPORTS", "REFUTES", "RELATED"


class SocialUrlAnalysisResponse(BaseModel):
    session_id: int
    url: str
    platform: str  # "TIKTOK" hoặc "FACEBOOK"
    metadata_source: str  # "LIVE_OEMBED", "LIVE_OPENGRAPH", "CANONICAL_URL_PARSER"
    author_name: str
    caption: str
    hashtags: List[str] = []
    engagement: SocialEngagementStats
    predicted_label: str  # "SAI_SU_THAT", "CHINH_XAC", "CAN_KIEM_CHUNG"
    confidence_score: float
    multimodal_summary: str
    evidence_matches: List[EvidenceMatchItem] = []
    tokens_highlight: Optional[List[Dict[str, Any]]] = None
    keyframes: Optional[List[Dict[str, Any]]] = None
    audio_transcript: Optional[str] = None
    propagation_risk_level: str  # "CAO", "TRUNG_BINH", "THAP"
    cascade_r0: float = Field(1.0, description="Hệ số lây lan cơ bản R0 trong mạng xã hội")
    cascade_nodes_predicted: int
    model_name: str
    data_integrity_notes: str
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
    api_status: str  # "ACTIVE_RESEARCH_API" hoặc "STANDARDIZED_BENCHMARK_DATASET"
