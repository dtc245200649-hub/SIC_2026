"""
Kịch bản Huấn luyện và Fine-tune Mô hình PhoBERT v2 cho Phát hiện Tin Giả tiếng Việt
(Multimodal & Text Deep Learning Pipeline - ViFact XAI)

Đề tài: Học sâu đa phương thức có khả năng giải thích trong phát hiện thông tin sai lệch
        và phân tích tác động xã hội trên mạng xã hội Việt Nam.

Tập dữ liệu: ViFactCheck Benchmark (5.062 mẫu huấn luyện, 723 mẫu kiểm định)
Nhãn:
  - 0: CHINH_XAC (Chính xác / Được xác thực - SUPPORTED)
  - 1: SAI_SU_THAT (Sai sự thật / Bác bỏ - REFUTED)
  - 2: GAY_HIEU_LAM (Gây hiểu lầm / Thiếu căn cứ - NOT ENOUGH INFO / CAN KIEM CHUNG)
"""

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Tuple

# Cấu hình lưu trữ bộ nhớ đệm trên ổ D: (tránh tràn ổ C:)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.environ["HF_HOME"] = os.path.join(BASE_DIR, "data", "huggingface")
os.environ["TORCH_HOME"] = os.path.join(BASE_DIR, "data", "torch")
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix
from transformers import AutoTokenizer, AutoModel, AutoConfig

from ai_engine.encoders.text_encoder import VietnameseTextPreprocessor


LABEL_MAP = {
    0: "CHINH_XAC",
    1: "SAI_SU_THAT",
    2: "GAY_HIEU_LAM",
}

LABEL_NAMES = ["Chính xác (True)", "Sai sự thật (Fake)", "Gây hiểu lầm (Misleading)"]


class ViFactDataset(Dataset):
    """Dataset xử lý dữ liệu kiểm chứng thông tin tiếng Việt."""
    def __init__(self, texts: List[str], labels: List[int], tokenizer, max_length: int = 256):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        cleaned = VietnameseTextPreprocessor.clean_text(text)
        encoding = self.tokenizer(
            cleaned,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt",
        )
        item = {key: val.squeeze(0) for key, val in encoding.items()}
        item["label"] = torch.tensor(self.labels[idx], dtype=torch.long)
        return item


class PhoBERTClassifier(nn.Module):
    """
    Kiến trúc Mạng Nơ-ron Phân loại Tin giả dựa trên PhoBERT Backbone:
      PhoBERT ([CLS] 768d) -> Dropout -> Linear (768 -> 256) -> GELU -> LayerNorm -> Linear (256 -> 3)
    """
    def __init__(self, model_name: str = "vinai/phobert-base-v2", num_classes: int = 3, freeze_backbone: bool = False):
        super().__init__()
        self.config = AutoConfig.from_pretrained(model_name, local_files_only=True)
        self.phobert = AutoModel.from_pretrained(model_name, local_files_only=True)
        
        if freeze_backbone:
            for param in self.phobert.parameters():
                param.requires_grad = False

        self.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(self.config.hidden_size, 256),
            nn.GELU(),
            nn.LayerNorm(256),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes),
        )

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor):
        outputs = self.phobert(input_ids=input_ids, attention_mask=attention_mask)
        cls_rep = outputs.last_hidden_state[:, 0, :]  # [CLS] representation (768d)
        logits = self.classifier(cls_rep)
        return logits, cls_rep


