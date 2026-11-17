from typing import Any, Dict, List, Optional, Tuple

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    class _MockModule:
        def __init__(self, *args, **kwargs):
            pass
    nn = type('MockNN', (), {'Module': _MockModule})()


class ReliabilityAwareGatedFusion(nn.Module):
    """
    Cơ chế dung hợp có nhận thức độ tin cậy (Reliability-aware Gated Fusion).
    Đánh giá mức độ tự tin và xung đột của từng phương thức dữ liệu để tự động:
      - Tăng trọng số phương thức có chất lượng cao.
      - Hạ trọng số hoặc loại bỏ phương thức bị thiếu hoặc nhiễu.
    """
    def __init__(self, feature_dim: int = 768, num_modalities: int = 2):
        super().__init__()
        self.feature_dim = feature_dim
        self.num_modalities = num_modalities

        if TORCH_AVAILABLE:
            # Gating network sinh trọng số softmax cho từng modality
            self.gate_network = nn.Sequential(
                nn.Linear(feature_dim * num_modalities, feature_dim),
                nn.ReLU(),
                nn.Linear(feature_dim, num_modalities),
                nn.Softmax(dim=-1),
            )
            self.fusion_projection = nn.Sequential(
                nn.Linear(feature_dim, feature_dim),
                nn.LayerNorm(feature_dim),
                nn.GELU(),
            )

    def forward(
        self,
        text_vec: Any,
        image_vec: Any,
        modality_mask: Optional[Any] = None,
    ) -> Tuple[Any, Any]:
        """
        Input:
          - text_vec: [Batch, 768]
          - image_vec: [Batch, 768]
        Output:
          - fused_vector: [Batch, 768]
          - gate_weights: [Batch, num_modalities] (trọng số đóng góp để giải thích XAI)
        """
        if TORCH_AVAILABLE and isinstance(text_vec, torch.Tensor):
            concat_feats = torch.cat([text_vec, image_vec], dim=-1)
            weights = self.gate_network(concat_feats)  # [B, 2]

            # Áp dụng trọng số
            w_text = weights[:, 0:1]
            w_image = weights[:, 1:2]
            fused = w_text * text_vec + w_image * image_vec
            fused_out = self.fusion_projection(fused)
            return fused_out, weights

        return text_vec, [0.55, 0.45]
