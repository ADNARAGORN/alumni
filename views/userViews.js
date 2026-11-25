// views/userViews.js — Mezun Dizini & Profil Arayüzleri (brand.md + DESIGN.md)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class UserViews {
    // 1. READ (All) & CREATE: Notion Tablo + WIRED 0px Form
    static renderUserListPage(users, errorMessage = null, successMessage = null, currentUser = null) {
        const rowsHtml = users.length === 0 ? `
            <tr><td colspan="7" class="td-muted" style="text-align:center; padding:28px;">Henüz kayıtlı mezun bulunmuyor.</td></tr>
        ` : users.map(user => `
            <tr>
                <td class="td-id">#${escapeHtml(user.id)}</td>
                <td>
                    <div class="td-title">
                        ${escapeHtml(user.name)}
                        <span class="tag-square tag-navy" style="margin-left:6px;">${escapeHtml(user.role || 'alumni')}</span>
                    </div>
                    <div class="td-muted">${escapeHtml(user.email || '-')}</div>
                </td>
                <td class="td-id">${escapeHtml(user.graduationYear || '-')}</td>
                <td class="td-muted">${escapeHtml(user.department || '-')}</td>
                <td><span class="tag-square">${escapeHtml(user.company || 'Belirtilmedi')}</span></td>
                <td class="td-muted">${escapeHtml(user.jobTitle || '-')}</td>
                <td>
                    <div class="action-row">
                        <a href="/users/${user.id}" class="btn btn-outline btn-sm">Detay</a>
                        <a href="/users/${user.id}/edit" class="btn btn-gold btn-sm">Düzenle</a>
                        <form action="/users/${user.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${escapeHtml(user.name)} kullanıcısını silmek istediğinize emin misiniz?');">
                            <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                        </form>
                    </div>
                </td>
            </tr>
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
                        <span class="kicker">01 / Mezun Dizini</span>
                        <h1>Kayıtlı Mezunlar (${users.length})</h1>
                        <p>Mezun profillerini, çalıştıkları kurumları ve kariyer unvanlarını inceleyin veya yeni kayıt ekleyin.</p>
                    </div>
                    <a href="/api/users" target="_blank" class="btn btn-outline btn-sm">JSON API &rarr;</a>
                </div>
            </section>

            <div class="container">
                ${alertError}
                ${alertSuccess}

                <div class="crud-grid">
                    <!-- NOTION DATA TABLE -->
                    <div class="notion-frame">
                        <table class="notion-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ad Soyad &amp; E-posta</th>
                                    <th>Yıl</th>
                                    <th>Bölüm</th>
                                    <th>Şirket</th>
                                    <th>Unvan</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- WIRED CREATE FORM -->
                    <aside class="panel panel-sticky">
                        <h2 class="panel-title">Yeni Mezun Ekle</h2>
                        <form action="/users" method="POST">
                            <div class="form-group">
                                <label for="name">Ad Soyad *</label>
                                <input type="text" id="name" name="name" placeholder="Örn: Elif Kaya" required>
                            </div>
                            <div class="form-group">
                                <label for="email">E-posta * (Zorunlu)</label>
                                <input type="email" id="email" name="email" placeholder="Örn: elif@example.com" required>
                            </div>
                            <div class="form-group">
                                <label for="graduationYear">Mezuniyet Yılı</label>
                                <input type="number" id="graduationYear" name="graduationYear" value="2024">
                            </div>
                            <div class="form-group">
                                <label for="department">Bölüm</label>
                                <input type="text" id="department" name="department" value="Yönetim Bilişim Sistemleri">
                            </div>
                            <div class="form-group">
                                <label for="company">Şirket</label>
                                <input type="text" id="company" name="company" placeholder="Örn: Google">
                            </div>
                            <div class="form-group">
                                <label for="jobTitle">Unvan</label>
                                <input type="text" id="jobTitle" name="jobTitle" placeholder="Örn: Backend Developer">
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Mezunu Kaydet &rarr;</button>
                        </form>
                    </aside>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'Mezun Dizini',
            activePath: '/users',
            bodyHtml,
            currentUser
        });
    }

    // 2. READ (One): Tekil Profil Detay Sayfası
    static renderUserDetailPage(user, currentUser = null) {
        const skillsText = Array.isArray(user.skills) && user.skills.length > 0
            ? user.skills.map(s => `<span class="tag-square tag-navy" style="margin-left:4px;">${escapeHtml(s)}</span>`).join('')
            : '<span class="td-muted">Belirtilmedi</span>';

        const bodyHtml = `
            <div class="focused-wrap">
                <div class="focused-card">
                    <span class="kicker">Mezun Profili · #${escapeHtml(user.id)}</span>
                    <h1>${escapeHtml(user.name)}</h1>

                    <div class="detail-row">
                        <span class="detail-label">E-posta</span>
                        <span class="detail-value">${escapeHtml(user.email || '-')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mezuniyet Yılı</span>
                        <span class="detail-value">${escapeHtml(user.graduationYear || '-')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Bölüm</span>
                        <span class="detail-value">${escapeHtml(user.department || '-')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Şirket</span>
                        <span class="detail-value"><span class="tag-square">${escapeHtml(user.company || '-')}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Unvan</span>
                        <span class="detail-value">${escapeHtml(user.jobTitle || '-')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Yetkinlikler</span>
                        <span class="detail-value">${skillsText}</span>
                    </div>

                    <div class="btn-group">
                        <a href="/users" class="btn btn-outline btn-sm">&larr; Dizine Dön</a>
                        <a href="/users/${user.id}/edit" class="btn btn-gold btn-sm">Profili Düzenle</a>
                    </div>
                </div>
            </div>
        `;

        const activePath = (currentUser && Number(currentUser.id) === Number(user.id)) ? `/users/${user.id}` : '/users';

        return renderLayout({
            title: `${user.name} · Profil`,
            activePath,
            bodyHtml,
            currentUser
        });
    }

    // 3. UPDATE: Düzenleme Form Sayfası
    static renderUserEditPage(user, errorMessage = null, currentUser = null) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';

        const bodyHtml = `
            <div class="focused-wrap">
                <div class="focused-card">
                    <span class="kicker">Profil Güncelleme · #${escapeHtml(user.id)}</span>
                    <h1>${escapeHtml(user.name)}</h1>
                    ${alertError}

                    <form action="/users/${user.id}/update" method="POST">
                        <div class="form-group">
                            <label for="name">Ad Soyad *</label>
                            <input type="text" id="name" name="name" value="${escapeHtml(user.name)}" required>
                        </div>
                        <div class="form-group">
                            <label for="email">E-posta *</label>
                            <input type="email" id="email" name="email" value="${escapeHtml(user.email || '')}" required>
                        </div>
                        <div class="form-group">
                            <label for="graduationYear">Mezuniyet Yılı</label>
                            <input type="number" id="graduationYear" name="graduationYear" value="${escapeHtml(user.graduationYear || '')}">
                        </div>
                        <div class="form-group">
                            <label for="department">Bölüm</label>
                            <input type="text" id="department" name="department" value="${escapeHtml(user.department || '')}">
                        </div>
                        <div class="form-group">
                            <label for="company">Şirket</label>
                            <input type="text" id="company" name="company" value="${escapeHtml(user.company || '')}">
                        </div>
                        <div class="form-group">
                            <label for="jobTitle">Unvan</label>
                            <input type="text" id="jobTitle" name="jobTitle" value="${escapeHtml(user.jobTitle || '')}">
                        </div>

                        <div class="btn-group">
                            <a href="/users" class="btn btn-outline">İptal</a>
                            <button type="submit" class="btn btn-primary" style="flex:1;">Değişiklikleri Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        return renderLayout({
            title: `Düzenle · ${user.name}`,
            activePath: '/users',
            bodyHtml,
            currentUser
        });
    }
}

module.exports = UserViews;
