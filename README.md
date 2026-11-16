# HỆ THỐNG PHÁT HIỆN THÔNG TIN SAI LỆCH ĐA PHƯƠNG THỨC TRÊN MẠNG XÃ HỘI VIỆT NAM
*(Explainable Multimodal Misinformation Detection & Social Impact Analysis)*

**Tác giả / GitHub:** [AQuan-kernox](https://github.com/AQuan-kernox)  
**Repository:** [https://github.com/AQuan-kernox/DUANSIC](https://github.com/AQuan-kernox/DUANSIC)  
**Đề tài:** Học sâu đa phương thức có khả năng giải thích trong phát hiện thông tin sai lệch và phân tích tác động xã hội trên mạng xã hội Việt Nam.

---

## 1. Giới thiệu tổng quan
Hệ thống là một nền tảng nghiên cứu kết hợp sản phẩm thực nghiệm hoàn chỉnh, có khả năng:
- **Xử lý Đa phương thức:** Tiếp nhận đồng thời Văn bản (Text), Hình ảnh (Image), Video (Keyframes), và Âm thanh (Audio).
- **Học sâu & Dung hợp (Multimodal Fusion):** PhoBERT (Text), Vision Transformer ViT (Image/Video), Whisper (Audio STT), kết hợp qua cơ chế Cross-modal Attention và Reliability-aware Gated Fusion.
- **Explainable AI (XAI):** Minh bạch hóa lý do dự đoán của mô hình qua Word Attribution, Visual Heatmap (Grad-CAM), và tỷ trọng đóng góp của từng phương thức.
- **Kiểm chứng thông tin (Fact-Checking):** Truy xuất bằng chứng từ kho tri thức báo chí chính thống và đối soát phát biểu qua Natural Language Inference (NLI).
- **Phân tích mạng xã hội (GNN):** Xây dựng đồ thị lan truyền và phân tích tác động, tốc độ lan truyền bằng Graph Neural Networks (PyG).

---

## 2. Cấu trúc thư mục dự án
```text
DUANNHOM/
├── backend/            # API Gateway & Logic nghiệp vụ (FastAPI, SQLAlchemy, Alembic)
├── ai_engine/          # Mô hình Học sâu, XAI, Fact-checking & GNN (PyTorch, PyG)
├── frontend/           # Giao diện người dùng (React, TypeScript, Vite, Tailwind CSS)
├── data/               # Dữ liệu mẫu kiểm thử, kho bằng chứng và đồ thị mô phỏng
├── docker-compose.yml  # Cấu hình containerization triển khai
└── README.md
```

---

## 3. Lộ trình phát triển (8 Giai đoạn)
- [x] **Giai đoạn 1: Khởi tạo** (Thiết kế kiến trúc, cấu trúc thư mục, môi trường Git)
- [ ] **Giai đoạn 2: Backend & Database** (PostgreSQL, 17 Models, Auth JWT, Khóa tài khoản > 5 lần)
- [ ] **Giai đoạn 3: Frontend** (React + Vite + Tailwind, 12 trang chức năng)
- [ ] **Giai đoạn 4: AI Cơ bản** (PhoBERT, ViT, Keyframe Extraction, Whisper STT)
- [ ] **Giai đoạn 5: AI Đa phương thức** (Cross-Modal Attention, Reliability-aware Fusion)
- [ ] **Giai đoạn 6: XAI & Fact-Checking** (Giải thích mô hình, Đối soát NLI)
- [ ] **Giai đoạn 7: GNN & Lan truyền xã hội** (Cây lan truyền, GraphSAGE/GAT)
- [ ] **Giai đoạn 8: Hoàn thiện & Docker** (Đóng gói Docker Compose, Test E2E)
