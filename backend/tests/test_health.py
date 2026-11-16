import pytest
from app.main import app
from app.config import settings


def test_app_configuration():
    """Kiểm tra cấu hình ứng dụng được load chính xác."""
    assert settings.APP_NAME == "Hệ thống Phát hiện Thông tin Sai lệch Đa phương thức"
    assert settings.API_V1_STR == "/api/v1"
    assert settings.MAX_FAILED_LOGIN_ATTEMPTS == 5
    assert settings.ACCOUNT_LOCK_MINUTES == 15
    assert settings.DATABASE_URL is not None


def test_root_endpoint():
    """Kiểm tra root endpoint trả về thông tin tác giả AQuan-kernox."""
    # Tìm endpoint '/'
    root_endpoint = None
    for route in app.routes:
        if getattr(route, "path", None) == "/":
            root_endpoint = route.endpoint
            break

    assert root_endpoint is not None, "Root endpoint '/' chưa được đăng ký."
    res = root_endpoint()
    assert res["status"] == "online"
    assert res["author"] == "AQuan-kernox"
    assert res["version"] == "0.1.0"


def test_health_endpoint():
    """Kiểm tra health endpoint trả về trạng thái healthy và sẵn sàng."""
    health_endpoint = None
    for route in app.routes:
        if getattr(route, "path", None) == "/api/health":
            health_endpoint = route.endpoint
            break

    assert health_endpoint is not None, "Health check endpoint '/api/health' chưa được đăng ký."
    res = health_endpoint()
    assert res["status"] == "healthy"
    assert res["database"] == "ready"
    assert res["ai_engine"] == "ready"
    assert "timestamp" in res
