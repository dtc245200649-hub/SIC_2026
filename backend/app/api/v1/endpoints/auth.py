from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.config import settings
from app.core.security import create_access_token
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    Token,
    UserOut,
)
from app.services.user_service import UserService

router = APIRouter()


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Đăng ký tài khoản người dùng mới",
    description="Tạo tài khoản mới với email, username và mật khẩu được băm an toàn.",
)
def register(
    user_in: RegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    user = UserService.register(db=db, user_in=user_in, ip_address=ip_address)
    return user


@router.post(
    "/login",
    response_model=Token,
    summary="Đăng nhập tài khoản & Nhận JWT Access Token",
    description="Xác thực username/email và mật khẩu. Tự động khóa tài khoản 15 phút nếu nhập sai quá 5 lần.",
)
def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user = UserService.authenticate(
        db=db,
        username_or_email=login_data.username_or_email,
        password=login_data.password,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    access_token = create_access_token(subject=user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=UserOut.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserOut,
    summary="Lấy thông tin tài khoản đang đăng nhập",
    description="Yêu cầu Bearer Token trong Header. Trả về thông tin chi tiết và danh sách quyền hạn.",
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post(
    "/logout",
    summary="Đăng xuất khỏi hệ thống",
    description="Ghi nhận nhật ký đăng xuất và yêu cầu Client xóa Access Token ở phía Frontend.",
)
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    audit = AuditLog(
        user_id=current_user.id,
        action="LOGOUT",
        ip_address=ip_address,
        details_json=f'{{"username": "{current_user.username}"}}',
    )
    db.add(audit)
    db.commit()

    return {
        "status": "success",
        "message": "Đăng xuất thành công. Vui lòng hủy lưu trữ Access Token tại client.",
    }
