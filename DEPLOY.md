# 🚀 HoaNgữ LMS - Deployment Guide

## Mục lục
1. [Database → Neon PostgreSQL](#1-database--neon-postgresql)
2. [Backend → Render](#2-backend--render)
3. [Frontend → Netlify](#3-frontend--netlify)
4. [Xác minh & Troubleshooting](#4-xác-minh--troubleshooting)

---

## 1. Database → Neon PostgreSQL

### Bước 1.1: Tạo tài khoản Neon
1. Truy cập [Neon.tech](https://neon.tech)
2. Đăng ký tài khoản (dùng GitHub để đăng nhập)
3. Click **"Create a project"**
4. Điền thông tin:
   - **Project name**: `hoangu-lms`
   - **Database name**: `hoangu_lms`
5. Click **"Create Project"**

### Bước 1.2: Lấy Connection String
1. Sau khi tạo project, click **"Connection Details"**
2. Chọn tab **"Pooled connection"** (nên dùng pooled để tránh connection limits)
3. Copy connection string:
```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/hoangu_lms?sslmode=require
```

### Bước 1.3: Tạo Database Tables
1. Trong Neon Dashboard, click **"Query"**
2. Copy và chạy nội dung file `src/server/db/schema.sql`

---

## 2. Backend → Render

### Bước 2.1: Push code lên GitHub
```bash
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Bước 2.2: Tạo Web Service trên Render
1. Đăng nhập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository của bạn
4. Cấu hình:
   - **Name**: `hoangu-lms-api`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` hoặc `Singapore`
   - **Branch**: `main`
   - **Build Command**: `cd src/server && npm install && npm run build`
   - **Start Command**: `cd src/server && npm start`

### Bước 2.3: Thêm Environment Variables
Trong phần **"Environment Variables"**, thêm:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render gán port tự động |
| `DB_HOST` | `ep-xxx.us-east-1.aws.neon.tech` | Từ Neon connection string |
| `DB_NAME` | `hoangu_lms` | |
| `DB_USER` | `your_username` | Từ Neon |
| `DB_PASSWORD` | `your_password` | Từ Neon (click "Reveal" để nhập) |
| `DB_PORT` | `5432` | |
| `JWT_SECRET` | `[tạo chuỗi bảo mật]` | Dùng: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://hoangu-lms.netlify.app` | Sau khi deploy Netlify |
| `VNP_RETURNURL` | `https://hoangu-lms.netlify.app/payment/return` | |
| `EMAIL_PROVIDER` | `console` | Hoặc `resend` nếu có API key |
| `LOG_LEVEL` | `info` | |

5. Click **"Create Web Service"**
6. Đợi build hoàn tất (khoảng 5-10 phút)

### Bước 2.4: Kiểm tra API
Sau khi deploy, truy cập:
```
https://hoangu-lms-api.onrender.com/api/health
```

---

## 3. Frontend → Netlify

### Bước 3.1: Cập nhật Environment Variables
Mở file `.env.local` và bỏ comment dòng production:
```env
VITE_API_URL=https://hoangu-lms-api.onrender.com/api
```

### Bước 3.2: Deploy lên Netlify
**Cách 1: Sử dụng Netlify CLI**
```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Cách 2: Sử dụng GitHub (Khuyến nghị)**
1. Đăng nhập [Netlify](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub và chọn repository
4. Cấu hình:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20`
5. Click **"Deploy site"**

### Bước 3.3: Cập nhật Environment Variables trên Netlify
1. Trong Netlify Dashboard → Site → **"Site settings"**
2. Click **"Environment variables"**
3. Thêm:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://hoangu-lms-api.onrender.com/api`
4. Click **"Deploy"** để rebuild với biến mới

---

## 4. Xác minh & Troubleshooting

### Kiểm tra hoạt động
1. **API Health**: `https://hoangu-lms-api.onrender.com/api/health`
2. **Frontend**: `https://hoangu-lms.netlify.app`
3. Đăng nhập và kiểm tra các chức năng

### Các lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| `502 Bad Gateway` | Backend chưa start | Kiểm tra Render logs |
| `CORS error` | FRONTEND_URL chưa đúng | Cập nhật FRONTEND_URL trong Render |
| `Database connection failed` | DB credentials sai | Kiểm tra DB_HOST, DB_USER, DB_PASSWORD |
| `JWT error` | JWT_SECRET chưa set | Thêm JWT_SECRET trong Render env vars |
| `Static page 404` | Redirect chưa đúng | Kiểm tra netlify.toml |

### Logs
- **Backend**: Render Dashboard → `hoangu-lms-api` → **"Logs"**
- **Frontend**: Netlify Dashboard → Site → **"Deploy logs"**

---

## Cấu trúc Files Đã Tạo

```
hoangu.techhave.com/
├── netlify.toml          # Netlify configuration
├── render.yaml           # Render configuration  
├── DEPLOY.md             # Deployment guide (file này)
├── .env.local            # Updated with production API URL
└── src/server/
    ├── package.json      # Already exists
    ├── .env              # Update with Neon credentials
    └── db/
        └── schema.sql    # Database schema
```

---

## Quick Commands

### Deploy Backend (sau khi cập nhật code)
```bash
git add .
git commit -m "Update: fix bug"
git push origin main
# Render sẽ tự deploy
```

### Deploy Frontend
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

**Chúc bạn deploy thành công! 🎉**
