const express = require('express');
const router = express.Router();
const ApiApplicationController = require('../controllers/apiApplicationController');
const ApplicationModel = require('../models/applicationModel');
const requireAuth = require('../middleware/authMiddleware');
const { requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const applicationOwnerId = (req) => {
    const app = ApplicationModel.findById(req.params.id);
    return app ? app.user_id : null;
};

// DIRECT ROUTES: /api/applications
router.get('/', ApiApplicationController.getAllApplications);
router.get('/:id', requireAuth, requireOwnerOrAdmin(applicationOwnerId), ApiApplicationController.getApplicationById);
router.delete('/:id', requireAuth, requireOwnerOrAdmin(applicationOwnerId), ApiApplicationController.deleteApplication);

module.exports = router;
