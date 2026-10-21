const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/apiUserController');
const ApiJobPostingController = require('../controllers/apiJobPostingController');

// /api/users DIRECT Rotaları
router.get('/', ApiUserController.getAllUsers);
router.post('/', ApiUserController.createUser);
router.get('/:id', ApiUserController.getUserById);
router.put('/:id', ApiUserController.updateUser);
router.patch('/:id', ApiUserController.patchUser);
router.delete('/:id', ApiUserController.deleteUser);

// NESTED ROUTES: /api/users/:id/jobs (Belirli bir kullanıcının ilanları)
// 1. Kullanıcının ilanlarını getir
router.get('/:id/jobs', ApiJobPostingController.getJobsByUserId);

// 2. Kullanıcı adına yeni ilan aç (id URL'den, veriler body'den)
router.post('/:id/jobs', ApiJobPostingController.createJobForUser);

// NESTED ROUTE: /api/users/:id/applications (Belirli bir kullanıcının yaptığı başvurular)
const ApiApplicationController = require('../controllers/apiApplicationController');
router.get('/:id/applications', ApiApplicationController.getApplicationsByUserId);

module.exports = router;
