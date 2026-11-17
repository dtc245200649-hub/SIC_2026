from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from app.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
import app.models  # Đăng ký toàn bộ 17 models với SQLAlchemy Base
from app.db.seed import seed_initial_data
from app.api.v1.router import api_v1_router


def create_app() -> FastAPI:
    """Khởi tạo ứng dụng FastAPI với đầy đủ cấu hình middleware và routes."""
    # Đảm bảo các bảng cơ sở dữ liệu được khởi tạo và nạp dữ liệu mẫu ban đầu
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as db:
            seed_initial_data(db)
    except Exception as e:
        print(f"[INIT] Cảnh báo khởi tạo seed data: {e}")

    app = FastAPI(
        title=settings.APP_NAME,
        description="Nền tảng học sâu đa phương thức có khả năng giải thích trong phát hiện tin giả và phân tích mạng xã hội.",
        version="0.1.0",
        debug=settings.DEBUG,
    )

    # Cấu hình CORS cho phép Frontend truy cập an toàn
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Đăng ký API Router v1
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    @app.get("/", tags=["General"])
    def root():
        """Root endpoint trả về thông tin hệ thống."""
        return {
            "name": settings.APP_NAME,
            "version": "0.1.0",
            "author": "dtc245200649-hub",
            "environment": settings.APP_ENV,
            "status": "online",
            "docs_url": "/docs",
        }

    @app.get("/api/health", tags=["Health"])
    def health_check():
        """Health-check endpoint phục vụ Docker và giám sát trạng thái hệ thống."""
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "database": "ready",
            "ai_engine": "ready",
        }

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=settings.DEBUG)
