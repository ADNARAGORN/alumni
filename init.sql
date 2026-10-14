-- init.sql: ddd.md dosyasında tanımlanan veri sözlüğüne ve kısıtlara göre hazırlanan şema
-- Docker Compose ilk ayağa kalktığında PostgreSQL bu dosyayı otomatik çalıştırır.

-- 1. Kullanıcılar / Mezunlar Tablosu (Users)
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

-- 2. Duyurular Tablosu (Announcements)
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Genel',
    author VARCHAR(100) DEFAULT 'Mezunlar Ofisi',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Başlangıç Varsayılan Verileri (Seed Data)
INSERT INTO users (name, email, graduation_year, department, company, job_title, skills)
VALUES 
    ('Çağrı Akpınar', 'cagri@example.com', 2024, 'Yönetim Bilişim Sistemleri', 'Microsoft', 'Software Engineer', ARRAY['Node.js', 'React']),
    ('Tonay Culha', 'tonay@example.com', 2023, 'Yönetim Bilişim Sistemleri', 'Amazon', 'Data Scientist', ARRAY['Python', 'SQL'])
ON CONFLICT (email) DO NOTHING;

INSERT INTO announcements (title, content, category, author, date)
VALUES
    ('2026 Güz Dönemi Mezunlar Buluşması', 'Geleneksel mezunlar buluşmamız 25 Ekim Cumartesi günü Beyazıt Kampüsü''nde gerçekleşecektir.', 'Buluşma', 'Mezunlar Ofisi', '2026-10-10'),
    ('Google & Alumni Mentörlük Programı Başlıyor', 'Teknoloji sektöründe çalışan mezunlarımızla son sınıf öğrencilerimizi eşleştiren mentörlük programı başvuruları açıldı.', 'Kariyer', 'Kariyer Merkezi', '2026-10-12')
ON CONFLICT DO NOTHING;
