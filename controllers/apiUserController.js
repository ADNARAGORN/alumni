// ApiUserController: API istemcileri (Postman, Mobil Uygulama, Frontend fetch/axios) için JSON çıktısı üreten Controller
const UserModel = require('../models/userModel');

class ApiUserController {
    // GET /api/users - Tüm kullanıcıları listele
    static getAllUsers(req, res) {
        try {
            const users = UserModel.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // GET /api/users/:id - Tek kullanıcı getir
    static getUserById(req, res) {
        try {
            const user = UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // POST /api/users - Yeni kullanıcı ekle
    static createUser(req, res) {
        try {
            const newUser = UserModel.create(req.body);
            return res.status(201).json({
                message: "Kullanıcı başarıyla eklendi!",
                data: newUser
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // PUT /api/users/:id - Kullanıcıyı tamamen güncelle
    static updateUser(req, res) {
        try {
            const updatedUser = UserModel.update(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "Güncellenecek kullanıcı bulunamadı!" });
            }
            return res.status(200).json({
                message: "Kullanıcı başarıyla güncellendi! (PUT)",
                user: updatedUser
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // PATCH /api/users/:id - Kullanıcıyı kısmi güncelle
    static patchUser(req, res) {
        try {
            const patchedUser = UserModel.patch(req.params.id, req.body);
            if (!patchedUser) {
                return res.status(404).json({ message: "Güncellenecek kullanıcı bulunamadı!" });
            }
            return res.status(200).json({
                message: "Kullanıcı kısmi olarak güncellendi! (PATCH)",
                user: patchedUser
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // DELETE /api/users/:id - Kullanıcıyı sil
    static deleteUser(req, res) {
        try {
            const deletedUser = UserModel.delete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "Silinecek kullanıcı bulunamadı!" });
            }
            return res.status(200).json({
                message: "Kullanıcı sistemden başarıyla silindi!",
                deletedUser: deletedUser
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ApiUserController;
