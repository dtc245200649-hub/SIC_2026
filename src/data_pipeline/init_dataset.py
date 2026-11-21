"""
Hệ thống Khởi tạo & Quản lý Bộ dữ liệu Đa phương thức Facebook & TikTok.
Đề tài: Học sâu đa phương thức có khả năng giải thích trong phát hiện thông tin sai lệch
        và phân tích tác động xã hội trên mạng xã hội Việt Nam.
"""

import os
import csv
import json
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

POSTS_FILE = os.path.join(DATASET_DIR, "processed", "posts.csv")
IMAGES_FILE = os.path.join(DATASET_DIR, "processed", "images.csv")
COMMENTS_FILE = os.path.join(DATASET_DIR, "processed", "comments.csv")
ENGAGEMENT_FILE = os.path.join(DATASET_DIR, "processed", "engagement.csv")
LABELS_FILE = os.path.join(DATASET_DIR, "labels", "labels.csv")
VERIFICATION_FILE = os.path.join(DATASET_DIR, "labels", "verification.csv")

POSTS_HEADERS = [
    "sample_id",
    "platform",
    "post_id",
    "content",
    "caption",
    "created_time",
    "source_url",
    "topic",
    "collection_time",
]

IMAGES_HEADERS = [
    "image_id",
    "sample_id",
    "image_path",
    "image_type",
    "image_format",
    "image_width",
    "image_height",
    "ocr_text",
    "image_hash",
]

COMMENTS_HEADERS = [
    "comment_id",
    "sample_id",
    "comment_text",
    "comment_time",
    "sentiment_label",
]

ENGAGEMENT_HEADERS = [
    "sample_id",
    "views",
    "likes",
    "shares",
    "comments_count",
    "reactions_count",
    "snapshot_time",
]

LABELS_HEADERS = [
    "sample_id",
    "label",
    "annotation_status",
    "annotator_id",
    "confidence",
    "annotation_time",
]

VERIFICATION_HEADERS = [
    "sample_id",
    "verification_source",
    "verification_url",
    "verification_reason",
    "evidence_status",
    "verification_time",
]


