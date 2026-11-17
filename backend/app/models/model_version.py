from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ModelVersion(Base):
    """
    Quản lý phiên bản các mô hình học sâu, trọng số checkpoint và siêu tham số thực nghiệm.
    """
    __tablename__ = "model_versions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)  # PhoBERT, ViT, VideoMAE, MultimodalFusion, GAT
    version_tag: Mapped[str] = mapped_column(String(50), nullable=False)  # v1.0.0, v1.1.0-colab
    modality: Mapped[str] = mapped_column(String(50), nullable=False)  # TEXT, IMAGE, MULTIMODAL, GNN
    checkpoint_path: Mapped[str] = mapped_column(String(500), nullable=False)
    metrics_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # F1, Accuracy, AUC, PR-AUC
    hyperparameters_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
