// ApiAnnouncementController: API istemcileri (Postman, mobil vb.) için JSON çıktısı üreten Controller
const AnnouncementModel = require('../models/announcementModel');

class ApiAnnouncementController {
    // GET /api/announcements - Tüm duyuruları listele
    static getAllAnnouncements(req, res, next) {
        try {
            const announcements = AnnouncementModel.findAll();
            return res.status(200).json(announcements);
        } catch (error) {
            return next(error);
        }
    }

    // GET /api/announcements/:id - Tekil duyuru getir
    static getAnnouncementById(req, res, next) {
        try {
            const item = AnnouncementModel.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: "Duyuru bulunamadı!" });
            }
            return res.status(200).json(item);
        } catch (error) {
            return next(error);
        }
    }

    // POST /api/announcements - Yeni duyuru oluştur
    static createAnnouncement(req, res, next) {
        try {
            const newItem = AnnouncementModel.create(req.body);
            return res.status(201).json({
                message: "Duyuru başarıyla oluşturuldu!",
                data: newItem
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    // PUT /api/announcements/:id - Duyuruyu tamamen güncelle
    static updateAnnouncement(req, res, next) {
        try {
            const updated = AnnouncementModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Güncellenecek duyuru bulunamadı!" });
            }
            return res.status(200).json({
                message: "Duyuru başarıyla güncellendi! (PUT)",
                data: updated
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    // PATCH /api/announcements/:id - Duyuruyu kısmi güncelle
    static patchAnnouncement(req, res, next) {
        try {
            const patched = AnnouncementModel.patch(req.params.id, req.body);
            if (!patched) {
                return res.status(404).json({ message: "Güncellenecek duyuru bulunamadı!" });
            }
            return res.status(200).json({
                message: "Duyuru kısmi olarak güncellendi! (PATCH)",
                data: patched
            });
        } catch (error) {
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    // DELETE /api/announcements/:id - Duyuruyu sil
    static deleteAnnouncement(req, res, next) {
        try {
            const deleted = AnnouncementModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Silinecek duyuru bulunamadı!" });
            }
            return res.status(200).json({
                message: "Duyuru başarıyla silindi!",
                deletedItem: deleted
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ApiAnnouncementController;
