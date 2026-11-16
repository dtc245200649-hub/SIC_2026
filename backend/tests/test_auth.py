from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.v1.endpoints.auth import register, login, get_me, logout
from app.core.security import create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.user_service import UserService


@pytest.fixture
def mock_request():
    req = MagicMock()
    req.client.host = "127.0.0.1"
    req.headers = {"user-agent": "pytest-agent"}
    return req


def test_register_user_success(db_session: Session, mock_request):
    """Kiểm tra đăng ký tài khoản thành công."""
    payload = RegisterRequest(
        email="researcher@sic.edu.vn",
        username="researcher_vn",
        password="SecurePassword123!",
        full_name="Nguyen Van Nghiên Cứu",
    )
    user = register(user_in=payload, request=mock_request, db=db_session)
    assert user.id is not None
    assert user.email == "researcher@sic.edu.vn"
    assert user.username == "researcher_vn"
    assert user.is_active is True
    assert len(user.roles) >= 1
    assert user.roles[0].name == "Analyst"


def test_register_duplicate_email(db_session: Session, mock_request):
    """Kiểm tra từ chối đăng ký khi trùng email."""
    payload1 = RegisterRequest(
        email="duplicate@sic.edu.vn",
        username="user1",
        password="Password123!",
    )
    register(user_in=payload1, request=mock_request, db=db_session)

    payload2 = RegisterRequest(
        email="duplicate@sic.edu.vn",
        username="user2",
        password="Password123!",
    )
    with pytest.raises(HTTPException) as exc_info:
        register(user_in=payload2, request=mock_request, db=db_session)
    assert exc_info.value.status_code == 400
    assert "email" in exc_info.value.detail.lower()


def test_register_duplicate_username(db_session: Session, mock_request):
    """Kiểm tra từ chối đăng ký khi trùng username."""
    payload1 = RegisterRequest(
        email="user1@sic.edu.vn",
        username="samename",
        password="Password123!",
    )
    register(user_in=payload1, request=mock_request, db=db_session)

    payload2 = RegisterRequest(
        email="user2@sic.edu.vn",
        username="samename",
        password="Password123!",
    )
    with pytest.raises(HTTPException) as exc_info:
        register(user_in=payload2, request=mock_request, db=db_session)
    assert exc_info.value.status_code == 400
    assert "username" in exc_info.value.detail.lower()


def test_login_success(db_session: Session, mock_request):
    """Kiểm tra đăng nhập thành công và nhận JWT Token."""
    register(
        user_in=RegisterRequest(
            email="login_test@sic.edu.vn",
            username="login_test",
            password="CorrectPassword123!",
        ),
        request=mock_request,
        db=db_session,
    )

    # Đăng nhập bằng username
    token_resp = login(
        login_data=LoginRequest(
            username_or_email="login_test",
            password="CorrectPassword123!",
        ),
        request=mock_request,
        db=db_session,
    )
    assert token_resp.token_type == "bearer"
    assert token_resp.access_token is not None
    assert token_resp.user.username == "login_test"

    # Đăng nhập bằng email
    token_resp_email = login(
        login_data=LoginRequest(
            username_or_email="login_test@sic.edu.vn",
            password="CorrectPassword123!",
        ),
        request=mock_request,
        db=db_session,
    )
    assert token_resp_email.access_token is not None


def test_account_lockout_after_5_failed_attempts(db_session: Session, mock_request):
    """
    Kiểm tra cơ chế phòng vệ Brute-force:
    Đăng nhập sai quá 5 lần sẽ khóa tài khoản trong 15 phút.
    """
    register(
        user_in=RegisterRequest(
            email="victim@sic.edu.vn",
            username="victim_user",
            password="CorrectPassword123!",
        ),
        request=mock_request,
        db=db_session,
    )

    # 4 lần đầu nhập sai -> HTTP 401 cảnh báo số lần còn lại
    for attempt in range(1, 5):
        with pytest.raises(HTTPException) as exc_info:
            login(
                login_data=LoginRequest(
                    username_or_email="victim_user",
                    password=f"Wrong_{attempt}",
                ),
                request=mock_request,
                db=db_session,
            )
        assert exc_info.value.status_code == 401
        expected_remaining = 5 - attempt
        assert f"{expected_remaining} lần thử" in exc_info.value.detail

    # Lần thứ 5 nhập sai -> HTTP 403 Khóa tài khoản trong 15 phút
    with pytest.raises(HTTPException) as exc_5th:
        login(
            login_data=LoginRequest(
                username_or_email="victim_user",
                password="Wrong_5",
            ),
            request=mock_request,
            db=db_session,
        )
    assert exc_5th.value.status_code == 403
    assert "tạm khóa" in exc_5th.value.detail
    assert "15 phút" in exc_5th.value.detail

    # Lần thứ 6 dù nhập đúng mật khẩu -> vẫn bị từ chối 403 vì tài khoản đang bị khóa
    with pytest.raises(HTTPException) as exc_locked:
        login(
            login_data=LoginRequest(
                username_or_email="victim_user",
                password="CorrectPassword123!",
            ),
            request=mock_request,
            db=db_session,
        )
    assert exc_locked.value.status_code == 403
    assert "tạm khóa" in exc_locked.value.detail


def test_get_current_user_dependency(db_session: Session, mock_request):
    """Kiểm tra dependency get_current_user với JWT hợp lệ và không hợp lệ."""
    user = register(
        user_in=RegisterRequest(
            email="token_user@sic.edu.vn",
            username="token_user",
            password="Password123!",
        ),
        request=mock_request,
        db=db_session,
    )

    # Token hợp lệ
    token = create_access_token(subject=user.id)
    curr_user = get_current_user(db=db_session, token=token)
    assert curr_user.id == user.id
    assert curr_user.username == "token_user"

    # Thiếu token
    with pytest.raises(HTTPException) as exc_no_token:
        get_current_user(db=db_session, token=None)
    assert exc_no_token.value.status_code == 401

    # Token sai / giả mạo
    with pytest.raises(HTTPException) as exc_invalid:
        get_current_user(db=db_session, token="invalid.token.here")
    assert exc_invalid.value.status_code == 401


def test_logout(db_session: Session, mock_request):
    """Kiểm tra endpoint logout ghi nhận audit log."""
    user = register(
        user_in=RegisterRequest(
            email="logout_user@sic.edu.vn",
            username="logout_user",
            password="Password123!",
        ),
        request=mock_request,
        db=db_session,
    )

    resp = logout(request=mock_request, current_user=user, db=db_session)
    assert resp["status"] == "success"