# Mẫu dữ liệu thực tế chuẩn hóa ban đầu (Đã xác minh qua báo chí chính thống)
INITIAL_SAMPLES = [
    # 1. FACEBOOK - SAI LỆCH (LABEL 1) - THIÊN TAI
    {
        "post": {
            "sample_id": "FB_00001",
            "platform": "Facebook",
            "post_id": "fb_post_984210412",
            "content": "KHẨN CẤP: Đê sông Hồng đoạn qua nội thành vừa bị vỡ lúc 5h sáng nay, nước ngập trắng xóa cả tuyến phố lớn. Mọi người chia sẻ gấp để người dân sơ tán ngay!!!",
            "caption": "Hình ảnh ngập lụt kinh hoàng tại Hà Nội sáng nay.",
            "created_time": "2024-09-11 05:45:00",
            "source_url": "https://facebook.com/public_group/posts/984210412",
            "topic": "disaster",
            "collection_time": "2024-09-11 07:30:00",
        },
        "image": {
            "image_id": "IMG_FB_00001_01",
            "sample_id": "FB_00001",
            "image_path": "dataset/images/facebook/FB_00001.jpg",
            "image_type": "IMAGE",
            "image_format": "jpg",
            "image_width": 1280,
            "image_height": 720,
            "ocr_text": "CẢNH BÁO VỠ ĐÊ NỘI THÀNH SƠ TÁN KHẨN CẤP",
            "image_hash": "a1f8c4e2b9d07311",
        },
        "comments": [
            {"comment_id": "CMT_FB_00001_01", "sample_id": "FB_00001", "comment_text": "Mọi người ở mạn cầu Long Biên cẩn thận nước lên nhanh quá", "comment_time": "2024-09-11 06:10:00", "sentiment_label": "fear"},
            {"comment_id": "CMT_FB_00001_02", "sample_id": "FB_00001", "comment_text": "Báo đài đã đính chính không có chuyện vỡ đê đâu, đừng chia sẻ bậy bạ", "comment_time": "2024-09-11 06:45:00", "sentiment_label": "anger"},
            {"comment_id": "CMT_FB_00001_03", "sample_id": "FB_00001", "comment_text": "Lại tin giả câu view rồi, công an sắp phạt tới nơi", "comment_time": "2024-09-11 07:05:00", "sentiment_label": "anger"},
        ],
        "engagement": {
            "sample_id": "FB_00001",
            "views": 0,
            "likes": 2450,
            "shares": 1842,
            "comments_count": 380,
            "reactions_count": 4200,
            "snapshot_time": "2024-09-11 08:00:00",
        },
        "label": {
            "sample_id": "FB_00001",
            "label": 1,  # 1: Sai lệch
            "annotation_status": "verified",
            "annotator_id": "ANN_01",
            "confidence": 0.98,
            "annotation_time": "2024-09-11 09:00:00",
        },
        "verification": {
            "sample_id": "FB_00001",
            "verification_source": "Báo Tuổi Trẻ & Ban Chỉ huy PCTT Hà Nội",
            "verification_url": "https://tuoitre.vn/ha-noi-khang-dinh-khong-co-chuyen-vo-de-song-hong-2024091110251812.htm",
            "verification_reason": "Ban Chỉ huy Phòng chống thiên tai khẳng định các tuyến đê sông Hồng vẫn an toàn, bức ảnh đính kèm là trận lụt đô thị cũ năm 2021 bị cắt ghép.",
            "evidence_status": "REFUTES",
            "verification_time": "2024-09-11 10:30:00",
        },
    },

    # 2. FACEBOOK - ĐÁNG TIN CẬY (LABEL 0) - THỜI TIẾT / XÃ HỘI
    {
        "post": {
            "sample_id": "FB_00002",
            "platform": "Facebook",
            "post_id": "fb_post_110294823",
            "content": "Trung tâm Dự báo Khí tượng Thủy văn Quốc gia phát đi bản tin: Áp thấp nhiệt đới gây mưa rải rác tại các tỉnh Bắc Bộ trong 24 giờ tới, người dân cần chú ý các vùng trũng thấp.",
            "caption": "Bản đồ phân bố lượng mưa vệ tinh từ Trung tâm KTTV Quốc gia.",
            "created_time": "2024-09-12 08:00:00",
            "source_url": "https://facebook.com/kttvquocgia/posts/110294823",
            "topic": "disaster",
            "collection_time": "2024-09-12 10:00:00",
        },
        "image": {
            "image_id": "IMG_FB_00002_01",
            "sample_id": "FB_00002",
            "image_path": "dataset/images/facebook/FB_00002.jpg",
            "image_type": "IMAGE",
            "image_format": "jpg",
            "image_width": 1024,
            "image_height": 768,
            "ocr_text": "BẢN ĐỒ VỆ TINH LƯỢNG MƯA TRUNG TÂM KTTV QUỐC GIA",
            "image_hash": "f4e1c2a8b3d76501",
        },
        "comments": [
            {"comment_id": "CMT_FB_00002_01", "sample_id": "FB_00002", "comment_text": "Cảm ơn bản tin kịp thời của cơ quan khí tượng", "comment_time": "2024-09-12 08:30:00", "sentiment_label": "enjoyment"},
            {"comment_id": "CMT_FB_00002_02", "sample_id": "FB_00002", "comment_text": "Khu vực nhà mình sáng nay đã bắt đầu ngớt mưa rồi", "comment_time": "2024-09-12 09:15:00", "sentiment_label": "neutral"},
        ],
        "engagement": {
            "sample_id": "FB_00002",
            "views": 0,
            "likes": 5600,
            "shares": 890,
            "comments_count": 140,
            "reactions_count": 6200,
            "snapshot_time": "2024-09-12 12:00:00",
        },
        "label": {
            "sample_id": "FB_00002",
            "label": 0,  # 0: Đáng tin cậy
            "annotation_status": "verified",
            "annotator_id": "ANN_01",
            "confidence": 0.99,
            "annotation_time": "2024-09-12 11:00:00",
        },
        "verification": {
            "sample_id": "FB_00002",
            "verification_source": "Trung tâm Dự báo KTTV Quốc gia & Báo VnExpress",
            "verification_url": "https://vnexpress.net/thoi-tiet-bac-bo-ap-thap-nhiet-doi-4791024.html",
            "verification_reason": "Bản tin chính thức từ cơ quan quản lý chuyên ngành, dữ liệu vệ tinh khí tượng khớp hoàn toàn với số liệu quan trắc thực tế.",
            "evidence_status": "SUPPORTS",
            "verification_time": "2024-09-12 11:30:00",
        },
    },

    # 3. TIKTOK - SAI LỆCH (LABEL 1) - Y TẾ
    {
        "post": {
            "sample_id": "TT_00001",
            "platform": "TikTok",
            "post_id": "tt_video_738491029481",
            "content": "Chấn động: Uống nước lá đu đủ kết hợp sả tươi đun sôi có thể tiêu diệt 100% tế bào ung thư sau 7 ngày điều trị, không cần phải xạ trị tốn kém!",
            "caption": "Bí quyết chữa ung thư thần kỳ ai cũng làm được #suckhoe #chuabenhdangian #ungthu",
            "created_time": "2024-09-18 19:30:00",
            "source_url": "https://tiktok.com/@user_health_tips/video/738491029481",
            "topic": "health",
            "collection_time": "2024-09-19 09:00:00",
        },
        "image": {
            "image_id": "IMG_TT_00001_01",
            "sample_id": "TT_00001",
            "image_path": "dataset/images/tiktok/TT_00001_kf01.jpg",
            "image_type": "KEYFRAME",
            "image_format": "jpg",
            "image_width": 1080,
            "image_height": 1920,
            "ocr_text": "UỐNG NƯỚC LÁ ĐU ĐỦ TIÊU DIỆT 100% TẾ BÀO UNG THƯ",
            "image_hash": "c8b4e192f03d65a2",
        },
        "comments": [
            {"comment_id": "CMT_TT_00001_01", "sample_id": "TT_00001", "comment_text": "Bác sĩ Bệnh viện K vừa cảnh báo đừng làm theo nguy hiểm tính mạng", "comment_time": "2024-09-18 20:10:00", "sentiment_label": "anger"},
            {"comment_id": "CMT_TT_00001_02", "sample_id": "TT_00001", "comment_text": "Có thật không ạ, người nhà em đang điều trị xạ trị mệt mỏi quá", "comment_time": "2024-09-18 21:00:00", "sentiment_label": "fear"},
            {"comment_id": "CMT_TT_00001_03", "sample_id": "TT_00001", "comment_text": "Đừng tin lang băm, bỏ viện là mất mạng đấy mọi người", "comment_time": "2024-09-18 22:30:00", "sentiment_label": "anger"},
        ],
        "engagement": {
            "sample_id": "TT_00001",
            "views": 284000,
            "likes": 18200,
            "shares": 6450,
            "comments_count": 1280,
            "reactions_count": 21000,
            "snapshot_time": "2024-09-19 12:00:00",
        },
        "label": {
            "sample_id": "TT_00001",
            "label": 1,  # 1: Sai lệch
            "annotation_status": "verified",
            "annotator_id": "ANN_02",
            "confidence": 0.99,
            "annotation_time": "2024-09-19 14:00:00",
        },
        "verification": {
            "sample_id": "TT_00001",
            "verification_source": "Báo Sức khỏe & Đời sống (Bộ Y tế) & Bệnh viện K",
            "verification_url": "https://suckhoedoisong.vn/thuc-hu-uong-nuoc-la-du-du-chua-khoi-ung-thu-169210924141209825.htm",
            "verification_reason": "Bộ Y tế khẳng định không có cơ sở khoa học chứng minh lá đu đủ chữa khỏi ung thư, việc tự ý bỏ viện điều trị dẫn đến nguy cơ tử vong nhanh chóng.",
            "evidence_status": "REFUTES",
            "verification_time": "2024-09-19 15:30:00",
        },
    },

    # 4. TIKTOK - CHƯA ĐỦ CĂN CỨ XÁC MINH (LABEL 2) - KINH TẾ / XÃ HỘI
    {
        "post": {
            "sample_id": "TT_00002",
            "platform": "TikTok",
            "post_id": "tt_video_819204918231",
            "content": "Xuất hiện thông tin một chuỗi siêu thị lớn sắp ngừng hoạt động tại miền Trung do tái cấu trúc nợ từ công ty mẹ ở nước ngoài.",
            "caption": "Tin đồn thương vụ bán lẻ hay sự thật? Đang chờ thông cáo chính thức #kinhte #thitruong #tintuc",
            "created_time": "2024-10-05 14:20:00",
            "source_url": "https://tiktok.com/@finance_observer/video/819204918231",
            "topic": "economy",
            "collection_time": "2024-10-05 16:00:00",
        },
        "image": {
            "image_id": "IMG_TT_00002_01",
            "sample_id": "TT_00002",
            "image_path": "dataset/images/tiktok/TT_00002_kf01.jpg",
            "image_type": "KEYFRAME",
            "image_format": "jpg",
            "image_width": 1080,
            "image_height": 1920,
            "ocr_text": "TIN ĐỒN CHUỖI SIÊU THỊ RÚT KHỎI THỊ TRƯỜNG",
            "image_hash": "b2c9d8a1f4e30718",
        },
        "comments": [
            {"comment_id": "CMT_TT_00002_01", "sample_id": "TT_00002", "comment_text": "Chưa thấy tập đoàn ra thông báo gì, mọi người đừng hoang mang", "comment_time": "2024-10-05 15:00:00", "sentiment_label": "neutral"},
            {"comment_id": "CMT_TT_00002_02", "sample_id": "TT_00002", "comment_text": "Hôm qua mình đi mua sắm thấy kệ hàng vẫn đầy đủ bình thường", "comment_time": "2024-10-05 15:45:00", "sentiment_label": "neutral"},
        ],
        "engagement": {
            "sample_id": "TT_00002",
            "views": 45000,
            "likes": 1200,
            "shares": 450,
            "comments_count": 190,
            "reactions_count": 1800,
            "snapshot_time": "2024-10-05 18:00:00",
        },
        "label": {
            "sample_id": "TT_00002",
            "label": 2,  # 2: Chưa đủ căn cứ xác minh
            "annotation_status": "pending",
            "annotator_id": "ANN_01",
            "confidence": 0.70,
            "annotation_time": "2024-10-05 19:00:00",
        },
        "verification": {
            "sample_id": "TT_00002",
            "verification_source": "Chưa có thông cáo chính thức",
            "verification_url": "",
            "verification_reason": "Chưa có thông tin xác nhận hoặc bác bỏ từ doanh nghiệp và các sở công thương liên quan.",
            "evidence_status": "NOT_ENOUGH_INFO",
            "verification_time": "2024-10-05 20:00:00",
        },
    },
]


