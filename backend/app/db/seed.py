from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User, Role
from app.core.security import get_password_hash


def seed_initial_data(db: Session) -> None:
    """
    Tự động khởi tạo các vai trò (Roles) và tài khoản mẫu ban đầu.
    Giúp người dùng và kiểm thử viên có thể đăng nhập ngay lập tức.
    """
    # 1. Khởi tạo danh sách vai trò nếu chưa tồn tại
    roles_data = [
        {"name": "Admin", "description": "Quản trị viên toàn quyền hệ thống"},
        {"name": "Researcher", "description": "Nhà nghiên cứu AI & Đa phương thức"},
        {"name": "Analyst", "description": "Chuyên viên phân tích thông tin & kiểm chứng"},
        {"name": "Viewer", "description": "Người xem báo cáo và kết quả phân tích"},
    ]

    role_objs = {}
    for r in roles_data:
        existing_role = db.scalar(select(Role).where(Role.name == r["name"]))
        if not existing_role:
            existing_role = Role(name=r["name"], description=r["description"])
            db.add(existing_role)
            db.flush()
        role_objs[r["name"]] = existing_role

    # 2. Danh sách tài khoản mẫu mặc định
    users_data = [
        {
            "username": "admin",
            "email": "admin@sic.edu.vn",
            "full_name": "Quản Trị Viên Hệ Thống",
            "password": "AdminPassword123!",
            "is_superuser": True,
            "roles": [role_objs["Admin"], role_objs["Researcher"]],
        },
        {
            "username": "researcher",
            "email": "researcher@sic.edu.vn",
            "full_name": "Nguyễn Văn Nghiên Cứu",
            "password": "ResearcherPassword123!",
            "is_superuser": False,
            "roles": [role_objs["Researcher"]],
        },
        {
            "username": "analyst",
            "email": "analyst@sic.edu.vn",
            "full_name": "Trần Thị Phân Tích",
            "password": "AnalystPassword123!",
            "is_superuser": False,
            "roles": [role_objs["Analyst"]],
        },
        {
            "username": "test_lock",
            "email": "test_lock@sic.edu.vn",
            "full_name": "Tài Khoản Test Khóa 15 Phút",
            "password": "Password123!",
            "is_superuser": False,
            "roles": [role_objs["Analyst"]],
        },
    ]

    for u in users_data:
        existing_user = db.scalar(select(User).where(User.username == u["username"]))
        if not existing_user:
            new_user = User(
                username=u["username"],
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=get_password_hash(u["password"]),
                is_active=True,
                is_superuser=u["is_superuser"],
                roles=u["roles"],
            )
            db.add(new_user)
            print(f"[SEED] Đã tạo tài khoản: {u['username']} ({u['email']})")

    db.commit()
    print("[SEED] Hoàn tất nạp dữ liệu mẫu ban đầu!")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_initial_data(session)
