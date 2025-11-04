================================================================================
                    ADMIN PANEL - OVERVIEW & STRUCTURE
================================================================================

MỤC ĐÍCH: Hệ thống quản trị cho giáo viên quản lý website dạy học Toán

================================================================================
                        CẤU TRÚC ADMIN PANEL
================================================================================

00_admin_login.txt         - Trang đăng nhập giáo viên
01_admin_dashboard.txt     - Dashboard tổng quan với thống kê
02_admin_gioi_thieu.txt    - Quản lý giới thiệu bài học
03_admin_video.txt         - Tải lên và quản lý video
04_admin_noi_dung.txt      - Quản lý nội dung Toán học
05_admin_tuong_tac.txt     - Quản lý công cụ tương tác (optional)
06_admin_kiem_tra.txt      - Quản lý bài kiểm tra và xem kết quả
07_admin_phan_hoi.txt      - Xem và trả lời phản hồi

================================================================================
                        TÍNH NĂNG CHUNG
================================================================================

1. AUTHENTICATION & SECURITY
   - Login with email/password
   - Session management
   - Auto-logout after inactivity
   - Password reset
   - Role-based access (if multiple teachers)

2. SIDEBAR NAVIGATION
   ┌────────────────────┐
   │ 📊 Dashboard       │
   │ 📚 Giới thiệu      │
   │ 🎥 Video           │
   │ 📝 Nội dung        │
   │ 🎯 Tương tác       │
   │ ✅ Kiểm tra        │
   │ 💬 Phản hồi        │
   │ ⚙️ Cài đặt         │
   │ 👁 Xem trang       │
   │ 🚪 Đăng xuất       │
   └────────────────────┘

3. COMMON ACTIONS
   - 💾 Lưu nháp (Save draft)
   - 👁 Xem thử (Preview)
   - 📤 Xuất bản (Publish)
   - ❌ Hủy (Cancel)
   - 🗑 Xóa (Delete)
   - ✏️ Sửa (Edit)

4. STATUS INDICATORS
   - ✅ Đã xuất bản (Published - Green)
   - ⚠️ Nháp (Draft - Orange)
   - ❌ Ẩn (Hidden - Red)
   - 🔒 Riêng tư (Private - Gray)

5. AUTO-SAVE
   - Tự động lưu mỗi 30 giây
   - Hiển thị "Đã lưu lúc HH:MM"
   - Ngăn mất dữ liệu

6. NOTIFICATIONS
   - Success messages (green)
   - Error messages (red)
   - Warning messages (orange)
   - Info messages (blue)
   - Toast/snackbar position: top-right

7. RESPONSIVE DESIGN
   - Desktop: Full sidebar + main content
   - Tablet: Collapsible sidebar
   - Mobile: Hamburger menu

================================================================================
                        FILE UPLOAD SYSTEM
================================================================================

SUPPORTED FILE TYPES:
- Images: JPG, PNG, GIF, SVG (max 5MB)
- Documents: PDF, PPT, DOCX (max 10MB)
- Videos: MP4, AVI, MOV, MKV (max 500MB or use YouTube/Drive)

UPLOAD FEATURES:
- Drag & drop
- Multiple file select
- Progress bar
- Cancel upload
- File preview
- Delete uploaded files
- File size/type validation

STORAGE OPTIONS:
1. Local server storage
2. Cloud storage (AWS S3, Google Cloud, Cloudinary)
3. External platforms (YouTube, Google Drive)

================================================================================
                        DATABASE STRUCTURE (GỢI Ý)
================================================================================

TABLES:
- users (id, email, password, name, role, created_at)
- lessons (id, title, description, grade, level, status, created_at, updated_at)
- lesson_objectives (id, lesson_id, category, content, order)
- videos (id, lesson_id, title, url, type, duration, status, created_at)
- content (id, lesson_id, section, content_html, order)
- exercises (id, lesson_id, type, question, answer, difficulty, page_number)
- assessments (id, lesson_id, title, form_url, settings)
- assessment_results (id, assessment_id, student_name, score, submitted_at)
- feedback (id, lesson_id, name, email, rating, message, reply, status, created_at)
- files (id, filename, path, type, size, uploaded_at)

