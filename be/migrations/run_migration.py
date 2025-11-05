"""
Run database migration to add completed_sections column
"""
import sys
import os

# Add parent directory to path to import from be
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from core.config import settings

def run_migration():
    """Apply the add_completed_sections migration"""

    # Create engine
    engine = create_engine(settings.DATABASE_URL)

    # Migration SQL
    migration_sql = """
    ALTER TABLE student_progress
    ADD COLUMN completed_sections TEXT NULL
    COMMENT 'JSON array of completed section IDs';
    """

    try:
        with engine.connect() as connection:
            # Check if column already exists
            check_sql = """
            SELECT COUNT(*) as count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'student_progress'
            AND COLUMN_NAME = 'completed_sections';
            """
            result = connection.execute(text(check_sql))
            exists = result.fetchone()[0] > 0

            if exists:
                print("✓ Column 'completed_sections' already exists in student_progress table")
                return

            # Apply migration
            print("Applying migration: add completed_sections column...")
            connection.execute(text(migration_sql))
            connection.commit()
            print("✓ Migration completed successfully!")

    except Exception as e:
        print(f"✗ Migration failed: {e}")
        sys.exit(1)
    finally:
        engine.dispose()

if __name__ == "__main__":
    run_migration()
