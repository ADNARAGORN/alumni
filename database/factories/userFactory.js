// database/factories/userFactory.js
// Factory Mantığı: Rastgele veya özelleştirilmiş sahte (mock) kullanıcı verisi üreten fabrika fonksiyonu

class UserFactory {
    static firstNames = ["Ahmet", "Mehmet", "Zeynep", "Burak", "Selin", "Can", "Gamze", "Mert", "Ece", "Kaan"];
    static lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Öztürk", "Aydın", "Özdemir", "Arslan"];
    static companies = ["Google", "Microsoft", "Amazon", "Trendyol", "Getir", "Hepsiburada", "Aselsan", "Turkcell"];
    static jobTitles = ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "Data Scientist", "DevOps Engineer", "Product Manager"];
    static departments = ["Yönetim Bilişim Sistemleri", "Bilgisayar Mühendisliği", "Yazılım Mühendisliği"];
    static skillPool = ["JavaScript", "TypeScript", "Node.js", "React", "Python", "SQL", "Docker", "PostgreSQL", "AWS"];

    // Tek bir sahte kullanıcı nesnesi üretir
    static create(overrides = {}) {
        const first = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const last = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        const randomNum = Math.floor(100 + Math.random() * 900);
        
        // Türkçe karakterleri temizleyip email yapalım
        const cleanFirst = first.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
        const cleanLast = last.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');

        const defaultUser = {
            name: `${first} ${last}`,
            email: `${cleanFirst}.${cleanLast}${randomNum}@alumni.edu.tr`,
            graduationYear: 2018 + Math.floor(Math.random() * 7), // 2018 - 2024
            department: this.departments[Math.floor(Math.random() * this.departments.length)],
            company: this.companies[Math.floor(Math.random() * this.companies.length)],
            jobTitle: this.jobTitles[Math.floor(Math.random() * this.jobTitles.length)],
            skills: [
                this.skillPool[Math.floor(Math.random() * this.skillPool.length)],
                this.skillPool[Math.floor(Math.random() * this.skillPool.length)]
            ]
        };

        return { ...defaultUser, ...overrides };
    }

    // İstenen adette (count) kullanıcı dizisi üretir
    static createMany(count, overrides = {}) {
        const users = [];
        for (let i = 0; i < count; i++) {
            users.push(this.create(overrides));
        }
        return users;
    }
}

module.exports = UserFactory;
