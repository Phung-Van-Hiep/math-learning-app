# Docker Setup Guide - Database Only

This guide shows you how to run the **database in Docker** while keeping the backend and frontend running locally on your machine.

## 🐳 Why Docker for Database?

✅ **Easy Setup** - No need to install MySQL/PostgreSQL manually
✅ **Isolated** - Database runs in container, won't conflict with other projects
✅ **Consistent** - Same environment on all machines
✅ **Easy Management** - Start/stop with simple commands
✅ **Includes phpMyAdmin** - Web interface to manage database

---

## 📋 Prerequisites

### Install Docker Desktop

**Windows/Mac:**
- Download from: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### Step 1: Start Database Container

```bash
# From project root directory (nckh_thcs/)
docker-compose up -d
```

This will:
- ✅ Download MySQL 8.0 image (first time only)
- ✅ Create database container
- ✅ Create database `thcs_math`
- ✅ Start phpMyAdmin on port 8085
- ✅ Set up networking

**Wait for database to be ready (~20 seconds):**
```bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs -f mysql
# Press Ctrl+C to exit logs
```

You should see: `MySQL init process done. Ready for start up.`

---

### Step 2: Verify Database is Running

**Option 1: Using Docker command**
```bash
docker-compose ps
```
You should see:
```
NAME                STATUS          PORTS
thcs_mysql          Up              0.0.0.0:3306->3306/tcp
thcs_phpmyadmin     Up              0.0.0.0:8085->80/tcp
```

**Option 2: Using phpMyAdmin**
1. Open browser: http://localhost:8085
2. Login:
   - Server: `mysql`
   - Username: `thcs_user`
   - Password: `thcs_password_change_this`
3. You should see `thcs_math` database

---

### Step 3: Run Backend (Connects to Docker Database)

```bash
cd be

# Create/activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create admin account (creates tables automatically)
python create_admin.py

# Start backend
python main.py
```

Backend will connect to MySQL running in Docker!

---

### Step 4: Run Frontend

```bash
# Terminal 1 - Client
cd fe
npm install
npm run dev:client

# Terminal 2 - Admin
cd fe
npm run dev:admin
```

---

## 🔧 Docker Commands

### Start Database
```bash
docker-compose up -d
# -d means "detached" (runs in background)
```

### Stop Database
```bash
docker-compose stop
# Stops containers but keeps data
```

### Stop and Remove Containers
```bash
docker-compose down
# Removes containers but keeps data in volumes
```

### Stop and Delete Everything (Including Data)
```bash
docker-compose down -v
# ⚠️ WARNING: This deletes all database data!
```

### View Logs
```bash
# All services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# Specific service
docker-compose logs mysql
docker-compose logs phpmyadmin
```

### Restart Database
```bash
docker-compose restart mysql
```

### Execute SQL Commands
```bash
# Open MySQL CLI
docker-compose exec mysql mysql -u thcs_user -p thcs_math
# Password: thcs_password_change_this

# Or as root
docker-compose exec mysql mysql -u root -p
# Password: root_password_change_this
```

---

## 🗄️ Database Management

### Using phpMyAdmin (Recommended)

1. **Access**: http://localhost:8085
2. **Login**:
   - Server: `mysql`
   - Username: `thcs_user`
   - Password: `thcs_password_change_this`

**Features:**
- Browse tables
- Run SQL queries
- Import/Export data
- Manage users
- View database structure

### Using MySQL CLI

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u thcs_user -pthcs_password_change_this thcs_math

# Common commands
SHOW TABLES;
DESCRIBE students;
SELECT * FROM students;
```

### Backup Database

```bash
# Backup to SQL file
docker-compose exec mysql mysqldump -u thcs_user -pthcs_password_change_this thcs_math > backup.sql

# Restore from backup
docker-compose exec -T mysql mysql -u thcs_user -pthcs_password_change_this thcs_math < backup.sql
```

---

## ⚙️ Configuration

### Change Database Password

1. **Edit `docker-compose.yml`:**
```yaml
environment:
  MYSQL_PASSWORD: YOUR_NEW_PASSWORD
```

2. **Edit `.env` and `be/.env`:**
```env
DATABASE_URL=mysql+pymysql://thcs_user:YOUR_NEW_PASSWORD@localhost:3306/thcs_math
```

3. **Recreate containers:**
```bash
docker-compose down -v
docker-compose up -d
```

### Change Database Port

If port 3306 is already in use:

**Edit `docker-compose.yml`:**
```yaml
ports:
  - "3307:3306"  # Change 3306 to 3307
```

**Update `.env`:**
```env
DATABASE_URL=mysql+pymysql://thcs_user:password@localhost:3307/thcs_math
```

### Use PostgreSQL Instead

1. **Edit `docker-compose.yml`:**
   - Comment out MySQL section
   - Uncomment PostgreSQL section

2. **Update `.env`:**
```env
DATABASE_URL=postgresql://thcs_user:thcs_password_change_this@localhost:5432/thcs_math
```

3. **Install PostgreSQL driver:**
```bash
cd be
pip install psycopg2-binary
```

---

## 🐛 Troubleshooting

### Container won't start

**Check if port is in use:**
```bash
# Windows
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3306
```

**Solution:** Change port in docker-compose.yml

### Database connection refused

1. **Wait longer** - Database takes ~20 seconds to start
2. **Check container is running:**
```bash
docker-compose ps
```
3. **Check logs:**
```bash
docker-compose logs mysql
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove images (optional)
docker rmi mysql:8.0 phpmyadmin:latest

# Start fresh
docker-compose up -d
```

### Can't connect from backend

**Check `.env` file:**
```env
# Make sure it's:
DATABASE_URL=mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3306/thcs_math

# NOT:
DATABASE_URL=sqlite:///./thcs_math.db
```

**Test connection:**
```python
# In Python
from sqlalchemy import create_engine
engine = create_engine("mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3306/thcs_math")
connection = engine.connect()
print("Connected!")
```

### Permission Denied (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or:
newgrp docker
```

---

## 📊 Monitoring

### View Container Stats
```bash
docker stats thcs_mysql
```

### Check Health
```bash
docker-compose ps
# Look for "healthy" in health column
```

---

## 🔐 Security Notes

### For Development:
- ✅ Default passwords are fine
- ✅ Database only accessible from localhost

### For Production:
1. **Change all passwords** in docker-compose.yml
2. **Use secrets** or environment variables
3. **Don't expose ports** publicly
4. **Enable SSL/TLS**
5. **Regular backups**

---

## 🎯 Next Steps

1. ✅ Start Docker containers: `docker-compose up -d`
2. ✅ Verify in phpMyAdmin: http://localhost:8085
3. ✅ Run backend: `cd be && python main.py`
4. ✅ Run frontend: `cd fe && npm run dev`
5. ✅ Start building your app!

---

## 📚 Additional Resources

- **Docker Docs**: https://docs.docker.com/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **phpMyAdmin Docs**: https://www.phpmyadmin.net/docs/
- **Docker Compose Docs**: https://docs.docker.com/compose/

---

## 🆘 Getting Help

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify containers are running: `docker-compose ps`
3. Check `.env` configuration
4. Try restarting: `docker-compose restart`
5. Reset if needed: `docker-compose down -v && docker-compose up -d`

---

**Happy Coding with Docker! 🐳**
