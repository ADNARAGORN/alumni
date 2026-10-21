-- 006_create_applications_table.sql
-- Many-to-Many: Kullanıcılar ile İş İlanları arasındaki Başvurular ara tablosu (Join Table)

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, interview, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_job_application UNIQUE (user_id, job_posting_id)
);
