import email.utils
from html import unescape
import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import xml.etree.ElementTree as ET

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.evidence import EvidenceDocument, EvidenceSource

logger = logging.getLogger(__name__)

# Danh sách các luồng RSS báo chí chính thống uy tín nhất Việt Nam
OFFICIAL_RSS_FEEDS = [
    {
        "name": "Báo VnExpress - Thời sự",
        "domain": "vnexpress.net",
        "url": "https://vnexpress.net",
        "feed_url": "https://vnexpress.net/rss/thoi-su.rss",
        "reliability_score": 0.98,
        "is_official": True,
    },
    {
        "name": "Báo VnExpress - Pháp luật",
        "domain": "vnexpress.net/phap-luat",
        "url": "https://vnexpress.net/phap-luat",
        "feed_url": "https://vnexpress.net/rss/phap-luat.rss",
        "reliability_score": 0.98,
        "is_official": True,
    },
    {
        "name": "Báo Tuổi Trẻ - Thời sự",
        "domain": "tuoitre.vn",
        "url": "https://tuoitre.vn",
        "feed_url": "https://tuoitre.vn/rss/thoi-su.rss",
        "reliability_score": 0.97,
        "is_official": True,
    },
    {
        "name": "Báo Tuổi Trẻ - Pháp luật",
        "domain": "tuoitre.vn/phap-luat",
        "url": "https://tuoitre.vn/phap-luat.htm",
        "feed_url": "https://tuoitre.vn/rss/phap-luat.rss",
        "reliability_score": 0.97,
        "is_official": True,
    },
    {
        "name": "Báo Thanh Niên - Thời sự",
        "domain": "thanhnien.vn",
        "url": "https://thanhnien.vn",
        "feed_url": "https://thanhnien.vn/rss/thoi-su.rss",
        "reliability_score": 0.96,
        "is_official": True,
    },
]


def clean_html_text(raw_html: Optional[str]) -> str:
    """Loại bỏ thẻ HTML và chuẩn hóa khoảng trắng để lấy trích đoạn nội dung sạch."""
    if not raw_html:
        return ""
    # Xóa toàn bộ thẻ HTML <...>
    text = re.sub(r"<[^>]+>", " ", raw_html)
    # Giải mã HTML entities (&quot;, &amp;, &lt;, v.v.)
    text = unescape(text)
    # Xóa các liên kết thừa và chuẩn hóa khoảng trắng
    text = " ".join(text.split()).strip()
    return text


def parse_pub_date(date_str: Optional[str]) -> Optional[datetime]:
    """Chuyển đổi chuỗi ngày tháng chuẩn RFC 2822 của RSS sang datetime UTC."""
    if not date_str:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(date_str)
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


class RssCollectorService:
    @staticmethod
    def fetch_feed_items(feed_url: str, max_items: int = 10) -> List[Dict[str, Any]]:
        """Tải và bóc tách các bài viết từ một đường dẫn RSS XML."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        }
        items_data = []

        try:
            with httpx.Client(timeout=10.0, follow_redirects=True) as client:
                response = client.get(feed_url, headers=headers)
                if response.status_code != 200:
                    logger.warning(f"Lỗi khi tải RSS {feed_url}: HTTP {response.status_code}")
                    return []

                xml_content = response.text
                root = ET.fromstring(xml_content)

                # Tìm tất cả các thẻ <item> bên trong <channel>
                for item in root.findall(".//item")[:max_items]:
                    title_elem = item.find("title")
                    link_elem = item.find("link")
                    desc_elem = item.find("description")
                    pub_date_elem = item.find("pubDate")

                    title = clean_html_text(title_elem.text) if title_elem is not None else ""
                    link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                    snippet = clean_html_text(desc_elem.text) if desc_elem is not None else ""
                    pub_date = parse_pub_date(pub_date_elem.text if pub_date_elem is not None else None)

                    if title and link:
                        items_data.append({
                            "title": title,
                            "url": link,
                            "snippet": snippet or title,
                            "published_date": pub_date,
                        })

        except Exception as e:
            logger.error(f"Ngoại lệ khi xử lý RSS từ {feed_url}: {e}")

        return items_data

    @staticmethod
    def sync_all_feeds(db: Session, max_items_per_feed: int = 10) -> Dict[str, Any]:
        """
        Quét toàn bộ danh sách RSS báo chí chính thống và lưu bài viết mới vào DB.
        Đảm bảo không lưu bài trùng lặp.
        """
        total_new_docs = 0
        total_skipped = 0
        feed_reports = []

        for feed_config in OFFICIAL_RSS_FEEDS:
            # 1. Tìm hoặc tạo nguồn tin (EvidenceSource)
            source = db.scalar(
                select(EvidenceSource).where(EvidenceSource.domain == feed_config["domain"])
            )
            if not source:
                source = EvidenceSource(
                    name=feed_config["name"],
                    domain=feed_config["domain"],
                    url=feed_config["url"],
                    reliability_score=feed_config["reliability_score"],
                    is_official=feed_config["is_official"],
                )
                db.add(source)
                db.flush()

            # 2. Tải bài viết từ RSS
            items = RssCollectorService.fetch_feed_items(
                feed_config["feed_url"],
                max_items=max_items_per_feed,
            )

            new_in_feed = 0
            skipped_in_feed = 0

            for it in items:
                # Kiểm tra bài viết đã tồn tại theo URL chưa
                existing = db.scalar(
                    select(EvidenceDocument).where(EvidenceDocument.url == it["url"])
                )
                if existing:
                    skipped_in_feed += 1
                    total_skipped += 1
                    continue

                new_doc = EvidenceDocument(
                    source_id=source.id,
                    title=it["title"],
                    url=it["url"],
                    snippet=it["snippet"],
                    published_date=it["published_date"],
                )
                db.add(new_doc)
                new_in_feed += 1
                total_new_docs += 1

            db.commit()

            feed_reports.append({
                "source": feed_config["name"],
                "fetched": len(items),
                "new_added": new_in_feed,
                "skipped": skipped_in_feed,
            })

        return {
            "status": "success",
            "message": f"Đồng bộ hoàn tất: đã thêm mới {total_new_docs} bài báo, bỏ qua {total_skipped} bài trùng lặp.",
            "total_new_documents": total_new_docs,
            "total_skipped": total_skipped,
            "details": feed_reports,
        }


if __name__ == "__main__":
    from app.db.session import SessionLocal
    print("[RSS] Đang tiến hành đồng bộ tin tức thời sự từ các báo chính thống...")
    with SessionLocal() as session:
        res = RssCollectorService.sync_all_feeds(session, max_items_per_feed=8)
        print(f"[RSS Kết quả] {res['message']}")
        for d in res["details"]:
            print(f"  - {d['source']}: Tải {d['fetched']} bài | Thêm mới {d['new_added']} | Trùng lặp {d['skipped']}")
