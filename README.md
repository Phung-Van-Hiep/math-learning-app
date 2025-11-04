# Website Hỗ Trợ Dạy Học Toán THCS Như Quỳnh

Full-stack web application for middle school math education with separate client and admin interfaces.

## 🏗️ Project Structure

```
.
├── fe/                    # Frontend applications
│   ├── client/           # Student-facing application (React + Vite)
│   └── admin/            # Admin dashboard (React + Vite)
├── be/                    # Backend API (FastAPI + MySQL)
├── db_init/              # Database initialization scripts
├── design/               # Design documents and specifications
├── docker-compose.yml    # Docker services configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14+ and npm
- **Python** 3.9+
- **Docker** and Docker Compose
- **MySQL** 8.0 (via Docker)

### 1. Start Database

```bash
# Start MySQL container
docker-compose up -d mysql

# Wait for MySQL to be ready (check with docker-compose logs mysql)
```

### 2. Setup Backend

```bash
cd be

# Install Python dependencies
pip install -r requirements.txt

# Seed database with initial data
python seed_data.py

# Start backend server
python main.py
```

Backend will be available at:
- API: `http://localhost:9532`
- Swagger Docs: `http://localhost:9532/api/docs`

### 3. Setup Frontend (Client)

```bash
cd fe/client

# Install dependencies
npm install

# Start development server
npm run dev
```

Client app will be available at: `http://localhost:5173`

### 4. Setup Frontend (Admin) - Optional

```bash
cd fe/admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Admin app will be available at: `http://localhost:5173` (use different port if client is running)

## 🔐 Authentication

The application uses JWT-based authentication for both admin and client interfaces.

### Default Credentials (After Seeding)

| Role    | Username  | Password    | Access       |
|---------|-----------|-------------|--------------|
| Admin   | admin     | admin123    | Admin Panel  |
| Student | student2  | student123  | Client App   |

### Login Flow

1. **Client (Students):**
   - Navigate to `http://localhost:5173/login`
   - Login with student credentials
   - Access published lessons and track progress

2. **Admin (Teachers/Admins):**
   - Navigate to `http://localhost:5173/login`
   - Login with admin credentials
   - Manage lessons, view student progress

## 📡 API Integration

### Client → Backend Communication

The frontend uses Axios to communicate with the backend API:

```javascript
// API Base URL (configured in .env)
VITE_API_URL=http://localhost:9532/api

// Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

// Lessons
GET  /api/lessons/published      # Public lessons
GET  /api/lessons/my-lessons     # With progress (auth required)
POST /api/lessons/{id}/progress  # Update progress
```

### Authentication Headers

All authenticated requests include JWT token:

```
Authorization: Bearer <access_token>
```

## 🎨 Features

### Client Application (Students)

✅ **Authentication**
- Login/Logout with JWT
- Session persistence
- Auto-redirect on authentication

✅ **Lesson Browsing**
- View all published lessons
- Filter by grade (6, 7, 8, 9)
- Filter by status (Not Started, In Progress, Completed)
- Search lessons by title
- Sort by multiple criteria

✅ **Progress Tracking**
- Real-time progress updates
- Visual progress indicators
- Completion status

✅ **User Interface**
- Responsive design (mobile, tablet, desktop)
- Educational-friendly colors
- Smooth animations
- Loading states

### Admin Application

✅ **Dashboard**
- Statistics overview
- Quick actions
- Recent activity

✅ **Lesson Management** (Coming Soon)
- Create/Edit/Delete lessons
- Publish/Unpublish
- Upload media

### Backend API

✅ **Core Features**
- JWT authentication
- Role-based access control (Admin, Teacher, Student)
- RESTful API design
- Input validation with Pydantic
- Comprehensive error handling

✅ **Database Models**
- Users (with roles)
- Lessons
- Student Progress
- Quizzes (with questions and answers)
- Feedback and ratings

## 🗄️ Database Schema

### Key Tables

- **users** - All users (admin, teacher, student)
- **lessons** - Lesson content and metadata
- **student_progress** - Track lesson completion
- **quizzes** - Quiz assessments
- **quiz_questions** - Quiz questions
- **quiz_answers** - Answer options
- **quiz_attempts** - Student quiz submissions
- **feedbacks** - Lesson ratings and comments

## 🔧 Development

### Frontend Development

```bash
# Client
cd fe/client
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build

# Admin
cd fe/admin
npm run dev     # Development server
npm run build   # Production build
```

### Backend Development

```bash
cd be

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 9532

# Run tests (when implemented)
pytest
```

### Database Management

```bash
# Access MySQL via phpMyAdmin
http://localhost:8085

# Or use MySQL client
mysql -h 127.0.0.1 -P 3307 -u thcs_user -p
# Password: thcs_password_change_this
```

## 📦 Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS with CSS Variables

### Backend
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Database:** MySQL 8.0
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt (passlib)
- **Server:** Uvicorn

### DevOps
- **Containerization:** Docker & Docker Compose
- **Database UI:** phpMyAdmin

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS protection
- Input validation (Pydantic)
- SQL injection protection (SQLAlchemy ORM)

## 📝 Environment Variables

### Backend (`be/.env`)
```env
DATABASE_URL=mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3307/thcs_math
SECRET_KEY=your-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`fe/client/.env`)
```env
VITE_API_URL=http://localhost:9532/api
```

## 🚀 Deployment

### Backend Deployment

1. Update `.env` for production:
   - Set `DEBUG=False`
   - Change `SECRET_KEY` to a strong random value
   - Update `ALLOWED_ORIGINS` to production domains
   - Use strong database passwords

2. Use a production-grade server:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend Deployment

```bash
# Build for production
cd fe/client
npm run build

# Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
```

## 📚 Documentation

- **Backend API:** `http://localhost:9532/api/docs` (Swagger UI)
- **Frontend README:** `fe/README.md`
- **Backend README:** `be/README.md`
- **Design Docs:** `design/`

## 🧪 Testing

### Manual Testing

1. **Start all services** (MySQL, Backend, Frontend)
2. **Test login** with default credentials
3. **Browse lessons** and test filters
4. **Test logout** and verify redirect

### API Testing

Use Swagger UI at `http://localhost:9532/api/docs` to test all endpoints interactively.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

© 2025 - THCS Như Quỳnh Math Learning Platform

## 🆘 Troubleshooting

### Backend won't start
- Check MySQL is running: `docker-compose ps`
- Verify database connection in `.env`
- Check logs: `docker-compose logs mysql`

### Frontend can't connect to backend
- Verify backend is running on port 9532
- Check `.env` file has correct API URL
- Verify CORS settings in backend

### Login fails
- Check database is seeded: `python seed_data.py`
- Verify credentials match seed data
- Check backend logs for errors

### Port conflicts
- Change ports in respective config files:
  - Backend: `be/.env` (PORT)
  - Frontend: `vite.config.js` (server.port)
  - MySQL: `docker-compose.yml` (ports)

## 📞 Support

For issues or questions, please check:
1. This README
2. Individual component READMEs (`fe/README.md`, `be/README.md`)
3. API documentation at `/api/docs`
4. Design specifications in `design/`
