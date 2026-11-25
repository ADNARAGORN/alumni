// routes/profileRoutes.js — Kullanıcıya Özel Sayfa Rotaları (/profile, /my-applications, /my-jobs)
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const jobOwnerId = (req) => {
    const job = JobPostingModel.findById(req.params.id);
    return job ? job.user_id : null;
};

const appOwnerId = (req) => {
    const app = ApplicationModel.findById(req.params.id);
    return app ? app.user_id : null;
};

// 1. Kişisel Profil Sayfası (Giriş yapmış tüm roller: student, alumni, admin)
router.get('/profile', requireAuth, ProfileController.renderProfile);
router.post('/profile', requireAuth, ProfileController.updateProfileWeb);

// 2. Kişisel Başvurularım Sayfası (Giriş yapmış tüm roller — yalnızca kendi başvuruları)
router.get('/my-applications', requireAuth, ProfileController.renderMyApplications);
router.post('/my-applications/:id/delete', requireAuth, requireOwnerOrAdmin(appOwnerId), ProfileController.deleteMyApplicationWeb);

// 3. Kişisel İlanlarım Sayfası (Yalnızca alumni ve admin — student 403 alır!)
router.get('/my-jobs', requireAuth, requireRole('admin', 'alumni'), ProfileController.renderMyJobs);
router.post('/my-jobs', requireAuth, requireRole('admin', 'alumni'), ProfileController.createMyJobWeb);
router.post('/my-jobs/:id/delete', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(jobOwnerId), ProfileController.deleteMyJobWeb);

// 4. Kişisel Profil JSON API
router.get('/api/profile', requireAuth, ProfileController.getProfileApi);

module.exports = router;
