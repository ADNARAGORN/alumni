const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/apiUserController');
const ApiJobPostingController = require('../controllers/apiJobPostingController');
const ApiApplicationController = require('../controllers/apiApplicationController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roleMiddleware');

const targetUserId = (req) => Number(req.params.id);

// /api/users DIRECT Rotaları
router.get('/', ApiUserController.getAllUsers);
router.post('/', requireAuth, requireRole('admin'), ApiUserController.createUser);
router.get('/:id', ApiUserController.getUserById);
router.put('/:id', requireAuth, requireOwnerOrAdmin(targetUserId, { preventRoleChange: true }), ApiUserController.updateUser);
router.patch('/:id', requireAuth, requireOwnerOrAdmin(targetUserId, { preventRoleChange: true }), ApiUserController.patchUser);
router.delete('/:id', requireAuth, requireRole('admin'), ApiUserController.deleteUser);

// NESTED ROUTES: /api/users/:id/jobs (Belirli bir kullanıcının ilanları)
// 1. Kullanıcının ilanlarını getir (Herkese açık)
router.get('/:id/jobs', ApiJobPostingController.getJobsByUserId);

// 2. Kullanıcı adına yeni ilan aç (Yalnızca admin veya kendi adına alumni — student açamaz!)
router.post(
    '/:id/jobs',
    requireAuth,
    requireRole('admin', 'alumni'),
    requireOwnerOrAdmin(targetUserId),
    ApiJobPostingController.createJobForUser
);

// NESTED ROUTE: /api/users/:id/applications (Yalnızca kendi başvuruları veya admin)
router.get('/:id/applications', requireAuth, requireOwnerOrAdmin(targetUserId), ApiApplicationController.getApplicationsByUserId);

module.exports = router;
