// routes/adminRoutes.js — Web Admin Panel Rotaları (/admin/...)
// Tüm alt rotalar zorunlu olarak requireAuth + requireRole('admin') arkasındadır.

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const requireAuth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Router seviyesinde çift kilit: Giriş yapmamışsa /login'e, admin değilse 403 Forbidden'a!
router.use(requireAuth, requireRole('admin'));

// Ana Yönetim Paneli
router.get('/', AdminController.renderDashboard);

// Kullanıcı & Rol Yönetimi
router.post('/users', AdminController.createUserWeb);
router.post('/users/:id/role', AdminController.updateUserRoleWeb);
router.post('/users/:id/delete', AdminController.deleteUserWeb);

// İş İlanları Yönetimi
router.post('/jobs/:id/delete', AdminController.deleteJobWeb);

// Başvuru Yönetimi
router.post('/applications/:id/status', AdminController.updateApplicationStatusWeb);
router.post('/applications/:id/delete', AdminController.deleteApplicationWeb);

// Duyuru Yönetimi
router.post('/announcements', AdminController.createAnnouncementWeb);
router.post('/announcements/:id/delete', AdminController.deleteAnnouncementWeb);

module.exports = router;
