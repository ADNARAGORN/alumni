// views/layoutHelper.js
// Tüm HTML View sayfaları için ortak Apple/Claude/WIRED/Notion/Tesla tasarım kabuğu (brand.md + DESIGN.md)

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderLayout({ title, activePath = '', bodyHtml }) {
    const navItems = [
        { href: '/users', label: 'Mezunlar' },
        { href: '/jobs', label: 'İş İlanları' },
        { href: '/applications', label: 'Başvurular' },
        { href: '/announcements', label: 'Duyurular' },
        { href: '/api/swagger', label: 'Swagger UI' }
    ];

    const navHtml = navItems.map(item => {
        const cls = activePath === item.href ? ' class="active"' : '';
        return `<a href="${item.href}"${cls}>${item.label}</a>`;
    }).join('\n                ');

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

            <nav class="nav-links">
                ${navHtml}
            </nav>

            <a href="/" class="btn btn-primary btn-sm">Ana Sayfa</a>
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
                <a href="/api/swagger">Swagger UI</a>
                <a href="/api/health" target="_blank">API Health</a>
                <a href="/404">404 Sayfası</a>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

module.exports = {
    renderLayout,
    escapeHtml
};
