-- 002_create_announcements_table.sql
-- ddd.md dosyasındaki Announcement modelinin PostgreSQL Migration dosyası

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Genel',
    author VARCHAR(100) DEFAULT 'Mezunlar Ofisi',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
