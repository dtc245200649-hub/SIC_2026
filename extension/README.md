# SIC 2026 Chrome Extension (Manifest V3)
## Tiện ích Phát hiện Tin giả trên Mạng Xã hội (TikTok & Facebook)

### 1. Giới thiệu
Tiện ích mở rộng chạy trên chuẩn Google Chrome Manifest V3, cho phép người dùng trực tiếp kiểm chứng tin giả khi lướt TikTok hoặc Facebook:
- Bôi đen văn bản trên bài viết -> Bấm chuột phải -> **"Kiểm chứng tin giả bằng SIC AI"**.
- Click chuột phải vào liên kết -> **"Kiểm chứng liên kết mạng xã hội với SIC AI"**.
- Mở popup trên thanh công cụ duyệt web để dán link phân tích ngay lập tức.
- Kết nối trực tiếp tới AI Core Backend của dự án qua API `http://127.0.0.1:8000/api/v1/social/analyze-url`.

---

### 2. Hướng dẫn cài đặt vào trình duyệt (Chỉ mất 30 giây)

1. Mở trình duyệt **Google Chrome** (hoặc **Microsoft Edge**, **Brave**).
2. Truy cập vào đường dẫn: `chrome://extensions` (Trên Edge là `edge://extensions`).
3. Bật công tắc **"Chế độ dành cho nhà phát triển" (Developer mode)** ở góc trên bên phải.
4. Bấm nút **"Tải tiện ích đã giải nén" (Load unpacked)** ở góc trên bên trái.
5. Chọn thư mục:
   ```
   D:\Download\SIC\DUANNHOM\extension
   ```
6. Tiện ích **SIC Misinformation Detector** sẽ xuất hiện trên thanh công cụ của trình duyệt và sẵn sàng hoạt động!
