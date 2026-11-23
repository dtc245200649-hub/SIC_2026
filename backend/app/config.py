import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Khóa cứng toàn bộ bộ nhớ đệm AI, HuggingFace và PyTorch trên ổ D: (tránh ghi vào ổ C:)
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.environ["HF_HOME"] = os.path.join(_PROJECT_ROOT, "data", "huggingface")
os.environ["TORCH_HOME"] = os.path.join(_PROJECT_ROOT, "data", "torch")
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"


class Settings(BaseSettings):
    """
    Cấu hình ứng dụng tập trung (Application Settings).
    Được load tự động từ file .env hoặc biến môi trường hệ điều hành.
    """
    # Thông tin cơ bản
    APP_NAME: str = "Hệ thống Phát hiện Thông tin Sai lệch Đa phương thức"
    APP_ENV: str = "development"
    DEBUG: bool = True
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    API_V1_STR: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Cơ sở dữ liệu (SQLite cho Local Dev, PostgreSQL cho Production / Docker)
    DATABASE_URL: str = "sqlite:///./misinfo_dev.db"

    # Bảo mật JWT
    SECRET_KEY: str = "misinformation_detection_secret_key_vietnam_2026_super_secure_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 giờ

    # Cơ chế phòng thủ Brute-force
    MAX_FAILED_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCK_MINUTES: int = 15

    # Quản lý Upload File
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 50

    # Tự động hóa nạp tri thức định kỳ vào Vector RAG (Cách 4)
    RAG_AUTO_SYNC_ENABLED: bool = True
    RAG_AUTO_SYNC_INTERVAL_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "..", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
