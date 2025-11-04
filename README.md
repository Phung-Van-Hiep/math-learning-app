# Website Dạy Học Toán THCS - Trường THCS Như Quỳnh

Hệ thống website hỗ trợ dạy học môn Toán THCS với đầy đủ tính năng cho học sinh và giáo viên.


## 🚀 Hướng dẫn cài đặt

### 🐳 Quick Start với Docker (Khuyên dùng)

**Cách đơn giản nhất - Database chạy trong Docker:**

```bash
# 1. Start database
docker-compose up -d

# 2. Setup backend
cd be
python -m venv venv
venv\Scripts\activate  # Windows (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
python create_admin.py
python main.py

# 3. Setup frontend (2 terminals)
cd fe
npm install
npm run dev:client  # Terminal 1
npm run dev:admin   # Terminal 2
```

📖 **Xem hướng dẫn chi tiết**: [QUICK_START_DOCKER.md](QUICK_START_DOCKER.md)

---

### 📋 Cài đặt thủ công

### 1. Yêu cầu hệ thống

- Node.js >= 18.x
- Python >= 3.9
- **Docker Desktop** (khuyên dùng) HOẶC MySQL/PostgreSQL (cài thủ công)

### 2. Cài đặt Frontend

```bash
cd fe

# Cài đặt dependencies
npm install

# Chạy client app (port 3000)
npm run dev:client

# Chạy admin app (port 3001)
npm run dev:admin

# Hoặc chạy cả hai cùng lúc
npm run dev
```

### 3. Cài đặt Backend

```bash
cd be

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với thông tin database của bạn

# Chạy server (port 9532)
python main.py

# Hoặc dùng uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 9532
```

### 4. Cấu hình Database

**Option 1: Docker (Khuyên dùng) ✨**
```bash
# Start MySQL in Docker
docker-compose up -d

# .env file already configured for Docker
DATABASE_URL=mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3307/thcs_math
```
📖 [Docker Setup Guide](DOCKER_SETUP.md)

**Option 2: SQLite (Đơn giản)**
```env
DATABASE_URL=sqlite:///./thcs_math.db
```

**Option 3: MySQL (Cài thủ công)**
```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/thcs_math
```

**Option 4: PostgreSQL (Cài thủ công)**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/thcs_math
```

### 5. Tạo Admin Account đầu tiên

```bash
cd be
python create_admin.py
```

Thông tin đăng nhập mặc định:
- Email: `admin@thcsnhuquynh.edu.vn`
- Password: `admin123`

## 📚 API Documentation

Sau khi chạy backend, truy cập:
- Swagger UI: http://localhost:9532/docs
- ReDoc: http://localhost:9532/redoc

## 🎯 Tính năng chính

### Client (Học sinh)
- ✅ Đăng ký / Đăng nhập
- ✅ Xem bài giảng video
- ✅ Học nội dung Toán học
- ✅ Làm bài kiểm tra
- ✅ Xem kết quả và tiến độ
- ✅ Quản lý bài làm
- ✅ Cài đặt tài khoản
- ✅ Gửi phản hồi

### Admin (Giáo viên)
- ✅ Dashboard thống kê
- ✅ Quản lý giới thiệu bài học
- ✅ Upload và quản lý video
- ✅ Quản lý nội dung Toán học
- ✅ Tạo và quản lý bài kiểm tra
- ✅ Xem kết quả học sinh
- ✅ Quản lý công cụ tương tác
- ✅ Xem và trả lời phản hồi

## 🔐 Authentication

- **Client**: JWT tokens với OAuth2PasswordBearer
- **Admin**: Separate JWT tokens cho admin
- **Token expiry**: 60 minutes (configurable)

## 📦 Tech Stack

### Frontend
- **Framework**: React 18 với ViteJS
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib với bcrypt
- **Validation**: Pydantic

## 🌐 Ports

- Client App: http://localhost:3000
- Admin App: http://localhost:3001
- Backend API: http://localhost:9532
- Database UI (phpMyAdmin): http://localhost:8085 (nếu dùng Docker)

## 📝 Environment Variables

Xem file `.env.example` trong thư mục `be/` để biết các biến môi trường cần thiết.

## 🧪 Testing

```bash
# Frontend
cd fe
npm run test

# Backend
cd be
pytest
```

## 📄 License

© 2024 Trường THCS Như Quỳnh. All rights reserved.

## 👥 Contributors

Nhóm nghiên cứu khoa học THCS - Trường THCS Như Quỳnh

---

## 📖 Tài liệu bổ sung

- **[QUICK_START_DOCKER.md](QUICK_START_DOCKER.md)** - Quick start với Docker (5 phút)
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Hướng dẫn Docker chi tiết
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết từng bước
- **[START_DEV.md](START_DEV.md)** - Quick start development
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Tình trạng dự án
- **design/** - Thiết kế UX

