"""
Seed quiz data for testing
Run this script to create sample quizzes for lessons
"""
from sqlalchemy.orm import Session
from core.database import SessionLocal
from entities.lesson import Lesson
from entities.quiz import Quiz, QuizQuestion, QuizAnswer


def create_sample_quiz(db: Session):
    """Create a sample quiz for the first lesson"""

    # Get the first lesson
    lesson = db.query(Lesson).first()
    if not lesson:
        print("No lessons found. Please run seed_data.py first.")
        return

    print(f"Creating quiz for lesson: {lesson.title}")

    # Check if quiz already exists
    existing_quiz = db.query(Quiz).filter(Quiz.lesson_id == lesson.id).first()
    if existing_quiz:
        print("Quiz already exists for this lesson. Skipping.")
        return

    # Create quiz
    quiz = Quiz(
        lesson_id=lesson.id,
        title=f"Bài kiểm tra: {lesson.title}",
        description="Kiểm tra kiến thức của bạn về bài học này",
        duration=15,  # 15 minutes
        passing_score=70.0,
        is_active=True,
        shuffle_questions=True,
        show_answers=True
    )
    db.add(quiz)
    db.flush()

    # Question 1: Multiple Choice
    q1 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Phương trình bậc nhất một ẩn có dạng tổng quát là gì?",
        question_type="multiple_choice",
        points=2.0,
        order=1
    )
    db.add(q1)
    db.flush()

    # Answers for Q1
    db.add_all([
        QuizAnswer(question_id=q1.id, answer_text="ax + b = 0 (a ≠ 0)", is_correct=True, order=1),
        QuizAnswer(question_id=q1.id, answer_text="ax² + bx + c = 0", is_correct=False, order=2),
        QuizAnswer(question_id=q1.id, answer_text="ax + by = c", is_correct=False, order=3),
        QuizAnswer(question_id=q1.id, answer_text="x + y = 0", is_correct=False, order=4),
    ])

    # Question 2: Multiple Choice
    q2 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Nghiệm của phương trình 2x - 6 = 0 là:",
        question_type="multiple_choice",
        points=2.0,
        order=2
    )
    db.add(q2)
    db.flush()

    # Answers for Q2
    db.add_all([
        QuizAnswer(question_id=q2.id, answer_text="x = 3", is_correct=True, order=1),
        QuizAnswer(question_id=q2.id, answer_text="x = -3", is_correct=False, order=2),
        QuizAnswer(question_id=q2.id, answer_text="x = 2", is_correct=False, order=3),
        QuizAnswer(question_id=q2.id, answer_text="x = -2", is_correct=False, order=4),
    ])

    # Question 3: True/False
    q3 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Phương trình 0x + 5 = 0 có vô số nghiệm",
        question_type="true_false",
        points=1.5,
        order=3
    )
    db.add(q3)
    db.flush()

    # Answers for Q3
    db.add_all([
        QuizAnswer(question_id=q3.id, answer_text="Đúng", is_correct=False, order=1),
        QuizAnswer(question_id=q3.id, answer_text="Sai", is_correct=True, order=2),
    ])

    # Question 4: Multiple Choice
    q4 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Để giải phương trình 3x + 9 = 0, bước đầu tiên ta nên:",
        question_type="multiple_choice",
        points=2.0,
        order=4
    )
    db.add(q4)
    db.flush()

    # Answers for Q4
    db.add_all([
        QuizAnswer(question_id=q4.id, answer_text="Chuyển vế số 9 sang phải", is_correct=True, order=1),
        QuizAnswer(question_id=q4.id, answer_text="Chia cả hai vế cho 3x", is_correct=False, order=2),
        QuizAnswer(question_id=q4.id, answer_text="Nhân cả hai vế với 3", is_correct=False, order=3),
        QuizAnswer(question_id=q4.id, answer_text="Bình phương cả hai vế", is_correct=False, order=4),
    ])

    # Question 5: Short Answer
    q5 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Nghiệm của phương trình x + 10 = 15 là bao nhiêu? (Chỉ ghi số)",
        question_type="short_answer",
        points=2.5,
        order=5
    )
    db.add(q5)
    db.flush()

    # Answer for Q5
    db.add(QuizAnswer(question_id=q5.id, answer_text="5", is_correct=True, order=1))

    db.commit()
    print(f"✅ Quiz created successfully with 5 questions!")
    print(f"   - 4 Multiple Choice questions")
    print(f"   - 1 True/False question")
    print(f"   - 1 Short Answer question")
    print(f"   - Total points: 10.0")
    print(f"   - Passing score: 70%")
    print(f"   - Duration: 15 minutes")


def create_quizzes_for_all_lessons(db: Session):
    """Create sample quizzes for all lessons"""

    lessons = db.query(Lesson).filter(Lesson.is_published == True).all()

    if not lessons:
        print("No published lessons found.")
        return

    for lesson in lessons:
        # Check if quiz already exists
        existing_quiz = db.query(Quiz).filter(Quiz.lesson_id == lesson.id).first()
        if existing_quiz:
            print(f"Quiz already exists for: {lesson.title}")
            continue

        print(f"\nCreating quiz for: {lesson.title}")

        # Create quiz
        quiz = Quiz(
            lesson_id=lesson.id,
            title=f"Bài kiểm tra: {lesson.title}",
            description=f"Kiểm tra kiến thức về {lesson.title.lower()}",
            duration=15,
            passing_score=70.0,
            is_active=True,
            shuffle_questions=True,
            show_answers=True
        )
        db.add(quiz)
        db.flush()

        # Create 5 sample questions
        for i in range(1, 6):
            q = QuizQuestion(
                quiz_id=quiz.id,
                question_text=f"Câu hỏi {i} về {lesson.title}?",
                question_type="multiple_choice" if i <= 3 else ("true_false" if i == 4 else "short_answer"),
                points=2.0,
                order=i
            )
            db.add(q)
            db.flush()

            # Add answers
            if q.question_type == "multiple_choice":
                db.add_all([
                    QuizAnswer(question_id=q.id, answer_text="Đáp án A", is_correct=(i == 1), order=1),
                    QuizAnswer(question_id=q.id, answer_text="Đáp án B", is_correct=(i == 2), order=2),
                    QuizAnswer(question_id=q.id, answer_text="Đáp án C", is_correct=(i == 3), order=3),
                    QuizAnswer(question_id=q.id, answer_text="Đáp án D", is_correct=False, order=4),
                ])
            elif q.question_type == "true_false":
                db.add_all([
                    QuizAnswer(question_id=q.id, answer_text="Đúng", is_correct=True, order=1),
                    QuizAnswer(question_id=q.id, answer_text="Sai", is_correct=False, order=2),
                ])
            else:  # short_answer
                db.add(QuizAnswer(question_id=q.id, answer_text="đáp án đúng", is_correct=True, order=1))

        db.commit()
        print(f"✅ Quiz created for: {lesson.title}")

    print("\n🎉 All quizzes created successfully!")


def main():
    """Main function"""
    db = SessionLocal()

    try:
        print("=" * 60)
        print("🎯 QUIZ DATA SEEDER")
        print("=" * 60)

        # Option 1: Create one detailed quiz
        create_sample_quiz(db)

        # Option 2: Create quizzes for all lessons (uncomment if needed)
        # create_quizzes_for_all_lessons(db)

        print("\n" + "=" * 60)
        print("✅ Seeding completed!")
        print("=" * 60)

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
