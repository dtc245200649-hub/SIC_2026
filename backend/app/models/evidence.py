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


class EvidenceSource(Base):
    """
    Nguồn tin kiểm chứng (Báo chí chính thống, cơ quan xác minh fact-checking).
    """
    __tablename__ = "evidence_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    domain: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    reliability_score: Mapped[float] = mapped_column(Float, default=1.0)  # Điểm độ tin cậy từ 0.0 đến 1.0
    is_official: Mapped[bool] = mapped_column(Boolean, default=True)  # Nguồn chính thống được chứng thực

    # Quan hệ
    documents: Mapped[List["EvidenceDocument"]] = relationship("EvidenceDocument", back_populates="source", cascade="all, delete-orphan")


class EvidenceDocument(Base):
    """
    Tài liệu / Bài báo làm bằng chứng đối soát lập luận (Ground Truth Evidence).
    """
    __tablename__ = "evidence_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_id: Mapped[int] = mapped_column(Integer, ForeignKey("evidence_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    snippet: Mapped[str] = mapped_column(Text, nullable=False)
    full_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    published_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    embedding_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)  # ID vector trong FAISS
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    source: Mapped[EvidenceSource] = relationship("EvidenceSource", back_populates="documents")
