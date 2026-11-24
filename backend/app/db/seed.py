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

    # 2. Danh sách tài khoản quản trị viên duy nhất
    users_data = [
        {
            "username": "phequan23",
            "email": "phequan@gmail.com",
            "full_name": "Quản Trị Viên Hệ Thống",
            "password": "@AQuan24",
            "is_superuser": True,
            "roles": [role_objs["Admin"], role_objs["Analyst"]],
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

    # 3. Nạp danh mục Nguồn Báo chí chính thống & Bằng chứng xác thực (Ground Truth)
    from app.models.evidence import EvidenceSource, EvidenceDocument

    sources_data = [
        {"name": "Báo VnExpress", "domain": "vnexpress.net", "url": "https://vnexpress.net", "reliability_score": 0.98},
        {"name": "Báo Tuổi Trẻ", "domain": "tuoitre.vn", "url": "https://tuoitre.vn", "reliability_score": 0.97},
        {"name": "Báo Thanh Niên", "domain": "thanhnien.vn", "url": "https://thanhnien.vn", "reliability_score": 0.96},
    ]

    source_objs = {}
    for s in sources_data:
        existing_s = db.scalar(select(EvidenceSource).where(EvidenceSource.domain == s["domain"]))
        if not existing_s:
            existing_s = EvidenceSource(
                name=s["name"],
                domain=s["domain"],
                url=s["url"],
                reliability_score=s["reliability_score"],
                is_official=True,
            )
            db.add(existing_s)
            db.flush()
        source_objs[s["domain"]] = existing_s

    evidence_docs_data = [
        {
            "domain": "vnexpress.net",
            "title": "Bác bỏ tin đồn vỡ đê sông Hồng, cơ quan chức năng khẳng định các tuyến đê xung yếu vẫn an toàn",
            "url": "https://vnexpress.net/bac-bo-tin-don-vo-de-song-hong-4791024.html",
            "snippet": "Cục Quản lý đê điều và Phòng chống thiên tai khẳng định thông tin vỡ đê sông Hồng trên mạng xã hội là sai sự thật, thất thiệt. Toàn bộ các vị trí xung yếu vẫn được giám sát 24/7.",
        },
        {
            "domain": "tuoitre.vn",
            "title": "Bản tin dự báo thời tiết và diễn biến mưa lũ diện rộng tại Bắc Bộ",
            "url": "https://tuoitre.vn/thoi-tiet-bac-bo-mua-rai-rac-20240912.htm",
            "snippet": "Trung tâm Dự báo Khí tượng Thủy văn Quốc gia phát đi bản tin: Áp thấp nhiệt đới gây mưa rải rác tại các tỉnh Bắc Bộ trong 24 giờ tới, người dân cần chú ý các vùng trũng thấp.",
        },
        {
            "domain": "thanhnien.vn",
            "title": "Bộ Y tế cảnh báo các bài thuốc dân gian truyền miệng chưa kiểm chứng trị ung thư",
            "url": "https://thanhnien.vn/bo-y-te-canh-bao-bai-thuoc-chua-ung-thu-truyen-mieng-1852409.htm",
            "snippet": "Cục Quản lý Dược và Bệnh viện K khuyến cáo người bệnh không tự ý dùng lá cây đu đủ, sả tươi thay thế phác đồ điều trị ung thư đã được chuẩn hóa y khoa.",
        },
        {
            "domain": "vnexpress.net",
            "title": "Xử phạt đối tượng tung tin đồn đổi tiền và phong tỏa tài khoản ngân hàng",
            "url": "https://vnexpress.net/xu-phat-doi-tuong-tung-tin-don-doi-tien-4789123.html",
            "snippet": "Công an thành phố đã xử phạt vi phạm hành chính đối với chủ tài khoản mạng xã hội đăng tin thất thiệt về chính sách tiền tệ và hệ thống ngân hàng.",
        },
        {
            "domain": "tuoitre.vn",
            "title": "Thực hư hình ảnh vỡ đập thủy điện: Sự thật là hình ảnh lũ lụt cũ tại nước ngoài",
            "url": "https://tuoitre.vn/su-that-hinh-anh-vo-dap-thuy-dien-20240915.htm",
            "snippet": "Trung tâm Xử lý tin giả Việt Nam (VAFC) xác định bức ảnh lan truyền trên Facebook thực chất là sự cố ngập lụt tại châu Âu năm 2021, bị cắt ghép để câu view.",
        },
    ]

    for d in evidence_docs_data:
        existing_doc = db.scalar(select(EvidenceDocument).where(EvidenceDocument.url == d["url"]))
        if not existing_doc:
            src = source_objs.get(d["domain"])
            if src:
                doc = EvidenceDocument(
                    source_id=src.id,
                    title=d["title"],
                    url=d["url"],
                    snippet=d["snippet"],
                )
                db.add(doc)

    db.commit()
    print("[SEED] Hoàn tất nạp dữ liệu mẫu ban đầu!")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_initial_data(session)
