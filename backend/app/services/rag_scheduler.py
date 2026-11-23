import threading
import time
from datetime import datetime, timezone
import logging
from typing import Dict, Any, Optional

from app.db.session import SessionLocal
from app.services.rss_collector import RssCollectorService
from app.services.rag_service import VectorRAGService
from app.config import settings

logger = logging.getLogger(__name__)


class RAGAutoScheduler:
    """
    Dịch vụ Tác vụ Ngầm Tự Động Hóa Nạp Tri Thức vào Vector RAG (Phương pháp 4):
    - Chạy nền (daemon thread), tự động quét 17 luồng RSS báo chí chính thống theo chu kỳ.
    - Phát hiện bài báo mới và tự động cập nhật Vector RAG Index.
    - Cung cấp trạng thái thời gian thực và cho phép kích hoạt chu kỳ ngay lập tức (Trigger Now).
    """

    _instance: Optional["RAGAutoScheduler"] = None
    _lock = threading.Lock()

    def __init__(self):
        self.enabled: bool = getattr(settings, "RAG_AUTO_SYNC_ENABLED", True)
        self.interval_minutes: int = getattr(settings, "RAG_AUTO_SYNC_INTERVAL_MINUTES", 60)
        self.is_running: bool = False
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self.last_run_at: Optional[datetime] = None
        self.last_sync_result: Optional[Dict[str, Any]] = None
        self.total_cycles_completed: int = 0
        self.is_cycle_in_progress: bool = False

    @classmethod
    def get_instance(cls) -> "RAGAutoScheduler":
        """Singleton pattern đảm bảo chỉ có duy nhất 1 background thread điều phối."""
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance

    def start(self, initial_delay_seconds: int = 5):
        """Khởi động luồng chạy ngầm."""
        with self._lock:
            if self.is_running:
                logger.info("[RAGScheduler] Scheduler đã đang chạy.")
                return

            self._stop_event.clear()
            self.is_running = True
            self._thread = threading.Thread(
                target=self._run_loop,
                args=(initial_delay_seconds,),
                name="RAG-Background-Scheduler-Thread",
                daemon=True,
            )
            self._thread.start()
            logger.info(
                f"[RAGScheduler] Đã kích hoạt chạy ngầm tự động nạp tri thức (Chu kỳ: {self.interval_minutes} phút)"
            )

    def stop(self):
        """Dừng luồng chạy ngầm."""
        with self._lock:
            if not self.is_running:
                return
            self._stop_event.set()
            self.is_running = False
            logger.info("[RAGScheduler] Yêu cầu dừng scheduler background...")

    def _run_loop(self, initial_delay_seconds: int = 5):
        """Vòng lặp chạy nền chính."""
        # Chờ ban đầu để FastAPI và database hoàn tất khởi động
        for _ in range(initial_delay_seconds):
            if self._stop_event.is_set():
                return
            time.sleep(1)

        while not self._stop_event.is_set():
            if self.enabled:
                try:
                    self.execute_sync_cycle()
                except Exception as e:
                    logger.error(f"[RAGScheduler] Ngoại lệ trong chu kỳ nạp tri thức: {e}")

            # Chờ đợi theo chu kỳ (kiểm tra mỗi giây để dừng ngay khi có tín hiệu tắt server)
            sleep_seconds = max(10, self.interval_minutes * 60)
            for _ in range(sleep_seconds):
                if self._stop_event.is_set():
                    break
                time.sleep(1)

        self.is_running = False

    def execute_sync_cycle(self, max_items_per_feed: int = 8) -> Dict[str, Any]:
        """Thực thi một chu kỳ đồng bộ RSS và tái tạo Vector RAG nếu có bài mới."""
        with self._lock:
            if self.is_cycle_in_progress:
                return {
                    "status": "busy",
                    "message": "Một chu kỳ nạp tri thức khác đang được tiến hành.",
                }
            self.is_cycle_in_progress = True

        try:
            logger.info("[RAGScheduler] Bắt đầu quét 17 luồng RSS báo chí chính thống...")
            with SessionLocal() as db:
                rss_res = RssCollectorService.sync_all_feeds(
                    db=db,
                    max_items_per_feed=max_items_per_feed,
                )
                new_added = rss_res.get("total_new_documents", 0)

                rag_rebuilt = False
                rag_details = None
                if new_added > 0:
                    logger.info(
                        f"[RAGScheduler] Tìm thấy {new_added} bài báo mới! Tự động nạp tích lũy vào Vector RAG Index (không xóa bài cũ)..."
                    )
                    rag_details = VectorRAGService.append_new_documents(db=db)
                    rag_rebuilt = True
                else:
                    logger.info(
                        "[RAGScheduler] Không có bài viết mới. Vector RAG Index vẫn được cập nhật sẵn sàng."
                    )
                    VectorRAGService.load_index(db=db)

                self.last_run_at = datetime.now(timezone.utc)
                self.total_cycles_completed += 1
                self.last_sync_result = {
                    "status": "success",
                    "timestamp": self.last_run_at.isoformat(),
                    "new_documents": new_added,
                    "rss_summary": rss_res.get("message"),
                    "rag_rebuilt": rag_rebuilt,
                    "total_cycles_completed": self.total_cycles_completed,
                    "rag_details": rag_details,
                }
                return self.last_sync_result
        finally:
            self.is_cycle_in_progress = False

    def get_status(self) -> Dict[str, Any]:
        """Trả về tình trạng hoạt động thời gian thực của Scheduler."""
        return {
            "enabled": self.enabled,
            "is_running": self.is_running,
            "is_busy": self.is_cycle_in_progress,
            "interval_minutes": self.interval_minutes,
            "last_run_at": self.last_run_at.isoformat() if self.last_run_at else None,
            "total_cycles_completed": self.total_cycles_completed,
            "last_result": self.last_sync_result,
        }

    def update_config(self, enabled: Optional[bool] = None, interval_minutes: Optional[int] = None):
        """Cập nhật cấu hình scheduler."""
        if enabled is not None:
            self.enabled = enabled
        if interval_minutes is not None and interval_minutes >= 1:
            self.interval_minutes = interval_minutes
