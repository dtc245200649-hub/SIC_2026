from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Explanation(Base):
    """
    Bảng lưu trữ giải thích từ các kỹ thuật Explainable AI (XAI).
    Hỗ trợ: Integrated Gradients, Grad-CAM, LIME, Attention Weights, Evidence-based.
    """
    __tablename__ = "explanations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    result_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_results.id", ondelete="CASCADE"), nullable=False, index=True)
    xai_method: Mapped[str] = mapped_column(String(50), nullable=False)  # INTEGRATED_GRADIENTS, GRAD_CAM, LIME, ATTENTION, EVIDENCE
    target_modality: Mapped[str] = mapped_column(String(50), nullable=False)  # TEXT, IMAGE, VIDEO, MULTIMODAL
    explanation_json: Mapped[str] = mapped_column(Text, nullable=False)  # Dữ liệu giải thích có cấu trúc (Token importance, bounding boxes, v.v.)
    summary_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Tóm tắt lý do bằng ngôn ngữ tự nhiên
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    result: Mapped["AnalysisResult"] = relationship("AnalysisResult", back_populates="explanations")
