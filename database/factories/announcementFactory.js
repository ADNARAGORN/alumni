// database/factories/announcementFactory.js
// Factory Mantığı: Rastgele veya özelleştirilmiş sahte (mock) duyuru verisi üreten fabrika fonksiyonu

class AnnouncementFactory {
    static categories = ["Kariyer", "Buluşma", "Etkinlik", "Genel"];
    static authors = ["Mezunlar Ofisi", "Kariyer Merkezi", "Bölüm Başkanlığı", "Öğrenci Dekanlığı"];
    static titles = [
        "Teknoloji Zirvesi ve Networking Buluşması",
        "Büyük Veri ve Yapay Zeka Kariyer Günü",
        "Geleneksel Pilav Günü ve Mezunlar Çayı",
        "Start-up Girişimcilik Yarışması Başvuruları",
        "Yurtdışı Yüksek Lisans ve Burs Fırsatları Semineri"
    ];

    static create(overrides = {}) {
        const title = this.titles[Math.floor(Math.random() * this.titles.length)];
        const category = this.categories[Math.floor(Math.random() * this.categories.length)];
        const author = this.authors[Math.floor(Math.random() * this.authors.length)];

        const defaultAnnouncement = {
            title: title,
            content: `Bu duyuru mezunlarımız ve öğrencilerimiz için düzenlenmiştir. Detaylı bilgi ve kayıt için lütfen mezunlar koordinasyon ofisi ile iletişime geçiniz.`,
            category: category,
            author: author,
            date: new Date().toISOString().split('T')[0]
        };

        return { ...defaultAnnouncement, ...overrides };
    }

    static createMany(count, overrides = {}) {
        const announcements = [];
        for (let i = 0; i < count; i++) {
            announcements.push(this.create(overrides));
        }
        return announcements;
    }
}

module.exports = AnnouncementFactory;
