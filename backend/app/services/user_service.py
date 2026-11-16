from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_

from app.config import settings
from app.core.security import get_password_hash, verify_password
from app.models.user import User, Role
from app.models.audit import AuditLog
from app.schemas.auth import RegisterRequest


class UserService:
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Truy vấn người dùng theo ID."""
        return db.scalar(select(User).where(User.id == user_id))

    @staticmethod
    def get_by_username_or_email(db: Session, identifier: str) -> Optional[User]:
        """Truy vấn người dùng theo username hoặc email."""
        identifier = identifier.strip().lower()
        stmt = select(User).where(
            or_(User.email.ilike(identifier), User.username.ilike(identifier))
        )
        return db.scalar(stmt)

    @staticmethod
    def register(db: Session, user_in: RegisterRequest, ip_address: Optional[str] = None) -> User:
        """
        Đăng ký tài khoản người dùng mới.
        Kiểm tra trùng lặp email/username và khởi tạo vai trò mặc định.
        """
        existing_email = db.scalar(select(User).where(User.email.ilike(user_in.email.strip())))
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Địa chỉ email này đã được sử dụng.",
            )

        existing_username = db.scalar(select(User).where(User.username.ilike(user_in.username.strip())))
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên người dùng (username) này đã tồn tại.",
            )

        # Lấy hoặc tạo vai trò mặc định 'Analyst'
        analyst_role = db.scalar(select(Role).where(Role.name == "Analyst"))
        if not analyst_role:
            analyst_role = Role(
                name="Analyst",
                description="Nhà phân tích thông tin & kiểm chứng viên",
            )
            db.add(analyst_role)
            db.flush()

        hashed_password = get_password_hash(user_in.password)
        new_user = User(
            email=user_in.email.strip().lower(),
            username=user_in.username.strip(),
            full_name=user_in.full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False,
            roles=[analyst_role],
        )
        db.add(new_user)
        db.flush()

        # Ghi nhật ký kiểm toán (Audit Log)
        audit = AuditLog(
            user_id=new_user.id,
            action="USER_REGISTERED",
            ip_address=ip_address,
            details_json=f'{{"email": "{new_user.email}", "username": "{new_user.username}"}}',
        )
        db.add(audit)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def authenticate(
        db: Session,
        username_or_email: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> User:
        """
        Xác thực đăng nhập tài khoản.
        Tuân thủ nghiêm ngặt cơ chế phòng thủ:
        - Đăng nhập sai quá 5 lần sẽ khóa tài khoản 15 phút.
        - Thông báo số lần thử còn lại hoặc thời gian mở khóa.
        """
        user = UserService.get_by_username_or_email(db, username_or_email)
        now = datetime.now(timezone.utc)

        if not user:
            # Ghi log đăng nhập thất bại do tài khoản không tồn tại
            audit = AuditLog(
                user_id=None,
                action="LOGIN_FAILED_NON_EXISTENT_ACCOUNT",
                ip_address=ip_address,
                user_agent=user_agent,
                details_json=f'{{"attempted_identifier": "{username_or_email}"}}',
            )
            db.add(audit)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tài khoản hoặc mật khẩu không chính xác.",
            )

        # 1. Kiểm tra tài khoản có đang bị khóa do nhập sai quá 5 lần không
        if user.locked_until:
            locked_until_dt = (
                user.locked_until
                if user.locked_until.tzinfo is not None
                else user.locked_until.replace(tzinfo=timezone.utc)
            )
            if locked_until_dt > now:
                remaining_seconds = int((locked_until_dt - now).total_seconds())
                remaining_minutes = max(1, (remaining_seconds + 59) // 60)
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Tài khoản đang bị tạm khóa do nhập sai quá 5 lần. Vui lòng thử lại sau {remaining_minutes} phút.",
                )

        # 2. Kiểm tra mật khẩu
        if not verify_password(password, user.hashed_password):
            user.failed_login_attempts += 1

            if user.failed_login_attempts >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                # Khóa tài khoản trong 15 phút
                lock_duration = timedelta(minutes=settings.ACCOUNT_LOCK_MINUTES)
                user.locked_until = now + lock_duration

                audit = AuditLog(
                    user_id=user.id,
                    action="ACCOUNT_LOCKED_BRUTE_FORCE_ATTEMPT",
                    ip_address=ip_address,
                    user_agent=user_agent,
                    details_json=f'{{"failed_attempts": {user.failed_login_attempts}, "locked_minutes": {settings.ACCOUNT_LOCK_MINUTES}}}',
                )
                db.add(audit)
                db.commit()

                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản bị tạm khóa trong {settings.ACCOUNT_LOCK_MINUTES} phút để đảm bảo an toàn.",
                )

            # Chưa đủ 5 lần: thông báo số lần thử còn lại
            remaining_attempts = settings.MAX_FAILED_LOGIN_ATTEMPTS - user.failed_login_attempts
            audit = AuditLog(
                user_id=user.id,
                action="LOGIN_FAILED_WRONG_PASSWORD",
                ip_address=ip_address,
                user_agent=user_agent,
                details_json=f'{{"failed_attempts": {user.failed_login_attempts}, "remaining_attempts": {remaining_attempts}}}',
            )
            db.add(audit)
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Mật khẩu không chính xác. Bạn còn {remaining_attempts} lần thử trước khi tài khoản bị khóa.",
            )

        # 3. Kiểm tra tài khoản có bị vô hiệu hóa bởi quản trị viên không
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tài khoản này đã bị vô hiệu hóa bởi Quản trị viên.",
            )

        # 4. Xác thực thành công: Reset biến đếm và xóa hạn khóa
        user.failed_login_attempts = 0
        user.locked_until = None

        audit = AuditLog(
            user_id=user.id,
            action="LOGIN_SUCCESS",
            ip_address=ip_address,
            user_agent=user_agent,
            details_json=f'{{"username": "{user.username}"}}',
        )
        db.add(audit)
        db.commit()
        db.refresh(user)
        return user
