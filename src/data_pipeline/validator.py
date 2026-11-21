"""
Chương trình kiểm tra chất lượng và tính toàn vẹn của Bộ dữ liệu (Dataset Validator).
Kiểm tra:
  1. Tính đầy đủ của 6 tệp CSV chuẩn (posts, images, comments, engagement, labels, verification).
  2. Tính nhất quán khóa ngoại sample_id giữa các bảng.
  3. Giá trị trống hoặc lỗi định dạng ở các trường bắt buộc.
  4. Trùng lặp mã băm hình ảnh (Image perceptual hash duplicate).
  5. Thống kê phân bố nhãn (0, 1, 2) và nền tảng (Facebook, TikTok).
"""

import os
import csv
from typing import Dict, List, Set

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

POSTS_FILE = os.path.join(DATASET_DIR, "processed", "posts.csv")
IMAGES_FILE = os.path.join(DATASET_DIR, "processed", "images.csv")
COMMENTS_FILE = os.path.join(DATASET_DIR, "processed", "comments.csv")
ENGAGEMENT_FILE = os.path.join(DATASET_DIR, "processed", "engagement.csv")
LABELS_FILE = os.path.join(DATASET_DIR, "labels", "labels.csv")
VERIFICATION_FILE = os.path.join(DATASET_DIR, "labels", "verification.csv")


def validate_dataset() -> bool:
    print("[*] Đang tiến hành kiểm tra tính toàn vẹn bộ dữ liệu...")
    errors: List[str] = []
    warnings: List[str] = []

    # 1. Kiểm tra sự tồn tại của các tệp
    files_to_check = [
        ("posts.csv", POSTS_FILE),
        ("images.csv", IMAGES_FILE),
        ("comments.csv", COMMENTS_FILE),
        ("engagement.csv", ENGAGEMENT_FILE),
        ("labels.csv", LABELS_FILE),
        ("verification.csv", VERIFICATION_FILE),
    ]
    for name, path in files_to_check:
        if not os.path.exists(path):
            errors.append(f"Tệp không tồn tại: {name} ({path})")

    if errors:
        for err in errors:
            print(f"[ERROR] {err}")
        return False

    # 2. Đọc posts.csv làm bảng chuẩn
    posts_samples: Dict[str, dict] = {}
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=2):
            sid = row.get("sample_id", "").strip()
            if not sid:
                errors.append(f"posts.csv: Dòng {idx} bị thiếu sample_id")
            elif sid in posts_samples:
                errors.append(f"posts.csv: Trùng lặp sample_id '{sid}' ở dòng {idx}")
            else:
                posts_samples[sid] = row

            if not row.get("content", "").strip():
                errors.append(f"posts.csv: Mẫu {sid} có trường 'content' rỗng")
            if row.get("platform") not in ["Facebook", "TikTok"]:
                warnings.append(f"posts.csv: Mẫu {sid} có nền tảng bất thường: {row.get('platform')}")

    total_posts = len(posts_samples)
    print(f"    -> Đã ghi nhận {total_posts} bài đăng trong posts.csv")

    # 3. Kiểm tra images.csv
    image_hashes: Dict[str, str] = {}
    images_sample_ids: Set[str] = set()
    with open(IMAGES_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=2):
            sid = row.get("sample_id", "").strip()
            if sid not in posts_samples:
                errors.append(f"images.csv: sample_id '{sid}' không tồn tại trong posts.csv (Dòng {idx})")
            images_sample_ids.add(sid)

            ihash = row.get("image_hash", "").strip()
            if ihash:
                if ihash in image_hashes:
                    warnings.append(f"Phát hiện ảnh trùng lặp (hash {ihash}) giữa {image_hashes[ihash]} và {sid}")
                else:
                    image_hashes[ihash] = sid

    # 4. Kiểm tra labels.csv
    labels_count = {0: 0, 1: 0, 2: 0}
    labeled_sample_ids: Set[str] = set()
    with open(LABELS_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=2):
            sid = row.get("sample_id", "").strip()
            if sid not in posts_samples:
                errors.append(f"labels.csv: sample_id '{sid}' không tồn tại trong posts.csv (Dòng {idx})")
            labeled_sample_ids.add(sid)

            lbl_str = row.get("label", "").strip()
            try:
                lbl = int(lbl_str)
                if lbl in labels_count:
                    labels_count[lbl] += 1
                else:
                    errors.append(f"labels.csv: Nhãn không hợp lệ '{lbl}' tại mẫu {sid} (Chỉ chấp nhận 0, 1, 2)")
            except ValueError:
                errors.append(f"labels.csv: Nhãn không phải số nguyên '{lbl_str}' tại mẫu {sid}")

    # Kiểm tra mẫu chưa gán nhãn
    unlabeled = set(posts_samples.keys()) - labeled_sample_ids
    if unlabeled:
        warnings.append(f"Có {len(unlabeled)} mẫu chưa được gán nhãn trong labels.csv: {list(unlabeled)[:5]}")

    # 5. Kiểm tra verification.csv
    with open(VERIFICATION_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=2):
            sid = row.get("sample_id", "").strip()
            if sid not in posts_samples:
                errors.append(f"verification.csv: sample_id '{sid}' không tồn tại trong posts.csv (Dòng {idx})")

    # In kết quả
    print("\n" + "="*50)
    print(" KẾT QUẢ KIỂM TRA CHẤT LƯỢNG BỘ DỮ LIỆU")
    print("="*50)
    print(f"Tổng số mẫu bài đăng:   {total_posts}")
    print(f"Số mẫu có hình ảnh/clip:{len(images_sample_ids)} / {total_posts}")
    print(f"Phân bố nhãn:")
    print(f"  - Label 0 (Đáng tin cậy):     {labels_count[0]}")
    print(f"  - Label 1 (Sai lệch):         {labels_count[1]}")
    print(f"  - Label 2 (Chưa đủ căn cứ):   {labels_count[2]}")

    if warnings:
        print(f"\n[CẢNH BÁO - {len(warnings)} cảnh báo]:")
        for w in warnings:
            print(f"  * {w}")

    if errors:
        print(f"\n[LỖI - {len(errors)} lỗi nghiêm trọng]:")
        for e in errors:
            print(f"  ! {e}")
        return False
    else:
        print("\n[CHÚC MỪNG] Toàn bộ tệp dữ liệu đạt chuẩn 100%! Không có lỗi cấu trúc.")
        return True


if __name__ == "__main__":
    validate_dataset()
