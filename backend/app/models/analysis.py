from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AnalysisSession(Base):
    """
    Phiên phân tích đa phương thức của người dùng.
    """
    __tablename__ = "analysis_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True)  # PENDING, PROCESSING, COMPLETED, FAILED
    primary_modality: Mapped[str] = mapped_column(String(50), default="MULTIMODAL")  # TEXT, IMAGE, VIDEO, MULTIMODAL
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Quan hệ
    user: Mapped["User"] = relationship("User", back_populates="analysis_sessions")
    uploaded_files: Mapped[List["UploadedFile"]] = relationship("UploadedFile", back_populates="session", cascade="all, delete-orphan")
    extracted_features: Mapped[List["ExtractedFeature"]] = relationship("ExtractedFeature", back_populates="session", cascade="all, delete-orphan")
    results: Mapped[List["AnalysisResult"]] = relationship("AnalysisResult", back_populates="session", cascade="all, delete-orphan")
    propagation_analyses: Mapped[List["PropagationAnalysis"]] = relationship("PropagationAnalysis", back_populates="session", cascade="all, delete-orphan")


class UploadedFile(Base):
    """
    Tệp tin đa phương thức tải lên (văn bản, hình ảnh, video).
    """
    __tablename__ = "uploaded_files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)  # TEXT, IMAGE, VIDEO
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    session: Mapped[AnalysisSession] = relationship("AnalysisSession", back_populates="uploaded_files")


class ExtractedFeature(Base):
    """
    Đặc trưng số học (Feature Vectors) được trích xuất từ các mô hình nền tảng.
    """
    __tablename__ = "extracted_features"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    modality: Mapped[str] = mapped_column(String(50), nullable=False)  # TEXT, IMAGE, VIDEO
    feature_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # Đường dẫn tới tệp vector numpy/pt
    feature_dim: Mapped[int] = mapped_column(Integer, nullable=False)  # Kích thước vector đặc trưng
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Thông tin trích xuất bổ sung
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    session: Mapped[AnalysisSession] = relationship("AnalysisSession", back_populates="extracted_features")


class AnalysisResult(Base):
    """
    Kết quả suy luận tổng hợp từ mô hình học sâu đa phương thức.
    """
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_prediction: Mapped[str] = mapped_column(String(50), nullable=False)  # CHINH_XAC, GAY_HIEU_LAM, SAI_SU_THAT, CHUA_DU_THONG_TIN
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)  # Độ tự tin từ 0.0 đến 1.0
    cross_modal_inconsistency_score: Mapped[float] = mapped_column(Float, default=0.0)  # Mức độ mâu thuẫn giữa các phương thức
    summary_explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    session: Mapped[AnalysisSession] = relationship("AnalysisSession", back_populates="results")
    modality_predictions: Mapped[List["ModalityPrediction"]] = relationship("ModalityPrediction", back_populates="result", cascade="all, delete-orphan")
    explanations: Mapped[List["Explanation"]] = relationship("Explanation", back_populates="result", cascade="all, delete-orphan")


class ModalityPrediction(Base):
    """
    Dự đoán thành phần và trọng số tin cậy của từng phương thức dữ liệu đơn lẻ.
    """
    __tablename__ = "modality_predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    result_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis_results.id", ondelete="CASCADE"), nullable=False, index=True)
    modality: Mapped[str] = mapped_column(String(50), nullable=False)  # TEXT, IMAGE, VIDEO
    predicted_label: Mapped[str] = mapped_column(String(50), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    contribution_weight: Mapped[float] = mapped_column(Float, nullable=False)  # Trọng số đóng góp trong Gated Fusion
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quan hệ
    result: Mapped[AnalysisResult] = relationship("AnalysisResult", back_populates="modality_predictions")
