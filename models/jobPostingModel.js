// models/jobPostingModel.js: İş İlanı Modeli (One-to-Many: Her ilan bir users.id'ye aittir)
// 005_create_job_postings_table.sql migration tarifnamesine göre oluşturulmuştur.

const UserModel = require('./userModel');

let jobPostings = [
    {
        id: 10,
        user_id: 1, // Çağrı Akpınar
        title: "Backend Intern",
        company: "Microsoft",
        location: "İstanbul (Hibrit)",
        description: "Node.js ve bulut teknolojileri üzerine çalışacak stajyer aranıyor.",
        created_at: new Date().toISOString()
    },
    {
        id: 11,
        user_id: 1, // Çağrı Akpınar
        title: "Data Analyst",
        company: "Microsoft",
        location: "İstanbul (Uzaktan)",
        description: "SQL ve PowerBI tecrübesi olan analist.",
        created_at: new Date().toISOString()
    },
    {
        id: 12,
        user_id: 2, // Tonay Culha
        title: "QA Tester",
        company: "Amazon",
        location: "İstanbul (Ofis)",
        description: "Otomasyon ve API testleri yapacak takım arkadaşı.",
        created_at: new Date().toISOString()
    }
];

let nextJobId = 13;

class JobPostingModel {
    // Doğrulama kuralı
    static validate(data, isPartial = false) {
        if (!isPartial || (isPartial && data.title !== undefined)) {
            if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
                return { isValid: false, error: 'Başlık (title) zorunludur!' };
            }
        }
        if (!isPartial || (isPartial && data.company !== undefined)) {
            if (!data.company || typeof data.company !== 'string' || data.company.trim() === '') {
                return { isValid: false, error: 'Şirket (company) zorunludur!' };
            }
        }
        return { isValid: true };
    }

    // Read all
    static findAll() {
        return jobPostings;
    }

    // Read by id
    static findById(id) {
        return jobPostings.find(j => j.id === Number(id)) || null;
    }

    // RELATIONSHIP: Belirli bir kullanıcıya ait tüm ilanları getir (One-to-Many: User hasMany Jobs)
    static findByUserId(userId) {
        return jobPostings.filter(j => j.user_id === Number(userId));
    }

    // RELATIONSHIP & CREATE: Kullanıcı için yeni iş ilanı oluştur
    static createForUser(userId, jobData) {
        // Foreign Key Kontrolü: Böyle bir kullanıcı var mı?
        const user = UserModel.findById(userId);
        if (!user) {
            const err = new Error(`USER_NOT_FOUND: ${userId} ID'li kullanıcı bulunamadı!`);
            err.statusCode = 404;
            throw err;
        }

        const validation = this.validate(jobData, false);
        if (!validation.isValid) {
            const err = new Error(`VALIDATION_ERROR: ${validation.error}`);
            err.statusCode = 400;
            throw err;
        }

        const newJob = {
            id: nextJobId++,
            user_id: Number(userId), // FK
            title: jobData.title.trim(),
            company: jobData.company.trim(),
            location: jobData.location ? jobData.location.trim() : "İstanbul (Hibrit)",
            description: jobData.description ? jobData.description.trim() : "",
            created_at: new Date().toISOString()
        };

        jobPostings.push(newJob);
        return newJob;
    }

    // Update
    static update(id, updateData) {
        const index = jobPostings.findIndex(j => j.id === Number(id));
        if (index === -1) return null;

        const validation = this.validate(updateData, false);
        if (!validation.isValid) {
            const err = new Error(`VALIDATION_ERROR: ${validation.error}`);
            err.statusCode = 400;
            throw err;
        }

        jobPostings[index] = {
            ...jobPostings[index],
            title: updateData.title.trim(),
            company: updateData.company.trim(),
            location: updateData.location ? updateData.location.trim() : jobPostings[index].location,
            description: updateData.description !== undefined ? updateData.description : jobPostings[index].description
        };
        return jobPostings[index];
    }

    // Delete
    static delete(id) {
        const index = jobPostings.findIndex(j => j.id === Number(id));
        if (index === -1) return null;
        const [deleted] = jobPostings.splice(index, 1);
        return deleted;
    }

    // CASCADE DELETE: Bir kullanıcı silindiğinde onun tüm ilanlarını sil
    static deleteByUserId(userId) {
        const beforeCount = jobPostings.length;
        jobPostings = jobPostings.filter(j => j.user_id !== Number(userId));
        return beforeCount - jobPostings.length;
    }
}

module.exports = JobPostingModel;
