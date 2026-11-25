// routes/apiAdminRoutes.js — REST API Admin Rotaları (/api/admin/...)
// Tüm alt rotalar zorunlu olarak requireAuth (401) + requireRole('admin') (403) arkasındadır.

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(requireAuth, requireRole('admin'));

router.get('/overview', AdminController.getOverviewApi);
router.patch('/users/:id/role', AdminController.updateUserRoleApi);
router.patch('/applications/:id/status', AdminController.updateApplicationStatusApi);

module.exports = router;
