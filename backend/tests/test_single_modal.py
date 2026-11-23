import io
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from app.models.user import User
from app.schemas.analysis import TextAnalysisRequest, XAIExplainRequest
from app.services.pipeline_service import SingleModalPipelineService
from app.api.v1.endpoints.analysis import (
    analyze_text,
    analyze_image,
    analyze_video,
    analyze_audio,
    analyze_multimodal,
    explain_xai,
    get_analysis_history,
)


def get_mock_user(db: Session) -> User:
    user = User(
        email="ai_tester@sic.edu.vn",
        username="ai_tester",
        hashed_password="hashed_pwd_placeholder",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_analyze_text_pipeline(db_session: Session):
    """Kiểm tra pipeline phân tích văn bản tiếng Việt và XAI SHAP."""
    user = get_mock_user(db_session)
    payload = TextAnalysisRequest(
        text="Khẩn cấp: vỡ đập thủy điện sông Tranh, người dân sơ tán ngay lập tức!",
        title="Tin đồn vỡ đập sông Tranh",
    )
    res = analyze_text(payload=payload, current_user=user, db=db_session)

    assert res.session_id is not None
    assert res.modality == "TEXT"
    assert res.predicted_label in ["SAI_SU_THAT", "GAY_HIEU_LAM", "CHINH_XAC"]
    assert res.confidence_score >= 0.5
    assert res.tokens_highlight is not None
    assert len(res.tokens_highlight) > 0
    assert res.shap_values is not None
    assert len(res.shap_values) > 0
    assert res.uncertainty_score is not None


def test_analyze_image_pipeline(db_session: Session):
    """Kiểm tra pipeline phân tích ảnh ViT và Grad-CAM Heatmap."""
    user = get_mock_user(db_session)
    mock_file = UploadFile(
        filename="test_image.jpg",
        file=io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 100),
        headers={"content-type": "image/jpeg"},
    )

    res = analyze_image(file=mock_file, current_user=user, db=db_session)
    assert res.session_id is not None
    assert res.modality == "IMAGE"
    assert res.file_name == "test_image.jpg"
    assert res.confidence_score > 0.0
    assert res.heatmap_grid is not None
    assert len(res.heatmap_grid) == 196
    assert res.gradcam_conclusion is not None


def test_analyze_video_pipeline(db_session: Session):
    """Kiểm tra pipeline video và trích xuất keyframes."""
    user = get_mock_user(db_session)
    mock_file = UploadFile(
        filename="test_video.mp4",
        file=io.BytesIO(b"\x00\x00\x00\x18ftypmp42" + b"\x00" * 200),
        headers={"content-type": "video/mp4"},
    )

    res = analyze_video(file=mock_file, current_user=user, db=db_session)
    assert res.session_id is not None
    assert res.modality == "VIDEO"
    assert res.keyframes is not None
    assert len(res.keyframes) >= 1


def test_analyze_audio_pipeline(db_session: Session):
    """Kiểm tra pipeline âm thanh Whisper STT."""
    user = get_mock_user(db_session)
    mock_file = UploadFile(
        filename="test_speech.mp3",
        file=io.BytesIO(b"ID3" + b"\x00" * 150),
        headers={"content-type": "audio/mpeg"},
    )

    res = analyze_audio(file=mock_file, current_user=user, db=db_session)
    assert res.session_id is not None
    assert res.modality == "AUDIO"
    assert res.audio_transcript is not None


def test_analyze_multimodal_pipeline(db_session: Session):
    """Kiểm tra pipeline Hợp nhất Đa phương thức và XAI."""
    user = get_mock_user(db_session)
    mock_file = UploadFile(
        filename="tampered_scene.jpg",
        file=io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 100),
        headers={"content-type": "image/jpeg"},
    )
    res = analyze_multimodal(
        text="Khẩn cấp: vỡ đập thủy điện sông Tranh nước ngập chia sẻ ngay",
        title="Vỡ đập đa phương thức",
        file=mock_file,
        current_user=user,
        db=db_session,
    )
    assert res.session_id is not None
    assert res.predicted_label in ["SAI_SU_THAT", "GAY_HIEU_LAM", "CHINH_XAC"]
    assert res.confidence_score >= 0.5
    assert res.cross_modal_inconsistency >= 0.0
    assert len(res.modality_contributions) >= 2
    assert res.summary_reasoning is not None
    assert len(res.heatmap_grid) == 196


def test_xai_explain_endpoint(db_session: Session):
    """Kiểm tra API giải thích trực tiếp XAI."""
    user = get_mock_user(db_session)
    req = XAIExplainRequest(
        text="Khẩn cấp: vỡ đê sông Hồng, mọi người chia sẻ ngay!",
        confidence=0.92,
        inconsistency=0.75,
        label="SAI_SU_THAT",
    )
    res = explain_xai(payload=req, current_user=user)
    assert "summary_reasoning" in res
    assert "token_attributions" in res
    assert "shap_values" in res
    assert len(res["shap_values"]) > 0
    assert res["uncertainty_score"] == 0.16


def test_analysis_history(db_session: Session):
    """Kiểm tra endpoint lịch sử phân tích."""
    user = get_mock_user(db_session)
    payload = TextAnalysisRequest(text="Thông cáo thời sự chính thức từ cơ quan nhà nước.")
    analyze_text(payload=payload, current_user=user, db=db_session)

    history = get_analysis_history(limit=10, offset=0, current_user=user, db=db_session)
    assert len(history) == 1
    assert history[0]["modality"] == "TEXT"
