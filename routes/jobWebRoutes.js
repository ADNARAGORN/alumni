const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const jobOwnerId = (req) => {
    const job = JobPostingModel.findById(req.params.id);
    return job ? job.user_id : null;
};

const bodyUserIdOrSelf = (req) => {
    const bodyId = req.body && req.body.userId;
    return bodyId !== undefined && bodyId !== '' ? Number(bodyId) : req.user.id;
};

const applicationOwnerId = (req) => {
    const app = ApplicationModel.findById(req.params.id);
    return app ? app.user_id : null;
};

// 1. İş İlanları Listesi + Yeni İlan Ekleme Formu (Herkese açık)
router.get('/jobs', JobController.renderJobsPage);

// 2. Yeni İş İlanı Gönderme (Yalnızca admin veya kendi adına alumni — student açamaz!)
router.post('/jobs', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(bodyUserIdOrSelf), JobController.createJob);

// 3. İlana Hızlı Başvuru Yapma (Giriş yapmış herkes kendi adına başvurabilir; admin herkes adına)
router.post('/jobs/:id/apply', requireAuth, requireOwnerOrAdmin(bodyUserIdOrSelf), JobController.applyJob);

// 4. Belirli bir ilana gelen başvuruları görüntüleme (Yalnızca ilan sahibi mezun veya admin)
router.get('/jobs/:id/applications', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(jobOwnerId), JobController.renderJobApplications);

// 5. Tüm başvuruları genel listede görüntüleme (Herkese açık)
router.get('/applications', JobController.renderAllApplications);

// 6. Başvuruyu silme / iptal etme (Yalnızca başvuru sahibi veya admin)
router.post('/applications/:id/delete', requireAuth, requireOwnerOrAdmin(applicationOwnerId), JobController.deleteApplication);

module.exports = router;
