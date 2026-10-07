// Model: Veri (RAM / Bellek İçi Liste) ve Doğrulama Kuralları (Data & Rules)


let users = [
    {
        id: 1,
        name: "Çağrı Akpınar",
        email: "cagri@example.com",
        graduationYear: 2024,
        department: "Yönetim Bilişim Sistemleri",
        company: "Microsoft",
        jobTitle: "Software Engineer",
        skills: ["Node.js", "React"]
    },
    {
        id: 2,
        name: "Tonay Culha",
        email: "tonay@example.com",
        graduationYear: 2023,
        department: "Yönetim Bilişim Sistemleri",
        company: "Amazon",
        jobTitle: "Data Scientist",
        skills: ["Python", "SQL"]
    }
];

let nextId = 3;

class UserModel {
    // Slayttaki kural: validate(user) -> email required
    static validate(userData, isPartial = false) {
        if (!isPartial || (isPartial && userData.email !== undefined)) {
            if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
                return { isValid: false, error: 'email' };
            }
        }
        return { isValid: true };
    }

    // CRUD: Read (All)
    static findAll() {
        return users;
    }

    // CRUD: Read (One)
    static findById(id) {
        return users.find(u => u.id === Number(id)) || null;
    }

    // CRUD: Create
    static create(userData) {
        const validation = this.validate(userData, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        const newUser = {
            id: nextId++,
            ...userData
        };
        users.push(newUser);
        return newUser;
    }

    // CRUD: Update (PUT - tam değiştirme)
    static update(id, updateData) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }

        const validation = this.validate(updateData, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        users[index] = {
            id: Number(id),
            ...updateData
        };
        return users[index];
    }

    // CRUD: Patch (Kısmi güncelleme)
    static patch(id, partialData) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }

        const validation = this.validate(partialData, true);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        users[index] = {
            ...users[index],
            ...partialData,
            id: Number(id)
        };
        return users[index];
    }

    // CRUD: Delete
    static delete(id) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }
        const [deletedUser] = users.splice(index, 1);
        return deletedUser;
    }
}

module.exports = UserModel;
