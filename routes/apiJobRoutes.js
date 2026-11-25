const express = require('express');
const router = express.Router();
const ApiJobPostingController = require('../controllers/apiJobPostingController');
const ApiApplicationController = require('../controllers/apiApplicationController');
const JobPostingModel = require('../models/jobPostingModel');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const jobOwnerId = (req) => {
    const job = JobPostingModel.findById(req.params.id);
    return job ? job.user_id : null;
};

const applicantUserId = (req) => {
    const bodyId = req.body && (req.body.userId || req.body.user_id);
    return bodyId !== undefined && bodyId !== '' ? Number(bodyId) : req.user.id;
};

// DIRECT ROUTES (Doğrudan İlan Rotaları)
router.get('/', ApiJobPostingController.getAllJobs);
router.get('/:id', ApiJobPostingController.getJobById);
router.put('/:id', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(jobOwnerId), ApiJobPostingController.updateJob);
router.delete('/:id', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(jobOwnerId), ApiJobPostingController.deleteJob);

// NESTED ROUTES: /api/jobs/:id/applications (İlana gelen başvurular)
// 1. İlana gelen başvuruları listele (Yalnızca ilan sahibi mezun veya admin)
router.get('/:id/applications', requireAuth, requireRole('admin', 'alumni'), requireOwnerOrAdmin(jobOwnerId), ApiApplicationController.getApplicationsByJobId);

// 2. İlana yeni başvuru yap (Tüm giriş yapmış roller kendi adına başvurabilir; admin herkes adına)
router.post('/:id/applications', requireAuth, requireOwnerOrAdmin(applicantUserId), ApiApplicationController.applyToJob);

module.exports = router;
