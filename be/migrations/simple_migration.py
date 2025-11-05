"""Simple migration script using pymysql directly"""
import pymysql

# Database connection details
config = {
    'host': 'localhost',
    'port': 3307,
    'user': 'thcs_user',
    'password': 'thcs_password_change_this',  # Update if needed
    'database': 'thcs_math',
}

try:
    # Connect to database
    print("Connecting to database...")
    connection = pymysql.connect(**config)
    cursor = connection.cursor()

    # Check if column already exists
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'student_progress'
        AND COLUMN_NAME = 'completed_sections'
    """)

    exists = cursor.fetchone()[0] > 0

    if exists:
        print("✓ Column 'completed_sections' already exists!")
    else:
        # Add the column
        print("Adding completed_sections column...")
        cursor.execute("""
            ALTER TABLE student_progress
            ADD COLUMN completed_sections TEXT NULL
            COMMENT 'JSON array of completed section IDs'
        """)
        connection.commit()
        print("✓ Migration completed successfully!")

    cursor.close()
    connection.close()

except pymysql.Error as e:
    print(f"✗ Database error: {e}")
except Exception as e:
    print(f"✗ Error: {e}")
