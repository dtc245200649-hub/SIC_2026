# Kho Dữ Liệu Nghiên Cứu & Thực Nghiệm (Research Benchmarks)

Thư mục lưu trữ và quản lý các bộ dữ liệu đã qua thẩm định khoa học phục vụ bài toán:
1. Phát hiện tin giả tiếng Việt đa phương thức.
2. Đối soát tri thức với báo chí chính thống (Ground Truth Fact-Checking).
3. Phân tích cảm xúc & bình luận mạng xã hội.

---

## 1. Các bộ dữ liệu Benchmark (Học thuật)

### 1.1. ViFactCheck (`tranthaihoa/vifactcheck`)
- **Tổ chức / Xuất bản:** AAAI 2024 / Hugging Face.
- **Quy mô:** Hơn 7.200 cặp Tuyên bố (Claim) - Bằng chứng đối soát (Evidence).
- **Lĩnh vực:** 12 chủ đề tin tức tiếng Việt (Y tế, Đời sống, Pháp luật, Khí tượng...).
- **Gán nhãn:** Chuyên gia thẩm định theo tiêu chuẩn Fact-Checking quốc tế (`SUPPORTS`, `REFUTES`, `NEI`).

### 1.2. UIT-VSMEC (`tridm/UIT-VSMEC`)
- **Tổ chức / Xuất bản:** Trường ĐH Công nghệ Thông tin - ĐHQG TP.HCM (UIT NLP Group).
- **Quy mô:** Hơn 6.900 bình luận Facebook tiếng Việt.
- **Gán nhãn:** 7 sắc thái cảm xúc (*Enjoyment, Sadness, Fear, Anger, Disgust, Surprise, Other*).
- **Mục đích:** Đánh giá phản ứng tâm lý và mức độ hoang mang cộng đồng khi tiếp nhận thông tin.

---

## 2. Quy trình Thu thập Mẫu Công khai có kiểm soát (Facebook & TikTok)

Áp dụng cho các sự kiện mới phát sinh chưa kịp cập nhật vào benchmark:
1. **Xác định chủ đề:** Thiên tai, y tế, cảnh báo lừa đảo tài chính.
2. **Nguồn công khai:** Fanpage chính thống cơ quan chức năng, báo chí, tài khoản công khai.
3. **Nguồn kiểm chứng:** Bắt buộc có link bài báo chính thống hoặc thông cáo xử phạt từ Bộ TTTT / Cục ATTT.
4. **Ẩn danh hóa (PII):** Toàn bộ tên người dùng, khuôn mặt không liên quan, số điện thoại đều được mã hóa/làm mờ trước khi đưa vào huấn luyện.
