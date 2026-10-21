const express = require('express');
const router = express.Router();
const ApiJobPostingController = require('../controllers/apiJobPostingController');
const ApiApplicationController = require('../controllers/apiApplicationController');

// DIRECT ROUTES (Doğrudan İlan Rotaları)
router.get('/', ApiJobPostingController.getAllJobs);
router.get('/:id', ApiJobPostingController.getJobById);
router.put('/:id', ApiJobPostingController.updateJob);
router.delete('/:id', ApiJobPostingController.deleteJob);

// NESTED ROUTES: /api/jobs/:id/applications (İlana gelen başvurular)
// 1. İlana gelen başvuruları listele
router.get('/:id/applications', ApiApplicationController.getApplicationsByJobId);

// 2. İlana yeni başvuru yap (Mükerrer ise 409 döner)
router.post('/:id/applications', ApiApplicationController.applyToJob);

module.exports = router;
