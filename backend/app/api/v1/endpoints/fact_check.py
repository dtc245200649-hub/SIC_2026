from typing import List, Optional
import re
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_, desc
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.evidence import EvidenceDocument, EvidenceSource
from app.services.rss_collector import RssCollectorService
from app.services.rag_service import VectorRAGService
from app.services.rag_scheduler import RAGAutoScheduler
from datetime import datetime, timezone
from urllib.parse import urlparse
from app.schemas.fact_check import (
    EvidenceDocumentOut,
    EvidenceDocumentCreate,
    FactCheckSearchResponse,
    ClaimVerifyRequest,
    ClaimVerifyResponse,
    VerifiedEvidenceItem,
)

router = APIRouter()


@router.post(
    "/sync-rss",
    summary="Đồng bộ tự động các luồng RSS báo chí chính thống",
    description="Quét và lưu bài viết mới nhất từ VnExpress, Tuổi Trẻ, Thanh Niên vào kho tri thức kiểm chứng.",
)
def sync_rss(
    max_items: int = Query(default=10, ge=1, le=30, description="Số bài tối đa mỗi luồng RSS"),
    db: Session = Depends(get_db),
):
    result = RssCollectorService.sync_all_feeds(db=db, max_items_per_feed=max_items)
    return result


@router.get(
    "/evidence",
    response_model=FactCheckSearchResponse,
    summary="Truy vấn danh sách bài báo kiểm chứng trong kho tri thức",
    description="Tìm kiếm theo từ khóa hoặc lấy danh sách bài báo mới nhất được thu thập từ báo chính thống.",
)
def get_evidence(
    q: Optional[str] = Query(default=None, description="Từ khóa tìm kiếm"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(EvidenceDocument).join(EvidenceDocument.source)

    if q and q.strip():
        search_term = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                EvidenceDocument.title.ilike(search_term),
                EvidenceDocument.snippet.ilike(search_term),
            )
        )

    stmt = stmt.order_by(desc(EvidenceDocument.published_date)).offset(offset).limit(limit)
    documents = db.scalars(stmt).all()

    # Đếm tổng số
    count_stmt = select(EvidenceDocument.id)
    if q and q.strip():
        count_stmt = count_stmt.where(
            or_(
                EvidenceDocument.title.ilike(search_term),
                EvidenceDocument.snippet.ilike(search_term),
            )
        )
    total = len(db.scalars(count_stmt).all())

    return FactCheckSearchResponse(
        total=total,
        items=[EvidenceDocumentOut.model_validate(d) for d in documents],
    )


@router.post(
    "/evidence",
    response_model=EvidenceDocumentOut,
    summary="Thêm bài báo / mẫu kiểm chứng mới vào kho tri thức",
    description="Lưu trữ tài liệu kiểm chứng từ báo chí chính thống hoặc mẫu công khai có kiểm soát.",
)
def create_evidence(
    payload: EvidenceDocumentCreate,
    db: Session = Depends(get_db),
):
    source_domain = payload.source_domain
    if not source_domain:
        try:
            source_domain = urlparse(payload.url).netloc or "baochinhthong.vn"
        except Exception:
            source_domain = "baochinhthong.vn"

    source = db.scalar(
        select(EvidenceSource).where(
            or_(
                EvidenceSource.name == payload.source_name,
                EvidenceSource.domain == source_domain,
            )
        )
    )
    if not source:
        source = EvidenceSource(
            name=payload.source_name,
            domain=source_domain,
            url=f"https://{source_domain}",
            reliability_score=payload.reliability_score,
            is_official=True,
        )
        db.add(source)
        db.flush()

    new_doc = EvidenceDocument(
        source_id=source.id,
        title=payload.title.strip(),
        url=payload.url.strip(),
        snippet=payload.snippet.strip(),
        published_date=payload.published_date or datetime.now(timezone.utc),
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    # Tự động nạp tài liệu mới vào Vector RAG Index
    try:
        VectorRAGService.build_index(db=db, force_rebuild=True)
    except Exception:
        pass
    return EvidenceDocumentOut.model_validate(new_doc)


@router.post(
    "/build-index",
    summary="Nạp toàn bộ tài liệu kiểm chứng vào Vector RAG Index",
    description="Tính toán vector đặc trưng ngữ nghĩa cho toàn bộ bài báo trong CSDL và cập nhật embedding_id.",
)
def build_rag_index(
    db: Session = Depends(get_db),
):
    result = VectorRAGService.build_index(db=db, force_rebuild=True)
    return result


@router.post(
    "/verify",
    response_model=ClaimVerifyResponse,
    summary="Đối soát phát biểu cần kiểm chứng bằng Vector RAG Semantic Search",
    description="Sử dụng không gian vector ngữ nghĩa để truy vấn và đối soát bằng chứng trong kho tri thức.",
)
def verify_claim(
    payload: ClaimVerifyRequest,
    db: Session = Depends(get_db),
):
    return VectorRAGService.verify_claim(claim=payload.claim, db=db)


# =========================================================================
# QUẢN LÝ TỰ ĐỘNG HÓA NẠP TRI THỨC VÀO RAG (PHƯƠNG PHÁP 4)
# =========================================================================
@router.get(
    "/scheduler/status",
    summary="Kiểm tra trạng thái dịch vụ tự động nạp tri thức định kỳ (Phương pháp 4)",
)
def get_scheduler_status():
    return RAGAutoScheduler.get_instance().get_status()


@router.post(
    "/scheduler/trigger",
    summary="Kích hoạt chu kỳ tự động nạp tri thức ngay lập tức",
)
def trigger_scheduler_cycle(
    max_items: int = Query(default=8, ge=1, le=20),
):
    scheduler = RAGAutoScheduler.get_instance()
    res = scheduler.execute_sync_cycle(max_items_per_feed=max_items)
    return res


@router.post(
    "/scheduler/config",
    summary="Cấu hình lịch tự động nạp tri thức",
)
def update_scheduler_config(
    enabled: Optional[bool] = Query(default=None),
    interval_minutes: Optional[int] = Query(default=None, ge=5, le=1440),
):
    scheduler = RAGAutoScheduler.get_instance()
    scheduler.update_config(enabled=enabled, interval_minutes=interval_minutes)
    return scheduler.get_status()
