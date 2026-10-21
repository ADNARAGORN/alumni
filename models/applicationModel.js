// models/applicationModel.js: Başvuru Modeli (Many-to-Many Join Table)
// 006_create_applications_table.sql migration tarifnamesine göre oluşturulmuştur.

const UserModel = require('./userModel');
const JobPostingModel = require('./jobPostingModel');

let applications = [
    {
        id: 1,
        user_id: 3, // Adnan Takta
        job_posting_id: 10, // Backend Intern
        status: "applied",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        user_id: 2, // Tonay Culha
        job_posting_id: 10, // Backend Intern
        status: "applied",
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        user_id: 3, // Adnan Takta
        job_posting_id: 12, // QA Tester
        status: "interview",
        created_at: new Date().toISOString()
    }
];

let nextAppId = 4;

class ApplicationModel {
    // Read all
    static findAll() {
        return applications;
    }

    // Read by id
    static findById(id) {
        return applications.find(a => a.id === Number(id)) || null;
    }

    // İlana göre başvuruları getir (Bir ilana kimler başvurdu?)
    static findByJobId(jobId) {
        return applications.filter(a => a.job_posting_id === Number(jobId));
    }

    // Kullanıcıya göre başvuruları getir (Bir kullanıcı hangi ilanlara başvurdu?)
    static findByUserId(userId) {
        return applications.filter(a => a.user_id === Number(userId));
    }

    // CREATE: Yeni Başvuru Oluştur (Foreign Key ve UNIQUE kontrolleri ile)
    static create(userId, jobId, status = "applied") {
        const uId = Number(userId);
        const jId = Number(jobId);

        // 1. Foreign Key Kontrolü: Kullanıcı var mı?
        const user = UserModel.findById(uId);
        if (!user) {
            const err = new Error(`USER_NOT_FOUND: ${uId} ID'li kullanıcı bulunamadı!`);
            err.statusCode = 404;
            throw err;
        }

        // 2. Foreign Key Kontrolü: İlan var mı?
        const job = JobPostingModel.findById(jId);
        if (!job) {
            const err = new Error(`JOB_NOT_FOUND: ${jId} ID'li iş ilanı bulunamadı!`);
            err.statusCode = 404;
            throw err;
        }

        // 3. UNIQUE (user_id, job_posting_id) Kontrolü: Aynı kişi aynı ilana tekrar başvuramaz!
        const existing = applications.find(a => a.user_id === uId && a.job_posting_id === jId);
        if (existing) {
            const err = new Error(`ALREADY_APPLIED: Bu kullanıcı (${uId}) bu ilana (${jId}) zaten başvurmuş!`);
            err.statusCode = 409; // 409 Conflict
            throw err;
        }

        const newApplication = {
            id: nextAppId++,
            user_id: uId,
            job_posting_id: jId,
            status: status || "applied",
            created_at: new Date().toISOString()
        };

        applications.push(newApplication);
        return newApplication;
    }

    // Delete
    static delete(id) {
        const index = applications.findIndex(a => a.id === Number(id));
        if (index === -1) return null;
        const [deleted] = applications.splice(index, 1);
        return deleted;
    }
}

module.exports = ApplicationModel;
