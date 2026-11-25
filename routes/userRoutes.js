const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const targetUserId = (req) => Number(req.params.id);

// 1. READ (All) - Mezun Listesi (Herkese açık)
router.get('/', UserController.renderUserList);

// 2. CREATE - Yeni Mezun Ekleme Formu Gönderimi (Yalnızca admin)
router.post('/', requireAuth, requireRole('admin'), UserController.createUser);

// 3. READ (One) - Tekil Mezun Profil Kartı (Herkese açık)
router.get('/:id', UserController.renderUserDetail);

// 4. UPDATE (Form) - Düzenleme Sayfasını Getir (Kendi profili veya admin)
router.get('/:id/edit', requireAuth, requireOwnerOrAdmin(targetUserId), UserController.renderEditForm);

// 5. UPDATE (Submit) - Düzenlemeyi Kaydet (Kendi profili veya admin)
router.post('/:id/update', requireAuth, requireOwnerOrAdmin(targetUserId, { preventRoleChange: true }), UserController.updateUser);

// 6. DELETE (Submit) - Mezunu Sil (Yalnızca admin)
router.post('/:id/delete', requireAuth, requireRole('admin'), UserController.deleteUser);

module.exports = router;
