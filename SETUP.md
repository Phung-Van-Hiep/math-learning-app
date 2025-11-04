# 🚀 Quick Setup Guide

## Step-by-Step Setup

### 1. Start MySQL Database

```bash
# From project root
docker-compose up -d mysql

# Wait 10-15 seconds for MySQL to initialize
# Check if ready:
docker-compose logs mysql | grep "ready for connections"
```

### 2. Setup and Start Backend

```bash
cd be

# Install dependencies (first time only)
pip install -r requirements.txt

# Initialize database with sample data (first time only)
python seed_data.py

# Start backend server
python main.py
```

**Backend will run on:** `http://localhost:9532`
**API Docs:** `http://localhost:9532/api/docs`

Keep this terminal open!

### 3. Setup and Start Frontend (New Terminal)

```bash
cd fe/client

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

Keep this terminal open!

## ✅ Test the Application

1. **Open browser:** `http://localhost:5173`
2. **You should be redirected to login page**
3. **Login with:**
   - Username: `student2`
   - Password: `student123`
4. **Browse lessons, test filters, and explore!**

### Admin Access

For admin access:
- Username: `admin`
- Password: `admin123`

## 📋 Verify Everything Works

### Check Backend
```bash
# Test API health
curl http://localhost:9532/health

# Should return: {"status":"healthy",...}
```

### Check Database
```bash
# Access phpMyAdmin
# Open: http://localhost:8085
# Login: thcs_user / thcs_password_change_this
```

### Check Frontend
- Open: `http://localhost:5173`
- Should see login page
- After login, should see lessons

## 🔧 Common Issues

### Port Already in Use

**Backend (Port 9532):**
```bash
# Find process using port
lsof -i :9532

# Kill process
kill -9 <PID>
```

**Frontend (Port 5173):**
```bash
# Find process
lsof -i :5173

# Kill process
kill -9 <PID>
```

### MySQL Connection Failed

```bash
# Stop and restart MySQL
docker-compose down
docker-compose up -d mysql

# Wait for it to be ready
docker-compose logs -f mysql
```

### Database Not Seeded

```bash
cd be
python seed_data.py
```

### Can't Login

1. Make sure backend is running
2. Check browser console for errors (F12)
3. Verify backend logs for authentication errors
4. Try reseeding database

## 📝 Default Data After Seeding

**Users:**
- Admin: `admin` / `admin123`
- Student: `student2` / `student123`

**Lessons:**
- 6 sample math lessons (Grade 8-9)
- With ratings, difficulty levels, and metadata

## 🎯 Next Steps

After successful setup:

1. ✅ Test login/logout
2. ✅ Browse and filter lessons
3. ✅ Test search functionality
4. ✅ Check user profile in dropdown
5. ✅ Explore API docs at `/api/docs`
6. ✅ Try admin features (if logged in as admin)

## 🛑 Stop Services

**Stop Frontend:**
- Press `Ctrl+C` in frontend terminal

**Stop Backend:**
- Press `Ctrl+C` in backend terminal

**Stop MySQL:**
```bash
docker-compose down
```

## 🔄 Restart Everything

```bash
# Stop all
docker-compose down
# Ctrl+C in all terminals

# Start again
docker-compose up -d mysql
cd be && python main.py &
cd fe/client && npm run dev
```

## 💡 Development Tips

### Backend Hot Reload
Backend auto-reloads on code changes when `DEBUG=True`

### Frontend Hot Reload
Frontend auto-reloads on file save (Vite HMR)

### API Testing
Use Swagger UI at `http://localhost:9532/api/docs` for interactive API testing

### Database Changes
If you modify entities/models, you may need to:
1. Drop database: `docker-compose down -v`
2. Restart: `docker-compose up -d mysql`
3. Reseed: `python seed_data.py`

## 📚 Documentation

- **Project README:** `README.md`
- **Backend API:** `be/README.md`
- **Frontend:** `fe/README.md`
- **API Docs:** `http://localhost:9532/api/docs`

## ✨ You're All Set!

Happy coding! 🎉
