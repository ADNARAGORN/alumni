// controllers/apiApplicationController.js: Başvuru Yönetimi (Direct ve Nested Rotalar)
const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');

class ApiApplicationController {
    // DIRECT ROUTE: GET /api/applications - Tüm başvuruları listele
    static getAllApplications(req, res) {
        try {
            const list = ApplicationModel.findAll();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // DIRECT ROUTE: GET /api/applications/:id - Tekil başvuru detayı
    static getApplicationById(req, res) {
        try {
            const app = ApplicationModel.findById(req.params.id);
            if (!app) {
                return res.status(404).json({ message: "Başvuru bulunamadı!" });
            }
            return res.status(200).json(app);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // NESTED ROUTE: GET /api/jobs/:id/applications - İlana gelen başvuruları getir
    static getApplicationsByJobId(req, res) {
        try {
            const jobId = req.params.id;
            const job = JobPostingModel.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: `${jobId} ID'li iş ilanı bulunamadı!` });
            }

            const applications = ApplicationModel.findByJobId(jobId);
            return res.status(200).json(applications);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // NESTED ROUTE: POST /api/jobs/:id/applications - İlana başvuru yap
    // Body: { "userId": 1, "status": "applied" }
    // İki kez başvurulursa 409 döner!
    static applyToJob(req, res) {
        try {
            const jobId = req.params.id;
            const userId = req.body.userId || req.body.user_id;

            if (!userId) {
                return res.status(400).json({ error: "Başvuru yapacak kullanıcının 'userId' bilgisi zorunludur!" });
            }

            const newApp = ApplicationModel.create(userId, jobId, req.body.status);
            return res.status(201).json({
                message: "İş başvurusu başarıyla alındı!",
                data: newApp
            });
        } catch (error) {
            if (error.statusCode === 409 || error.message.startsWith('ALREADY_APPLIED')) {
                return res.status(409).json({ error: error.message });
            }
            if (error.statusCode === 404) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // NESTED ROUTE: GET /api/users/:id/applications - Kullanıcının yaptığı tüm başvurular
    static getApplicationsByUserId(req, res) {
        try {
            const userId = req.params.id;
            const user = UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: `${userId} ID'li kullanıcı bulunamadı!` });
            }

            const applications = ApplicationModel.findByUserId(userId);
            return res.status(200).json(applications);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // DIRECT ROUTE: DELETE /api/applications/:id - Başvuruyu geri çek / sil
    static deleteApplication(req, res) {
        try {
            const deleted = ApplicationModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Silinecek başvuru bulunamadı!" });
            }
            return res.status(200).json({
                message: "Başvuru başarıyla iptal edildi / silindi!",
                deletedItem: deleted
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ApiApplicationController;
