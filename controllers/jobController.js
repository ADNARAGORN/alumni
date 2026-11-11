// controllers/jobController.js: İş İlanları ve Başvurular Web Arayüzü Controller'ı (HTML Views)
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');
const ApplicationModel = require('../models/applicationModel');
const JobViews = require('../views/jobViews');

class JobController {
    // 1. İŞ İLANLARI SAYFASI (GET /jobs)
    static renderJobsPage(req, res, next) {
        try {
            const jobs = JobPostingModel.findAll();
            const users = UserModel.findAll();
            const html = JobViews.renderJobsPage(jobs, users, req.query.error, req.query.success);
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 2. YENİ İŞ İLANI OLUŞTUR (POST /jobs)
    static createJob(req, res) {
        try {
            const userId = req.body.userId;
            const jobData = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                description: req.body.description
            };

            JobPostingModel.createForUser(userId, jobData);
            return res.redirect('/jobs?success=' + encodeURIComponent('İş ilanı başarıyla yayınlandı!'));
        } catch (error) {
            const jobs = JobPostingModel.findAll();
            const users = UserModel.findAll();
            const html = JobViews.renderJobsPage(jobs, users, error.message);
            return res.status(400).send(html);
        }
    }

    // 3. İLANA HIZLI BAŞVURU YAP (POST /jobs/:id/apply)
    // Slayttaki kural: Mükerrer ise 409 Conflict yakalanıp kullanıcıya kırmızı alert olarak basılır!
    static applyJob(req, res) {
        try {
            const jobId = req.params.id;
            const userId = req.body.userId;

            if (!userId) {
                return res.redirect('/jobs?error=' + encodeURIComponent('Lütfen başvuran mezunu seçin!'));
            }

            ApplicationModel.create(userId, jobId);
            return res.redirect('/jobs?success=' + encodeURIComponent('İlana başarıyla başvurdunuz!'));
        } catch (error) {
            // 409 Conflict veya diğer hataları yakala
            const errorMessage = error.statusCode === 409 
                ? 'Bu ilana zaten daha önce başvurdunuz! (409 Conflict - Mükerrer Başvuru Engellendi)'
                : error.message;

            return res.redirect('/jobs?error=' + encodeURIComponent(errorMessage));
        }
    }

    // 4. TÜM BAŞVURULARI LİSTELE (GET /applications)
    static renderAllApplications(req, res, next) {
        try {
            const applications = ApplicationModel.findAll();
            const users = UserModel.findAll();
            const jobs = JobPostingModel.findAll();
            const html = JobViews.renderApplicationsPage(applications, users, jobs, null, req.query.error, req.query.success);
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 5. BELİRLİ BİR İLANA GELEN BAŞVURULARI LİSTELE (GET /jobs/:id/applications)
    static renderJobApplications(req, res, next) {
        try {
            const jobId = req.params.id;
            const targetJob = JobPostingModel.findById(jobId);
            if (!targetJob) {
                return res.status(404).send('<h1>İş ilanı bulunamadı</h1><a href="/jobs">İlanlara Dön</a>');
            }

            const applications = ApplicationModel.findByJobId(jobId);
            const users = UserModel.findAll();
            const jobs = JobPostingModel.findAll();
            const html = JobViews.renderApplicationsPage(applications, users, jobs, targetJob, req.query.error, req.query.success);
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 6. BAŞVURUYU SİL / İPTAL ET (POST /applications/:id/delete)
    static deleteApplication(req, res) {
        try {
            ApplicationModel.delete(req.params.id);
            return res.redirect('/applications?success=' + encodeURIComponent('Başvuru başarıyla iptal edildi.'));
        } catch (error) {
            return res.redirect('/applications?error=' + encodeURIComponent(error.message));
        }
    }
}

module.exports = JobController;
