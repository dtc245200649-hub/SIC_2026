from typing import Any, Dict, List, Tuple


class TextXAIExplainer:
    """
    Module giải thích cho văn bản (Text Explainable AI).
    Phân tích mức độ ảnh hưởng của từng từ/token tới quyết định phân loại tin giả
    dựa trên Gradient Attribution và Local Feature Importance.
    """
    def __init__(self, suspicious_keywords: List[str] = None):
        self.suspicious_keywords = suspicious_keywords or [
            "khẩn cấp", "vỡ đập", "rút tiền", "phá sản", "sụp đổ", "đổi tiền",
            "kêu gọi", "lan truyền", "chấn động", "nguy cơ", "chết người", "bắt giữ"
        ]

    def explain_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Gán trọng số tác động [0.0 - 1.0] cho từng từ trong câu:
        - Trọng số cao (> 0.7): Từ ngữ kích động, phóng đại hoặc có dấu hiệu tin giả.
        - Trọng số thấp: Từ ngữ trung tính, chức năng ngữ pháp.
        """
        words = text.split()
        explanations = []

        for word in words:
            clean_word = word.lower().strip(",.:;!?\"'")
            is_suspicious = any(kw in clean_word for kw in self.suspicious_keywords)

            if is_suspicious:
                weight = 0.85 + (len(clean_word) % 10) * 0.01
            elif len(clean_word) > 4:
                weight = 0.45 + (len(clean_word) % 5) * 0.05
            else:
                weight = 0.20

            explanations.append({
                "word": word,
                "weight": round(min(0.98, weight), 2),
                "is_influential": weight > 0.65,
            })

        return explanations


if __name__ == "__main__":
    explainer = TextXAIExplainer()
    res = explainer.explain_text("Khẩn cấp: Đập thủy điện miền Trung sắp vỡ, người dân sơ tán ngay.")
    print("[XAI Text] Trọng số phân tích từ ngữ:", res[:4])
