# =========================================================================
# BACKEND DOCKERFILE - MULTIMODAL MISINFORMATION DETECTION PLATFORM
# Python 3.11 Slim with PyTorch CPU & Transformers
# =========================================================================
FROM python:3.11-slim

# Thiết lập biến môi trường hệ thống
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH="/app:/app/backend" \
    HF_HOME="/app/data/huggingface" \
    TORCH_HOME="/app/data/torch"

# Cài đặt các thư viện hệ thống cần thiết (C compiler, libpq cho PostgreSQL, FFmpeg cho xử lý media)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cài đặt Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt

# Sao chép mã nguồn backend và ai_engine
COPY ai_engine /app/ai_engine
COPY backend /app/backend

# Tạo thư mục lưu trữ uploads và cache
RUN mkdir -p /app/backend/uploads/images /app/backend/uploads/videos /app/backend/uploads/audio /app/backend/uploads/multimodal \
    && mkdir -p /app/data/huggingface /app/data/torch

WORKDIR /app/backend

# Cổng dịch vụ
EXPOSE 8000

# Kiểm tra trạng thái sức khỏe container
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Khởi chạy ứng dụng FastAPI qua Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
