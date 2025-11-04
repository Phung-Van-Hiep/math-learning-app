"""
Seed database with initial data
"""
from sqlalchemy.orm import Session
from core.database import SessionLocal, init_db
from entities.user import User, UserRole
from entities.lesson import Lesson, LessonDifficulty
from utils.security import get_password_hash


def create_users(db: Session):
    """Create initial users"""
    print("Creating users...")

    # Check if users already exist
    if db.query(User).count() > 0:
        print("Users already exist, skipping...")
        return

    users = [
        # Admin
        User(
            username="admin",
            email="admin@thcsnhuquynh.edu.vn",
            full_name="Quản trị viên",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        ),
        # # Teacher
        # User(
        #     username="teacher1",
        #     email="teacher1@thcsnhuquynh.edu.vn",
        #     full_name="Giáo viên Toán",
        #     hashed_password=get_password_hash("teacher123"),
        #     role=UserRole.TEACHER,
        #     is_active=True,
        #     is_verified=True
        # ),
        # # Students
        # User(
        #     username="student1",
        #     email="student1@example.com",
        #     full_name="Nguyễn Văn An",
        #     hashed_password=get_password_hash("student123"),
        #     role=UserRole.STUDENT,
        #     grade=8,
        #     class_name="8A",
        #     is_active=True,
        #     is_verified=True
        # ),
        User(
            username="student2",
            email="student2@example.com",
            full_name="Trần Thị Bình",
            hashed_password=get_password_hash("student123"),
            role=UserRole.STUDENT,
            grade=9,
            class_name="9B",
            is_active=True,
            is_verified=True
        ),
    ]

    db.add_all(users)
    db.commit()
    print(f"✅ Created {len(users)} users")


def create_lessons(db: Session):
    """Create initial lessons"""
    print("Creating lessons...")

    # Check if lessons already exist
    if db.query(Lesson).count() > 0:
        print("Lessons already exist, skipping...")
        return

    lessons = [
        Lesson(
            title="Phương trình bậc nhất một ẩn",
            slug="phuong-trinh-bac-nhat-mot-an",
            description="Học về phương trình bậc nhất một ẩn và cách giải",
            grade=8,
            duration=45,
            difficulty=LessonDifficulty.MEDIUM,
            rating=4.8,
            review_count=124,
            is_published=True,
            order=1,
            thumbnail="https://via.placeholder.com/400x225/4A90E2/FFFFFF?text=Phuong+trinh+bac+nhat",
            content="<h2>Phương trình bậc nhất một ẩn</h2><p>Nội dung bài học...</p>"
        ),
        Lesson(
            title="Bất phương trình bậc nhất",
            slug="bat-phuong-trinh-bac-nhat",
            description="Tìm hiểu bất phương trình và cách giải",
            grade=8,
            duration=50,
            difficulty=LessonDifficulty.MEDIUM,
            rating=4.5,
            review_count=89,
            is_published=True,
            order=2,
            thumbnail="https://via.placeholder.com/400x225/10B981/FFFFFF?text=Bat+phuong+trinh",
            content="<h2>Bất phương trình bậc nhất</h2><p>Nội dung bài học...</p>"
        ),
        Lesson(
            title="Hệ phương trình",
            slug="he-phuong-trinh",
            description="Giải hệ phương trình hai ẩn",
            grade=9,
            duration=60,
            difficulty=LessonDifficulty.HARD,
            rating=4.9,
            review_count=156,
            is_published=True,
            order=3,
            thumbnail="https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=He+phuong+trinh",
            content="<h2>Hệ phương trình</h2><p>Nội dung bài học...</p>"
        ),
        Lesson(
            title="Hàm số bậc nhất",
            slug="ham-so-bac-nhat",
            description="Tìm hiểu về hàm số bậc nhất và đồ thị",
            grade=9,
            duration=55,
            difficulty=LessonDifficulty.MEDIUM,
            rating=4.6,
            review_count=98,
            is_published=True,
            order=4,
            thumbnail="https://via.placeholder.com/400x225/4A90E2/FFFFFF?text=Ham+so+bac+nhat",
            content="<h2>Hàm số bậc nhất</h2><p>Nội dung bài học...</p>"
        ),
        Lesson(
            title="Đường thẳng song song",
            slug="duong-thang-song-song",
            description="Tính chất đường thẳng song song",
            grade=8,
            duration=40,
            difficulty=LessonDifficulty.EASY,
            rating=4.7,
            review_count=112,
            is_published=True,
            order=5,
            thumbnail="https://via.placeholder.com/400x225/10B981/FFFFFF?text=Duong+thang+song+song",
            content="<h2>Đường thẳng song song</h2><p>Nội dung bài học...</p>"
        ),
        Lesson(
            title="Tam giác đồng dạng",
            slug="tam-giac-dong-dang",
            description="Các trường hợp đồng dạng của tam giác",
            grade=8,
            duration=50,
            difficulty=LessonDifficulty.MEDIUM,
            rating=4.4,
            review_count=76,
            is_published=True,
            order=6,
            thumbnail="https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=Tam+giac+dong+dang",
            content="<h2>Tam giác đồng dạng</h2><p>Nội dung bài học...</p>"
        ),
    ]

    db.add_all(lessons)
    db.commit()
    print(f"✅ Created {len(lessons)} lessons")


def seed_database():
    """Main seed function"""
    print("🌱 Seeding database...")

    # Initialize database
    init_db()

    # Create session
    db = SessionLocal()

    try:
        create_users(db)
        create_lessons(db)

        print("\n✅ Database seeded successfully!")
        print("\n📝 Default credentials:")
        print("   Admin: admin / admin123")
        print("   Teacher: teacher1 / teacher123")
        print("   Student: student1 / student123")
        print("   Student: student2 / student123")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
