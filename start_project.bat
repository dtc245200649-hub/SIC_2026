@echo off
chcp 65001 > nul
title HỆ THỐNG PHÁT HIỆN THÔNG TIN SAI LỆCH ĐA PHƯƠNG THỨC - SIC 2026
echo ======================================================================
echo    KHỞI ĐỘNG HỆ THỐNG (CHẠY TRỰC TIẾP TRÊN Ổ D - KHÔNG DÙNG DOCKER)
echo ======================================================================
echo.

set PROJECT_DIR=D:\Download\SIC\DUANNHOM

echo [1/3] Đang khởi động Backend FastAPI (Cổng 8000)...
start "Backend - FastAPI & AI Engine" cmd /k "cd /d %PROJECT_DIR%\backend && uvicorn app.main:app --reload --port 8000"

echo [2/3] Đang khởi động Frontend React (Cổng 5173)...
start "Frontend - React Vite UI" cmd /k "cd /d %PROJECT_DIR%\frontend && npm run dev"

echo [3/3] Đang mở trình duyệt giao diện hệ thống...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo ======================================================================
echo    ✔ Hệ thống đã khởi chạy thành công!
echo    - Giao diện người dùng: http://localhost:5173
echo    - Tài liệu API Swagger:  http://localhost:8000/docs
echo ======================================================================
pause
