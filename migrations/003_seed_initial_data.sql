-- 003_seed_initial_data.sql
-- Başlangıç varsayılan kayıtları (Seed data)

INSERT INTO users (name, email, graduation_year, department, company, job_title, skills)
VALUES 
    ('Çağrı Akpınar', 'cagri@example.com', 2024, 'Yönetim Bilişim Sistemleri', 'Microsoft', 'Software Engineer', ARRAY['Node.js', 'React']),
    ('Tonay Culha', 'tonay@example.com', 2023, 'Yönetim Bilişim Sistemleri', 'Amazon', 'Data Scientist', ARRAY['Python', 'SQL']),
    ('Adnan Takta', 'adnan@example.com', 2024, 'Yönetim Bilişim Sistemleri', 'Google', 'Frontend Developer', ARRAY['React', 'TypeScript', 'Node.js']),
    ('Elif Kaya', 'elif@example.com', 2024, 'Yönetim Bilişim Sistemleri', 'Trendyol', 'Backend Developer', ARRAY['Node.js', 'Express', 'PostgreSQL'])
ON CONFLICT (email) DO NOTHING;

INSERT INTO announcements (title, content, category, author, date)
VALUES
    ('2026 Güz Dönemi Mezunlar Buluşması', 'Geleneksel mezunlar buluşmamız 25 Ekim Cumartesi günü Beyazıt Kampüsü''nde gerçekleşecektir.', 'Buluşma', 'Mezunlar Ofisi', '2026-10-10'),
    ('Google & Alumni Mentörlük Programı Başlıyor', 'Teknoloji sektöründe çalışan mezunlarımızla son sınıf öğrencilerimizi eşleştiren mentörlük programı başvuruları açıldı.', 'Kariyer', 'Kariyer Merkezi', '2026-10-12'),
    ('Yapay Zeka ve Kariyer Webinarı', 'Yapay zekanın geleceği ve sektördeki yeni roller üzerine çevrim içi seminerimiz 30 Ekim''de Zoom üzerinden yapılacaktır.', 'Etkinlik', 'Bölüm Başkanlığı', '2026-10-14')
ON CONFLICT DO NOTHING;
