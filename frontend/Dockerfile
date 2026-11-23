# =========================================================================
# FRONTEND DOCKERFILE - MULTIMODAL MISINFORMATION DETECTION PLATFORM
# Multi-stage build: Node.js 20 Alpine -> Nginx Alpine
# =========================================================================

# Stage 1: Build source code bằng Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Sao chép toàn bộ mã nguồn frontend và build bản phân phối production
COPY frontend/ ./
RUN npm run build

# Stage 2: Phục vụ tĩnh bằng Nginx chuyên dụng
FROM nginx:1.27-alpine

# Sao chép cấu hình Nginx reverse proxy
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép sản phẩm build từ Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Chạy Nginx ở chế độ tiền cảnh
CMD ["nginx", "-g", "daemon off;"]
