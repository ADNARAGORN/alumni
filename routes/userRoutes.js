const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Task 6: Define all CRUD operations on user route with view:

// 1. READ (All) - Mezun Listesi (Sayfada Create formu da yer alır)
router.get('/', UserController.renderUserList);

// 2. CREATE - Yeni Mezun Ekleme Formu Gönderimi
router.post('/', UserController.createUser);

// 3. READ (One) - Tekil Mezun Profil Kartı
router.get('/:id', UserController.renderUserDetail);

// 4. UPDATE (Form) - Düzenleme Sayfasını Getir
router.get('/:id/edit', UserController.renderEditForm);

// 5. UPDATE (Submit) - Düzenlemeyi Kaydet (HTML formları POST destekler)
router.post('/:id/update', UserController.updateUser);

// 6. DELETE (Submit) - Mezunu Sil
router.post('/:id/delete', UserController.deleteUser);

module.exports = router;
