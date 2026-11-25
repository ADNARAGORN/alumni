// controllers/adminController.js — Admin Panel (Web & API) Controller
// Not: Tüm rotaları requireAuth + requireRole('admin') arkasındadır.

const UserModel = require('../models/userModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const AnnouncementModel = require('../models/announcementModel');
const AdminViews = require('../views/adminViews');

class AdminController {
    // ================= WEB: ADMIN PANEL DASHBOARD =================
    static renderDashboard(req, res, next) {
        try {
            const html = AdminViews.renderDashboard({
                users: UserModel.findAll(),
                jobs: JobPostingModel.findAll(),
                applications: ApplicationModel.findAll(),
                announcements: AnnouncementModel.findAll(),
                currentUser: req.user,
                errorMessage: req.query ? req.query.error : null,
                successMessage: req.query ? req.query.success : null
            });
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    }

    // WEB: Yeni Kullanıcı Oluştur (Admin rol seçebilir)
    static createUserWeb(req, res) {
        try {
            const { name, email, password, role, department, company } = req.body || {};
            if (email && UserModel.findRawByEmail(email)) {
                return res.redirect('/admin?error=' + encodeURIComponent('Bu e-posta adresi zaten sistemde kayıtlı.'));
            }
            const created = UserModel.create({
                name,
                email,
                password: password || '123456',
                role: role || 'student',
                department: department || 'Yönetim Bilişim Sistemleri',
                company: company || null
            });
            return res.redirect('/admin?success=' + encodeURIComponent(`${created.name} (${created.role}) başarıyla eklendi.`));
        } catch (error) {
            return res.redirect('/admin?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // WEB: Kullanıcı Rolünü Güncelle
    static updateUserRoleWeb(req, res) {
        try {
            const targetId = Number(req.params.id);
            const newRole = req.body && req.body.role;

            if (req.user && Number(req.user.id) === targetId && newRole !== 'admin') {
                return res.redirect('/admin?error=' + encodeURIComponent('Kendi aktif admin yetkinizi düşüremezsiniz.'));
            }

            const updated = UserModel.updateRole(targetId, newRole);
            if (!updated) {
                return res.redirect('/admin?error=' + encodeURIComponent(`#${targetId} ID'li kullanıcı bulunamadı.`));
            }
            return res.redirect('/admin?success=' + encodeURIComponent(`${updated.name} kullanıcısının rolü '${updated.role}' olarak güncellendi.`));
        } catch (error) {
            return res.redirect('/admin?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // WEB: Kullanıcı Sil
    static deleteUserWeb(req, res) {
        const targetId = Number(req.params.id);
        if (req.user && Number(req.user.id) === targetId) {
            return res.redirect('/admin?error=' + encodeURIComponent('Kendi aktif admin hesabınızı silemezsiniz.'));
        }
        const deleted = UserModel.delete(targetId);
        if (!deleted) {
            return res.redirect('/admin?error=' + encodeURIComponent(`#${targetId} ID'li kullanıcı bulunamadı.`));
        }
        return res.redirect('/admin?success=' + encodeURIComponent(`${deleted.name} hesabı ve ilişkili ilanları silindi.`));
    }

    // WEB: İş İlanı Sil
    static deleteJobWeb(req, res) {
        const deleted = JobPostingModel.delete(req.params.id);
        if (!deleted) {
            return res.redirect('/admin?error=' + encodeURIComponent('Silinecek iş ilanı bulunamadı.'));
        }
        return res.redirect('/admin?success=' + encodeURIComponent(`'${deleted.title}' iş ilanı silindi.`));
    }

    // WEB: Başvuru Durumu Güncelle
    static updateApplicationStatusWeb(req, res) {
        try {
            const updated = ApplicationModel.updateStatus(req.params.id, req.body && req.body.status);
            if (!updated) {
                return res.redirect('/admin?error=' + encodeURIComponent('Güncellenecek başvuru bulunamadı.'));
            }
            return res.redirect('/admin?success=' + encodeURIComponent(`#${updated.id} başvurusu '${updated.status}' olarak güncellendi.`));
        } catch (error) {
            return res.redirect('/admin?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // WEB: Başvuru Sil
    static deleteApplicationWeb(req, res) {
        const deleted = ApplicationModel.delete(req.params.id);
        if (!deleted) {
            return res.redirect('/admin?error=' + encodeURIComponent('Silinecek başvuru bulunamadı.'));
        }
        return res.redirect('/admin?success=' + encodeURIComponent(`#${deleted.id} numaralı başvuru silindi.`));
    }

    // WEB: Hızlı Duyuru Yayınla
    static createAnnouncementWeb(req, res) {
        try {
            const { title, content, category } = req.body || {};
            const created = AnnouncementModel.create({
                title,
                content,
                category: category || 'Genel',
                author: req.user ? `${req.user.name} (Admin)` : 'Admin'
            });
            return res.redirect('/admin?success=' + encodeURIComponent(`'${created.title}' duyurusu yayınlandı.`));
        } catch (error) {
            return res.redirect('/admin?error=' + encodeURIComponent(error.message.replace(/^VALIDATION_ERROR:\s*/, '')));
        }
    }

    // WEB: Duyuru Sil
    static deleteAnnouncementWeb(req, res) {
        const deleted = AnnouncementModel.delete(req.params.id);
        if (!deleted) {
            return res.redirect('/admin?error=' + encodeURIComponent('Silinecek duyuru bulunamadı.'));
        }
        return res.redirect('/admin?success=' + encodeURIComponent(`'${deleted.title}' duyurusu silindi.`));
    }

    // ================= API: ADMIN ENDPOINTS (/api/admin/...) =================
    static getOverviewApi(req, res, next) {
        try {
            const users = UserModel.findAll();
            const jobs = JobPostingModel.findAll();
            const applications = ApplicationModel.findAll();
            const announcements = AnnouncementModel.findAll();

            return res.status(200).json({
                admin: req.user,
                stats: {
                    totalUsers: users.length,
                    roles: {
                        admin: users.filter(u => u.role === 'admin').length,
                        alumni: users.filter(u => u.role === 'alumni').length,
                        student: users.filter(u => u.role === 'student').length
                    },
                    totalJobs: jobs.length,
                    totalApplications: applications.length,
                    totalAnnouncements: announcements.length
                },
                data: { users, jobs, applications, announcements }
            });
        } catch (error) {
            return next(error);
        }
    }

    static updateUserRoleApi(req, res, next) {
        try {
            const targetId = Number(req.params.id);
            const newRole = req.body && req.body.role;

            if (req.user && Number(req.user.id) === targetId && newRole !== 'admin') {
                return res.status(400).json({
                    status: 400,
                    error: 'Bad Request',
                    reason: 'Kendi aktif admin yetkinizi düşüremezsiniz.'
                });
            }

            const updated = UserModel.updateRole(targetId, newRole);
            if (!updated) {
                return res.status(404).json({ status: 404, error: 'Not Found', reason: 'Kullanıcı bulunamadı.' });
            }
            return res.status(200).json({
                message: 'Kullanıcı rolü başarıyla güncellendi.',
                user: updated
            });
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({
                    status: 400,
                    error: 'Bad Request',
                    reason: error.message.replace(/^VALIDATION_ERROR:\s*/, '')
                });
            }
            return next(error);
        }
    }

    static updateApplicationStatusApi(req, res, next) {
        try {
            const updated = ApplicationModel.updateStatus(req.params.id, req.body && req.body.status);
            if (!updated) {
                return res.status(404).json({ status: 404, error: 'Not Found', reason: 'Başvuru bulunamadı.' });
            }
            return res.status(200).json({
                message: 'Başvuru durumu güncellendi.',
                application: updated
            });
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({
                    status: 400,
                    error: 'Bad Request',
                    reason: error.message.replace(/^VALIDATION_ERROR:\s*/, '')
                });
            }
            return next(error);
        }
    }
}

module.exports = AdminController;
