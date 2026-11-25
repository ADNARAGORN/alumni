-- 007_add_auth_columns_to_users.sql
-- ddd.md Auth & RBAC kurallarına göre users tablosuna password_hash ve role sütunlarını ekler

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'student';

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS chk_users_role;

ALTER TABLE users
    ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'alumni', 'student'));
