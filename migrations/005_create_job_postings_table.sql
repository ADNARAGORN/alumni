-- 005_create_job_postings_table.sql
-- Hafta 6: İş İlanları Tablosu (One-to-Many: Her ilan bir kullanıcıya aittir)

CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) DEFAULT 'İstanbul (Hibrit)',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
