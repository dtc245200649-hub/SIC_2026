#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
KỊCH BẢN KIỂM THỬ END-TO-END (E2E SYSTEM VERIFICATION)
Hệ thống Phát hiện Thông tin Sai lệch Đa phương thức trên Mạng xã hội Việt Nam
"""
import os
import sys
import io

_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)
backend_path = os.path.join(_ROOT, "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

os.environ["HF_HOME"] = os.path.join(_ROOT, "data", "huggingface")
os.environ["TORCH_HOME"] = os.path.join(_ROOT, "data", "torch")

from starlette.datastructures import UploadFile
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.analysis import TextAnalysisRequest
from app.services.pipeline_service import SingleModalPipelineService
from ai_engine.encoders.text_encoder import VietnameseTextEncoder
from ai_engine.encoders.image_encoder import VisionTransformerEncoder
from ai_engine.fusion.multimodal_model import MultimodalMisinformationDetector
from ai_engine.xai.fusion_explainer import MultimodalXAIOrchestrator
from ai_engine.social_gnn.gnn_models import GATClassifier, GraphSAGEClassifier
from ai_engine.social_gnn.propagation import CascadePropagationAnalyzer
from app.api.v1.endpoints.social import get_social_macro_trends, simulate_social_cascade, predict_gnn_cascade_risk
from app.services.rag_service import VectorRAGService


def print_step(title: str):
    print("\n" + "=" * 70)
    print(f"▶ {title}")
    print("=" * 70)


def main():
    print("*" * 70)
    print("   BẮT ĐẦU CHẠY KIỂM THỬ END-TO-END TOÀN BỘ 8 GIAI ĐOẠN")
    print("*" * 70)

    db = SessionLocal()

    try:
        # 1. Cơ sở dữ liệu & Người dùng mẫu
        print_step("BƯỚC 1: Kiểm tra Cơ sở dữ liệu & Khởi tạo Tài khoản Test E2E")
        test_email = "e2e_verifier@sic.edu.vn"
        user = db.query(User).filter(User.email == test_email).first()
        if not user:
            user = User(
                email=test_email,
                username="e2e_verifier",
                hashed_password="e2e_hashed_password_mock",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        print(f"✔ Đã kết nối CSDL và xác thực Người dùng E2E (ID: {user.id}, Email: {user.email})")

        # 2. Học sâu Văn bản tiếng Việt (PhoBERT v2) & XAI SHAP
        print_step("BƯỚC 2: Kiểm thử PhoBERT v2 Fine-Tuned & Token Attribution SHAP")
        sample_fake_text = "Khẩn cấp: vỡ đập thủy điện sông Tranh, nước dâng ngập trắng xóa di tản ngay!"
        text_res = SingleModalPipelineService.analyze_text(
            db=db,
            user=user,
            text=sample_fake_text,
            title="Tin đồn vỡ đập sông Tranh",
        )
        print(f"✔ Nhãn dự đoán: {text_res.predicted_label}")
        print(f"✔ Độ tin cậy (Confidence): {int(text_res.confidence_score * 100)}%")
        print(f"✔ Số lượng Tokens Highlight: {len(text_res.tokens_highlight)}")
        print(f"✔ Top SHAP Values: {text_res.shap_values[:3] if text_res.shap_values else 'N/A'}")
        print(f"✔ Độ bất định suy luận (Uncertainty): {text_res.uncertainty_score}")
        assert text_res.predicted_label == "SAI_SU_THAT", "Lỗi dự đoán văn bản fake"
        assert text_res.confidence_score >= 0.70, "Độ tin cậy quá thấp"

        # 3. Vision Transformer (ViT) & Grad-CAM Heatmap
        print_step("BƯỚC 3: Kiểm thử Vision Transformer ViT & Grad-CAM Heatmap 196 Patches")
        mock_img = UploadFile(
            filename="fake_flood_photo.jpg",
            file=io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 150),
            headers={"content-type": "image/jpeg"},
        )
        img_res = SingleModalPipelineService.analyze_image(
            db=db,
            user=user,
            file=mock_img,
        )
        print(f"✔ Nhãn phân tích ảnh: {img_res.predicted_label}")
        print(f"✔ Số lượng patches Grad-CAM Heatmap: {len(img_res.heatmap_grid)}")
        print(f"✔ Kết luận Grad-CAM: {img_res.gradcam_conclusion[:100]}...")
        assert len(img_res.heatmap_grid) == 196, "Số lượng patch ViT phải là 196 (14x14)"

        # 4. Hợp nhất Đa phương thức (Multimodal Co-Attention & Inconsistency)
        print_step("BƯỚC 4: Kiểm thử Dung hợp Đa phương thức & Cross-Modal Inconsistency")
        multi_img = UploadFile(
            filename="mismatch_disaster.jpg",
            file=io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 120),
            headers={"content-type": "image/jpeg"},
        )
        multi_res = SingleModalPipelineService.analyze_multimodal(
            db=db,
            user=user,
            text=sample_fake_text,
            file=multi_img,
            title="Đa phương thức: Vỡ đập và ngập lụt",
        )
        print(f"✔ Dự đoán đa phương thức: {multi_res.predicted_label} (Tin cậy: {int(multi_res.confidence_score * 100)}%)")
        print(f"✔ Chỉ số mâu thuẫn chéo (Cross-Modal Inconsistency): {multi_res.cross_modal_inconsistency}")
        print(f"✔ Phân rã tỷ trọng phương thức (Modality Weights):")
        for m in multi_res.modality_contributions:
            print(f"    - {m.get('name')}: {int(m.get('weight', 0) * 100)}%")
        print(f"✔ Tóm tắt giải thích tự nhiên:\n{multi_res.summary_reasoning}")
        assert multi_res.predicted_label in ["SAI_SU_THAT", "GAY_HIEU_LAM"]

        # 5. Graph Neural Network (GAT) & Mô hình Dịch tễ SEIR
        print_step("BƯỚC 5: Kiểm thử Graph Attention Network (GAT) & Động lực học SEIR")
        gat = GATClassifier(in_features=32, hidden_dim=64, num_classes=3)
        gat_res = gat.predict_cascade_risk(num_nodes=30)
        print(f"✔ GAT Classification: {gat_res['predicted_label']} (Confidence: {gat_res['confidence_score']})")
        print(f"✔ Top nút quan trọng nhất (Influential KOL/Hubs): {gat_res['influential_nodes'][:3]}")

        analyzer = CascadePropagationAnalyzer()
        cascade_res = analyzer.analyze_cascade(
            caption_or_topic=sample_fake_text,
            initial_shares=180,
        )
        print(f"✔ Hệ số lây lan cơ bản R0: {cascade_res['reproduction_number_r0']}")
        print(f"✔ Tốc độ phát tán: {cascade_res['virality_speed']} nút/giờ (Mức độ: {cascade_res['risk_level']})")
        print(f"✔ Chỉ số Wiener (Structural Virality): {cascade_res['structural_virality']}")
        print(f"✔ Chuỗi thời gian 24h SEIR ({len(cascade_res['time_series_trend'])} mốc):")
        for pt in cascade_res["time_series_trend"]:
            print(f"    - Mốc {pt['time']}: {pt['fake']} lượt chia sẻ tin giả, {pt['real']} lượt tin xác thực")
        assert cascade_res["reproduction_number_r0"] > 1.0, "R0 phải > 1 đối với tin kích động"

        # 6. API Macro Trends
        print_step("BƯỚC 6: Kiểm thử API Giám sát Xu hướng Mạng xã hội")
        trends = get_social_macro_trends(time_range="7 ngày qua", platform="Tất cả nền tảng")
        print(f"✔ Tổng lượt tương tác: {trends['key_metrics']['total_interactions']:,}")
        print(f"✔ Tỷ lệ cảm xúc tiêu cực: {trends['key_metrics']['negative_sentiment_pct']}%")
        print(f"✔ Số lượng cụm tin nóng đang giám sát: {len(trends['monitored_clusters'])}")

        # 7. Fact-Checking Ground-Truth
        print_step("BƯỚC 7: Kiểm thử Tri thức Kiểm chứng Đối soát Báo chí (Ground Truth)")
        rag_res = VectorRAGService.verify_claim("Thông tin vỡ đê sông Hồng nước ngập nội thành", db=db)
        print(f"✔ Kết quả đối soát NLI: {rag_res.overall_verdict} (Số bài đối chứng: {len(rag_res.matched_evidences)})")
        if rag_res.matched_evidences:
            print(f"    - Bằng chứng 1: '{rag_res.matched_evidences[0].title}' ({rag_res.matched_evidences[0].source_name})")

        print("\n" + "*" * 70)
        print("   ✔ TẤT CẢ 7 BƯỚC KIỂM THỬ E2E TOÀN HỆ THỐNG ĐÃ VƯỢT QUA 100%!")
        print("*" * 70)

    finally:
        db.close()


if __name__ == "__main__":
    main()
