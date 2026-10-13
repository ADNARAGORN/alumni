const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');

// /announcements Web Arayüzü Rotaları (HTML Views)
// 1. Liste + Ekleme Formu
router.get('/', AnnouncementController.renderList);

// 2. Yeni Duyuru Ekle (Form Submit)
router.post('/', AnnouncementController.create);

// 3. Tekil Duyuru Detayı
router.get('/:id', AnnouncementController.renderDetail);

// 4. Düzenleme Formu
router.get('/:id/edit', AnnouncementController.renderEditForm);

// 5. Düzenlemeyi Kaydet (Form Submit)
router.post('/:id/update', AnnouncementController.update);

// 6. Duyuruyu Sil (Form Submit)
router.post('/:id/delete', AnnouncementController.delete);

module.exports = router;
