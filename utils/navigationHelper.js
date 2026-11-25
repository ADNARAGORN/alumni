// utils/navigationHelper.js
// Tek Doğruluk Kaynağı (Single Source of Truth): Kullanıcı rolüne göre dinamik üst menü öğelerini üretir.

function getNavItemsForUser(user = null) {
    const role = user && user.role ? String(user.role).toLowerCase() : 'guest';

    if (role === 'admin') {
        return [
            { href: '/users', label: 'Mezunlar' },
            { href: '/jobs', label: 'İş İlanları' },
            { href: '/applications', label: 'Başvurular' },
            { href: '/announcements', label: 'Duyurular' },
            { href: '/profile', label: 'Profilim' },
            { href: '/admin', label: 'Admin Panel' },
            { href: '/api/swagger', label: 'Swagger UI' }
        ];
    }

    if (role === 'alumni') {
        return [
            { href: '/users', label: 'Mezunlar' },
            { href: '/jobs', label: 'İş İlanları' },
            { href: '/my-jobs', label: 'İlanlarım' },
            { href: '/my-applications', label: 'Başvurularım' },
            { href: '/announcements', label: 'Duyurular' },
            { href: '/profile', label: 'Profilim' }
        ];
    }

    if (role === 'student') {
        return [
            { href: '/users', label: 'Mezunlar' },
            { href: '/jobs', label: 'İş İlanları' },
            { href: '/my-applications', label: 'Başvurularım' },
            { href: '/announcements', label: 'Duyurular' },
            { href: '/profile', label: 'Profilim' }
        ];
    }

    // Misafir (giriş yapmamış) kullanıcılar için sadeleştirilmiş herkese açık menü
    return [
        { href: '/users', label: 'Mezunlar' },
        { href: '/jobs', label: 'İş İlanları' },
        { href: '/announcements', label: 'Duyurular' },
        { href: '/about', label: 'Hakkımızda' }
    ];
}

module.exports = {
    getNavItemsForUser
};
