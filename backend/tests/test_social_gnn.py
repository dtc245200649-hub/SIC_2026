from ai_engine.social_gnn.gnn_models import GATClassifier, GraphSAGEClassifier
from ai_engine.social_gnn.propagation import CascadePropagationAnalyzer
from app.api.v1.endpoints.social import (
    get_social_macro_trends,
    simulate_social_cascade,
    predict_gnn_cascade_risk,
)


def test_gat_classifier_direct():
    """Kiểm tra mô hình Graph Attention Network (GAT) trực tiếp."""
    gat = GATClassifier(in_features=32, hidden_dim=64, num_classes=3)
    res = gat.predict_cascade_risk(num_nodes=20)

    assert res["model_type"] == "Graph Attention Network (GAT)"
    assert res["predicted_label"] in ["CHINH_XAC", "GAY_HIEU_LAM", "SAI_SU_THAT"]
    assert 0.0 <= res["confidence_score"] <= 1.0
    assert len(res["class_probabilities"]) == 3
    assert len(res["influential_nodes"]) >= 1
    assert res["total_nodes_analyzed"] == 20


def test_graphsage_classifier_direct():
    """Kiểm tra mô hình GraphSAGE trực tiếp."""
    import torch
    sage = GraphSAGEClassifier(in_features=16, hidden_dim=32, num_classes=3)
    x = torch.randn(10, 16)
    adj = torch.eye(10)
    for i in range(1, 10):
        adj[0, i] = 1.0
        adj[i, 0] = 1.0

    probs = sage(x, adj)
    assert probs.shape == (1, 3)
    assert round(float(torch.sum(probs.detach())), 2) == 1.0


def test_cascade_seir_simulation():
    """Kiểm tra mô phỏng dịch tễ mạng xã hội SEIR."""
    analyzer = CascadePropagationAnalyzer()
    res = analyzer.analyze_cascade(
        caption_or_topic="Khẩn cấp: vỡ đập thủy điện sông Tranh nước ngập biển người",
        initial_shares=150,
    )

    assert res["reproduction_number_r0"] >= 1.5
    assert res["virality_speed"] > 100.0
    assert res["cascade_depth"] >= 5
    assert res["structural_virality"] > 2.0
    assert res["risk_level"] == "CAO"
    assert len(res["time_series_trend"]) >= 4

    first_pt = res["time_series_trend"][0]
    assert "fake" in first_pt
    assert "real" in first_pt
    assert "hour" in first_pt


def test_api_social_trends_endpoint():
    """Kiểm tra endpoint GET /api/v1/social/trends."""
    data = get_social_macro_trends(time_range="7 ngày qua", platform="Tất cả nền tảng")

    assert "key_metrics" in data
    assert data["key_metrics"]["total_interactions"] == 482910
    assert "viral_trend_data" in data
    assert len(data["viral_trend_data"]) >= 4
    assert "monitored_clusters" in data
    assert len(data["monitored_clusters"]) == 3
    assert "sentiment_distribution" in data


def test_api_simulate_cascade_endpoint():
    """Kiểm tra endpoint POST /api/v1/social/simulate-cascade."""
    data = simulate_social_cascade(
        topic="Tin vỡ đồn rút tiền ngân hàng",
        initial_shares=200,
    )

    assert "reproduction_number_r0" in data
    assert data["reproduction_number_r0"] > 1.0
    assert "virality_speed" in data
    assert "cascade_depth" in data
    assert "time_series_trend" in data


def test_api_gnn_predict_endpoint():
    """Kiểm tra endpoint POST /api/v1/social/gnn-predict."""
    data = predict_gnn_cascade_risk(num_nodes=25)

    assert data["model_type"] == "Graph Attention Network (GAT)"
    assert data["predicted_label"] in ["CHINH_XAC", "GAY_HIEU_LAM", "SAI_SU_THAT"]
    assert data["total_nodes_analyzed"] == 25
    assert len(data["influential_nodes"]) > 0
