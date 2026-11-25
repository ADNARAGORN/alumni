// models/userModel.js — Veri (RAM / Bellek İçi Liste), Auth/Rol Kuralları ve Doğrulama (ddd.md)

const { hashPassword, verifyPassword } = require('../utils/passwordHelper');

const ALLOWED_ROLES = ['admin', 'alumni', 'student'];
const SELF_REGISTER_ROLES = ['alumni', 'student'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultDemoHash = hashPassword('123456');

let users = [
    {
        id: 1,
        name: "Çağrı Akpınar",
        email: "cagri@example.com",
        password_hash: defaultDemoHash,
        role: "alumni",
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
        password_hash: defaultDemoHash,
        role: "alumni",
        graduationYear: 2023,
        department: "Yönetim Bilişim Sistemleri",
        company: "Amazon",
        jobTitle: "Data Scientist",
        skills: ["Python", "SQL"]
    },
    {
        id: 3,
        name: "Adnan Takta",
        email: "adnan@example.com",
        password_hash: defaultDemoHash,
        role: "admin",
        graduationYear: 2024,
        department: "Yönetim Bilişim Sistemleri",
        company: "Google",
        jobTitle: "Frontend Developer",
        skills: ["React", "TypeScript", "Node.js"]
    },
    {
        id: 4,
        name: "Elif Kaya",
        email: "elif@example.com",
        password_hash: defaultDemoHash,
        role: "alumni",
        graduationYear: 2024,
        department: "Yönetim Bilişim Sistemleri",
        company: "Trendyol",
        jobTitle: "Backend Developer",
        skills: ["Node.js", "Express", "PostgreSQL"]
    }
];

let nextId = 5;

class UserModel {
    // Güvenlik kuralı: password_hash API/View yanıtlarına ASLA sızdırılmaz
    static sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    static validate(userData, isPartial = false) {
        if (!isPartial || (isPartial && userData.email !== undefined)) {
            if (!userData.email || typeof userData.email !== 'string' || !EMAIL_REGEX.test(userData.email.trim())) {
                return { isValid: false, error: 'Geçerli bir e-posta (email) adresi zorunludur.' };
            }
        }
        if (userData.role !== undefined && !ALLOWED_ROLES.includes(userData.role)) {
            return { isValid: false, error: `Geçersiz rol. İzin verilen roller: ${ALLOWED_ROLES.join(', ')}` };
        }
        return { isValid: true };
    }

    // CRUD: Read (All) — şifre hash'i temizlenmiş olarak döner
    static findAll() {
        return users.map(u => this.sanitize(u));
    }

    // CRUD: Read (One) - include: 'jobs' opsiyonu ile (Relationship desteği)
    static findById(id, options = {}) {
        const user = users.find(u => u.id === Number(id));
        if (!user) return null;

        const safeUser = this.sanitize(user);

        if (options.include && options.include.includes('jobs')) {
            const JobPostingModel = require('./jobPostingModel');
            return {
                ...safeUser,
                jobs: JobPostingModel.findByUserId(user.id)
            };
        }

        return safeUser;
    }

    // Dahili Auth araması (giriş doğrulamasında password_hash erişimi için)
    static findRawByEmail(email) {
        if (!email || typeof email !== 'string') return null;
        const normalized = email.trim().toLowerCase();
        return users.find(u => u.email && u.email.toLowerCase() === normalized) || null;
    }

    // AUTH: Login doğrulaması (E-posta + Şifre kontrolü — kullanıcı taramasına karşı tek tip 401 mesajı)
    static authenticate(email, password) {
        const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        const cleanPassword = typeof password === 'string' ? password : '';

        if (!cleanEmail || !cleanPassword) {
            const err = new Error('VALIDATION_ERROR: E-posta ve şifre alanları zorunludur.');
            err.statusCode = 400;
            throw err;
        }

        const rawUser = this.findRawByEmail(cleanEmail);
        if (!rawUser || !verifyPassword(cleanPassword, rawUser.password_hash)) {
            const err = new Error('INVALID_CREDENTIALS: E-posta veya şifre hatalı.');
            err.statusCode = 401;
            throw err;
        }

        return this.sanitize(rawUser);
    }

    // AUTH: Register (Kayıt Ol) — şifre hashleme, benzersiz e-posta (409) ve rol güvenliği
    static register(data) {
        const fullName = data.name
            ? String(data.name).trim()
            : `${String(data.firstName || '').trim()} ${String(data.lastName || '').trim()}`.trim();

        if (!fullName || fullName.length < 2) {
            const err = new Error('VALIDATION_ERROR: Ad ve soyad en az 2 karakter olmalıdır.');
            err.statusCode = 400;
            throw err;
        }

        const email = String(data.email || '').trim().toLowerCase();
        if (!EMAIL_REGEX.test(email)) {
            const err = new Error('VALIDATION_ERROR: Geçerli bir e-posta adresi giriniz.');
            err.statusCode = 400;
            throw err;
        }

        if (this.findRawByEmail(email)) {
            const err = new Error('EMAIL_EXISTS: Bu e-posta adresi ile zaten kayıtlı bir kullanıcı var.');
            err.statusCode = 409;
            throw err;
        }

        const plainPassword = String(data.password || '');
        if (plainPassword.length < 6) {
            const err = new Error('VALIDATION_ERROR: Şifre en az 6 karakter olmalıdır.');
            err.statusCode = 400;
            throw err;
        }

        // Güvenlik kuralı: Herkese açık kayıt ekranından kimse kendini 'admin' yapamaz
        const requestedRole = String(data.role || 'student').trim().toLowerCase();
        if (!SELF_REGISTER_ROLES.includes(requestedRole)) {
            const err = new Error(`VALIDATION_ERROR: Kayıt sırasında yalnızca 'student' veya 'alumni' rolü seçilebilir.`);
            err.statusCode = 400;
            throw err;
        }

        const graduationYear = data.graduationYear ? Number(data.graduationYear) : null;
        if (graduationYear !== null && (Number.isNaN(graduationYear) || graduationYear < 1950 || graduationYear > 2035)) {
            const err = new Error('VALIDATION_ERROR: Mezuniyet yılı 1950 ile 2035 arasında geçerli bir yıl olmalıdır.');
            err.statusCode = 400;
            throw err;
        }

        const newUser = {
            id: nextId++,
            name: fullName,
            email,
            password_hash: hashPassword(plainPassword),
            role: requestedRole,
            graduationYear,
            department: data.department ? String(data.department).trim() : 'Yönetim Bilişim Sistemleri',
            company: data.company ? String(data.company).trim() : null,
            jobTitle: data.jobTitle ? String(data.jobTitle).trim() : null,
            skills: Array.isArray(data.skills) ? data.skills : []
        };

        users.push(newUser);
        return this.sanitize(newUser);
    }

    // CRUD: Create (Seed ve admin/genel oluşturma uyumluluğu)
    static create(userData) {
        const validation = this.validate(userData, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        const normalizedEmail = userData.email.trim().toLowerCase();
        const { id: _ignoredId, password, password_hash: _ignoredHash, role, ...rest } = userData;
        const safeRole = role && ALLOWED_ROLES.includes(String(role).trim().toLowerCase())
            ? String(role).trim().toLowerCase()
            : 'alumni';

        const newUser = {
            ...rest,
            id: nextId++,
            role: safeRole,
            email: normalizedEmail,
            password_hash: password ? hashPassword(password) : defaultDemoHash
        };
        users.push(newUser);
        return this.sanitize(newUser);
    }

    // CRUD: Update (PUT - tam değiştirme; id ve mevcut şifre hash'i/rolü mass-assignment'tan korunur)
    static update(id, updateData) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }

        const validation = this.validate(updateData, false);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        const { id: _ignoredId, password, password_hash: _ignoredHash, role, ...rest } = updateData;
        const requestedRole = role !== undefined ? String(role).trim().toLowerCase() : null;
        if (requestedRole !== null && !ALLOWED_ROLES.includes(requestedRole)) {
            throw new Error(`VALIDATION_ERROR: Geçersiz rol '${role}'.`);
        }

        users[index] = {
            ...rest,
            id: Number(id),
            email: rest.email ? rest.email.trim().toLowerCase() : users[index].email,
            role: requestedRole || users[index].role || 'alumni',
            password_hash: password ? hashPassword(password) : users[index].password_hash
        };
        return this.sanitize(users[index]);
    }

    // CRUD: Patch (Kısmi güncelleme; id, password_hash ve geçersiz rol atamasına karşı korumalı)
    static patch(id, partialData) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }

        const validation = this.validate(partialData, true);
        if (!validation.isValid) {
            throw new Error(`VALIDATION_ERROR: ${validation.error}`);
        }

        const { id: _ignoredId, password, password_hash: _ignoredHash, role, ...rest } = partialData;
        const requestedRole = role !== undefined ? String(role).trim().toLowerCase() : null;
        if (requestedRole !== null && !ALLOWED_ROLES.includes(requestedRole)) {
            throw new Error(`VALIDATION_ERROR: Geçersiz rol '${role}'.`);
        }

        users[index] = {
            ...users[index],
            ...rest,
            id: Number(id),
            email: rest.email ? rest.email.trim().toLowerCase() : users[index].email,
            role: requestedRole || users[index].role,
            password_hash: password ? hashPassword(password) : users[index].password_hash
        };
        return this.sanitize(users[index]);
    }

    // ADMIN: Kullanıcının rolünü güncelle (RBAC)
    static updateRole(id, newRole) {
        const normalizedRole = String(newRole || '').trim().toLowerCase();
        if (!ALLOWED_ROLES.includes(normalizedRole)) {
            const err = new Error(`VALIDATION_ERROR: Geçersiz rol '${newRole}'. Yalnızca admin, alumni veya student atanabilir.`);
            err.statusCode = 400;
            throw err;
        }

        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }

        users[index].role = normalizedRole;
        return this.sanitize(users[index]);
    }

    // CRUD: Delete - CASCADE kuralı ile ilişkili ilanları da temizler
    static delete(id) {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            return null;
        }
        const [deletedUser] = users.splice(index, 1);

        const JobPostingModel = require('./jobPostingModel');
        JobPostingModel.deleteByUserId(deletedUser.id);

        return this.sanitize(deletedUser);
    }
}

module.exports = UserModel;
