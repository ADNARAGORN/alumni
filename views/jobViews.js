// views/jobViews.js — İş İlanları & Başvurular Arayüzleri (brand.md + DESIGN.md)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class JobViews {
    // 1. İŞ İLANLARI SAYFASI (/jobs)
    static renderJobsPage(jobs, users, errorMessage = null, successMessage = null, currentUser = null) {
        const userOptions = users.map(u => `
            <option value="${escapeHtml(u.id)}">${escapeHtml(u.name)} (${escapeHtml(u.company || 'Mezun')})</option>
        `).join('');

        const jobsCardsHtml = jobs.length === 0 ? `
            <div class="panel"><p class="td-muted" style="text-align:center; margin:0;">Henüz hiç iş ilanı yayınlanmamış.</p></div>
        ` : jobs.map(j => {
            const owner = users.find(u => u.id === j.user_id);
            const ownerName = owner ? owner.name : `Kullanıcı #${j.user_id}`;
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
                    <span><strong>İlan Sahibi:</strong> ${escapeHtml(ownerName)}</span>
                    <div class="action-row" style="flex-wrap:wrap;">
                        <a href="/jobs/${j.id}/applications" class="btn btn-outline btn-sm">Başvurular</a>
                        <form action="/jobs/${j.id}/apply" method="POST" style="display:inline-flex; gap:6px; align-items:center;">
                            <select name="userId" required class="select-inline">
                                <option value="" disabled selected>Kim Başvuruyor?</option>
                                ${userOptions}
                            </select>
                            <button type="submit" class="btn btn-success btn-sm">Başvur</button>
                        </form>
                    </div>
                </div>
            </article>
            `;
        }).join('');

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
                        <span class="kicker">02 / Kariyer Fırsatları</span>
                        <h1>İş &amp; Staj İlanları (${jobs.length})</h1>
                        <p>Mezunların kendi şirketlerinden paylaştığı açık pozisyonları inceleyin ve tek tıkla başvuru yapın.</p>
                    </div>
                    <div class="action-row">
                        <a href="/applications" class="btn btn-gold btn-sm">Tüm Başvurular</a>
                        <a href="/api/jobs" target="_blank" class="btn btn-outline btn-sm">JSON API &rarr;</a>
                    </div>
                </div>
            </section>

            <div class="container">
                ${alertError}
                ${alertSuccess}

                <div class="crud-grid">
                    <!-- İLAN KARTLARI -->
                    <div class="editorial-stack">
                        ${jobsCardsHtml}
                    </div>

                    <!-- YENİ İLAN FORMU -->
                    <aside class="panel panel-sticky">
                        <h2 class="panel-title">Yeni İlan Yayınla</h2>
                        <form action="/jobs" method="POST">
                            <div class="form-group">
                                <label for="userId">İlanı Açan Mezun *</label>
                                <select id="userId" name="userId" required>
                                    <option value="" disabled selected>Mezun Seçin...</option>
                                    ${userOptions}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="title">Pozisyon Başlığı * (Maks 120)</label>
                                <input type="text" id="title" name="title" maxlength="120" placeholder="Örn: Frontend Developer" required>
                            </div>
                            <div class="form-group">
                                <label for="company">Şirket *</label>
                                <input type="text" id="company" name="company" placeholder="Örn: Trendyol" required>
                            </div>
                            <div class="form-group">
                                <label for="location">Şehir / Lokasyon (Opsiyonel)</label>
                                <input type="text" id="location" name="location" value="İstanbul (Hibrit)">
                            </div>
                            <div class="form-group">
                                <label for="description">İlan Açıklaması (Opsiyonel)</label>
                                <textarea id="description" name="description" placeholder="Pozisyon gereksinimleri ve detaylar..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">İlanı Yayınla &rarr;</button>
                        </form>
                    </aside>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'İş & Staj İlanları',
            activePath: '/jobs',
            bodyHtml,
            currentUser
        });
    }

    // 2. BAŞVURULAR SAYFASI (/applications veya /jobs/:id/applications) — Notion Data Table
    static renderApplicationsPage(applications, users, jobs, targetJob = null, errorMessage = null, successMessage = null, currentUser = null) {
        const headingText = targetJob
            ? `"${escapeHtml(targetJob.title)}" Başvuruları (${applications.length})`
            : `Tüm İş Başvuruları (${applications.length})`;

        const subText = targetJob
            ? `${escapeHtml(targetJob.company)} bünyesindeki ilana yapılan başvurular listeleniyor.`
            : 'Kullanıcılar ile iş ilanları arasındaki Many-to-Many başvuru kayıtlarını tek tabloda takip edin.';

        const rowsHtml = applications.length === 0 ? `
            <tr><td colspan="6" class="td-muted" style="text-align:center; padding:28px;">Henüz başvuru bulunmuyor.</td></tr>
        ` : applications.map(app => {
            const applicant = users.find(u => u.id === app.user_id);
            const job = jobs.find(j => j.id === app.job_posting_id);

            const applicantName = applicant ? applicant.name : `Kullanıcı #${app.user_id}`;
            const applicantEmail = applicant ? applicant.email : '-';
            const jobTitle = job ? `${job.title} · ${job.company}` : `İlan #${app.job_posting_id}`;

            let statusClass = 'tag-navy';
            if (app.status === 'interview') statusClass = 'tag-warning';
            if (app.status === 'accepted') statusClass = 'tag-success';

            return `
            <tr>
                <td class="td-id">#${escapeHtml(app.id)}</td>
                <td>
                    <div class="td-title">${escapeHtml(applicantName)}</div>
                    <div class="td-muted">${escapeHtml(applicantEmail)}</div>
                </td>
                <td class="td-title">${escapeHtml(jobTitle)}</td>
                <td><span class="tag-square ${statusClass}">${escapeHtml(app.status || 'applied')}</span></td>
                <td class="td-id">${new Date(app.created_at).toLocaleDateString('tr-TR')}</td>
                <td style="text-align:right;">
                    <form action="/applications/${app.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Başvuruyu iptal etmek istediğinize emin misiniz?');">
                        <button type="submit" class="btn btn-danger btn-sm">İptal Et</button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');

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
                        <span class="kicker">03 / Süreç Yönetimi</span>
                        <h1>${headingText}</h1>
                        <p>${subText}</p>
                    </div>
                    <div class="action-row">
                        <a href="/jobs" class="btn btn-outline btn-sm">&larr; İlanlara Dön</a>
                        <a href="/api/applications" target="_blank" class="btn btn-outline btn-sm">JSON API &rarr;</a>
                    </div>
                </div>
            </section>

            <div class="container" style="padding-bottom:64px;">
                ${alertError}
                ${alertSuccess}

                <div class="notion-frame">
                    <table class="notion-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Başvuran Mezun</th>
                                <th>İş İlanı &amp; Şirket</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th style="text-align:right;">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return renderLayout({
            title: targetJob ? `${targetJob.title} Başvuruları` : 'İş Başvuruları',
            activePath: '/applications',
            bodyHtml,
            currentUser
        });
    }
}

module.exports = JobViews;
