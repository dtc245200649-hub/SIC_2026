from sqlalchemy.orm import Session
from app.schemas.social import SocialUrlAnalysisRequest, SocialApiQueryRequest
from app.services.social_scraper import social_scraper
from app.services.social_api_connector import social_api_connector
from app.api.v1.endpoints.social import (
    analyze_social_url,
    query_social_research_api,
    get_supported_platforms,
)


def test_social_scraper_platform_detection():
    assert social_scraper.detect_platform("https://www.tiktok.com/@vtv24news/video/7123456789") == "TIKTOK"
    assert social_scraper.detect_platform("https://vt.tiktok.com/ZS23456/") == "TIKTOK"
    assert social_scraper.detect_platform("https://www.facebook.com/thoisuvtv/posts/123456") == "FACEBOOK"
    assert social_scraper.detect_platform("https://fb.watch/abcd1234/") == "FACEBOOK"
    assert social_scraper.detect_platform("https://vnexpress.net/thoi-su") == "UNKNOWN"


def test_social_scraper_data_extraction():
    tiktok_data = social_scraper.scrape_url("https://www.tiktok.com/@kenhtintuc/video/123456")
    assert tiktok_data["platform"] == "TIKTOK"
    assert "engagement" in tiktok_data
    assert "virality_score" in tiktok_data["engagement"]
    assert len(tiktok_data["caption"]) > 0
    assert tiktok_data["metadata_source"] in ("LIVE_OEMBED", "CANONICAL_URL_PARSER")

    fb_data = social_scraper.scrape_url("https://www.facebook.com/nguoilaodong/posts/987654")
    assert fb_data["platform"] == "FACEBOOK"
    assert "engagement" in fb_data
    assert "virality_score" in fb_data["engagement"]
    assert len(fb_data["caption"]) > 0


def test_social_api_connector_query():
    tiktok_res = social_api_connector.query_tiktok_research_api(keyword="tin_gia", max_results=3)
    assert tiktok_res.platform == "TIKTOK_RESEARCH"
    assert len(tiktok_res.results) >= 1

    meta_res = social_api_connector.query_meta_graph_api(hashtag="#canhbao", max_results=3)
    assert meta_res.platform == "META_GRAPH"
    assert len(meta_res.results) >= 1


def test_analyze_social_url_endpoint(db_session: Session):
    tiktok_req = SocialUrlAnalysisRequest(
        url="https://www.tiktok.com/@tintuc24h/video/789101112",
        analyze_cascade=True,
    )
    res_tiktok = analyze_social_url(payload=tiktok_req, current_user=None, db=db_session)
    assert res_tiktok.session_id is not None
    assert res_tiktok.platform == "TIKTOK"
    assert res_tiktok.predicted_label in ("SAI_SU_THAT", "CHINH_XAC", "CAN_KIEM_CHUNG")
    assert res_tiktok.propagation_risk_level in ("CAO", "TRUNG_BINH", "THAP")
    assert res_tiktok.cascade_nodes_predicted >= 0

    fb_req = SocialUrlAnalysisRequest(
        url="https://www.facebook.com/thongtinchinhphu/posts/888999111",
        analyze_cascade=True,
    )
    res_fb = analyze_social_url(payload=fb_req, current_user=None, db=db_session)
    assert res_fb.session_id is not None
    assert res_fb.platform == "FACEBOOK"


def test_supported_platforms_endpoint():
    platforms = get_supported_platforms()
    assert "supported_platforms" in platforms
    assert len(platforms["supported_platforms"]) == 2
    assert platforms["extension_manifest_version"] == "v3"
