// AnnouncementController: Web arayüzü (HTML Views) için çalışan Duyuru Kontrolcüsü (Full CRUD)
const AnnouncementModel = require('../models/announcementModel');
const AnnouncementViews = require('../views/announcementViews');

class AnnouncementController {
    // 1. READ (All): Duyuru Listesi + Ekleme Formu
    static renderList(req, res) {
        try {
            const list = AnnouncementModel.findAll();
            const html = AnnouncementViews.renderListPage(list);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 2. READ (One): Tekil Duyuru Detayı
    static renderDetail(req, res) {
        try {
            const item = AnnouncementModel.findById(req.params.id);
            if (!item) {
                return res.status(404).send('<h1>404 - Duyuru Bulunamadı</h1><a href="/announcements">Duyurulara Dön</a>');
            }
            const html = AnnouncementViews.renderDetailPage(item);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 3. CREATE: Formdan Yeni Duyuru Yayınla
    static create(req, res) {
        try {
            AnnouncementModel.create(req.body);
            return res.redirect('/announcements');
        } catch (error) {
            const list = AnnouncementModel.findAll();
            const html = AnnouncementViews.renderListPage(list, error.message);
            return res.status(400).send(html);
        }
    }

    // 4. UPDATE Formu: Düzenleme Sayfasını Göster
    static renderEditForm(req, res) {
        try {
            const item = AnnouncementModel.findById(req.params.id);
            if (!item) {
                return res.status(404).send('<h1>404 - Duyuru Bulunamadı</h1><a href="/announcements">Listeye Dön</a>');
            }
            const html = AnnouncementViews.renderEditPage(item);
            return res.status(200).send(html);
        } catch (error) {
            return res.status(500).send(`<h1>Sunucu Hatası</h1><p>${error.message}</p>`);
        }
    }

    // 5. UPDATE İşlemi: Değişiklikleri Kaydet
    static update(req, res) {
        try {
            const updated = AnnouncementModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).send('<h1>404 - Duyuru Bulunamadı</h1>');
            }
            return res.redirect('/announcements');
        } catch (error) {
            const item = AnnouncementModel.findById(req.params.id) || { id: req.params.id, ...req.body };
            const html = AnnouncementViews.renderEditPage(item, error.message);
            return res.status(400).send(html);
        }
    }

    // 6. DELETE İşlemi: Duyuruyu Sil
    static delete(req, res) {
        try {
            AnnouncementModel.delete(req.params.id);
            return res.redirect('/announcements');
        } catch (error) {
            return res.status(500).send(`<h1>Hata</h1><p>${error.message}</p>`);
        }
    }
}

module.exports = AnnouncementController;
