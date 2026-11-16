from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.services.user_service import UserService

# OAuth2 Scheme sử dụng đường dẫn /api/v1/auth/login
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False,
)


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(reusable_oauth2),
) -> User:
    """
    Dependency kiểm tra token Bearer và trả về thông tin User hiện tại.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yêu cầu xác thực: Thiếu Access Token hoặc định dạng không hợp lệ.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Dữ liệu token không hợp lệ.",
        )

    user = UserService.get_by_id(db, int(user_id_str))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông tin người dùng tương ứng với token.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản người dùng đã bị vô hiệu hóa.",
        )

    return user


def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency giới hạn chỉ dành cho Quản trị viên cấp cao (Admin / Superuser).
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền quản trị viên cấp cao để thực hiện hành động này.",
        )
    return current_user
