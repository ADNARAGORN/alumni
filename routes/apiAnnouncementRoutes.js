const express = require('express');
const router = express.Router();
const ApiAnnouncementController = require('../controllers/apiAnnouncementController');

// /api/announcements REST API Rotaları (JSON)
router.get('/', ApiAnnouncementController.getAllAnnouncements);
router.post('/', ApiAnnouncementController.createAnnouncement);
router.get('/:id', ApiAnnouncementController.getAnnouncementById);
router.put('/:id', ApiAnnouncementController.updateAnnouncement);
router.patch('/:id', ApiAnnouncementController.patchAnnouncement);
router.delete('/:id', ApiAnnouncementController.deleteAnnouncement);

module.exports = router;
