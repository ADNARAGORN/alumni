// database/seeds/databaseSeeder.js
// Seeder Mantığı: Factory'leri kullanarak sistemi veya veritabanını test verileriyle otomatik besleyen çalıştırıcı

const UserFactory = require('../factories/userFactory');
const AnnouncementFactory = require('../factories/announcementFactory');
const UserModel = require('../../models/userModel');
const AnnouncementModel = require('../../models/announcementModel');

class DatabaseSeeder {
    // Tohumlama (Seeding) işlemini çalıştırır
    static run({ userCount = 5, announcementCount = 3 } = {}) {
        console.log('🌱 [DatabaseSeeder] Veri tohumlama işlemi başlatılıyor...');

        // 1. Kullanıcıları üret ve modele ekle
        const generatedUsers = UserFactory.createMany(userCount);
        const addedUsers = [];
        generatedUsers.forEach(u => {
            const added = UserModel.create(u);
            addedUsers.push(added);
            console.log(`  👤 Eklendi: ${added.name} (${added.email})`);
        });

        // 2. Duyuruları üret ve modele ekle
        const generatedAnnouncements = AnnouncementFactory.createMany(announcementCount);
        const addedAnnouncements = [];
        generatedAnnouncements.forEach(a => {
            const added = AnnouncementModel.create(a);
            addedAnnouncements.push(added);
            console.log(`  📢 Eklendi: ${added.title} [${added.category}]`);
        });

        console.log(`✅ [DatabaseSeeder] Başarıyla ${addedUsers.length} kullanıcı ve ${addedAnnouncements.length} duyuru tohumlandı!`);
        return {
            users: addedUsers,
            announcements: addedAnnouncements
        };
    }
}

// Komut satırından direkt çağrıldığında çalışması için (node database/seeds/databaseSeeder.js):
if (require.main === module) {
    DatabaseSeeder.run();
}

module.exports = DatabaseSeeder;
