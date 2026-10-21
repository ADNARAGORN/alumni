const express = require('express');
const router = express.Router();
const ApiApplicationController = require('../controllers/apiApplicationController');

// DIRECT ROUTES: /api/applications
router.get('/', ApiApplicationController.getAllApplications);
router.get('/:id', ApiApplicationController.getApplicationById);
router.delete('/:id', ApiApplicationController.deleteApplication);

module.exports = router;
