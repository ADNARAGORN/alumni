-- 004_create_jobs_and_mentorship_tables.sql
-- ddd.md ve README.md içindeki "İş İlanları" ve "Mentörlük Ağı" özellikleri için veritabanı tabloları

-- 1. İş ve Staj İlanları Tablosu (Jobs / Careers)
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) DEFAULT 'İstanbul (Hibrit)',
    employment_type VARCHAR(50) DEFAULT 'Tam Zamanlı', -- Tam Zamanlı, Staj, Yarı Zamanlı
    description TEXT NOT NULL,
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- İlanı veren mezun
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mentörlük Başvuruları / Eşleşmeleri Tablosu (Mentorship)
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    topic VARCHAR(150) NOT NULL, -- Örn: Kariyer Danışmanlığı, Kod İnceleme, Mülakat Hazırlığı
    status VARCHAR(50) DEFAULT 'Beklemede', -- Beklemede, Kabul Edildi, Tamamlandı, Reddedildi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
