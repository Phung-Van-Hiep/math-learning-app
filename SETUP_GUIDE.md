# Hướng dẫn cài đặt chi tiết

## Bước 1: Chuẩn bị môi trường

### Cài đặt Node.js
Tải và cài đặt Node.js từ: https://nodejs.org/ (Khuyên dùng phiên bản LTS)

Kiểm tra cài đặt:
```bash
node --version  # Cần >= 18.x
npm --version
```

### Cài đặt Python
Tải và cài đặt Python từ: https://www.python.org/ (Khuyên dùng >= 3.9)

Kiểm tra cài đặt:
```bash
python --version  # hoặc python3 --version
pip --version     # hoặc pip3 --version
```

## Bước 2: Clone hoặc tải dự án

```bash
# Nếu dùng git
git clone <repository-url>
cd nckh_thcs

# Hoặc giải nén file zip vào thư mục nckh_thcs
```

## Bước 3: Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd fe

# Cài đặt tất cả dependencies
npm install

# Chờ quá trình cài đặt hoàn tất (có thể mất vài phút)
```

**Lưu ý**: Nếu gặp lỗi, thử xóa folder `node_modules` và file `package-lock.json`, sau đó chạy `npm install` lại.

## Bước 4: Cài đặt Backend

```bash
# Di chuyển vào thư mục backend (từ root)
cd ../be

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Trên Windows:
venv\Scripts\activate

# Trên Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

## Bước 5: Cấu hình Database

### Option 1: Dùng SQLite (Đơn giản nhất - Khuyên dùng cho dev)

```bash
# Tạo file .env
cp .env.example .env

# Mở file .env và đảm bảo dòng DATABASE_URL là:
DATABASE_URL=sqlite:///./thcs_math.db
```

### Option 2: Dùng MySQL

1. Cài đặt MySQL Server
2. Tạo database mới:
```sql
CREATE DATABASE thcs_math CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Cập nhật file `.env`:
```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/thcs_math
```

### Option 3: Dùng PostgreSQL

1. Cài đặt PostgreSQL
2. Tạo database mới:
```sql
CREATE DATABASE thcs_math;
```

3. Cập nhật file `.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/thcs_math
```

## Bước 6: Tạo bảng Database và Admin Account

```bash
# Đảm bảo đang ở trong thư mục be và đã activate venv

# Tạo bảng database (tự động khi chạy server lần đầu)
# Hoặc chạy:
python -c "from services.database import engine, Base; from services import models; Base.metadata.create_all(bind=engine)"

# Tạo admin account
python create_admin.py
```

Thông tin đăng nhập admin mặc định:
- Email: `admin@thcsnhuquynh.edu.vn`
- Password: `admin123`

## Bước 7: Chạy ứng dụng

### Mở 3 terminal/command prompt:

**Terminal 1 - Backend:**
```bash
cd be
# Activate venv nếu chưa
venv\Scripts\activate  # Windows
# hoặc source venv/bin/activate  # Linux/Mac

python main.py
```
Backend sẽ chạy tại: http://localhost:9532

**Terminal 2 - Client Frontend:**
```bash
cd fe
npm run dev:client
```
Client sẽ chạy tại: http://localhost:3000

**Terminal 3 - Admin Frontend:**
```bash
cd fe
npm run dev:admin
```
Admin sẽ chạy tại: http://localhost:3001

## Bước 8: Truy cập ứng dụng

- **Website học sinh**: http://localhost:3000
- **Admin panel**: http://localhost:3001
- **API documentation**: http://localhost:9532/docs

### Đăng nhập Admin:
1. Mở http://localhost:3001
2. Email: `admin@thcsnhuquynh.edu.vn`
3. Password: `admin123`

### Tạo tài khoản học sinh:
1. Mở http://localhost:3000
2. Click "Đăng nhập"
3. Click "Đăng ký ngay"
4. Điền thông tin và đăng ký

## Xử lý sự cố thường gặp

### Lỗi port đã được sử dụng

**Frontend:**
```bash
# Client (port 3000)
# Sửa trong fe/client/vite.config.js:
server: {
  port: 3002,  // đổi sang port khác
}

# Admin (port 3001)
# Sửa trong fe/admin/vite.config.js:
server: {
  port: 3003,  // đổi sang port khác
}
```

**Backend (port 9532):**
```env
# Sửa trong be/.env:
PORT=8001
```

### Lỗi kết nối database

1. Kiểm tra DATABASE_URL trong `.env`
2. Kiểm tra MySQL/PostgreSQL service đang chạy
3. Kiểm tra username/password đúng
4. Đảm bảo database đã được tạo

### Lỗi module not found

**Frontend:**
```bash
cd fe
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
cd be
pip install -r requirements.txt --force-reinstall
```

### Lỗi CORS

Kiểm tra file `be/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Build cho Production

### Frontend:
```bash
cd fe
npm run build
```
Files build sẽ ở:
- Client: `fe/dist/client/`
- Admin: `fe/dist/admin/`

### Backend:
```bash
# Cập nhật .env
DEBUG=False
SECRET_KEY=your-very-secure-random-key

# Chạy với gunicorn (Linux/Mac)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Hoặc uvicorn (Windows)
uvicorn main:app --host 0.0.0.0 --port 9532 --workers 4
```

## Tài liệu tham khảo

- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- TailwindCSS: https://tailwindcss.com/
- SQLAlchemy: https://www.sqlalchemy.org/

## Hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ team phát triển hoặc tham khảo documentation trong thư mục `design/`.
