from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SocialUser(Base):
    """
    Người dùng trên mạng xã hội tham gia chuỗi tương tác / chia sẻ bài đăng.
    """
    __tablename__ = "social_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    platform_user_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(150), nullable=False)
    followers_count: Mapped[int] = mapped_column(Integer, default=0)
    following_count: Mapped[int] = mapped_column(Integer, default=0)
    account_age_days: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_bot_predicted: Mapped[bool] = mapped_column(Boolean, default=False)

    # Quan hệ
    posts: Mapped[List["SocialPost"]] = relationship("SocialPost", back_populates="author", cascade="all, delete-orphan")


class SocialPost(Base):
    """
    Bài đăng mạng xã hội liên quan tới nội dung đang phân tích.
    """
    __tablename__ = "social_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    author_id: Mapped[int] = mapped_column(Integer, ForeignKey("social_users.id", ondelete="CASCADE"), nullable=False, index=True)
    platform: Mapped[str] = mapped_column(String(50), default="FACEBOOK")  # FACEBOOK, TIKTOK, ZALO, YOUTUBE
    platform_post_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    shares_count: Mapped[int] = mapped_column(Integer, default=0)
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    reactions_count: Mapped[int] = mapped_column(Integer, default=0)

    # Quan hệ
    author: Mapped[SocialUser] = relationship("SocialUser", back_populates="posts")
    interactions: Mapped[List["SocialInteraction"]] = relationship("SocialInteraction", back_populates="post", cascade="all, delete-orphan")


class SocialInteraction(Base):
    """
    Cạnh (Edge) trong đồ thị lan truyền: thể hiện hành vi share, comment, phản hồi.
    """
    __tablename__ = "social_interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    post_id: Mapped[int] = mapped_column(Integer, ForeignKey("social_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    interaction_type: Mapped[str] = mapped_column(String(50), nullable=False)  # SHARE, COMMENT, REACTION, RETWEET
    source_user_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    target_user_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Quan hệ
    post: Mapped[SocialPost] = relationship("SocialPost", back_populates="interactions")


class PropagationAnalysis(Base):
    """
    Chỉ số phân tích động lực học lan truyền và tác động xã hội từ mô hình GNN.
    """
    __tablename__ = "propagation_analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    total_nodes: Mapped[int] = mapped_column(Integer, default=0)
    total_edges: Mapped[int] = mapped_column(Integer, default=0)
    cascade_depth: Mapped[int] = mapped_column(Integer, default=0)  # Độ sâu tầng lan truyền
    virality_speed: Mapped[float] = mapped_column(Float, default=0.0)  # Tốc độ lan truyền (nodes/giờ)
    structural_virality: Mapped[float] = mapped_column(Float, default=0.0)  # Chỉ số Wiener index của đồ thị
    community_count: Mapped[int] = mapped_column(Integer, default=0)  # Số cộng đồng bị ảnh hưởng
    is_simulated_data: Mapped[bool] = mapped_column(Boolean, default=True)  # Gắn nhãn trung thực nếu là dữ liệu mô phỏng
    graph_topology_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Cấu trúc JSON phục vụ vẽ đồ thị React
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    session: Mapped["AnalysisSession"] = relationship("AnalysisSession", back_populates="propagation_analyses")