================================================================================
                        TECHNOLOGY STACK (GỢI Ý)
================================================================================

FRONTEND:
- HTML5, CSS3, JavaScript
- Framework: React, Vue, or vanilla JS
- UI Library: Material-UI, Bootstrap, Tailwind CSS
- Rich Text Editor: TinyMCE, Quill, CKEditor
- Math Rendering: MathJax or KaTeX

BACKEND:
- Node.js (Express) or PHP (Laravel) or Python (Django/Flask)
- RESTful API or GraphQL

DATABASE:
- MySQL, PostgreSQL, or MongoDB

FILE STORAGE:
- Local filesystem or Cloud (AWS S3, Cloudinary)

AUTHENTICATION:
- JWT (JSON Web Tokens) or Session-based
- bcrypt for password hashing

DEPLOYMENT:
- Frontend: Netlify, Vercel, GitHub Pages
- Backend: Heroku, AWS, DigitalOcean, Google Cloud
- Database: Managed service or self-hosted

================================================================================
                        SECURITY CONSIDERATIONS
================================================================================

1. Input validation and sanitization
2. XSS protection
3. CSRF protection
4. SQL injection prevention (use parameterized queries)
5. File upload validation
6. Rate limiting for login attempts
7. HTTPS only
8. Secure password storage (hashing + salt)
9. Session timeout
10. Role-based access control

================================================================================
                        USER WORKFLOW
================================================================================

TEACHER LOGIN → DASHBOARD → Choose Section:

1. CREATE NEW LESSON:
   Giới thiệu → Upload Videos → Add Content → Add Interactive Tools →
   Create Assessment → Configure Feedback Form → Preview → Publish

2. MANAGE EXISTING:
   Dashboard → Click Edit → Make Changes → Save/Publish

3. VIEW STUDENT DATA:
   Dashboard → Kiểm tra section → View Results
   Dashboard → Phản hồi section → Read & Reply

4. UPDATE CONTACT INFO:
   Phản hồi & Liên hệ → Edit Contact Info → Save

================================================================================
                        COLOR SCHEME
================================================================================

PRIMARY COLORS:
- Primary: Blue (#2196F3)
- Secondary: Indigo (#3F51B5)

STATUS COLORS:
- Success: Green (#4CAF50)
- Warning: Orange (#FF9800)
- Error: Red (#F44336)
- Info: Light Blue (#03A9F4)

NEUTRAL COLORS:
- Dark: #333333
- Gray: #757575
- Light Gray: #E0E0E0
- Background: #F5F5F5
- White: #FFFFFF

SIDEBAR:
- Background: Dark Gray (#263238)
- Active: Light overlay
- Text: White (#FFFFFF)

================================================================================
                        ACCESSIBILITY
================================================================================

- Keyboard navigation support
- ARIA labels for screen readers
- Sufficient color contrast
- Focus indicators
- Alt text for images
- Form field labels
- Error message announcements

================================================================================
                        PERFORMANCE OPTIMIZATION
================================================================================

- Lazy loading for images
- Code splitting
- Minify CSS/JS
- Compress images
- Cache static assets
- CDN for media files
- Database query optimization
- Pagination for large datasets

================================================================================
                        FUTURE ENHANCEMENTS
================================================================================

- Multi-user support (multiple teachers)
- Student accounts and progress tracking
- Analytics dashboard (Google Analytics integration)
- Email notifications (SendGrid, Mailgun)
- Mobile app (React Native, Flutter)
- Live chat support
- Forum/discussion board
- Gamification (badges, points)
- AI-powered recommendations
- Automatic exercise generation

================================================================================
