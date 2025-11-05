# 📚 Quiz Learning Screen Implementation Guide

## 🎉 What Was Implemented

A comprehensive interactive quiz system has been added to the student learning experience!

### Features
✅ **Multiple Question Types**
- Multiple Choice (A, B, C, D)
- True/False
- Short Answer

✅ **Interactive Quiz Experience**
- Real-time timer with optional time limits
- Visual progress tracking
- Question navigation (jump to any question)
- Mark answered/unanswered questions
- Auto-save answers

✅ **Smart Scoring & Feedback**
- Automatic grading
- Detailed score breakdown
- Show correct answers (configurable)
- Performance history tracking
- Best score tracking

✅ **Student-Friendly Design**
- Clean, educational UI
- Encouraging feedback messages
- Celebration animations for achievements
- Retake support with attempt history
- Mobile responsive

---

## 📁 Files Created/Modified

### Backend (FastAPI)
```
be/
├── schemas/quiz.py              ← Pydantic validation schemas
├── services/quiz_service.py     ← Business logic for quizzes
├── routes/quiz.py               ← REST API endpoints
├── middleware/auth.py           ← Added require_role() function
├── main.py                      ← Registered quiz routes
└── seed_quiz_data.py            ← Sample quiz data generator
```

### Frontend (React)
```
fe/client/src/
├── services/quizService.js          ← API service layer
├── components/
│   ├── QuizSection.jsx              ← Main quiz interface
│   ├── QuizSection.css
│   ├── QuizQuestion.jsx             ← Individual question component
│   ├── QuizQuestion.css
│   ├── QuizResults.jsx              ← Results display
│   └── QuizResults.css
└── pages/
    └── LessonDetail.jsx             ← Integrated quiz section
```

---

## 🚀 How to Run

### 1. Start the Database
```bash
# Start MySQL with Docker Compose
docker-compose up -d mysql

# Wait for MySQL to be healthy (check with)
docker-compose ps
```

### 2. Start the Backend

```bash
# Navigate to backend directory
cd be

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the backend
python main.py
```

Backend will start on: **http://localhost:9532**

### 3. Seed Quiz Data

```bash
# In the backend directory (with venv activated)
python seed_quiz_data.py
```

This will create a sample quiz with 5 questions for the first lesson:
- 3 Multiple Choice questions
- 1 True/False question
- 1 Short Answer question

### 4. Start the Frontend

```bash
# Open a new terminal
cd fe/client

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

Frontend will start on: **http://localhost:5173**

---

## 🧪 Testing the Quiz Feature

1. **Login as a student:**
   - Username: `student2`
   - Password: `student123`

2. **Navigate to a lesson:**
   - Click on any lesson card
   - Scroll through the lesson content

3. **Take the quiz:**
   - Scroll to the "Bài kiểm tra" (Quiz Test) section
   - Answer the questions
   - Use the navigation dots to jump between questions
   - Watch the timer and progress bar
   - Submit when ready

4. **View results:**
   - See your score and performance
   - Review correct/incorrect answers
   - Check your attempt history
   - Retake the quiz to improve

---

## 📡 API Endpoints

### Student Endpoints

```bash
# Get quiz for a lesson
GET /api/quizzes/lesson/{lesson_id}/quiz

# Submit quiz answers
POST /api/quizzes/{quiz_id}/submit
{
  "answers": {
    "1": 3,        # question_id: answer_id (for MC/TF)
    "5": "answer"  # question_id: text (for short answer)
  },
  "time_spent": 120  # seconds
}

# Get my quiz attempts
GET /api/quizzes/attempts/my-attempts?quiz_id={quiz_id}

# Get best attempt for a quiz
GET /api/quizzes/{quiz_id}/best-attempt
```

### Teacher/Admin Endpoints

```bash
# Create quiz
POST /api/quizzes/

# Get all quizzes
GET /api/quizzes/?lesson_id={lesson_id}

# Update quiz
PUT /api/quizzes/{quiz_id}

# Delete quiz
DELETE /api/quizzes/{quiz_id}
```

---

## 🎨 Customization

### Change Quiz Settings

Edit the quiz creation in `seed_quiz_data.py`:

```python
quiz = Quiz(
    lesson_id=lesson.id,
    title="Your Quiz Title",
    description="Your description",
    duration=20,              # Time limit in minutes (None = no limit)
    passing_score=70.0,       # Passing percentage
    is_active=True,           # Enable/disable quiz
    shuffle_questions=True,   # Randomize question order
    show_answers=True         # Show correct answers after submission
)
```

### Add More Quizzes

Uncomment line in `seed_quiz_data.py`:

```python
# Option 2: Create quizzes for all lessons (uncomment if needed)
create_quizzes_for_all_lessons(db)
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 9532 is available
lsof -i :9532

# Check database connection
# Ensure MySQL is running on port 3307
docker-compose ps
```

### Frontend won't start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Quiz doesn't appear
1. Ensure backend is running
2. Check browser console for errors
3. Verify quiz was created: `GET /api/quizzes/lesson/{lesson_id}/quiz`
4. Check that lesson exists and is published

### Import errors in seed script
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Verify Python can import modules
python -c "from entities.quiz import Quiz; print('OK')"
```

---

## 📊 Database Schema

### Quiz Tables

**quizzes**
- id, lesson_id, title, description
- duration, passing_score
- is_active, shuffle_questions, show_answers
- created_at, updated_at

**quiz_questions**
- id, quiz_id
- question_text, question_type, points, order
- image_url
- created_at, updated_at

**quiz_answers**
- id, question_id
- answer_text, is_correct, order
- created_at

**quiz_attempts**
- id, user_id, quiz_id
- score, points_earned, total_points
- answers (JSON)
- started_at, submitted_at, time_spent
- is_completed

---

## 🎯 Next Steps / Future Enhancements

- [ ] Add quiz analytics dashboard for teachers
- [ ] Export quiz results to Excel/PDF
- [ ] Add quiz certificates
- [ ] Implement question bank for random quiz generation
- [ ] Add image upload for questions
- [ ] Support for LaTeX math equations
- [ ] Add quiz difficulty levels
- [ ] Implement adaptive quizzes (questions based on performance)
- [ ] Add peer comparison statistics
- [ ] Create quiz templates

---

## 📞 Support

If you encounter any issues:
1. Check the error in browser console (F12)
2. Check backend logs in terminal
3. Verify all services are running
4. Check database connectivity

---

**Built with ❤️ for THCS Như Quỳnh Math Learning Platform**
