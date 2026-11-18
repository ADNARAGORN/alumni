// views/announcementViews.js — Duyuru & Etkinlik Yönetimi Arayüzleri (brand.md + DESIGN.md)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class AnnouncementViews {
    // 1. Liste Sayfası + Yeni Duyuru Formu
    static renderListPage(announcements, errorMessage = null, successMessage = null) {
        const cardsHtml = announcements.length === 0 ? `
            <div class="panel"><p class="td-muted" style="text-align:center; margin:0;">Henüz hiç duyuru yayınlanmamış.</p></div>
        ` : announcements.map(item => `
            <article class="editorial-card">
                <div class="editorial-card-top">
                    <div>
                        <span class="tag-square tag-navy">${escapeHtml(item.category || 'Genel')}</span>
                        <h3>${escapeHtml(item.title)}</h3>
                    </div>
                    <span class="td-id">${escapeHtml(item.date || '')}</span>
                </div>

                <p>${escapeHtml(item.content)}</p>

                <div class="editorial-card-footer">
                    <span><strong>Yayınlayan:</strong> ${escapeHtml(item.author || 'Mezunlar Ofisi')}</span>
                    <div class="action-row">
                        <a href="/announcements/${item.id}" class="btn btn-outline btn-sm">Detay</a>
                        <a href="/announcements/${item.id}/edit" class="btn btn-gold btn-sm">Düzenle</a>
                        <form action="/announcements/${item.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${escapeHtml(item.title)} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
                            <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                        </form>
                    </div>
                </div>
            </article>
        `).join('');

        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';

        const bodyHtml = `
            <section class="page-header">
                <div class="container page-header-row">
                    <div>
                        <span class="kicker">04 / Topluluk Bülteni</span>
                        <h1>Duyurular &amp; Etkinlikler (${announcements.length})</h1>
                        <p>Mezun buluşmaları, kariyer seminerleri ve mentörlük duyurularını buradan yönetin.</p>
                    </div>
                    <a href="/api/announcements" target="_blank" class="btn btn-outline btn-sm">JSON API &rarr;</a>
                </div>
            </section>

            <div class="container">
                ${alertError}
                ${alertSuccess}

                <div class="crud-grid">
                    <div class="editorial-stack">
                        ${cardsHtml}
                    </div>

                    <aside class="panel panel-sticky">
                        <h2 class="panel-title">Yeni Duyuru Yayınla</h2>
                        <form action="/announcements" method="POST">
                            <div class="form-group">
                                <label for="title">Duyuru Başlığı *</label>
                                <input type="text" id="title" name="title" placeholder="Örn: 2026 Kariyer Zirvesi" required>
                            </div>
                            <div class="form-group">
                                <label for="category">Kategori</label>
                                <select id="category" name="category">
                                    <option value="Genel">Genel</option>
                                    <option value="Kariyer">Kariyer</option>
                                    <option value="Etkinlik">Etkinlik</option>
                                    <option value="Buluşma">Buluşma</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="author">Yayınlayan Birim</label>
                                <input type="text" id="author" name="author" value="Mezunlar Ofisi">
                            </div>
                            <div class="form-group">
                                <label for="content">Duyuru Metni *</label>
                                <textarea id="content" name="content" placeholder="Duyuru detaylarını yazın..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Duyuruyu Yayınla &rarr;</button>
                        </form>
                    </aside>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'Duyurular',
            activePath: '/announcements',
            bodyHtml
        });
    }

    // 2. Tekil Duyuru Detay Sayfası
    static renderDetailPage(item) {
        const bodyHtml = `
            <div class="focused-wrap">
                <div class="focused-card">
                    <span class="tag-square tag-navy">${escapeHtml(item.category || 'Genel')}</span>
                    <h1>${escapeHtml(item.title)}</h1>
                    <div class="td-muted" style="padding-bottom:16px; margin-bottom:20px; border-bottom:1px solid var(--color-border);">
                        <strong>Yayınlayan:</strong> ${escapeHtml(item.author || 'Mezunlar Ofisi')} &nbsp;·&nbsp;
                        <span class="td-id">${escapeHtml(item.date || '')}</span>
                    </div>
                    <p style="font-family:var(--font-editorial); font-size:18px; line-height:1.7; white-space:pre-wrap; margin:0;">${escapeHtml(item.content)}</p>

                    <div class="btn-group">
                        <a href="/announcements" class="btn btn-outline btn-sm">&larr; Duyurulara Dön</a>
                        <a href="/announcements/${item.id}/edit" class="btn btn-gold btn-sm">Duyuruyu Düzenle</a>
                    </div>
                </div>
            </div>
        `;

        return renderLayout({
            title: `${item.title} · Duyuru`,
            activePath: '/announcements',
            bodyHtml
        });
    }

    // 3. Duyuru Düzenleme Sayfası
    static renderEditPage(item, errorMessage = null) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';

        const bodyHtml = `
            <div class="focused-wrap">
                <div class="focused-card">
                    <span class="kicker">Duyuru Güncelleme · #${escapeHtml(item.id)}</span>
                    <h1>${escapeHtml(item.title)}</h1>
                    ${alertError}

                    <form action="/announcements/${item.id}/update" method="POST">
                        <div class="form-group">
                            <label for="title">Duyuru Başlığı *</label>
                            <input type="text" id="title" name="title" value="${escapeHtml(item.title)}" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Kategori</label>
                            <select id="category" name="category">
                                <option value="Genel" ${item.category === 'Genel' ? 'selected' : ''}>Genel</option>
                                <option value="Kariyer" ${item.category === 'Kariyer' ? 'selected' : ''}>Kariyer</option>
                                <option value="Etkinlik" ${item.category === 'Etkinlik' ? 'selected' : ''}>Etkinlik</option>
                                <option value="Buluşma" ${item.category === 'Buluşma' ? 'selected' : ''}>Buluşma</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="author">Yayınlayan</label>
                            <input type="text" id="author" name="author" value="${escapeHtml(item.author || '')}">
                        </div>
                        <div class="form-group">
                            <label for="content">Duyuru Metni *</label>
                            <textarea id="content" name="content" required>${escapeHtml(item.content)}</textarea>
                        </div>

                        <div class="btn-group">
                            <a href="/announcements" class="btn btn-outline">İptal</a>
                            <button type="submit" class="btn btn-primary" style="flex:1;">Değişiklikleri Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        return renderLayout({
            title: `Düzenle · ${item.title}`,
            activePath: '/announcements',
            bodyHtml
        });
    }
}

module.exports = AnnouncementViews;
