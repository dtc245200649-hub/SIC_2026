from typing import List, Optional
import re
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_, desc
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.evidence import EvidenceDocument, EvidenceSource
from app.services.rss_collector import RssCollectorService
from app.schemas.fact_check import (
    EvidenceDocumentOut,
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
    "/verify",
    response_model=ClaimVerifyResponse,
    summary="Đối soát phát biểu cần kiểm chứng với kho bài báo chính thống",
    description="So khớp nội dung phát biểu với các bài báo trong CSDL để đưa ra bằng chứng ủng hộ hoặc bác bỏ.",
)
def verify_claim(
    payload: ClaimVerifyRequest,
    db: Session = Depends(get_db),
):
    claim_text = payload.claim.strip().lower()
    claim_words = set(re.findall(r"\w+", claim_text)) if 're' in globals() else set(claim_text.split())

    # Lấy các bài báo có từ khóa liên quan
    stmt = select(EvidenceDocument).join(EvidenceDocument.source).order_by(desc(EvidenceDocument.published_date)).limit(50)
    all_docs = db.scalars(stmt).all()

    matched_items: List[VerifiedEvidenceItem] = []

    for doc in all_docs:
        doc_words = set(doc.title.lower().split() + doc.snippet.lower().split())
        intersection = claim_words.intersection(doc_words)

        if intersection:
            score = len(intersection) / max(1, len(claim_words))
            # Quyết định NLI sơ bộ
            # Nếu bài báo chứa từ "bác bỏ", "sai sự thật", "cảnh báo", "không đúng"
            lower_text = (doc.title + " " + doc.snippet).lower()
            if any(k in lower_text for k in ["bác bỏ", "sai sự thật", "cảnh báo", "giả mạo", "xử phạt"]):
                verdict = "REFUTES"
            elif score > 0.4:
                verdict = "SUPPORTS"
            else:
                verdict = "NOT_ENOUGH_INFO"

            matched_items.append(
                VerifiedEvidenceItem(
                    id=doc.id,
                    title=doc.title,
                    url=doc.url,
                    snippet=doc.snippet,
                    source_name=doc.source.name,
                    source_domain=doc.source.domain,
                    published_date=doc.published_date.strftime("%d/%m/%Y") if doc.published_date else None,
                    similarity_score=min(1.0, score + 0.3),
                    nli_verdict=verdict,
                )
            )

    matched_items.sort(key=lambda x: x.similarity_score, reverse=True)
    top_matches = matched_items[:5]

    overall = "NOT_ENOUGH_INFO"
    if top_matches:
        if any(m.nli_verdict == "REFUTES" for m in top_matches):
            overall = "REFUTES"
        elif any(m.nli_verdict == "SUPPORTS" for m in top_matches):
            overall = "SUPPORTS"

    return ClaimVerifyResponse(
        claim=payload.claim,
        overall_verdict=overall,
        matched_evidences=top_matches,
    )
