# ⚡ Quick Start with Docker Database

**Complete setup in 5 minutes!**

---

## 🎯 What You'll Run

- 🐳 **MySQL Database** - In Docker container
- 🐍 **Backend (FastAPI)** - Local (connects to Docker DB)
- ⚛️ **Frontend (React)** - Local

---

## ⚙️ One-Time Setup

### 1. Install Docker Desktop

**Download & Install:**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Start Docker Desktop after installation

**Verify:**
```bash
docker --version
```

---

### 2. Start Database

```bash
# From project root (nckh_thcs/)
docker-compose up -d

# Wait ~20 seconds for database to start
# Check status:
docker-compose ps
```

✅ Done! Database is running.

---

### 3. Setup Backend

```bash
cd be

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate          # Windows
# source venv/bin/activate      # Linux/Mac

# Install packages
pip install -r requirements.txt

# Create database tables & admin account
python create_admin.py

# Start backend
python main.py
```

✅ Backend running at http://localhost:9532

---

### 4. Setup Frontend

**Terminal 1 - Client:**
```bash
cd fe
npm install
npm run dev:client
```
✅ Client at http://localhost:3000

**Terminal 2 - Admin:**
```bash
cd fe
npm run dev:admin
```
✅ Admin at http://localhost:3001

---

## 🎉 Access Your App

| Service | URL | Credentials |
|---------|-----|-------------|
| **Client Website** | http://localhost:3000 | Register new account |
| **Admin Panel** | http://localhost:3001 | `admin@thcsnhuquynh.edu.vn` / `admin123` |
| **API Docs** | http://localhost:9532/docs | - |
| **Database UI** | http://localhost:8085 | `thcs_user` / `thcs_password_change_this` |

---

## 📝 Daily Usage

### Start Everything

```bash
# Start database
docker-compose up -d

# Start backend (in be/ folder)
venv\Scripts\activate          # Windows
# source venv/bin/activate      # Linux/Mac
python main.py

# Start frontend (2 terminals in fe/ folder)
npm run dev:client
npm run dev:admin
```

### Stop Everything

```bash
# Stop frontend: Ctrl+C in terminals

# Stop backend: Ctrl+C in terminal

# Stop database
docker-compose stop
```

---

## 🔧 Useful Commands

```bash
# View database logs
docker-compose logs -f mysql

# Restart database
docker-compose restart

# Stop and remove (keeps data)
docker-compose down

# Reset database (⚠️ deletes data)
docker-compose down -v
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Database won't start?
```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs mysql
```

### Backend can't connect?
```bash
# Check .env file has:
DATABASE_URL=mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3306/thcs_math
```

### Port already in use?
```bash
# Change port in docker-compose.yml
ports:
  - "3307:3306"  # Change first number

# Update .env
DATABASE_URL=mysql+pymysql://...@localhost:3307/thcs_math
```

---

## 📚 More Info

- Detailed guide: `DOCKER_SETUP.md`
- Setup guide: `SETUP_GUIDE.md`
- Project readme: `README.md`

---

**That's it! Start coding! 🚀**
