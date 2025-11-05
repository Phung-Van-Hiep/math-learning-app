#!/usr/bin/env python3
"""
Validation script to verify quiz implementation files
"""
import os
from pathlib import Path

def check_file(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}")
        return True
    else:
        print(f"❌ MISSING: {description}")
        print(f"   Path: {filepath}")
        return False

def main():
    print("=" * 70)
    print("🔍 VALIDATING QUIZ IMPLEMENTATION")
    print("=" * 70)

    base_dir = Path(__file__).parent
    all_good = True

    print("\n📦 BACKEND FILES")
    print("-" * 70)
    backend_files = [
        ("be/schemas/quiz.py", "Quiz Pydantic schemas"),
        ("be/services/quiz_service.py", "Quiz service (business logic)"),
        ("be/routes/quiz.py", "Quiz API routes"),
        ("be/middleware/auth.py", "Auth middleware (updated)"),
        ("be/seed_quiz_data.py", "Quiz data seeder"),
    ]

    for filepath, desc in backend_files:
        if not check_file(base_dir / filepath, desc):
            all_good = False

    print("\n🎨 FRONTEND FILES")
    print("-" * 70)
    frontend_files = [
        ("fe/client/src/services/quizService.js", "Quiz API service"),
        ("fe/client/src/components/QuizSection.jsx", "Quiz section component"),
        ("fe/client/src/components/QuizSection.css", "Quiz section styles"),
        ("fe/client/src/components/QuizQuestion.jsx", "Quiz question component"),
        ("fe/client/src/components/QuizQuestion.css", "Quiz question styles"),
        ("fe/client/src/components/QuizResults.jsx", "Quiz results component"),
        ("fe/client/src/components/QuizResults.css", "Quiz results styles"),
    ]

    for filepath, desc in frontend_files:
        if not check_file(base_dir / filepath, desc):
            all_good = False

    print("\n📄 DOCUMENTATION")
    print("-" * 70)
    doc_files = [
        ("QUIZ_IMPLEMENTATION.md", "Implementation guide"),
    ]

    for filepath, desc in doc_files:
        if not check_file(base_dir / filepath, desc):
            all_good = False

    print("\n" + "=" * 70)
    if all_good:
        print("✅ ALL FILES PRESENT - Implementation Complete!")
        print("\n📖 Next steps:")
        print("   1. Start the database: docker-compose up -d mysql")
        print("   2. Start the backend: cd be && python main.py")
        print("   3. Seed quiz data: cd be && python seed_quiz_data.py")
        print("   4. Start the frontend: cd fe/client && npm run dev")
        print("\n📚 See QUIZ_IMPLEMENTATION.md for detailed instructions")
    else:
        print("❌ SOME FILES ARE MISSING")
        print("   Please check the output above for missing files")
    print("=" * 70)

if __name__ == "__main__":
    main()
