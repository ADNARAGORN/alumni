// database/factories/jobPostingFactory.js
// Factory Mantığı: Rastgele ama gerçekçi iş ilanları üreten fabrika fonksiyonu

class JobPostingFactory {
    static jobTitles = [
        "Junior Full Stack Developer",
        "Frontend React Developer",
        "Backend Node.js Engineer",
        "Data Analyst & BI Specialist",
        "DevOps & Cloud Intern",
        "Mobile App Developer (Flutter)",
        "Cyber Security Associate",
        "Product & Project Assistant"
    ];

    static companies = [
        "Trendyol", "Getir", "Hepsiburada", "Amazon", "Microsoft", "Google", "Aselsan", "Turkcell", "Papara", "Peak Games"
    ];

    static locations = [
        "İstanbul (Hibrit)", "İstanbul (Uzaktan)", "Ankara (Hibrit)", "İzmir (Ofis)", "Tamamen Uzaktan (Remote)"
    ];

    // Tekil ilan nesnesi üretir (userId zorunludur veya rastgele atanır)
    static create(userId = 1, overrides = {}) {
        const title = this.jobTitles[Math.floor(Math.random() * this.jobTitles.length)];
        const company = this.companies[Math.floor(Math.random() * this.companies.length)];
        const location = this.locations[Math.floor(Math.random() * this.locations.length)];

        const defaultJob = {
            title: title,
            company: company,
            location: location,
            description: `Mezunlar ağımız üzerinden paylaşılan bu pozisyonda, ${company} bünyesinde yenilikçi projelerde yer alacak motivasyonu yüksek takım arkadaşı aranmaktadır.`,
            created_at: new Date().toISOString()
        };

        return { ...defaultJob, ...overrides };
    }

    // Belirli bir kullanıcı veya kullanıcı havuzu için birden çok ilan üretir
    static createMany(count, userIds = [1, 2, 3, 4]) {
        const jobs = [];
        for (let i = 0; i < count; i++) {
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            jobs.push({
                userId: randomUserId,
                data: this.create(randomUserId)
            });
        }
        return jobs;
    }
}

module.exports = JobPostingFactory;
