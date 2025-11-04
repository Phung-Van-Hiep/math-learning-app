# Quick Start - Development Mode

## 🚀 Cách nhanh nhất để chạy dự án

### Prerequisites
- Node.js >= 18.x installed
- Python >= 3.9 installed

---

## Option 1: Chạy tất cả trong 3 terminal

### Terminal 1: Backend
```bash
cd be
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python create_admin.py
python main.py
```

**Backend will run at: http://localhost:9532**

---

### Terminal 2: Client Frontend
```bash
cd fe
npm install
npm run dev:client
```

**Client will run at: http://localhost:3000**

---

### Terminal 3: Admin Frontend
```bash
cd fe
npm run dev:admin
```

**Admin will run at: http://localhost:3001**

---

## Option 2: Script tự động (Linux/Mac)

```bash
# Tạo file start.sh
cat > start.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}Starting THCS Math Website...${NC}"

# Start backend
echo -e "${BLUE}Starting Backend...${NC}"
cd be
python -m venv venv 2>/dev/null
source venv/bin/activate
pip install -r requirements.txt -q
cp .env.example .env 2>/dev/null
python create_admin.py 2>/dev/null
python main.py &
BACKEND_PID=$!

# Start frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd ../fe
npm install -q
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}All services started!${NC}"
echo "Backend: http://localhost:9532"
echo "Client: http://localhost:3000"
echo "Admin: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

chmod +x start.sh
./start.sh
```

---

## Option 3: Script tự động (Windows)

```batch
@echo off
echo Starting THCS Math Website...

REM Start backend
echo Starting Backend...
start cmd /k "cd be && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && copy .env.example .env && python create_admin.py && python main.py"

REM Wait a bit
timeout /t 5

REM Start client
echo Starting Client...
start cmd /k "cd fe && npm install && npm run dev:client"

REM Start admin
echo Starting Admin...
start cmd /k "cd fe && npm run dev:admin"

echo All services are starting...
echo Backend: http://localhost:9532
echo Client: http://localhost:3000
echo Admin: http://localhost:3001
pause
```

---

## ✅ Xác nhận các service đang chạy

1. **Backend API**:
   - Mở http://localhost:9532/docs
   - Bạn sẽ thấy Swagger UI với tất cả API endpoints

2. **Client Website**:
   - Mở http://localhost:3000
   - Bạn sẽ thấy trang chủ với các cards navigation

3. **Admin Panel**:
   - Mở http://localhost:3001
   - Login với:
     - Email: `admin@thcsnhuquynh.edu.vn`
     - Password: `admin123`

---

## 🐛 Troubleshooting

### Port already in use?

**Backend (port 9532):**
```bash
# Tìm process đang dùng port
# Windows:
netstat -ano | findstr :9532
# Linux/Mac:
lsof -i :9532

# Kill process hoặc đổi port trong be/.env
PORT=8001
```

**Frontend (port 3000 or 3001):**
```bash
# Đổi port trong vite.config.js
server: { port: 3002 }
```

### Module not found?

```bash
# Frontend
cd fe
rm -rf node_modules package-lock.json
npm install

# Backend
cd be
pip install -r requirements.txt --force-reinstall
```

### Database error?

```bash
# Đảm bảo dùng SQLite (không cần cài đặt gì)
cd be
# Kiểm tra .env có dòng:
DATABASE_URL=sqlite:///./thcs_math.db

# Xóa database cũ nếu có
rm thcs_math.db

# Chạy lại
python create_admin.py
python main.py
```

---

## 📝 First Login

### Student Account
1. Go to http://localhost:3000
2. Click "Đăng nhập"
3. Click "Đăng ký ngay"
4. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Class: Choose from dropdown (6A, 7B, etc.)
   - Password: min 6 characters

### Admin Account
1. Go to http://localhost:3001
2. Login with:
   - Email: `admin@thcsnhuquynh.edu.vn`
   - Password: `admin123`
3. **Important**: Change password after first login!

---

## 🎯 What to do next?

1. **Explore the structure**: Check out the code in `fe/` and `be/`
2. **Read UX designs**: See `design/`
3. **Implement pages**: Start with placeholder pages in `fe/client/src/pages/`
4. **Add features**: Follow `IMPLEMENTATION_SUMMARY.md`

---

## 📚 Documentation

- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **IMPLEMENTATION_SUMMARY.md** - What's done, what's next
- **API Docs** - http://localhost:9532/docs (when running)

---

## 🆘 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check API documentation at http://localhost:9532/docs
3. Check browser console for frontend errors
4. Check terminal for backend errors

---

**Happy Coding! 🎓📚**
