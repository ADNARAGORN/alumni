// AnnouncementModel: Bellek içi (In-Memory / without database yet) Duyuru Modeli ve Doğrulama Kuralları
let announcements = [
    {
        id: 1,
        title: "2026 Güz Dönemi Mezunlar Buluşması",
        content: "Geleneksel mezunlar buluşmamız 25 Ekim Cumartesi günü Beyazıt Kampüsü'nde gerçekleşecektir. Tüm mezunlarımız davetlidir!",
        author: "Mezunlar Ofisi",
        category: "Buluşma",
        date: "2026-10-10"
    },
    {
        id: 2,
        title: "Google & Alumni Mentörlük Programı Başlıyor",
        content: "Teknoloji sektöründe çalışan mezunlarımızla son sınıf öğrencilerimizi eşleştiren mentörlük programı başvuruları açıldı.",
        author: "Kariyer Merkezi",
        category: "Kariyer",
        date: "2026-10-12"
    }
];

let nextAnnouncementId = 3;

class AnnouncementModel {
    // Doğrulama kuralı: title ve content zorunludur
    static validate(data, isPartial = false) {
        if (!isPartial || (isPartial && data.title !== undefined)) {
            if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
                return { isValid: false, error: 'Başlık (title) zorunludur!' };
            }
        }
        if (!isPartial || (isPartial && data.content !== undefined)) {
            if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') {
                return { isValid: false, error: 'İçerik (content) zorunludur!' };
            }
        }
        return { isValid: true };
    }

    // Read all
    static findAll() {
        return announcements;
    }

    // Read one
    static findById(id) {
        return announcements.find(a => a.id === Number(id)) || null;
    }

    // Create
    static create(data) {
        const validation = this.validate(data, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        const newAnnouncement = {
            id: nextAnnouncementId++,
            title: data.title.trim(),
            content: data.content.trim(),
            author: data.author ? data.author.trim() : "Yönetim",
            category: data.category ? data.category.trim() : "Genel",
            date: data.date || new Date().toISOString().split('T')[0]
        };

        announcements.unshift(newAnnouncement); // En yeniyi en başa ekle
        return newAnnouncement;
    }

    // Update (PUT)
    static update(id, data) {
        const index = announcements.findIndex(a => a.id === Number(id));
        if (index === -1) return null;

        const validation = this.validate(data, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        announcements[index] = {
            id: Number(id),
            title: data.title.trim(),
            content: data.content.trim(),
            author: data.author ? data.author.trim() : announcements[index].author,
            category: data.category ? data.category.trim() : announcements[index].category,
            date: data.date || announcements[index].date
        };
        return announcements[index];
    }

    // Patch (Kısmi Güncelleme)
    static patch(id, partialData) {
        const index = announcements.findIndex(a => a.id === Number(id));
        if (index === -1) return null;

        const validation = this.validate(partialData, true);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        announcements[index] = {
            ...announcements[index],
            ...partialData,
            id: Number(id)
        };
        return announcements[index];
    }

    // Delete
    static delete(id) {
        const index = announcements.findIndex(a => a.id === Number(id));
        if (index === -1) return null;

        const [deleted] = announcements.splice(index, 1);
        return deleted;
    }
}

module.exports = AnnouncementModel;
