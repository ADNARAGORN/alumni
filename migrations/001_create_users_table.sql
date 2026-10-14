-- 001_create_users_table.sql
-- ddd.md dosyasındaki User modelinin PostgreSQL Migration dosyası

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    graduation_year INTEGER,
    department VARCHAR(150) DEFAULT 'Yönetim Bilişim Sistemleri',
    company VARCHAR(150),
    job_title VARCHAR(150),
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
