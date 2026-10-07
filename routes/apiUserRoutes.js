const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/apiUserController');

// Slayttaki kural: ROUTES - the table of contents
// /api/users rotalarını ApiUserController fonksiyonlarına bağlama
router.get('/', ApiUserController.getAllUsers);
router.post('/', ApiUserController.createUser);
router.get('/:id', ApiUserController.getUserById);
router.put('/:id', ApiUserController.updateUser);
router.patch('/:id', ApiUserController.patchUser);
router.delete('/:id', ApiUserController.deleteUser);

module.exports = router;
