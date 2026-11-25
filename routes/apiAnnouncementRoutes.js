const express = require('express');
const router = express.Router();
const ApiAnnouncementController = require('../controllers/apiAnnouncementController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// /api/announcements REST API Rotaları (JSON)
// Duyuru oluşturma / güncelleme / silme yalnızca admin rolüne açıktır (ddd.md)
router.get('/', ApiAnnouncementController.getAllAnnouncements);
router.post('/', requireAuth, requireRole('admin'), ApiAnnouncementController.createAnnouncement);
router.get('/:id', ApiAnnouncementController.getAnnouncementById);
router.put('/:id', requireAuth, requireRole('admin'), ApiAnnouncementController.updateAnnouncement);
router.patch('/:id', requireAuth, requireRole('admin'), ApiAnnouncementController.patchAnnouncement);
router.delete('/:id', requireAuth, requireRole('admin'), ApiAnnouncementController.deleteAnnouncement);

module.exports = router;
