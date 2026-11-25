const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Web Auth Rotaları (/register, /login, /logout)
router.get('/register', AuthController.renderRegisterPage);
router.post('/register', AuthController.registerWeb);

router.get('/login', AuthController.renderLoginPage);
router.post('/login', AuthController.loginWeb);

router.get('/logout', AuthController.logoutWeb);
router.post('/logout', AuthController.logoutWeb);

module.exports = router;
