# Kịch bản Test - HoaNgữ LMS

## Chuẩn bị
```bash
# Khởi động backend server
cd src/server
npm start  # hoặc: node index.ts

# Khởi động frontend
cd ../..
npm run dev
```

---

## 1. Test Đăng ký & Đăng nhập

### 1.1 Đăng ký với email bất kỳ
```
1. Truy cập http://localhost:5173/register
2. Nhập:
   - Họ tên: "Nguyễn Văn Test"
   - Email: "test@gmail.com" (hoặc bất kỳ email nào)
   - Mật khẩu: "123456"
   - Xác nhận mật khẩu: "123456"
3. Quan sát:
   - ✓ Check icon xuất hiện khi nhập đúng
   - ✓ Nút "Đăng ký" chỉ enable khi form hợp lệ
4. Click "Đăng ký"
5. Chuyển hướng đến Dashboard
```

### 1.2 Đăng nhập
```
1. Truy cập http://localhost:5173/login
2. Nhập email/password đã đăng ký
3. Click "Đăng nhập"
4. ✓ Chuyển hướng đến Dashboard
```

### 1.3 Đăng nhập với email sai
```
1. Nhập email không tồn tại
2. Click "Đăng nhập"
3. ✓ Hiển thị lỗi: "Email hoặc mật khẩu không đúng"
```

---

## 2. Test Quên mật khẩu

### 2.1 Gửi yêu cầu quên mật khẩu
```
1. Từ trang login, click "Quên mật khẩu?"
2. Truy cập http://localhost:5173/forgot-password
3. Nhập email: "test@gmail.com"
4. Click "Gửi link đặt lại mật khẩu"
5. Quan sát:
   - ✓ Hiển thị thông báo thành công
   - ✓ Check server console để lấy reset token
```

### 2.2 Đặt lại mật khẩu
```
1. Copy token từ server console (log: [RESET PASSWORD] Token for test@gmail.com: ...)
2. Truy cập: http://localhost:5173/reset-password?token=<TOKEN>
3. Nhập mật khẩu mới: "654321"
4. Nhập lại mật khẩu: "654321"
5. Click "Đặt lại mật khẩu"
6. ✓ Hiển thị thành công, chuyển về login
```

### 2.3 Đăng nhập với mật khẩu mới
```
1. Đăng nhập với password mới: "654321"
2. ✓ Đăng nhập thành công
```

---

## 3. Test Đổi mật khẩu (khi đã đăng nhập)

```
1. Đăng nhập với tài khoản test
2. Truy cập http://localhost:5173/settings
3. Click tab "Bảo mật"
4. Nhập:
   - Mật khẩu hiện tại: "654321"
   - Mật khẩu mới: "abc123"
   - Xác nhận mật khẩu: "abc123"
5. Quan sát:
   - ✓ Check icon xuất hiện khi hợp lệ
6. Click "Đổi mật khẩu"
7. ✓ Hiển thị toast thành công
8. Đăng xuất và đăng nhập với mật khẩu mới
```

---

## 4. Test Admin Quản lý User

### 4.1 Truy cập Admin
```
1. Đăng nhập với tài khoản admin
2. Truy cập http://localhost:5173/admin/users
3. ✓ Hiển thị danh sách users
```

### 4.2 Tạo user mới
```
1. Click nút "Thêm người dùng"
2. Nhập:
   - Họ tên: "User Test Mới"
   - Email: "newuser@test.com"
   - Mật khẩu: "123456"
   - Vai trò: "student"
3. Click "Tạo người dùng"
4. ✓ Hiển thị thành công, user mới xuất hiện trong danh sách
```

### 4.3 Sửa user
```
1. Click icon "Sửa" bên cạnh user
2. Thay đổi level hoặc coins
3. Click "Lưu"
4. ✓ Cập nhật thành công
```

### 4.4 Xóa user
```
1. Click icon "Xóa" bên cạnh user
2. Xác nhận trong popup
3. ✓ User bị xóa khỏi danh sách
```

---

## 5. Test UX Improvements

### 5.1 Form Validation Real-time
```
1. Vào trang Đăng ký
2. Nhập email không hợp lệ: "test"
3. Click ra ngoài (blur)
4. ✓ Hiển thị lỗi: "Email không hợp lệ"
5. Nhập email hợp lệ: "test@gmail.com"
6. ✓ Hiển thị check icon xanh
```

### 5.2 Keyboard Shortcuts
```
Sau khi đăng nhập:
- Nhấn Ctrl+D → Chuyển đến Dashboard
- Nhấn Ctrl+C → Chuyển đến Courses
- Nhấn Ctrl+S → Chuyển đến Settings
- Nhấn Ctrl+L → Chuyển đến Leaderboard
- Nhấn ? → Hiển thị help modal (nếu có)
- Nhấn Esc → Đóng modal
```

### 5.3 Celebration Animations
```
1. Hoàn thành một bài học
2. ✓ Hiển thị confetti animation
```

---

## 6. Test API Validation (Backend)

### 6.1 Đăng ký với email trùng
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123456","full_name":"Test"}'

# Kết quả: {"success":false,"error":"Email đã được sử dụng"}
```

### 6.2 Đăng ký với dữ liệu thiếu
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@gmail.com"}'

# Kết quả: {"success":false,"error":"Email, password và full_name là bắt buộc"}
```

### 6.3 Đổi mật khẩu không có token
```bash
curl -X PUT http://localhost:3000/api/auth/password \
  -H "Content-Type: application/json" \
  -d '{"current_password":"123","new_password":"456"}'

# Kết quả: {"success":false,"error":"Không có token"}
```

---

## 7. Test Bảo mật

### 7.1 SQL Injection Prevention
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'\" OR '1'='1","password":"anything"}'

# Kết quả: {"success":false,"error":"Email hoặc mật khẩu không đúng"}
```

### 7.2 XSS Prevention
```
1. Đăng ký với name chứa script: "<script>alert(1)</script>"
2. ✓ Script được sanitize, không thực thi
```

---

## 8. Checklist Kết quả

| STT | Chức năng | Trạng thái |
|-----|-----------|-------------|
| 1 | Đăng ký email bất kỳ | ☐ |
| 2 | Đăng nhập | ☐ |
| 3 | Quên mật khẩu | ☐ |
| 4 | Đặt lại mật khẩu | ☐ |
| 5 | Đổi mật khẩu khi đã login | ☐ |
| 6 | Admin tạo user | ☐ |
| 7 | Admin sửa user | ☐ |
| 8 | Admin xóa user | ☐ |
| 9 | Form validation real-time | ☐ |
| 10 | Keyboard shortcuts | ☐ |
| 11 | Celebration animations | ☐ |
| 12 | API validation | ☐ |
| 13 | Bảo mật SQL Injection | ☐ |
