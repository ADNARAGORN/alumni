// controllers/profileController.js — Kullanıcıya Özel Sayfalar Controller'ı (/profile, /my-applications, /my-jobs, /api/profile)
const UserModel = require('../models/userModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const ProfileViews = require('../views/profileViews');

class ProfileController {
    // 1. WEB: KİŞİSEL PROFİL SAYFASI (GET /profile)
    static renderProfile(req, res, next) {
        try {
            const user = req.user;
            const myJobs = JobPostingModel.findByUserId(user.id);
            const myApplications = ApplicationModel.findByUserId(user.id);
            const allJobs = JobPostingModel.findAll();

            const applicantsOnMyJobsCount = myJobs.reduce(
                (sum, job) => sum + ApplicationModel.findByJobId(job.id).length,
                0
            );

            const html = ProfileViews.renderProfilePage({
                user,
                myJobs,
                myApplications,
                allJobs,
                applicantsOnMyJobsCount,
                errorMessage: req.query ? req.query.error : null,
                successMessage: req.query ? req.query.success : null
            });
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 2. WEB: KENDİ PROFİLİNİ GÜNCELLE (POST /profile)
    // Güvenlik: Yalnızca req.user.id güncellenir ve role asla kullanıcı tarafından değiştirilemez!
    static updateProfileWeb(req, res) {
        try {
            const body = req.body || {};
            const skillsArray = typeof body.skills === 'string'
                ? body.skills.split(',').map(s => s.trim()).filter(Boolean)
                : (Array.isArray(req.user.skills) ? req.user.skills : []);

            UserModel.patch(req.user.id, {
                name: body.name,
                email: body.email,
                department: body.department,
                graduationYear: body.graduationYear ? Number(body.graduationYear) : null,
                company: body.company || null,
                jobTitle: body.jobTitle || null,
                skills: skillsArray
            });

            return res.redirect('/profile?success=' + encodeURIComponent('Profil bilgileriniz başarıyla güncellendi!'));
        } catch (error) {
            return res.redirect('/profile?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // 3. WEB: BAŞVURULARIM SAYFASI (GET /my-applications)
    static renderMyApplications(req, res, next) {
        try {
            const myApps = ApplicationModel.findByUserId(req.user.id);
            const allJobs = JobPostingModel.findAll();

            const html = ProfileViews.renderMyApplicationsPage({
                user: req.user,
                applications: myApps,
                jobs: allJobs,
                errorMessage: req.query ? req.query.error : null,
                successMessage: req.query ? req.query.success : null
            });
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 4. WEB: KENDİ BAŞVURUSUNU İPTAL ET (POST /my-applications/:id/delete)
    static deleteMyApplicationWeb(req, res) {
        const deleted = ApplicationModel.delete(req.params.id);
        if (!deleted) {
            return res.redirect('/my-applications?error=' + encodeURIComponent('İptal edilecek başvuru bulunamadı.'));
        }
        return res.redirect('/my-applications?success=' + encodeURIComponent('Başvurunuz başarıyla iptal edildi.'));
    }

    // 5. WEB: İLANLARIM SAYFASI (GET /my-jobs — Yalnızca alumni ve admin)
    static renderMyJobs(req, res, next) {
        try {
            const myJobs = JobPostingModel.findByUserId(req.user.id);
            const applicantCountByJobId = {};
            myJobs.forEach(j => {
                applicantCountByJobId[j.id] = ApplicationModel.findByJobId(j.id).length;
            });

            const html = ProfileViews.renderMyJobsPage({
                user: req.user,
                myJobs,
                applicantCountByJobId,
                errorMessage: req.query ? req.query.error : null,
                successMessage: req.query ? req.query.success : null
            });
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // 6. WEB: KENDİ ADINA İLAN OLUŞTUR (POST /my-jobs — Yalnızca alumni ve admin)
    static createMyJobWeb(req, res) {
        try {
            const body = req.body || {};
            JobPostingModel.createForUser(req.user.id, {
                title: body.title,
                company: body.company,
                location: body.location,
                description: body.description
            });
            return res.redirect('/my-jobs?success=' + encodeURIComponent('Yeni iş ilanınız başarıyla yayınlandı!'));
        } catch (error) {
            return res.redirect('/my-jobs?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // 7. WEB: KENDİ İLANINI SİL (POST /my-jobs/:id/delete)
    static deleteMyJobWeb(req, res) {
        const deleted = JobPostingModel.delete(req.params.id);
        if (!deleted) {
            return res.redirect('/my-jobs?error=' + encodeURIComponent('Silinecek ilan bulunamadı.'));
        }
        return res.redirect('/my-jobs?success=' + encodeURIComponent(`'${deleted.title}' ilanınız silindi.`));
    }

    // 8. API: KİŞİSEL PROFİL & VERİLER (GET /api/profile)
    static getProfileApi(req, res, next) {
        try {
            const user = req.user;
            const myApplications = ApplicationModel.findByUserId(user.id);
            const isJobPoster = user.role === 'alumni' || user.role === 'admin';
            const myJobs = isJobPoster ? JobPostingModel.findByUserId(user.id) : [];

            return res.status(200).json({
                user,
                myApplications,
                ...(isJobPoster ? { myJobs } : {})
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ProfileController;
