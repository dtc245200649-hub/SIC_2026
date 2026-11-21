from sqlalchemy.orm import Session
from app.models.evidence import EvidenceSource, EvidenceDocument
from app.api.v1.endpoints.fact_check import get_evidence, verify_claim
from app.schemas.fact_check import ClaimVerifyRequest


def test_get_evidence_empty_and_populated(db_session: Session):
    """Kiểm tra truy vấn danh sách bằng chứng báo chí."""
    # Khi chưa có bài viết
    res_empty = get_evidence(q=None, limit=10, offset=0, db=db_session)
    assert res_empty.total == 0

    # Tạo nguồn tin và bài báo mẫu
    source = EvidenceSource(
        name="Báo VnExpress",
        domain="vnexpress.net",
        url="https://vnexpress.net",
        reliability_score=0.98,
        is_official=True,
    )
    db_session.add(source)
    db_session.flush()

    doc = EvidenceDocument(
        source_id=source.id,
        title="Bác bỏ tin đồn thất thiệt về bão lũ",
        url="https://vnexpress.net/tin-123.html",
        snippet="Cơ quan chức năng khẳng định thông tin trên mạng là sai sự thật.",
    )
    db_session.add(doc)
    db_session.commit()

    # Truy vấn lại
    res_populated = get_evidence(q="bão lũ", limit=10, offset=0, db=db_session)
    assert res_populated.total == 1
    assert res_populated.items[0].title == "Bác bỏ tin đồn thất thiệt về bão lũ"
    assert res_populated.items[0].source.name == "Báo VnExpress"


def test_verify_claim_nli(db_session: Session):
    """Kiểm tra đối soát phát biểu với bài báo trong CSDL."""
    source = EvidenceSource(
        name="Báo Tuổi Trẻ",
        domain="tuoitre.vn",
        url="https://tuoitre.vn",
        reliability_score=0.97,
        is_official=True,
    )
    db_session.add(source)
    db_session.flush()

    doc = EvidenceDocument(
        source_id=source.id,
        title="Bác bỏ tin giả vỡ đập thủy điện sông Tranh",
        url="https://tuoitre.vn/tin-456.html",
        snippet="Ban chỉ huy phòng chống lụt bão khẳng định đập sông Tranh vận hành bình thường.",
    )
    db_session.add(doc)
    db_session.commit()

    req = ClaimVerifyRequest(claim="vỡ đập thủy điện sông Tranh")
    res = verify_claim(payload=req, db=db_session)

    assert len(res.matched_evidences) >= 1
    assert res.matched_evidences[0].nli_verdict == "REFUTES"
    assert res.overall_verdict == "REFUTES"


def test_create_evidence(db_session: Session):
    """Kiểm tra thêm bài báo / mẫu kiểm chứng mới."""
    from app.api.v1.endpoints.fact_check import create_evidence
    from app.schemas.fact_check import EvidenceDocumentCreate

    payload = EvidenceDocumentCreate(
        title="Đính chính thông tin vỡ đê sông Hồng",
        url="https://tuoitre.vn/dinh-chinh-de-song-hong.html",
        snippet="Hà Nội khẳng định các tuyến đê vẫn an toàn, người dân không nên chia sẻ thông tin hoang mang.",
        source_name="Báo Tuổi Trẻ",
        source_domain="tuoitre.vn",
        reliability_score=0.99,
    )
    doc_out = create_evidence(payload=payload, db=db_session)
    assert doc_out.id is not None
    assert doc_out.title == "Đính chính thông tin vỡ đê sông Hồng"
    assert doc_out.source.name == "Báo Tuổi Trẻ"
