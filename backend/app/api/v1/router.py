from fastapi import APIRouter
from app.api.v1.endpoints import auth, fact_check, analysis, social

api_v1_router = APIRouter()

# Tích hợp module xác thực
api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Tích hợp module kiểm chứng & Bằng chứng báo chí
api_v1_router.include_router(fact_check.router, prefix="/fact-check", tags=["Fact-Checking & Evidence"])

# Tích hợp module phân tích đơn phương thức & đa phương thức
api_v1_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis Encoders"])

# Tích hợp module mạng xã hội (TikTok & Facebook)
api_v1_router.include_router(social.router, prefix="/social", tags=["Social Media (TikTok & Facebook)"])
