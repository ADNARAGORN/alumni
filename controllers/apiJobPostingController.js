// controllers/apiJobPostingController.js: İş İlanları için REST API Controller (Direct ve Nested rotaları yönetir)
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');

class ApiJobPostingController {
    // DIRECT ROUTE: GET /api/jobs - Sistemdeki tüm iş ilanlarını listele
    static getAllJobs(req, res, next) {
        try {
            const jobs = JobPostingModel.findAll();
            return res.status(200).json(jobs);
        } catch (error) {
            return next(error);
        }
    }

    // DIRECT ROUTE: GET /api/jobs/:id - Tekil iş ilanı getir
    static getJobById(req, res, next) {
        try {
            const job = JobPostingModel.findById(req.params.id);
            if (!job) {
                return res.status(404).json({ message: "İş ilanı bulunamadı!" });
            }
            return res.status(200).json(job);
        } catch (error) {
            return next(error);
        }
    }

    // NESTED ROUTE: GET /api/users/:id/jobs - Belirli bir kullanıcının ilanlarını getir
    static getJobsByUserId(req, res, next) {
        try {
            const userId = req.params.id;
            // 1. Önce kullanıcı var mı kontrol et
            const user = UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: `${userId} ID'li kullanıcı bulunamadı!` });
            }

            // 2. Kullanıcının iş ilanlarını getir
            const userJobs = JobPostingModel.findByUserId(userId);
            return res.status(200).json(userJobs);
        } catch (error) {
            return next(error);
        }
    }

    // NESTED ROUTE: POST /api/users/:id/jobs - Belirli bir kullanıcı adına yeni ilan oluştur
    // Slayttaki kural: id from URL (:id), title & company from body. Body'de user_id yazmaz!
    static createJobForUser(req, res, next) {
        try {
            const userId = req.params.id;
            
            // Model seviyesindeki kontrol ve ekleme (FK güvencesi)
            const newJob = JobPostingModel.createForUser(userId, req.body);
            
            return res.status(201).json({
                message: "İş ilanı başarıyla oluşturuldu!",
                data: newJob
            });
        } catch (error) {
            if (error.statusCode === 404 || error.message.startsWith('USER_NOT_FOUND')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.statusCode === 400 || error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    // DIRECT ROUTE: PUT /api/jobs/:id - İlanı güncelle
    static updateJob(req, res, next) {
        try {
            const updated = JobPostingModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Güncellenecek ilan bulunamadı!" });
            }
            return res.status(200).json({
                message: "İş ilanı güncellendi!",
                data: updated
            });
        } catch (error) {
            if (error.statusCode === 400 || error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    // DIRECT ROUTE: DELETE /api/jobs/:id - İlanı sil
    static deleteJob(req, res, next) {
        try {
            const deleted = JobPostingModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Silinecek ilan bulunamadı!" });
            }
            return res.status(200).json({
                message: "İş ilanı başarıyla silindi!",
                deletedItem: deleted
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ApiJobPostingController;
