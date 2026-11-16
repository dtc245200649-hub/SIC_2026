from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.config import settings


def create_app() -> FastAPI:
    """Khởi tạo ứng dụng FastAPI với đầy đủ cấu hình middleware và routes."""
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

    @app.get("/", tags=["General"])
    def root():
        """Root endpoint trả về thông tin hệ thống."""
        return {
            "name": settings.APP_NAME,
            "version": "0.1.0",
            "author": "AQuan-kernox",
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
