"""
Chương trình Phân chia Tập dữ liệu Train / Validation / Test (70:15:15).
Đặc điểm:
  1. Phân tầng (Stratified) theo Nhãn (0, 1, 2) và Nền tảng (Facebook, TikTok).
  2. Ngăn chặn triệt để rò rỉ dữ liệu (Data Leakage) giữa Train và Test.
  3. Xuất ra 3 tệp splits:
     - dataset/splits/train.csv (70%)
     - dataset/splits/validation.csv (15%)
     - dataset/splits/test.csv (15%)
"""

import os
import csv
import random
from collections import defaultdict
from typing import Dict, List, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

POSTS_FILE = os.path.join(DATASET_DIR, "processed", "posts.csv")
IMAGES_FILE = os.path.join(DATASET_DIR, "processed", "images.csv")
LABELS_FILE = os.path.join(DATASET_DIR, "labels", "labels.csv")

TRAIN_SPLIT_FILE = os.path.join(DATASET_DIR, "splits", "train.csv")
VAL_SPLIT_FILE = os.path.join(DATASET_DIR, "splits", "validation.csv")
TEST_SPLIT_FILE = os.path.join(DATASET_DIR, "splits", "test.csv")

SPLIT_HEADERS = [
    "sample_id",
    "platform",
    "topic",
    "label",
    "content",
    "image_path",
]


def split_dataset(train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, random_seed=42):
    print("[*] Đang tiến hành phân chia tập dữ liệu...")
    random.seed(random_seed)

    # 1. Đọc posts
    posts: Dict[str, dict] = {}
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            posts[row["sample_id"]] = row

    # 2. Đọc images
    images: Dict[str, dict] = {}
    if os.path.exists(IMAGES_FILE):
        with open(IMAGES_FILE, "r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                images[row["sample_id"]] = row

    # 3. Đọc labels
    labels: Dict[str, str] = {}
    with open(LABELS_FILE, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            labels[row["sample_id"]] = row["label"]

    # 4. Gom nhóm Stratified theo (Platform, Label)
    groups = defaultdict(list)
    for sid, p in posts.items():
        lbl = labels.get(sid, "2")
        platform = p.get("platform", "Facebook")
        item = {
            "sample_id": sid,
            "platform": platform,
            "topic": p.get("topic", "social"),
            "label": lbl,
            "content": p.get("content", ""),
            "image_path": images.get(sid, {}).get("image_path", ""),
        }
        groups[(platform, lbl)].append(item)

    train_set: List[dict] = []
    val_set: List[dict] = []
    test_set: List[dict] = []

    for key, items in groups.items():
        random.shuffle(items)
        n = len(items)
        if n == 1:
            train_set.extend(items)
        elif n == 2:
            train_set.append(items[0])
            test_set.append(items[1])
        else:
            n_train = max(1, int(round(n * train_ratio)))
            n_val = max(1, int(round(n * val_ratio))) if n >= 4 else 0
            train_set.extend(items[:n_train])
            val_set.extend(items[n_train:n_train + n_val])
            test_set.extend(items[n_train + n_val:])

    # Ghi vào 3 tệp
    def write_split(path: str, data: List[dict]):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=SPLIT_HEADERS)
            w.writeheader()
            for r in data:
                w.writerow(r)

    write_split(TRAIN_SPLIT_FILE, train_set)
    write_split(VAL_SPLIT_FILE, val_set)
    write_split(TEST_SPLIT_FILE, test_set)

    print(f"[OK] Đã phân chia tập dữ liệu thành công:")
    print(f"     - Tập Huấn luyện (Train - {len(train_set)} mẫu):      {TRAIN_SPLIT_FILE}")
    print(f"     - Tập Kiểm định (Val - {len(val_set)} mẫu):          {VAL_SPLIT_FILE}")
    print(f"     - Tập Đánh giá (Test - {len(test_set)} mẫu):         {TEST_SPLIT_FILE}")


if __name__ == "__main__":
    split_dataset()
