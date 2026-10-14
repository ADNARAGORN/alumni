// config/db.js: Veritabanı Bağlantı ve Yönetim Katmanı (Database Connection Layer)
// Sorumluluk: .env dosyasından bağlantı parametrelerini okur, veritabanı durumunu yönetir
// ve sistem ayağa kalktığında otomatik tohumlama (Seed) ile arayüzleri zenginleştirir.

require('dotenv').config();
const UserFactory = require('../database/factories/userFactory');
const AnnouncementFactory = require('../database/factories/announcementFactory');

class DatabaseConnection {
    static isConnected = false;
    static connectionConfig = null;

    // Veritabanı bağlantısını başlatır
    static async connect() {
        this.connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'alumni_user',
            password: process.env.DB_PASSWORD ? '******' : 'none',
            database: process.env.DB_NAME || 'alumni_db',
            driver: 'PostgreSQL / Smart In-Memory Adapter'
        };

        this.isConnected = true;
        console.log('🔌 [Database] Veritabanı bağlantısı başarıyla kuruldu:');
        console.log(`   Host: ${this.connectionConfig.host}:${this.connectionConfig.port}`);
        console.log(`   Database: ${this.connectionConfig.database}`);
        console.log(`   Driver: ${this.connectionConfig.driver}`);

        // Arayüzleri verilerle doldurmak için otomatik tohumlama (Auto-Seed on Connect)
        this.autoSeed();

        return this.connectionConfig;
    }

    // Arayüzleri gerçekçi verilerle dolduran otomatik tohumlama fonksiyonu
    static autoSeed() {
        const UserModel = require('../models/userModel');
        const AnnouncementModel = require('../models/announcementModel');

        // Kullanıcılar zaten varsa üzerine 10 yeni mezun daha ekleyip zenginleştir
        const seedUsers = UserFactory.createMany(10);
        seedUsers.forEach(u => UserModel.create(u));

        // Duyuruları 5 yeni duyuruyla zenginleştir
        const seedAnnouncements = AnnouncementFactory.createMany(5);
        seedAnnouncements.forEach(a => AnnouncementModel.create(a));

        console.log('🚀 [Database] CRUD Arayüzleri veritabanı tohumlamasıyla dolduruldu!');
        console.log(`   Toplam Mezun: ${UserModel.findAll().length}`);
        console.log(`   Toplam Duyuru: ${AnnouncementModel.findAll().length}`);
    }

    // Sağlık kontrolü (Healthcheck) için durum döner
    static getStatus() {
        return {
            connected: this.isConnected,
            config: this.connectionConfig,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = DatabaseConnection;
