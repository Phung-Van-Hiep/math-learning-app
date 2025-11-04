# Backend API - Website Hỗ Trợ Dạy Học Toán THCS

FastAPI backend for THCS Như Quỳnh Math Learning Platform with JWT authentication.

## 🏗️ Architecture

The backend follows a clean architecture pattern:

```
be/
├── core/               # Core configuration
│   ├── config.py      # Application settings
│   └── database.py    # Database connection
├── entities/          # Database models (SQLAlchemy ORM)
│   ├── user.py        # User model (Admin, Teacher, Student)
│   ├── lesson.py      # Lesson model
│   ├── student_progress.py  # Progress tracking
│   ├── quiz.py        # Quiz models
│   └── feedback.py    # Feedback model
├── schemas/           # Pydantic schemas (validation)
│   ├── user.py        # User request/response schemas
│   └── lesson.py      # Lesson schemas
├── services/          # Business logic
│   ├── auth_service.py      # Authentication logic
│   └── lesson_service.py    # Lesson management
├── routes/            # API endpoints
│   ├── auth.py        # Auth routes (login/logout/register)
│   └── lessons.py     # Lesson routes
├── middleware/        # Middleware and dependencies
│   └── auth.py        # Authentication middleware
├── utils/             # Utility functions
│   └── security.py    # Password hashing, JWT tokens
├── .env               # Environment variables
├── requirements.txt   # Python dependencies
├── main.py           # Main application
└── seed_data.py      # Database seeding script
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- MySQL 8.0 (via Docker or local)
- pip or poetry

### Installation

1. **Install dependencies:**

```bash
cd be
pip install -r requirements.txt
```

2. **Set up environment variables:**

Edit `.env` file with your configuration:

```env
DATABASE_URL=mysql+pymysql://thcs_user:thcs_password_change_this@localhost:3307/thcs_math
SECRET_KEY=your-very-secret-key-change-this-in-production-min-32-chars
```

3. **Start MySQL database (Docker):**

```bash
# From project root
docker-compose up -d mysql
```

4. **Initialize database and seed data:**

```bash
python seed_data.py
```

5. **Run the development server:**

```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 9532
```

The API will be available at:
- API: `http://localhost:9532`
- Swagger UI: `http://localhost:9532/api/docs`
- ReDoc: `http://localhost:9532/api/redoc`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### User Roles

- **Admin**: Full access to all resources
- **Teacher**: Can manage lessons and view student progress
- **Student**: Can view lessons and track their own progress

### Default Credentials (After Seeding)

```
Admin:    admin / admin123
Teacher:  teacher1 / teacher123
Student:  student1 / student123
Student:  student2 / student123
```

### Authentication Flow

1. **Register** (POST `/api/auth/register`):
```json
{
  "username": "student3",
  "email": "student3@example.com",
  "password": "password123",
  "full_name": "Học sinh 3",
  "role": "student",
  "grade": 8,
  "class_name": "8A"
}
```

2. **Login** (POST `/api/auth/login`):
```json
{
  "username": "student1",
  "password": "student123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 3,
    "username": "student1",
    "email": "student1@example.com",
    "full_name": "Nguyễn Văn An",
    "role": "student",
    "grade": 8,
    "class_name": "8A",
    "is_active": true,
    "is_verified": true,
    "created_at": "2025-01-04T...",
    "last_login": "2025-01-04T..."
  }
}
```

3. **Use token in requests**:
```
Authorization: Bearer <access_token>
```

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login and get token | No |
| POST | `/logout` | Logout (client-side) | Yes |
| GET | `/me` | Get current user info | Yes |
| GET | `/verify` | Verify token validity | Yes |

### Lessons (`/api/lessons`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create lesson | Yes | Teacher/Admin |
| GET | `/` | Get all lessons (incl. unpublished) | Yes | Teacher/Admin |
| GET | `/published` | Get published lessons | No | All |
| GET | `/my-lessons` | Get lessons with progress | Yes | Student |
| GET | `/{lesson_id}` | Get lesson by ID | Yes | All |
| GET | `/slug/{slug}` | Get lesson by slug | Yes | All |
| PUT | `/{lesson_id}` | Update lesson | Yes | Teacher/Admin |
| DELETE | `/{lesson_id}` | Delete lesson | Yes | Teacher/Admin |
| POST | `/{lesson_id}/progress` | Update lesson progress | Yes | Student |

### Query Parameters

**Get lessons:**
- `skip`: Pagination offset (default: 0)
- `limit`: Max results (default: 100)
- `grade`: Filter by grade (6-9)
- `difficulty`: Filter by difficulty (easy, medium, hard)

## 🗄️ Database Models

### User Model

```python
{
  "id": int,
  "username": str (unique),
  "email": str (unique),
  "full_name": str,
  "role": "admin" | "teacher" | "student",
  "grade": int (6-9, for students),
  "class_name": str (for students),
  "is_active": bool,
  "is_verified": bool,
  "created_at": datetime,
  "updated_at": datetime,
  "last_login": datetime
}
```

### Lesson Model

```python
{
  "id": int,
  "title": str,
  "slug": str (unique),
  "description": str,
  "thumbnail": str (URL),
  "video_url": str,
  "content": str (HTML/Markdown),
  "grade": int (6-9),
  "duration": int (minutes),
  "difficulty": "easy" | "medium" | "hard",
  "rating": float,
  "review_count": int,
  "order": int,
  "is_published": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### StudentProgress Model

```python
{
  "id": int,
  "user_id": int,
  "lesson_id": int,
  "progress_percentage": float (0-100),
  "is_completed": bool,
  "time_spent": int (seconds),
  "quiz_score": float,
  "average_score": float,
  "started_at": datetime,
  "completed_at": datetime,
  "last_accessed": datetime
}
```

## 🔧 Environment Variables

```env
# Application
APP_NAME="THCS Math Website API"
APP_VERSION="1.0.0"
DEBUG=True

# Server
HOST=0.0.0.0
PORT=9532

# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3307/thcs_math

# Security
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing

### Using Swagger UI

1. Go to `http://localhost:9532/api/docs`
2. Use "Authorize" button to login
3. Test endpoints interactively

### Using curl

**Login:**
```bash
curl -X POST "http://localhost:9532/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"student123"}'
```

**Get lessons (with token):**
```bash
curl -X GET "http://localhost:9532/api/lessons/published" \
  -H "Authorization: Bearer <your_token>"
```

## 📦 Dependencies

- **FastAPI**: Modern web framework
- **SQLAlchemy**: ORM for database
- **Pydantic**: Data validation
- **python-jose**: JWT implementation
- **passlib**: Password hashing
- **uvicorn**: ASGI server
- **pymysql**: MySQL connector

## 🔄 Database Migrations

For production, use Alembic for migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## 🛡️ Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation with Pydantic
- ✅ SQL injection protection (SQLAlchemy ORM)

## 📝 Adding New Features

### 1. Add a new entity

Create model in `entities/` folder:

```python
# entities/new_entity.py
from sqlalchemy import Column, Integer, String
from core.database import Base

class NewEntity(Base):
    __tablename__ = "new_entities"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
```

### 2. Add Pydantic schemas

Create schemas in `schemas/` folder for validation.

### 3. Add service

Create business logic in `services/` folder.

### 4. Add routes

Create API endpoints in `routes/` folder and include in `main.py`.

## 🚀 Deployment

### Production Checklist

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_ORIGINS` to production domains
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9532"]
```

## 📄 License

© 2025 - THCS Như Quỳnh Math Learning Platform
