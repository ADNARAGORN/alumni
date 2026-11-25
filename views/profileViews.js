// views/profileViews.js — Kullanıcıya Özel Sayfalar: Profilim (/profile), Başvurularım (/my-applications), İlanlarım (/my-jobs)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class ProfileViews {
    // 1. KİŞİSEL PROFİL & PANEL SAYFASI (/profile)
    static renderProfilePage({
        user,
        myJobs = [],
        myApplications = [],
        allJobs = [],
        applicantsOnMyJobsCount = 0,
        errorMessage = null,
        successMessage = null
    }) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';

        const roleLabelMap = {
            admin: 'Sistem Yöneticisi (Admin)',
            alumni: 'Mezun (Alumni)',
            student: 'Öğrenci (Student)'
        };
        const roleBadgeClass = user.role === 'admin' ? 'tag-gold' : 'tag-navy';
        const jobMap = new Map(allJobs.map(j => [Number(j.id), j]));
        const skillsCsv = Array.isArray(user.skills) ? user.skills.join(', ') : '';
        const skillsHtml = Array.isArray(user.skills) && user.skills.length > 0
            ? user.skills.map(s => `<span class="tag-square tag-navy" style="margin-right:6px; margin-bottom:6px;">${escapeHtml(s)}</span>`).join('')
            : '<span class="td-muted">Henüz yetkinlik eklenmemiş.</span>';

        const acceptedCount = myApplications.filter(a => a.status === 'accepted').length;
        const interviewCount = myApplications.filter(a => a.status === 'interview').length;

        // Role özel üst özet kartları
        const isJobPoster = user.role === 'alumni' || user.role === 'admin';
        const metricsHtml = isJobPoster
            ? `
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); border:1px solid var(--color-border); background:var(--color-surface); margin-bottom:36px;">
                    <div style="padding:20px; border-right:1px solid var(--color-border); text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${myJobs.length}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">Yayınladığım İlan</div>
                    </div>
                    <div style="padding:20px; border-right:1px solid var(--color-border); text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${applicantsOnMyJobsCount}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">İlanlarıma Gelen Başvuru</div>
                    </div>
                    <div style="padding:20px; text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${myApplications.length}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">Yaptığım Başvuru</div>
                    </div>
                </div>
            `
            : `
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); border:1px solid var(--color-border); background:var(--color-surface); margin-bottom:36px;">
                    <div style="padding:20px; border-right:1px solid var(--color-border); text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${myApplications.length}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">Toplam Başvurum</div>
                    </div>
                    <div style="padding:20px; border-right:1px solid var(--color-border); text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${interviewCount}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">Mülakat Aşamasında</div>
                    </div>
                    <div style="padding:20px; text-align:center;">
                        <div style="font-family:var(--font-display); font-size:32px; font-weight:600; color:var(--color-navy);">${acceptedCount}</div>
                        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-muted); margin-top:4px;">Kabul Edilen</div>
                    </div>
                </div>
            `;

        // Son başvurular önizlemesi
        const appPreviewRows = myApplications.length === 0
            ? `<tr><td colspan="4" class="td-muted">Henüz bir iş ilanına başvurmadınız. <a href="/jobs" style="text-decoration:underline;">Açık ilanları inceleyin &rarr;</a></td></tr>`
            : myApplications.slice(0, 5).map(a => {
                const job = jobMap.get(Number(a.job_posting_id));
                let badgeCls = 'tag-navy';
                if (a.status === 'interview') badgeCls = 'tag-warning';
                if (a.status === 'accepted') badgeCls = 'tag-success';
                return `
                    <tr>
                        <td class="td-id">#${a.id}</td>
                        <td class="td-title">${job ? escapeHtml(job.title) : `İlan #${a.job_posting_id}`}</td>
                        <td><span class="tag-square">${job ? escapeHtml(job.company) : '-'}</span></td>
                        <td><span class="tag-square ${badgeCls}">${escapeHtml(a.status || 'applied')}</span></td>
                    </tr>
                `;
            }).join('');

        // Role özel ek bölüm: Alumni/Admin için "Yayınladığım İlanlar", Student için "Kariyer Rehberi"
        const roleSpecificSection = isJobPoster
            ? `
                <div style="margin-top:40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                        <div>
                            <span class="kicker">Size Özel · İlan Yönetimi</span>
                            <h2 style="font-family:var(--font-display); font-size:26px; color:var(--color-navy); margin:0;">Yayınladığım İş İlanları (${myJobs.length})</h2>
                        </div>
                        <a href="/my-jobs" class="btn btn-gold btn-sm">İlanlarımı Yönet &rarr;</a>
                    </div>
                    <div class="notion-frame">
                        <table class="notion-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pozisyon</th>
                                    <th>Şirket</th>
                                    <th>Lokasyon</th>
                                    <th style="text-align:right;">Başvuranlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${myJobs.length === 0
                                    ? `<tr><td colspan="5" class="td-muted">Henüz ilan yayınlamadınız. <a href="/my-jobs" style="text-decoration:underline;">İlk ilanınızı yayınlayın &rarr;</a></td></tr>`
                                    : myJobs.map(j => `
                                        <tr>
                                            <td class="td-id">#${j.id}</td>
                                            <td class="td-title">${escapeHtml(j.title)}</td>
                                            <td><span class="tag-square">${escapeHtml(j.company)}</span></td>
                                            <td class="td-muted">${escapeHtml(j.location || j.city || 'İstanbul')}</td>
                                            <td style="text-align:right;">
                                                <a href="/jobs/${j.id}/applications" class="btn btn-outline btn-sm">Başvuruları Gör &rarr;</a>
                                            </td>
                                        </tr>
                                    `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `
            : `
                <div class="panel-card" style="margin-top:40px; border-left:3px solid var(--color-gold);">
                    <span class="kicker">Öğrenci Kariyer Alanı</span>
                    <h3 style="margin-top:6px;">Mezun Ağıyla Kariyerinize Hızlı Başlayın</h3>
                    <p class="td-muted" style="margin:0 0 18px 0;">
                        Öğrenci hesabınızla mezunların paylaştığı açık staj ve junior pozisyonlarına başvurabilir,
                        başvuru durumlarınızı <strong>Başvurularım</strong> sayfasından anlık takip edebilirsiniz.
                    </p>
                    <div class="action-row">
                        <a href="/jobs" class="btn btn-primary btn-sm">Açık İlanlara Göz At &rarr;</a>
                        <a href="/my-applications" class="btn btn-outline btn-sm">Tüm Başvurularım</a>
                        <a href="/users" class="btn btn-outline btn-sm">Mezun Dizini</a>
                    </div>
                </div>
            `;

        const bodyHtml = `
            <section class="page-head">
                <div class="container page-head-row">
                    <div>
                        <span class="kicker">Kişisel Alan · #${escapeHtml(user.id)}</span>
                        <h1>Hoş Geldin, ${escapeHtml(user.name)}</h1>
                        <p class="lead">
                            Hesap bilgilerinizi güncelleyin, size ait başvuruları ve ${isJobPoster ? 'yayınladığınız iş ilanlarını' : 'kariyer sürecinizi'} tek ekrandan takip edin.
                        </p>
                    </div>
                    <div class="action-row">
                        <span class="tag-square ${roleBadgeClass}">${escapeHtml(roleLabelMap[user.role] || user.role)}</span>
                        ${user.role === 'admin' ? '<a href="/admin" class="btn btn-gold btn-sm">Admin Paneli &rarr;</a>' : ''}
                        <a href="/api/profile" target="_blank" class="btn btn-outline btn-sm">Profil JSON</a>
                    </div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    ${alertError}
                    ${alertSuccess}
                    ${metricsHtml}

                    <div class="crud-grid">
                        <!-- SOL: KİŞİSEL ÖZET + SON BAŞVURULAR -->
                        <div>
                            <div class="panel-card" style="margin-bottom:28px;">
                                <span class="kicker">Hesap Kartım</span>
                                <h2 style="font-family:var(--font-display); font-size:24px; color:var(--color-navy); margin:4px 0 18px 0;">${escapeHtml(user.name)}</h2>
                                <div class="detail-row">
                                    <span class="detail-label">E-posta</span>
                                    <span class="detail-value">${escapeHtml(user.email)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Rol</span>
                                    <span class="detail-value"><span class="tag-square ${roleBadgeClass}">${escapeHtml(user.role)}</span></span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Bölüm</span>
                                    <span class="detail-value">${escapeHtml(user.department || 'Belirtilmedi')}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Mezuniyet Yılı</span>
                                    <span class="detail-value">${escapeHtml(user.graduationYear || 'Belirtilmedi')}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Şirket / Unvan</span>
                                    <span class="detail-value">${escapeHtml(user.company || '-')} · ${escapeHtml(user.jobTitle || '-')}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Yetkinlikler</span>
                                    <span class="detail-value">${skillsHtml}</span>
                                </div>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
                                <div>
                                    <span class="kicker">Size Özel · Başvuru Özeti</span>
                                    <h2 style="font-family:var(--font-display); font-size:24px; color:var(--color-navy); margin:0;">Son Başvurularım</h2>
                                </div>
                                <a href="/my-applications" class="btn btn-outline btn-sm">Tüm Başvurularım &rarr;</a>
                            </div>

                            <div class="notion-frame">
                                <table class="notion-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Pozisyon</th>
                                            <th>Şirket</th>
                                            <th>Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appPreviewRows}
                                    </tbody>
                                </table>
                            </div>

                            ${roleSpecificSection}
                        </div>

                        <!-- SAĞ: HIZLI PROFİL GÜNCELLEME FORMU -->
                        <aside class="panel panel-sticky">
                            <span class="kicker">Bilgilerimi Düzenle</span>
                            <h2 class="panel-title">Profilimi Güncelle</h2>
                            <form action="/profile" method="POST">
                                <div class="form-group">
                                    <label for="p-name">Ad Soyad *</label>
                                    <input type="text" id="p-name" name="name" value="${escapeHtml(user.name)}" required>
                                </div>
                                <div class="form-group">
                                    <label for="p-email">E-posta *</label>
                                    <input type="email" id="p-email" name="email" value="${escapeHtml(user.email || '')}" required>
                                </div>
                                <div class="form-group">
                                    <label for="p-dept">Bölüm</label>
                                    <input type="text" id="p-dept" name="department" value="${escapeHtml(user.department || '')}">
                                </div>
                                <div class="form-group">
                                    <label for="p-year">Mezuniyet Yılı</label>
                                    <input type="number" id="p-year" name="graduationYear" min="1950" max="2035" value="${escapeHtml(user.graduationYear || '')}">
                                </div>
                                <div class="form-group">
                                    <label for="p-comp">Şirket</label>
                                    <input type="text" id="p-comp" name="company" value="${escapeHtml(user.company || '')}" placeholder="Örn: Trendyol">
                                </div>
                                <div class="form-group">
                                    <label for="p-title">Unvan / Pozisyon</label>
                                    <input type="text" id="p-title" name="jobTitle" value="${escapeHtml(user.jobTitle || '')}" placeholder="Örn: Backend Developer">
                                </div>
                                <div class="form-group">
                                    <label for="p-skills">Yetkinlikler (Virgülle ayırın)</label>
                                    <input type="text" id="p-skills" name="skills" value="${escapeHtml(skillsCsv)}" placeholder="Node.js, SQL, React">
                                </div>
                                <button type="submit" class="btn btn-primary btn-block">Profilimi Kaydet &rarr;</button>
                            </form>
                        </aside>
                    </div>
                </div>
            </section>
        `;

        return renderLayout({
            title: 'Profilim',
            activePath: '/profile',
            bodyHtml,
            currentUser: user
        });
    }

    // 2. KİŞİSEL BAŞVURULARIM SAYFASI (/my-applications)
    static renderMyApplicationsPage({ user, applications = [], jobs = [], errorMessage = null, successMessage = null }) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';

        const jobMap = new Map(jobs.map(j => [Number(j.id), j]));

        const rowsHtml = applications.length === 0
            ? `<tr><td colspan="6" class="td-muted" style="text-align:center; padding:28px;">Henüz hiçbir ilana başvurmadınız. <a href="/jobs" style="text-decoration:underline;">Açık ilanlara göz atın &rarr;</a></td></tr>`
            : applications.map(app => {
                const job = jobMap.get(Number(app.job_posting_id));
                let statusClass = 'tag-navy';
                if (app.status === 'interview') statusClass = 'tag-warning';
                if (app.status === 'accepted') statusClass = 'tag-success';

                return `
                    <tr>
                        <td class="td-id">#${app.id}</td>
                        <td class="td-title">${job ? escapeHtml(job.title) : `İlan #${app.job_posting_id}`}</td>
                        <td><span class="tag-square">${job ? escapeHtml(job.company) : '-'}</span></td>
                        <td><span class="tag-square ${statusClass}">${escapeHtml(app.status || 'applied')}</span></td>
                        <td class="td-id">${new Date(app.created_at).toLocaleDateString('tr-TR')}</td>
                        <td style="text-align:right;">
                            <form action="/my-applications/${app.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvurunuzu iptal etmek istediğinize emin misiniz?');">
                                <button type="submit" class="btn btn-danger btn-sm">İptal Et</button>
                            </form>
                        </td>
                    </tr>
                `;
            }).join('');

        const bodyHtml = `
            <section class="page-head">
                <div class="container page-head-row">
                    <div>
                        <span class="kicker">Size Özel · ${escapeHtml(user.name)}</span>
                        <h1>Başvurularım (${applications.length})</h1>
                        <p class="lead">Yalnızca kendi hesabınızla yaptığınız iş ve staj başvuruları listelenir.</p>
                    </div>
                    <div class="action-row">
                        <a href="/jobs" class="btn btn-primary btn-sm">Yeni İlanlara Başvur &rarr;</a>
                        <a href="/profile" class="btn btn-outline btn-sm">&larr; Profilim</a>
                    </div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    ${alertError}
                    ${alertSuccess}
                    <div class="notion-frame">
                        <table class="notion-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pozisyon</th>
                                    <th>Şirket</th>
                                    <th>Durum</th>
                                    <th>Başvuru Tarihi</th>
                                    <th style="text-align:right;">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `;

        return renderLayout({
            title: 'Başvurularım',
            activePath: '/my-applications',
            bodyHtml,
            currentUser: user
        });
    }

    // 3. KİŞİSEL İLANLARIM SAYFASI (/my-jobs — Yalnızca alumni ve admin)
    static renderMyJobsPage({ user, myJobs = [], applicantCountByJobId = {}, errorMessage = null, successMessage = null }) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';

        const cardsHtml = myJobs.length === 0
            ? `<div class="panel"><p class="td-muted" style="text-align:center; margin:0;">Henüz kendi adınıza yayınladığınız bir iş ilanı bulunmuyor. Sağdaki formdan ilk ilanınızı oluşturabilirsiniz.</p></div>`
            : myJobs.map(j => {
                const count = applicantCountByJobId[j.id] || 0;
                return `
                    <article class="editorial-card">
                        <div class="editorial-card-top">
                            <div>
                                <span class="tag-square">${escapeHtml(j.company)}</span>
                                <h3>${escapeHtml(j.title)}</h3>
                            </div>
                            <span class="td-id">${escapeHtml(j.location || j.city || 'İstanbul (Hibrit)')}</span>
                        </div>
                        <p>${escapeHtml(j.description || 'İlan açıklaması belirtilmemiş.')}</p>
                        <div class="editorial-card-footer">
                            <span class="tag-square tag-navy">${count} Başvuru</span>
                            <div class="action-row">
                                <a href="/jobs/${j.id}/applications" class="btn btn-gold btn-sm">Başvuranları Gör (${count})</a>
                                <form action="/my-jobs/${j.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${escapeHtml(j.title)} ilanınızı silmek istediğinize emin misiniz?');">
                                    <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                                </form>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');

        const bodyHtml = `
            <section class="page-head">
                <div class="container page-head-row">
                    <div>
                        <span class="kicker">Mezun &amp; Yönetici Alanı · ${escapeHtml(user.name)}</span>
                        <h1>Yayınladığım İş İlanları (${myJobs.length})</h1>
                        <p class="lead">Yalnızca sizin hesabınıza ait iş ve staj ilanlarını yönetin, gelen başvuruları inceleyin.</p>
                    </div>
                    <div class="action-row">
                        <a href="/jobs" class="btn btn-outline btn-sm">Tüm İlanlar</a>
                        <a href="/profile" class="btn btn-outline btn-sm">&larr; Profilim</a>
                    </div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    ${alertError}
                    ${alertSuccess}

                    <div class="crud-grid">
                        <div class="editorial-stack">
                            ${cardsHtml}
                        </div>

                        <aside class="panel panel-sticky">
                            <span class="kicker">Kendi Adıma İlan Aç</span>
                            <h2 class="panel-title">Yeni İlan Yayınla</h2>
                            <form action="/my-jobs" method="POST">
                                <div class="form-group">
                                    <label>İlan Sahibi</label>
                                    <input type="text" value="${escapeHtml(user.name)} (${escapeHtml(user.role)})" disabled>
                                </div>
                                <div class="form-group">
                                    <label for="mj-title">Pozisyon Başlığı *</label>
                                    <input type="text" id="mj-title" name="title" maxlength="120" placeholder="Örn: Junior Full-Stack Developer" required>
                                </div>
                                <div class="form-group">
                                    <label for="mj-company">Şirket *</label>
                                    <input type="text" id="mj-company" name="company" value="${escapeHtml(user.company || '')}" placeholder="Örn: Microsoft" required>
                                </div>
                                <div class="form-group">
                                    <label for="mj-loc">Lokasyon</label>
                                    <input type="text" id="mj-loc" name="location" value="İstanbul (Hibrit)">
                                </div>
                                <div class="form-group">
                                    <label for="mj-desc">İlan Açıklaması</label>
                                    <textarea id="mj-desc" name="description" rows="4" placeholder="Aranan nitelikler ve pozisyon detayları..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block">İlanımı Yayınla &rarr;</button>
                            </form>
                        </aside>
                    </div>
                </div>
            </section>
        `;

        return renderLayout({
            title: 'İlanlarım',
            activePath: '/my-jobs',
            bodyHtml,
            currentUser: user
        });
    }
}

module.exports = ProfileViews;
