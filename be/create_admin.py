"""
Script to create initial admin account
Usage: python create_admin.py
"""

from services.database import SessionLocal
from services.models import Admin
from services.auth import get_password_hash
from dotenv import load_dotenv

load_dotenv()

def create_admin():
    db = SessionLocal()

    # Check if admin already exists
    existing_admin = db.query(Admin).filter(Admin.email == "admin@thcsnhuquynh.edu.vn").first()

    if existing_admin:
        print("❌ Admin account already exists!")
        print(f"Email: {existing_admin.email}")
        return

    print("Creating admin account...")
    print(get_password_hash("admin123"))
    # Create new admin
    admin = Admin(
        name="Administrator",
        email="admin@thcsnhuquynh.edu.vn",
        hashed_password=get_password_hash("admin123"),
        is_active=True
    )

    db.add(admin)
    db.commit()

    print("✅ Admin account created successfully!")
    print(f"Email: admin@thcsnhuquynh.edu.vn")
    print(f"Password: admin123")
    print("\n⚠️  Please change the password after first login!")

    db.close()

if __name__ == "__main__":
    create_admin()
