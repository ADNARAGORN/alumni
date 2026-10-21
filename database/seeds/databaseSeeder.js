// database/seeds/databaseSeeder.js
// Seeder Mantığı: Factory'leri kullanarak sistemi veya veritabanını test verileriyle otomatik besleyen çalıştırıcı

const UserFactory = require('../factories/userFactory');
const AnnouncementFactory = require('../factories/announcementFactory');
const JobPostingFactory = require('../factories/jobPostingFactory');
const UserModel = require('../../models/userModel');
const AnnouncementModel = require('../../models/announcementModel');
const JobPostingModel = require('../../models/jobPostingModel');

class DatabaseSeeder {
    // Tohumlama (Seeding) işlemini çalıştırır
    static run({ userCount = 5, announcementCount = 3, jobCount = 6 } = {}) {
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

        // 3. İş İlanlarını üret ve kullanıcılara bağlayarak ekle (One-to-Many Seed)
        const availableUserIds = UserModel.findAll().map(u => u.id);
        const generatedJobs = JobPostingFactory.createMany(jobCount, availableUserIds);
        const addedJobs = [];
        generatedJobs.forEach(j => {
            const added = JobPostingModel.createForUser(j.userId, j.data);
            addedJobs.push(added);
            console.log(`  💼 İlan Eklendi: ${added.title} @ ${added.company} (Sahibi User ID: ${added.user_id})`);
        });

        console.log(`✅ [DatabaseSeeder] Başarıyla ${addedUsers.length} kullanıcı, ${addedAnnouncements.length} duyuru ve ${addedJobs.length} iş ilanı tohumlandı!`);
        return {
            users: addedUsers,
            announcements: addedAnnouncements,
            jobs: addedJobs
        };
    }
}

// Komut satırından direkt çağrıldığında çalışması için (node database/seeds/databaseSeeder.js):
if (require.main === module) {
    DatabaseSeeder.run();
}

module.exports = DatabaseSeeder;
