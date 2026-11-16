from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

# Kết nối cơ sở dữ liệu (SQLite cho Dev, PostgreSQL cho Prod)
# connect_args={"check_same_thread": False} chỉ cần cho SQLite
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI Dependency cung cấp database session độc lập cho mỗi request.
    Đảm bảo session luôn được đóng tự động sau khi hoàn tất.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
