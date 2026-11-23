#!/usr/bin/env python3
"""
Daemon chạy ngầm Tự Động Hóa Nạp Tri Thức Báo Chí vào Vector RAG (Phương pháp 4).
Chạy độc lập trong terminal hoặc cấu hình systemd / task scheduler:
- Quét 17 luồng RSS chính thống theo chu kỳ (mặc định 60 phút).
- Tự động phát hiện bài báo mới và tái tạo Vector RAG Index.
"""
import sys
import os
import time
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.rag_scheduler import RAGAutoScheduler


def main():
    print("=" * 75)
    print(" DAEMON TỰ ĐỘNG HÓA NẠP TRI THỨC VÀO VECTOR RAG (PHƯƠNG PHÁP 4) ")
    print("=" * 75)

    scheduler = RAGAutoScheduler.get_instance()
    print(f"[*] Trạng thái: Kích hoạt tự động")
    print(f"[*] Chu kỳ kiểm tra: {scheduler.interval_minutes} phút/lần")
    print(f"[*] Phạm vi: 17 luồng RSS chính thống (5 chuyên đề tin tức)")
    print("[*] Đang thực thi chu kỳ khởi động ban đầu...")

    res = scheduler.execute_sync_cycle(max_items_per_feed=8)
    print(f"[+] Kết quả chu kỳ đầu tiên:")
    print(f"    - Bài báo mới phát hiện: {res.get('new_documents', 0)}")
    print(f"    - Tái tạo Vector RAG Index: {'CÓ (Đã cập nhật vector)' if res.get('rag_rebuilt') else 'KHÔNG (Giữ nguyên)'}")
    print(f"    - Thông báo: {res.get('rss_summary')}")

    print("\n[*] Daemon đang chạy nền định kỳ. Nhấn Ctrl+C để dừng.")
    scheduler.start(initial_delay_seconds=scheduler.interval_minutes * 60)

    try:
        while True:
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n[*] Đang dừng Daemon an toàn...")
        scheduler.stop()
        print("[+] Daemon đã dừng thành công.")


if __name__ == "__main__":
    main()