def create_csv_if_missing(file_path: str, headers: list):
    """Tạo tệp CSV với headers nếu chưa tồn tại."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()


def seed_initial_dataset():
    """Khởi tạo toàn bộ bộ khung CSV và nạp các mẫu chuẩn hóa ban đầu."""
    print("[*] Đang khởi tạo bộ khung dữ liệu nghiên cứu...")

    create_csv_if_missing(POSTS_FILE, POSTS_HEADERS)
    create_csv_if_missing(IMAGES_FILE, IMAGES_HEADERS)
    create_csv_if_missing(COMMENTS_FILE, COMMENTS_HEADERS)
    create_csv_if_missing(ENGAGEMENT_FILE, ENGAGEMENT_HEADERS)
    create_csv_if_missing(LABELS_FILE, LABELS_HEADERS)
    create_csv_if_missing(VERIFICATION_FILE, VERIFICATION_HEADERS)

    # Đọc existing sample_ids để tránh trùng lặp
    existing_ids = set()
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("sample_id"):
                existing_ids.add(row["sample_id"])

    # Ghi mẫu mới
    new_count = 0
    with open(POSTS_FILE, "a", newline="", encoding="utf-8") as f_post, \
         open(IMAGES_FILE, "a", newline="", encoding="utf-8") as f_img, \
         open(COMMENTS_FILE, "a", newline="", encoding="utf-8") as f_cmt, \
         open(ENGAGEMENT_FILE, "a", newline="", encoding="utf-8") as f_eng, \
         open(LABELS_FILE, "a", newline="", encoding="utf-8") as f_lbl, \
         open(VERIFICATION_FILE, "a", newline="", encoding="utf-8") as f_ver:

        post_w = csv.DictWriter(f_post, fieldnames=POSTS_HEADERS)
        img_w = csv.DictWriter(f_img, fieldnames=IMAGES_HEADERS)
        cmt_w = csv.DictWriter(f_cmt, fieldnames=COMMENTS_HEADERS)
        eng_w = csv.DictWriter(f_eng, fieldnames=ENGAGEMENT_HEADERS)
        lbl_w = csv.DictWriter(f_lbl, fieldnames=LABELS_HEADERS)
        ver_w = csv.DictWriter(f_ver, fieldnames=VERIFICATION_HEADERS)

        for s in INITIAL_SAMPLES:
            sid = s["post"]["sample_id"]
            if sid in existing_ids:
                continue

            post_w.writerow(s["post"])
            img_w.writerow(s["image"])
            for cmt in s["comments"]:
                cmt_w.writerow(cmt)
            eng_w.writerow(s["engagement"])
            lbl_w.writerow(s["label"])
            ver_w.writerow(s["verification"])
            existing_ids.add(sid)
            new_count += 1

    print(f"[OK] Đã hoàn tất khởi tạo bộ dữ liệu! Đã nạp {new_count} mẫu chuẩn hóa.")
    print(f"     - posts.csv:       {POSTS_FILE}")
    print(f"     - images.csv:      {IMAGES_FILE}")
    print(f"     - comments.csv:    {COMMENTS_FILE}")
    print(f"     - engagement.csv:  {ENGAGEMENT_FILE}")
    print(f"     - labels.csv:      {LABELS_FILE}")
    print(f"     - verification.csv:{VERIFICATION_FILE}")


if __name__ == "__main__":
    seed_initial_dataset()
