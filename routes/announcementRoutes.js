const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// /announcements Web Arayüzü Rotaları (HTML Views)
// 1. Liste (Herkese açık)
router.get('/', AnnouncementController.renderList);

// 2. Yeni Duyuru Ekle (Yalnızca admin)
router.post('/', requireAuth, requireRole('admin'), AnnouncementController.create);

// 3. Tekil Duyuru Detayı (Herkese açık)
router.get('/:id', AnnouncementController.renderDetail);

// 4. Düzenleme Formu (Yalnızca admin)
router.get('/:id/edit', requireAuth, requireRole('admin'), AnnouncementController.renderEditForm);

// 5. Düzenlemeyi Kaydet (Yalnızca admin)
router.post('/:id/update', requireAuth, requireRole('admin'), AnnouncementController.update);

// 6. Duyuruyu Sil (Yalnızca admin)
router.post('/:id/delete', requireAuth, requireRole('admin'), AnnouncementController.delete);

module.exports = router;
