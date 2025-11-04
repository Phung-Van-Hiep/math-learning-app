# Port Configuration

## Services and Ports

### Frontend Applications
- **Client App**: http://localhost:3000
- **Admin App**: http://localhost:3001

### Backend
- **API Server**: http://localhost:9532
- **API Docs**: http://localhost:9532/api/docs

### Database
- **MySQL**: localhost:3307

## Configuration Files Updated

### 1. Client App - `fe/client/vite.config.js`
```javascript
server: {
  port: 3000,
  strictPort: true,
}
```

### 2. Admin App - `fe/admin/vite.config.js`
```javascript
server: {
  port: 3001,
  strictPort: true,
}
```

### 3. Backend CORS - `be/.env`
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174,http://localhost:5175
```

## Access URLs

### For Students (Client)
- **URL**: http://localhost:3000
- **Login**: student2 / student123

### For Admin/Teachers (Admin)
- **URL**: http://localhost:3001
- **Login**: admin / admin123

### API Documentation
- **Swagger UI**: http://localhost:9532/api/docs
- **ReDoc**: http://localhost:9532/api/redoc

## Running Status

✓ Client App (Port 3000) - Running
✓ Admin App (Port 3001) - Running
✓ Backend API (Port 9532) - Running
✓ MySQL Database (Port 3307) - Running

## Notes

- The `strictPort: true` setting ensures the apps fail if the desired port is occupied, preventing them from running on random ports
- CORS is configured to allow requests from both frontend apps
- All ports are properly configured in the backend .env file
