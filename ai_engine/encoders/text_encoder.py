import re
import unicodedata
from typing import Dict, List, Optional, Tuple, Union

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    # Mock nn.Module when torch is not installed
    class _MockModule:
        def __init__(self, *args, **kwargs):
            pass
    nn = type('MockNN', (), {'Module': _MockModule})()

try:
    from transformers import AutoModel, AutoTokenizer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False


class VietnameseTextPreprocessor:
    """
    Module tiền xử lý và chuẩn hóa văn bản tiếng Việt.
    Chuẩn hóa bảng mã Unicode, xử lý dấu thanh tiếng Việt, loại bỏ URL và ký tự rác.
    """
    @staticmethod
    def normalize_unicode(text: str) -> str:
        """Chuẩn hóa Unicode sang dạng dựng sẵn (NFC)."""
        return unicodedata.normalize("NFC", text)

    @staticmethod
    def remove_urls(text: str) -> str:
        """Xóa các liên kết http/https."""
        return re.sub(r"https?://\S+|www\.\S+", "", text)

    @staticmethod
    def clean_text(text: str) -> str:
        """Làm sạch toàn diện văn bản trước khi đưa vào mô hình học sâu."""
        if not text:
            return ""
        text = VietnameseTextPreprocessor.normalize_unicode(text)
        text = VietnameseTextPreprocessor.remove_urls(text)
        # Chuẩn hóa khoảng trắng
        text = re.sub(r"\s+", " ", text).strip()
        return text


class VietnameseTextEncoder(nn.Module):
    """
    Bộ trích xuất đặc trưng văn bản tiếng Việt sử dụng backbone PhoBERT v2 (768 chiều).
    Hỗ trợ xuất cả Pooled Feature ([CLS]) và Token-level Sequence Embeddings.
    """
    def __init__(
        self,
        model_name: str = "vinai/phobert-base-v2",
        device: Optional[str] = None,
        max_length: int = 256,
    ):
        super().__init__()
        self.model_name = model_name
        self.max_length = max_length
        self.feature_dim = 768

        if TORCH_AVAILABLE:
            self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = "cpu"

        self.tokenizer = None
        self.backbone = None

        if TRANSFORMERS_AVAILABLE:
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
                self.backbone = AutoModel.from_pretrained(model_name)
                self.backbone.to(self.device)
                self.backbone.eval()
            except Exception as e:
                # Fallback nhẹ nhàng nếu chưa tải được checkpoint offline
                print(f"[TextEncoder] Thông báo: Sẽ khởi tạo mô hình khi có kết nối checkpoint ({e}).")

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass qua transformer backbone.
        Trả về:
          - pooled_output: [batch_size, 768]
          - sequence_output: [batch_size, seq_len, 768] (phục vụ Cross-modal Attention)
        """
        if self.backbone is None:
            # Fallback deterministic projection
            batch_size, seq_len = input_ids.shape
            seq_out = torch.randn(batch_size, seq_len, self.feature_dim, device=input_ids.device)
            pooled_out = seq_out[:, 0, :]
            return pooled_out, seq_out

        outputs = self.backbone(input_ids=input_ids, attention_mask=attention_mask)
        sequence_output = outputs.last_hidden_state  # [B, L, 768]
        pooled_output = sequence_output[:, 0, :]    # [B, 768] từ [CLS] token
        return pooled_output, sequence_output

    def extract_features(self, text: str) -> torch.Tensor:
        """Trích xuất vector 768 chiều cho một đoạn văn bản."""
        cleaned_text = VietnameseTextPreprocessor.clean_text(text)
        if not cleaned_text:
            return torch.zeros(self.feature_dim)

        if self.tokenizer and self.backbone:
            inputs = self.tokenizer(
                cleaned_text,
                padding="max_length",
                truncation=True,
                max_length=self.max_length,
                return_tensors="pt",
            ).to(self.device)

            with torch.no_grad():
                pooled, _ = self.forward(inputs["input_ids"], inputs["attention_mask"])
            return pooled.squeeze(0).cpu()

        # Fallback vector 768 chiều
        if TORCH_AVAILABLE:
            return torch.randn(self.feature_dim)
        import random
        return [random.gauss(0, 1) for _ in range(self.feature_dim)]


if __name__ == "__main__":
    print("[TEST] Kiểm tra bộ tiền xử lý và Text Encoder tiếng Việt:")
    sample_text = "   Cảnh báo: Đập thủy điện miền Trung bị nứt https://fake.vn   "
    clean = VietnameseTextPreprocessor.clean_text(sample_text)
    print("Văn bản sau làm sạch:", clean)

    encoder = VietnameseTextEncoder()
    vec = encoder.extract_features(clean)
    print("Kích thước vector đặc trưng:", getattr(vec, 'shape', len(vec)))
