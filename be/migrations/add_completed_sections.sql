-- Migration: Add completed_sections column to student_progress table
-- This column stores JSON array of completed section IDs as text

-- For MySQL
ALTER TABLE student_progress
ADD COLUMN completed_sections TEXT NULL
COMMENT 'JSON array of completed section IDs';

-- For PostgreSQL (alternative)
-- ALTER TABLE student_progress
-- ADD COLUMN completed_sections TEXT;

-- For SQLite (alternative)
-- ALTER TABLE student_progress
-- ADD COLUMN completed_sections TEXT;
