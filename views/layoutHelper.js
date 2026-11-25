// views/layoutHelper.js
// Tüm HTML View sayfaları için ortak tasarım kabuğu (brand.md + DESIGN.md) + Rol Bazlı Dinamik Navigasyon

const { getNavItemsForUser } = require('../utils/navigationHelper');

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderLayout({ title, activePath = '', bodyHtml, currentUser = null }) {
    const navItems = getNavItemsForUser(currentUser);

    const navHtml = navItems.map(item => {
        const cls = activePath === item.href ? ' class="active"' : '';
        return `<a href="${escapeHtml(item.href)}"${cls}>${escapeHtml(item.label)}</a>`;
    }).join('\n                ');

    const badgeClass = (currentUser && currentUser.role === 'admin') ? 'tag-square tag-gold' : 'tag-square tag-navy';

    const initialAuthHtml = currentUser
        ? `
            <a href="/profile" class="${badgeClass}" title="Profilime Git">${escapeHtml(currentUser.name)} · ${escapeHtml(currentUser.role)}</a>
            <form action="/logout" method="POST" style="display:inline;">
                <button type="submit" class="btn btn-outline btn-sm">Çıkış Yap</button>
            </form>
        `
        : `
            <a href="/login" class="btn btn-outline btn-sm">Giriş Yap</a>
            <a href="/register" class="btn btn-primary btn-sm">Kayıt Ol</a>
        `;

    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} · Alumni</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/design-system.css">
</head>
<body>
    <header class="navbar">
        <div class="container navbar-inner">
            <a href="/" class="brand">
                <div class="brand-mark">A</div>
                <span class="brand-title">Alumni</span>
            </a>

            <nav class="nav-links" id="main-nav-links">
                ${navHtml}
            </nav>

            <div class="action-row" id="nav-auth-slot">
                ${initialAuthHtml}
            </div>
        </div>
    </header>

    <main>
        ${bodyHtml}
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                <span>© 2026 Alumni Tracking System</span>
                <span class="live-badge"><span class="live-dot"></span>SYSTEM ONLINE</span>
            </div>
            <div class="footer-links">
                <a href="/">Ana Sayfa</a>
                <a href="/about">Hakkımızda</a>
                <a href="/login">Giriş Yap</a>
                <a href="/register">Kayıt Ol</a>
                <a href="/api/swagger">Swagger UI</a>
                <a href="/404">404 Sayfası</a>
            </div>
        </div>
    </footer>

    <script src="/js/dynamic-nav.js"></script>
</body>
</html>`;
}

module.exports = {
    renderLayout,
    escapeHtml
};
