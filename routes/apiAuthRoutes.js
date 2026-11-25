const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const requireAuth = require('../middleware/authMiddleware');

// API Auth Rotaları (/api/auth/...)
router.post('/register', AuthController.registerApi);
router.post('/login', AuthController.loginApi);
router.post('/logout', AuthController.logoutApi);
router.get('/me', requireAuth, AuthController.getCurrentUserApi);
router.get('/navigation', AuthController.getNavigationApi);

module.exports = router;
