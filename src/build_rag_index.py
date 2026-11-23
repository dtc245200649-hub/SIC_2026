#!/usr/bin/env python3
"""
Script xây dựng và nạp Kho Tri Thức Báo Chí Chính Thống vào Vector RAG Index.
Trích xuất vector ngữ nghĩa đa chiều cho toàn bộ bài báo trong CSDL và lưu chỉ mục.
"""
import sys
import os
from pathlib import Path
import time

# Đưa thư mục backend vào sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.session import SessionLocal
from app.services.rag_service import VectorRAGService


def main():
    print("=" * 70)
    print(" HỆ THỐNG KIỂM CHỨNG TIN GIẢ ĐA PHƯƠNG THỨC - XÂY DỰNG VECTOR RAG INDEX ")
    print("=" * 70)

    start_time = time.time()
    with SessionLocal() as db:
        print("[1/3] Đang kết nối CSDL và đọc tài liệu kiểm chứng...")
        result = VectorRAGService.build_index(db=db, force_rebuild=True)

        elapsed = time.time() - start_time
        print(f"\n[2/3] Kết quả đánh chỉ mục:")
        print(f"  - Trạng thái: {result.get('status')}")
        print(f"  - Thông báo: {result.get('message')}")
        print(f"  - Tổng số tài liệu: {result.get('total_indexed')} bài báo")
        print(f"  - Kích thước Vector đặc trưng: {result.get('vector_dimension')} chiều")
        print(f"  - Đường dẫn tệp Index: {result.get('index_path')}")
        print(f"  - Thời gian thực thi: {elapsed:.2f} giây")

        print("\n[3/3] Kiểm thử truy vấn mẫu từ Vector RAG Index:")
        test_queries = [
            "Vỡ đê sông Hồng đoạn qua nội thành Hà Nội",
            "Uống nước lá đu đủ chữa khỏi ung thư",
            "Bản tin dự báo áp thấp nhiệt đới và mưa lớn Bắc Bộ",
        ]

        for q in test_queries:
            print(f"\n>> Truy vấn: '{q}'")
            res = VectorRAGService.verify_claim(claim=q, db=db)
            print(f"   => Phán quyết tổng thể: {res.overall_verdict}")
            for item in res.matched_evidences[:2]:
                print(f"      * [{item.nli_verdict}] (Score: {item.similarity_score:.2f}) {item.title} ({item.source_name})")

    print("\n" + "=" * 70)
    print(" XÂY DỰNG VECTOR RAG INDEX HOÀN TẤT THÀNH CÔNG! ")
    print("=" * 70)


if __name__ == "__main__":
    main()