def load_dataset_splits(data_dir: str, max_train: int = None, max_dev: int = None):
    """Nạp dữ liệu từ định dạng Parquet hoặc CSV."""
    train_parquet = os.path.join(data_dir, "benchmark", "vifactcheck", "train.parquet")
    dev_parquet = os.path.join(data_dir, "benchmark", "vifactcheck", "dev.parquet")

    if os.path.exists(train_parquet) and os.path.exists(dev_parquet):
        print(f"[DataLoader] Đang nạp tập dữ liệu từ Parquet: {train_parquet}")
        df_train = pd.read_parquet(train_parquet)
        df_dev = pd.read_parquet(dev_parquet)
    else:
        train_csv = os.path.join(data_dir, "splits", "vifactcheck_train.csv")
        dev_csv = os.path.join(data_dir, "splits", "vifactcheck_val.csv")
        print(f"[DataLoader] Đang nạp tập dữ liệu từ CSV: {train_csv}")
        df_train = pd.read_csv(train_csv)
        df_dev = pd.read_csv(dev_csv)

    # Chuẩn bị văn bản: Kết hợp Statement và tóm tắt Context
    def prepare_input(row):
        stmt = str(row.get("Statement", "")).strip()
        topic = str(row.get("Topic", "")).strip()
        if topic and topic != "nan":
            return f"[{topic}] {stmt}"
        return stmt

    df_train["input_text"] = df_train.apply(prepare_input, axis=1)
    df_dev["input_text"] = df_dev.apply(prepare_input, axis=1)

    if max_train and max_train < len(df_train):
        sampled_parts = []
        for lbl, group in df_train.groupby("labels"):
            sampled_parts.append(group.sample(min(len(group), max_train // 3), random_state=42))
        df_train = pd.concat(sampled_parts, ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

    if max_dev and max_dev < len(df_dev):
        sampled_parts = []
        for lbl, group in df_dev.groupby("labels"):
            sampled_parts.append(group.sample(min(len(group), max_dev // 3), random_state=42))
        df_dev = pd.concat(sampled_parts, ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

    print(f"[DataLoader] Số mẫu huấn luyện: {len(df_train)} (Phân bố: {df_train['labels'].value_counts().to_dict()})")
    print(f"[DataLoader] Số mẫu kiểm định: {len(df_dev)} (Phân bố: {df_dev['labels'].value_counts().to_dict()})")

    return df_train, df_dev


def train_phobert(
    epochs: int = 3,
    batch_size: int = 16,
    lr: float = 2e-5,
    max_length: int = 128,
    max_train_samples: int = 1500,
    max_dev_samples: int = 300,
    device_name: str = None,
):
    """Chu trình huấn luyện hoàn chỉnh mô hình PhoBERT Deep Learning."""
    start_time = time.time()
    device = torch.device(device_name if device_name else ("cuda" if torch.cuda.is_available() else "cpu"))
    print(f"\n=======================================================")
    print(f"  KHỞI ĐỘNG HUẤN LUYỆN PHO-BERT V2 TRÊN VIFACTCHECK")
    print(f"  Thiết bị: {device} | Số Epochs: {epochs} | Batch size: {batch_size}")
    print(f"=======================================================\n")

    model_name = "vinai/phobert-base-v2"
    print(f"[1/5] Nạp Tokenizer: {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, local_files_only=True)

    # 1. Nạp dữ liệu
    print(f"[2/5] Nạp và xử lý tập dữ liệu...")
    data_dir = os.path.join(BASE_DIR, "dataset")
    df_train, df_dev = load_dataset_splits(data_dir, max_train=max_train_samples, max_dev=max_dev_samples)

    train_dataset = ViFactDataset(df_train["input_text"].tolist(), df_train["labels"].tolist(), tokenizer, max_length)
    dev_dataset = ViFactDataset(df_dev["input_text"].tolist(), df_dev["labels"].tolist(), tokenizer, max_length)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    dev_loader = DataLoader(dev_dataset, batch_size=batch_size, shuffle=False)

    # 2. Khởi tạo mô hình
    print(f"[3/5] Khởi tạo kiến trúc PhoBERT Classifier...")
    model = PhoBERTClassifier(model_name=model_name, num_classes=3)
    model.to(device)

    # Tính trọng số phạt mất cân bằng nhãn (Class Weights)
    label_counts = df_train["labels"].value_counts().sort_index().values
    total_samples = len(df_train)
    weights = total_samples / (len(label_counts) * label_counts)
    class_weights = torch.tensor(weights, dtype=torch.float).to(device)
    print(f"[Loss] Class weights: {class_weights.tolist()}")

    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=0.01)

    # 3. Vòng lặp huấn luyện
    print(f"[4/5] Bắt đầu quá trình huấn luyện ({epochs} epochs)...")
    best_f1 = 0.0
    checkpoint_dir = os.path.join(BASE_DIR, "ai_engine", "checkpoints")
    os.makedirs(checkpoint_dir, exist_ok=True)
    best_checkpoint_path = os.path.join(checkpoint_dir, "phobert_vifact_best.pt")

    history = []

    for epoch in range(1, epochs + 1):
        epoch_start = time.time()
        model.train()
        total_loss = 0.0
        train_preds, train_trues = [], []

        for batch_idx, batch in enumerate(train_loader):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["label"].to(device)

            optimizer.zero_grad()
            logits, _ = model(input_ids, attention_mask)
            loss = criterion(logits, labels)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_loss += loss.item()
            preds = torch.argmax(logits, dim=-1).cpu().numpy()
            train_preds.extend(preds)
            train_trues.extend(labels.cpu().numpy())

            if (batch_idx + 1) % max(1, len(train_loader) // 4) == 0 or (batch_idx + 1) == len(train_loader):
                print(f"  Epoch [{epoch}/{epochs}] - Batch [{batch_idx+1}/{len(train_loader)}] - Loss: {loss.item():.4f}")

        train_acc = accuracy_score(train_trues, train_preds)
        train_f1 = f1_score(train_trues, train_preds, average="macro")
        avg_train_loss = total_loss / len(train_loader)

        # Đánh giá trên tập Dev
        model.eval()
        dev_loss = 0.0
        val_preds, val_trues = [], []

        with torch.no_grad():
            for batch in dev_loader:
                input_ids = batch["input_ids"].to(device)
                attention_mask = batch["attention_mask"].to(device)
                labels = batch["label"].to(device)

                logits, _ = model(input_ids, attention_mask)
                loss = criterion(logits, labels)
                dev_loss += loss.item()

                preds = torch.argmax(logits, dim=-1).cpu().numpy()
                val_preds.extend(preds)
                val_trues.extend(labels.cpu().numpy())

        dev_acc = accuracy_score(val_trues, val_preds)
        dev_f1 = f1_score(val_trues, val_preds, average="macro")
        avg_dev_loss = dev_loss / len(dev_loader)
        epoch_time = time.time() - epoch_start

        print(f"\n>> KẾT THÚC EPOCH {epoch}/{epochs} ({epoch_time:.1f}s):")
        print(f"   Train Loss: {avg_train_loss:.4f} | Train Acc: {train_acc*100:.2f}% | Train F1-Macro: {train_f1:.4f}")
        print(f"   Dev Loss:   {avg_dev_loss:.4f} | Dev Acc:   {dev_acc*100:.2f}% | Dev F1-Macro:   {dev_f1:.4f}")

        epoch_stat = {
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 4),
            "train_accuracy": round(train_acc, 4),
            "train_f1": round(train_f1, 4),
            "dev_loss": round(avg_dev_loss, 4),
            "dev_accuracy": round(dev_acc, 4),
            "dev_f1": round(dev_f1, 4),
            "duration_sec": round(epoch_time, 1),
        }
        history.append(epoch_stat)

        # Lưu checkpoint tốt nhất
        if dev_f1 > best_f1:
            best_f1 = dev_f1
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "dev_f1": dev_f1,
                "dev_acc": dev_acc,
                "label_map": LABEL_MAP,
                "config": {
                    "model_name": model_name,
                    "max_length": max_length,
                    "num_classes": 3,
                }
            }, best_checkpoint_path)
            print(f"   ★ Đã lưu Checkpoint mới tốt nhất vào: {best_checkpoint_path} (F1: {best_f1:.4f})")

        print("-------------------------------------------------------")

    # 4. Báo cáo đánh giá tổng kết
    print(f"\n[5/5] Hoàn tất huấn luyện trong {(time.time() - start_time):.1f}s. Đánh giá chi tiết tập kiểm định:")
    report = classification_report(val_trues, val_preds, target_names=LABEL_NAMES, output_dict=True)
    cm = confusion_matrix(val_trues, val_preds).tolist()

    print(classification_report(val_trues, val_preds, target_names=LABEL_NAMES))

    # Lưu metrics ra file JSON
    metrics_path = os.path.join(checkpoint_dir, "training_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "model_name": "vinai/phobert-base-v2",
            "best_dev_f1": round(best_f1, 4),
            "final_dev_acc": round(dev_acc, 4),
            "epochs_trained": epochs,
            "total_time_sec": round(time.time() - start_time, 1),
            "history": history,
            "classification_report": report,
            "confusion_matrix": cm,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }, f, indent=2, ensure_ascii=False)

    print(f"[Done] Đã lưu báo cáo đánh giá vào: {metrics_path}")
    return best_checkpoint_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Huấn luyện mô hình PhoBERT phân loại tin giả tiếng Việt")
    parser.add_argument("--epochs", type=int, default=2, help="Số lượt huấn luyện (default: 2)")
    parser.add_argument("--batch_size", type=int, default=8, help="Kích thước batch (default: 8)")
    parser.add_argument("--lr", type=float, default=2e-5, help="Tốc độ học (default: 2e-5)")
    parser.add_argument("--max_length", type=int, default=128, help="Độ dài chuỗi tối đa (default: 128)")
    parser.add_argument("--max_train", type=int, default=600, help="Số mẫu huấn luyện giới hạn (default: 600 để tối ưu tốc độ CPU)")
    parser.add_argument("--max_dev", type=int, default=150, help="Số mẫu kiểm định giới hạn (default: 150)")
    parser.add_argument("--device", type=str, default=None, help="cpu hoặc cuda")

    args = parser.parse_args()
    train_phobert(
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        max_length=args.max_length,
        max_train_samples=args.max_train,
        max_dev_samples=args.max_dev,
        device_name=args.device,
    )
