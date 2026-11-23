# BÁO CÁO THỐNG KÊ BỘ DỮ LIỆU NGHIÊN CỨU

**Tên đề tài:** Học sâu đa phương thức có khả năng giải thích trong phát hiện thông tin sai lệch và phân tích tác động xã hội trên mạng xã hội Việt Nam  
**Ngày cập nhật:** 22/11/2026 04:00:05  
**Mục tiêu quy mô giai đoạn 1:** 2.000 mẫu (Facebook: 1.000, TikTok: 1.000)  

---

## 1. TỔNG QUAN BỘ DỮ LIỆU HIỆN TẠI

| Chỉ số | Số lượng ghi nhận | Ghi chú |
| :--- | :--- | :--- |
| **Tổng số mẫu bài đăng (posts)** | **4** | Thu thập từ nguồn công khai hợp lệ & đối soát |
| **Số lượng hình ảnh / keyframe (images)** | **4** | Đạt tỷ lệ đa phương thức 100.0% |
| **Số lượng bình luận đã ẩn danh (comments)**| **10** | Đã loại bỏ hoàn toàn thông tin cá nhân (PII) |
| **Tập Huấn luyện (Train Split)** | **4** | Tỷ lệ ~70% |
| **Tập Kiểm định (Validation Split)** | **0** | Tỷ lệ ~15% |
| **Tập Đánh giá (Test Split)** | **0** | Tỷ lệ ~15% |

---

## 2. PHÂN BỐ THEO NỀN TẢNG (PLATFORM DISTRIBUTION)

| Nền tảng | Số lượng mẫu | Tỷ trọng |
| :--- | :--- | :--- |
| **Facebook** | 2 | 50.0% |
| **TikTok** | 2 | 50.0% |

---

## 3. PHÂN BỐ NHÃN KIỂM CHỨNG (GROUND TRUTH LABELS)

Tuân thủ nguyên tắc 3 nhãn chuẩn học thuật:

| Mã nhãn | Ý nghĩa học thuật | Số lượng mẫu | Tỷ lệ |
| :--- | :--- | :--- | :--- |
| **LABEL 0** | **Đáng tin cậy (Reliable / True)** | 1 | 25.0% |
| **LABEL 1** | **Thông tin sai lệch (Misinformation / Fake)** | 2 | 50.0% |
| **LABEL 2** | **Chưa đủ căn cứ xác minh (Unverified)** | 1 | 25.0% |

---

## 4. PHÂN BỐ THEO CHỦ ĐỀ NGHIÊN CỨU (TOPICS)

| Chủ đề | Số lượng mẫu | Mô tả |
| :--- | :--- | :--- |
| `disaster` | 2 | Thiên tai, bão lũ, vỡ đê, thời tiết cực đoan |
| `health` | 1 | Y tế, phòng chống dịch bệnh, thuốc và chữa bệnh phản khoa học |
| `economy` | 1 | Doanh nghiệp, thị trường giá cả, lừa đảo tài chính |
| `social` | 0 | Đời sống xã hội, sự kiện công cộng |
| `education`| 0 | Tuyển sinh, thi cử, chính sách giáo dục |
| `technology`| 0 | AI, công nghệ số, deepfake |

---

## 5. THỐNG KÊ CẢM XÚC BÌNH LUẬN (SENTIMENT & EMOTION)

Thống kê trên 10 bình luận mạng xã hội phục vụ phân tích tác động cộng đồng:

| Sắc thái cảm xúc | Số lượng | Tỷ lệ |
| :--- | :--- | :--- |
| **Phẫn nộ / Bất bình (Anger)** | 4 | 40.0% |
| **Hoang mang / Lo sợ (Fear)** | 2 | 20.0% |
| **Vui mừng / Yên tâm (Enjoyment)** | 1 | 10.0% |
| **Trung tính / Khác (Neutral/Other)** | 3 | 30.0% |

---

## 6. ĐẢM BẢO CHẤT LƯỢNG VÀ ĐẠO ĐỨC NGHIÊN CỨU

1. **Khử danh tính (Anonymization):** 100% tài khoản người dùng bình luận đã được loại bỏ thông tin nhận dạng cá nhân (PII).
2. **Căn cứ kiểm chứng:** Toàn bộ mẫu có nhãn `0` và `1` đều có đường dẫn tham chiếu bài viết đính chính / xác thực từ Báo Tuổi Trẻ, Báo VnExpress, Báo Sức khỏe & Đời sống (Bộ Y tế) và Trung tâm KTTV Quốc gia.
3. **Phân chia không rò rỉ (No Data Leakage):** Không có bài đăng nào trùng lặp hoặc xuất hiện đồng thời ở cả hai tập Train và Test.
