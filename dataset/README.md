# BỘ DỮ LIỆU ĐA PHƯƠNG THỨC FACEBOOK & TIKTOK (VIETNAMESE MULTIMODAL MISINFORMATION DATASET)

**Đề tài:** Học sâu đa phương thức có khả năng giải thích trong phát hiện thông tin sai lệch và phân tích tác động xã hội trên mạng xã hội Việt Nam  
**Phạm vi:** Facebook và TikTok  
**Ngôn ngữ:** Tiếng Việt  

---

## 1. Cấu Trúc Thư Mục Chuẩn Hóa

```text
dataset/
│
├── raw/                      # Dữ liệu thô thu thập ban đầu
│   ├── facebook/
│   └── tiktok/
│
├── processed/                # Dữ liệu đã làm sạch và chuẩn hóa schema
│   ├── posts.csv             # Bảng thông tin bài đăng
│   ├── images.csv            # Bảng thông tin ảnh và keyframe video
│   ├── comments.csv          # Bảng bình luận đã ẩn danh (PII removed)
│   └── engagement.csv        # Bảng chỉ số tương tác (views, likes, shares)
│
├── images/                   # Tệp tin hình ảnh và khung hình video
│   ├── facebook/             # Ảnh đính kèm bài viết Facebook
│   └── tiktok/               # Khung hình đại diện (Keyframes) video TikTok
│
├── labels/                   # Nhãn kiểm chứng và căn cứ khoa học
│   ├── labels.csv            # Nhãn 0, 1, 2
│   └── verification.csv      # Bằng chứng đối soát báo chí chính thống
│
└── splits/                   # Phân chia phục vụ huấn luyện (Train/Val/Test: 70/15/15)
    ├── train.csv             # Tập huấn luyện
    ├── validation.csv        # Tập kiểm định
    └── test.csv              # Tập đánh giá độc lập
```

---

## 2. Quy Định Định Nghĩa Nhãn (3-Class Labeling Schema)

| Nhãn | Tên gọi | Định nghĩa học thuật |
| :---: | :--- | :--- |
| **0** | **Đáng tin cậy (Reliable / True)** | Thông tin có căn cứ kiểm chứng, phù hợp với các nguồn chính thống (Báo chí, cơ quan quản lý). |
| **1** | **Thông tin sai lệch (Misinformation / Fake)** | Khẳng định thực tế bị bác bỏ, tin đồn thất thiệt, bóp méo ngữ cảnh hoặc cắt ghép hình ảnh. |
| **2** | **Chưa đủ căn cứ xác minh (Unverified)** | Thông tin chưa có đủ bằng chứng xác thực hoặc đính chính, tránh kết luận vội vã. |

---

## 3. Các Lệnh Quản Lý Pipeline Dữ Liệu

Chạy từ thư mục gốc của dự án:

```powershell
# 1. Khởi tạo và nạp mẫu chuẩn ban đầu:
python src/data_pipeline/init_dataset.py

# 2. Kiểm tra tính toàn vẹn (Schema, Khóa ngoại, Duplicate hash):
python src/data_pipeline/validator.py

# 3. Phân chia tập Train / Val / Test (70:15:15):
python src/data_pipeline/splitter.py

# 4. Xuất Báo cáo Thống kê Bộ dữ liệu:
python src/data_pipeline/stats.py
```

Báo cáo phân tích chi tiết được lưu tại: `reports/dataset_report.md`.
