from typing import Optional, Tuple, Any

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


class CrossModalAttention(nn.Module):
    """
    Cơ chế Cross-Modal Co-Attention hai chiều:
    - Text-to-Image Attention: Văn bản đối chiếu với các vùng ảnh tương ứng.
    - Image-to-Text Attention: Vùng ảnh đối chiếu với các từ ngữ mô tả.
    """
    def __init__(self, feature_dim: int = 768, num_heads: int = 8, dropout: float = 0.1):
        super().__init__()
        self.feature_dim = feature_dim
        self.num_heads = num_heads

        if TORCH_AVAILABLE:
            self.text_to_image_attn = nn.MultiheadAttention(
                embed_dim=feature_dim, num_heads=num_heads, dropout=dropout, batch_first=True
            )
            self.image_to_text_attn = nn.MultiheadAttention(
                embed_dim=feature_dim, num_heads=num_heads, dropout=dropout, batch_first=True
            )
            self.norm_text = nn.LayerNorm(feature_dim)
            self.norm_image = nn.LayerNorm(feature_dim)

    def forward(
        self,
        text_seq: Any,
        image_patches: Any,
    ) -> Tuple[Any, Any]:
        """
        Input:
          - text_seq: [Batch, Seq_Len, 768]
          - image_patches: [Batch, 197, 768]
        Output:
          - text_attended: [Batch, Seq_Len, 768]
          - image_attended: [Batch, 197, 768]
        """
        if TORCH_AVAILABLE and isinstance(text_seq, torch.Tensor):
            t_attn, _ = self.text_to_image_attn(query=text_seq, key=image_patches, value=image_patches)
            t_out = self.norm_text(text_seq + t_attn)

            i_attn, _ = self.image_to_text_attn(query=image_patches, key=text_seq, value=text_seq)
            i_out = self.norm_image(image_patches + i_attn)

            return t_out, i_out

        return text_seq, image_patches
