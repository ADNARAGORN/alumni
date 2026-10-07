// UserController: HTML View katmanı ile Model arasındaki köprü (Full CRUD)
const UserModel = require('../models/userModel');
const UserViews = require('../views/userViews');

class UserController {
    // 1. READ (All): Mezunları Listele
    static renderUserList(req, res) {
        try {
            const users = UserModel.findAll();
            const html = UserViews.renderUserListPage(users);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 2. READ (One): Tekil Profil Görüntüle
    static renderUserDetail(req, res) {
        try {
            const user = UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('<h1>404 - Kullanıcı Bulunamadı</h1><a href="/users">Listeye Dön</a>');
            }
            const html = UserViews.renderUserDetailPage(user);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 3. CREATE: Formdan Yeni Mezun Ekle
    static createUser(req, res) {
        try {
            const userData = {
                name: req.body.name,
                email: req.body.email,
                graduationYear: req.body.graduationYear ? Number(req.body.graduationYear) : undefined,
                department: req.body.department,
                company: req.body.company,
                jobTitle: req.body.jobTitle
            };

            UserModel.create(userData);
            return res.redirect('/users');
        } catch (error) {
            const users = UserModel.findAll();
            const html = UserViews.renderUserListPage(users, error.message);
            return res.status(400).send(html);
        }
    }

    // 4. UPDATE Formu: Düzenleme Sayfasını Göster
    static renderEditForm(req, res) {
        try {
            const user = UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('<h1>404 - Düzenlenecek Kullanıcı Bulunamadı</h1><a href="/users">Listeye Dön</a>');
            }
            const html = UserViews.renderUserEditPage(user);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 5. UPDATE İşlemi: Değişiklikleri Kaydet
    static updateUser(req, res) {
        try {
            const updateData = {
                name: req.body.name,
                email: req.body.email,
                graduationYear: req.body.graduationYear ? Number(req.body.graduationYear) : undefined,
                department: req.body.department,
                company: req.body.company,
                jobTitle: req.body.jobTitle
            };

            const updated = UserModel.update(req.params.id, updateData);
            if (!updated) {
                return res.status(404).send('<h1>404 - Kullanıcı Bulunamadı</h1>');
            }
            return res.redirect('/users');
        } catch (error) {
            const user = UserModel.findById(req.params.id) || { id: req.params.id, ...req.body };
            const html = UserViews.renderUserEditPage(user, error.message);
            return res.status(400).send(html);
        }
    }

    // 6. DELETE İşlemi: Mezunu Sil
    static deleteUser(req, res) {
        try {
            UserModel.delete(req.params.id);
            return res.redirect('/users');
        } catch (error) {
            return res.status(500).send(`<h1>Hata</h1><p>${error.message}</p>`);
        }
    }
}

module.exports = UserController;
