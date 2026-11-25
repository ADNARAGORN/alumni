// views/adminViews.js — Sistem Yöneticisi (Admin) Kontrol Paneli (brand.md + DESIGN.md)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class AdminViews {
    static renderDashboard({
        users = [],
        jobs = [],
        applications = [],
        announcements = [],
        currentUser = null,
        errorMessage = null,
        successMessage = null
    } = {}) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>İşlem Engellendi / Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';

        const userMap = new Map(users.map(u => [Number(u.id), u]));
        const jobMap = new Map(jobs.map(j => [Number(j.id), j]));

        const adminCount = users.filter(u => u.role === 'admin').length;
        const alumniCount = users.filter(u => u.role === 'alumni').length;
        const studentCount = users.filter(u => u.role === 'student').length;

        // 1. KULLANICILAR & ROL YÖNETİMİ SATIRLARI
        const userRows = users.map(u => {
            const isSelf = currentUser && Number(currentUser.id) === Number(u.id);
            const roleBadgeClass = u.role === 'admin' ? 'tag-gold' : (u.role === 'alumni' ? 'tag-navy' : '');

            const roleControl = isSelf
                ? `<span class="tag-square tag-gold">Aktif Admin (Siz)</span>`
                : `
                    <form action="/admin/users/${u.id}/role" method="POST" style="display:inline-flex; gap:6px; align-items:center;">
                        <select name="role" style="padding:5px 8px; font-size:12px; width:auto; border:1px solid var(--color-border); background:#fff;">
                            <option value="student" ${u.role === 'student' ? 'selected' : ''}>student</option>
                            <option value="alumni" ${u.role === 'alumni' ? 'selected' : ''}>alumni</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
                        </select>
                        <button type="submit" class="btn btn-outline btn-sm" style="padding:5px 10px; font-size:11px;">Rolü Kaydet</button>
                    </form>
                `;

            const deleteControl = isSelf
                ? `<span class="td-muted" style="font-size:12px;">Silinemez</span>`
                : `
                    <form action="/admin/users/${u.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${escapeHtml(u.name)} hesabını ve bağlı ilanlarını silmek istediğinize emin misiniz?');">
                        <button type="submit" class="btn btn-danger btn-sm" style="padding:5px 10px; font-size:11px;">Sil</button>
                    </form>
                `;

            return `
                <tr>
                    <td class="td-id">#${u.id}</td>
                    <td class="td-title">
                        <a href="/users/${u.id}">${escapeHtml(u.name)}</a>
                        <div class="td-muted" style="font-size:12px; font-weight:400;">${escapeHtml(u.email)}</div>
                    </td>
                    <td class="td-muted">${escapeHtml(u.department || 'YBS')}</td>
                    <td><span class="tag-square ${roleBadgeClass}">${escapeHtml(u.role || 'alumni')}</span></td>
                    <td>${roleControl}</td>
                    <td style="text-align:right;">
                        <div class="action-row" style="justify-content:flex-end;">
                            <a href="/users/${u.id}/edit" class="btn btn-outline btn-sm" style="padding:5px 10px; font-size:11px;">Düzenle</a>
                            ${deleteControl}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // 2. İŞ İLANLARI SATIRLARI
        const jobRows = jobs.length === 0
            ? `<tr><td colspan="5" class="td-muted">Sistemde kayıtlı iş ilanı bulunmuyor.</td></tr>`
            : jobs.map(j => {
                const owner = userMap.get(Number(j.user_id));
                return `
                    <tr>
                        <td class="td-id">#${j.id}</td>
                        <td class="td-title">${escapeHtml(j.title)}</td>
                        <td><span class="tag-square">${escapeHtml(j.company)}</span></td>
                        <td class="td-muted">${owner ? escapeHtml(owner.name) : `Kullanıcı #${j.user_id}`}</td>
                        <td style="text-align:right;">
                            <div class="action-row" style="justify-content:flex-end;">
                                <a href="/jobs/${j.id}/applications" class="btn btn-outline btn-sm" style="padding:5px 10px; font-size:11px;">Başvurular</a>
                                <form action="/admin/jobs/${j.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu iş ilanını silmek istediğinize emin misiniz?');">
                                    <button type="submit" class="btn btn-danger btn-sm" style="padding:5px 10px; font-size:11px;">Sil</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

        // 3. BAŞVURULAR SATIRLARI
        const appRows = applications.length === 0
            ? `<tr><td colspan="5" class="td-muted">Sistemde kayıtlı başvuru bulunmuyor.</td></tr>`
            : applications.map(a => {
                const applicant = userMap.get(Number(a.user_id));
                const job = jobMap.get(Number(a.job_posting_id));
                return `
                    <tr>
                        <td class="td-id">#${a.id}</td>
                        <td class="td-title">${applicant ? escapeHtml(applicant.name) : `Kullanıcı #${a.user_id}`}</td>
                        <td class="td-muted">${job ? `${escapeHtml(job.title)} · ${escapeHtml(job.company)}` : `İlan #${a.job_posting_id}`}</td>
                        <td>
                            <form action="/admin/applications/${a.id}/status" method="POST" style="display:inline-flex; gap:6px; align-items:center;">
                                <select name="status" style="padding:5px 8px; font-size:12px; width:auto; border:1px solid var(--color-border); background:#fff;">
                                    <option value="applied" ${a.status === 'applied' ? 'selected' : ''}>applied</option>
                                    <option value="interview" ${a.status === 'interview' ? 'selected' : ''}>interview</option>
                                    <option value="accepted" ${a.status === 'accepted' ? 'selected' : ''}>accepted</option>
                                    <option value="rejected" ${a.status === 'rejected' ? 'selected' : ''}>rejected</option>
                                </select>
                                <button type="submit" class="btn btn-outline btn-sm" style="padding:5px 10px; font-size:11px;">Güncelle</button>
                            </form>
                        </td>
                        <td style="text-align:right;">
                            <form action="/admin/applications/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvuruyu silmek istediğinize emin misiniz?');">
                                <button type="submit" class="btn btn-danger btn-sm" style="padding:5px 10px; font-size:11px;">Sil</button>
                            </form>
                        </td>
                    </tr>
                `;
            }).join('');

        // 4. DUYURULAR SATIRLARI
        const annRows = announcements.length === 0
            ? `<tr><td colspan="5" class="td-muted">Henüz duyuru yayınlanmamış.</td></tr>`
            : announcements.map(an => `
                <tr>
                    <td class="td-id">#${an.id}</td>
                    <td class="td-title"><a href="/announcements/${an.id}">${escapeHtml(an.title)}</a></td>
                    <td><span class="tag-square tag-navy">${escapeHtml(an.category || 'Genel')}</span></td>
                    <td class="td-id">${escapeHtml(an.date || '-')}</td>
                    <td style="text-align:right;">
                        <div class="action-row" style="justify-content:flex-end;">
                            <a href="/announcements/${an.id}/edit" class="btn btn-outline btn-sm" style="padding:5px 10px; font-size:11px;">Düzenle</a>
                            <form action="/admin/announcements/${an.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu duyuruyu silmek istediğinize emin misiniz?');">
                                <button type="submit" class="btn btn-danger btn-sm" style="padding:5px 10px; font-size:11px;">Sil</button>
                            </form>
                        </div>
                    </td>
                </tr>
            `).join('');

        const bodyHtml = `
            <section class="page-head">
                <div class="container page-head-row">
                    <div>
                        <span class="kicker">RBAC · Yalnızca Admin Yetkisi</span>
                        <h1>Admin Yönetim Paneli</h1>
                        <p class="lead">
                            Kullanıcı rollerini değiştirin, hesapları, iş ilanlarını, başvuruları ve fakülte duyurularını tek merkezden yönetin.
                        </p>
                    </div>
                    <div class="action-row">
                        <span class="tag-square tag-gold">Yönetici: ${escapeHtml(currentUser ? currentUser.name : 'Admin')}</span>
                        <a href="/api/admin/overview" target="_blank" class="btn btn-outline btn-sm">Admin JSON API</a>
                    </div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    ${alertError}
                    ${alertSuccess}

                    <!-- KPI Özet Şeridi -->
                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); border:1px solid var(--color-border); background:var(--color-surface); margin-bottom:44px;">
                        <div style="padding:22px; border-right:1px solid var(--color-border); text-align:center;">
                            <div style="font-family:var(--font-display); font-size:34px; font-weight:600; color:var(--color-navy);">${users.length}</div>
                            <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:6px;">Toplam Kullanıcı</div>
                            <div style="font-family:var(--font-mono); font-size:11px; color:var(--color-gold-ink); margin-top:4px;">${adminCount} admin · ${alumniCount} alumni · ${studentCount} student</div>
                        </div>
                        <div style="padding:22px; border-right:1px solid var(--color-border); text-align:center;">
                            <div style="font-family:var(--font-display); font-size:34px; font-weight:600; color:var(--color-navy);">${jobs.length}</div>
                            <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:6px;">İş İlanı</div>
                        </div>
                        <div style="padding:22px; border-right:1px solid var(--color-border); text-align:center;">
                            <div style="font-family:var(--font-display); font-size:34px; font-weight:600; color:var(--color-navy);">${applications.length}</div>
                            <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:6px;">Başvuru</div>
                        </div>
                        <div style="padding:22px; text-align:center;">
                            <div style="font-family:var(--font-display); font-size:34px; font-weight:600; color:var(--color-navy);">${announcements.length}</div>
                            <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:6px;">Duyuru</div>
                        </div>
                    </div>

                    <!-- 01. KULLANICILAR & ROL YÖNETİMİ -->
                    <div style="margin-bottom:52px;">
                        <span class="kicker">01 / Kullanıcı &amp; Rol Yönetimi</span>
                        <h2 style="font-family:var(--font-display); font-size:28px; color:var(--color-navy); margin:0 0 18px 0;">Sistem Kullanıcıları ve RBAC Rolleri</h2>

                        <div class="notion-frame" style="margin-bottom:24px;">
                            <table class="notion-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Ad Soyad / E-posta</th>
                                        <th>Bölüm</th>
                                        <th>Mevcut Rol</th>
                                        <th>Rol Ata</th>
                                        <th style="text-align:right;">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${userRows}
                                </tbody>
                            </table>
                        </div>

                        <div class="panel-card">
                            <span class="kicker">Hızlı Kayıt</span>
                            <h3>Yeni Kullanıcı Oluştur (Rol Seçimli)</h3>
                            <form action="/admin/users" method="POST">
                                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px;">
                                    <div class="form-group">
                                        <label for="admin-u-name">Ad Soyad *</label>
                                        <input type="text" id="admin-u-name" name="name" placeholder="Örn: Zeynep Arslan" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="admin-u-email">E-posta *</label>
                                        <input type="email" id="admin-u-email" name="email" placeholder="zeynep@example.com" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="admin-u-pass">Başlangıç Şifresi *</label>
                                        <input type="password" id="admin-u-pass" name="password" minlength="6" value="123456" required>
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:14px; align-items:end;">
                                    <div class="form-group" style="margin-bottom:0;">
                                        <label for="admin-u-role">Rol *</label>
                                        <select id="admin-u-role" name="role">
                                            <option value="student">student (Öğrenci)</option>
                                            <option value="alumni">alumni (Mezun)</option>
                                            <option value="admin">admin (Yönetici)</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="margin-bottom:0;">
                                        <label for="admin-u-dept">Bölüm</label>
                                        <input type="text" id="admin-u-dept" name="department" value="Yönetim Bilişim Sistemleri">
                                    </div>
                                    <div class="form-group" style="margin-bottom:0;">
                                        <label for="admin-u-comp">Şirket</label>
                                        <input type="text" id="admin-u-comp" name="company" placeholder="Opsiyonel">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Kullanıcı Ekle &rarr;</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- 02. İŞ İLANLARI YÖNETİMİ -->
                    <div style="margin-bottom:52px;">
                        <span class="kicker">02 / Kariyer Moderasyonu</span>
                        <h2 style="font-family:var(--font-display); font-size:28px; color:var(--color-navy); margin:0 0 18px 0;">İş İlanları Yönetimi</h2>
                        <div class="notion-frame">
                            <table class="notion-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Pozisyon</th>
                                        <th>Şirket</th>
                                        <th>İlan Sahibi</th>
                                        <th style="text-align:right;">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${jobRows}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 03. BAŞVURU YÖNETİMİ -->
                    <div style="margin-bottom:52px;">
                        <span class="kicker">03 / Başvuru Süreçleri</span>
                        <h2 style="font-family:var(--font-display); font-size:28px; color:var(--color-navy); margin:0 0 18px 0;">Başvurular &amp; Durum Yönetimi</h2>
                        <div class="notion-frame">
                            <table class="notion-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Başvuran</th>
                                        <th>İlan &amp; Şirket</th>
                                        <th>Durum Güncelle</th>
                                        <th style="text-align:right;">Sil</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${appRows}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 04. DUYURU YÖNETİMİ -->
                    <div>
                        <span class="kicker">04 / Bülten Yönetimi</span>
                        <h2 style="font-family:var(--font-display); font-size:28px; color:var(--color-navy); margin:0 0 18px 0;">Duyurular</h2>

                        <div class="notion-frame" style="margin-bottom:24px;">
                            <table class="notion-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Başlık</th>
                                        <th>Kategori</th>
                                        <th>Tarih</th>
                                        <th style="text-align:right;">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${annRows}
                                </tbody>
                            </table>
                        </div>

                        <div class="panel-card">
                            <span class="kicker">Hızlı Duyuru</span>
                            <h3>Yeni Duyuru Yayınla</h3>
                            <form action="/admin/announcements" method="POST">
                                <div style="display:grid; grid-template-columns:2fr 1fr; gap:14px;">
                                    <div class="form-group">
                                        <label for="admin-a-title">Duyuru Başlığı *</label>
                                        <input type="text" id="admin-a-title" name="title" placeholder="Örn: 2026 Mezunlar Kariyer Zirvesi" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="admin-a-cat">Kategori</label>
                                        <select id="admin-a-cat" name="category">
                                            <option value="Genel">Genel</option>
                                            <option value="Kariyer">Kariyer</option>
                                            <option value="Etkinlik">Etkinlik</option>
                                            <option value="Buluşma">Buluşma</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="admin-a-content">İçerik *</label>
                                    <textarea id="admin-a-content" name="content" rows="3" placeholder="Duyuru metnini yazın..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-gold">Duyuru Yayınla &rarr;</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;

        return renderLayout({
            title: 'Admin Paneli',
            activePath: '/admin',
            bodyHtml,
            currentUser
        });
    }
}

module.exports = AdminViews;
