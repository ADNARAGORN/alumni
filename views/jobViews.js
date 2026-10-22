// views/jobViews.js: İş İlanları ve Başvurular için HTML Arayüzleri (View Katmanı)

class JobViews {
    // 1. İŞ İLANLARI SAYFASI (/jobs)
    static renderJobsPage(jobs, users, errorMessage = null, successMessage = null) {
        const userOptions = users.map(u => `
            <option value="${u.id}">${u.name} (${u.company || 'Mezun'})</option>
        `).join('');

        const jobsCardsHtml = jobs.length === 0 ? `
            <p class="text-muted" style="text-align:center; padding:30px;">Henüz hiç iş ilanı yayınlanmamış.</p>
        ` : jobs.map(j => {
            const owner = users.find(u => u.id === j.user_id);
            const ownerName = owner ? owner.name : `Kullanıcı #${j.user_id}`;
            return `
            <div class="job-card">
                <div class="job-header">
                    <div>
                        <span class="badge badge-company">${j.company}</span>
                        <h3 class="job-title">${j.title}</h3>
                    </div>
                    <span class="job-location">📍 ${j.location || 'Hibrit'}</span>
                </div>
                <p class="job-desc">${j.description || 'Detay belirtilmemiş.'}</p>
                <div class="job-footer">
                    <span class="job-owner">👤 <strong>İlan Sahibi:</strong> ${ownerName}</span>
                    <div class="job-actions">
                        <a href="/jobs/${j.id}/applications" class="btn btn-sm btn-info">📋 Başvurular</a>
                        <form action="/jobs/${j.id}/apply" method="POST" style="display:inline;" class="quick-apply-form">
                            <select name="userId" required class="select-sm">
                                <option value="" disabled selected>Kim Başvuruyor?</option>
                                ${userOptions}
                            </select>
                            <button type="submit" class="btn btn-sm btn-success">⚡ Başvur</button>
                        </form>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        const alertError = errorMessage ? `
            <div class="alert alert-danger">⚠️ <strong>Hata:</strong> ${errorMessage}</div>
        ` : '';

        const alertSuccess = successMessage ? `
            <div class="alert alert-success">✅ ${successMessage}</div>
        ` : '';

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💼 İş İlanları - Alumni Tracking</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
            --success: #16a34a;
            --info: #0284c7;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0; padding: 30px 20px; background-color: var(--bg); color: var(--text);
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--border);
        }
        h1 { margin: 0; font-size: 26px; }
        .nav-links a { color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 15px; }
        .nav-links a:hover { text-decoration: underline; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
        @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
        .card {
            background: var(--card-bg); padding: 24px; border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); border: 1px solid var(--border);
        }
        .card h2 { margin-top: 0; font-size: 20px; margin-bottom: 16px; }
        .job-card {
            background: #ffffff; border: 1px solid var(--border); border-radius: 8px;
            padding: 18px; margin-bottom: 16px; transition: box-shadow 0.2s;
        }
        .job-card:hover { box-shadow: 0 6px 12px rgba(0,0,0,0.06); }
        .job-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-title { margin: 6px 0 0 0; font-size: 18px; color: #1e293b; }
        .job-location { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .job-desc { color: #334155; font-size: 14px; line-height: 1.6; margin: 10px 0 14px 0; }
        .job-footer {
            display: flex; justify-content: space-between; align-items: center;
            border-top: 1px solid #f1f5f9; padding-top: 12px; font-size: 13px;
        }
        .badge {
            display: inline-block; font-size: 11px; font-weight: 700;
            padding: 3px 8px; border-radius: 4px; text-transform: uppercase;
        }
        .badge-company { background: #dbeafe; color: #1e40af; }
        .form-group { margin-bottom: 14px; }
        label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 600; color: var(--text-muted); }
        input, select, textarea {
            width: 100%; padding: 10px; border: 1px solid var(--border);
            border-radius: 6px; font-size: 14px; box-sizing: border-box; font-family: inherit;
        }
        textarea { resize: vertical; min-height: 80px; }
        .btn {
            display: inline-block; background: var(--primary); color: white; border: none;
            padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 600;
            cursor: pointer; text-decoration: none; text-align: center;
        }
        .btn-block { width: 100%; box-sizing: border-box; }
        .btn:hover { background: var(--primary-hover); }
        .btn-sm { padding: 6px 10px; font-size: 12px; border-radius: 4px; }
        .btn-info { background: var(--info); }
        .btn-success { background: var(--success); }
        .select-sm { width: auto; padding: 5px 8px; font-size: 12px; display: inline-block; }
        .job-actions { display: flex; gap: 8px; align-items: center; }
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .alert-danger { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .alert-success { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .text-muted { color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💼 Alumni Tracking - İş & Staj İlanları (UI)</h1>
            <div class="nav-links">
                <a href="/">Ana Sayfa</a>
                <a href="/users">Mezunlar</a>
                <a href="/announcements">Duyurular</a>
                <a href="/applications">📋 Tüm Başvurular</a>
                <a href="/api/swagger">Swagger UI</a>
            </div>
        </div>

        ${alertError}
        ${alertSuccess}

        <div class="grid">
            <!-- İLANLAR LİSTESİ -->
            <div class="card">
                <h2>📋 Açık Pozisyonlar (${jobs.length})</h2>
                ${jobsCardsHtml}
            </div>

            <!-- YENİ İLAN FORMU -->
            <div class="card">
                <h2>➕ Yeni İş İlanı Yayınla</h2>
                <form action="/jobs" method="POST">
                    <div class="form-group">
                        <label for="userId">İlanı Açan Mezun (User ID) *</label>
                        <select id="userId" name="userId" required>
                            <option value="" disabled selected>Mezun Seçin...</option>
                            ${userOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="title">Pozisyon Başlığı *</label>
                        <input type="text" id="title" name="title" placeholder="Örn: Frontend React Developer" required>
                    </div>

                    <div class="form-group">
                        <label for="company">Şirket *</label>
                        <input type="text" id="company" name="company" placeholder="Örn: Trendyol" required>
                    </div>

                    <div class="form-group">
                        <label for="location">Lokasyon</label>
                        <input type="text" id="location" name="location" placeholder="Örn: İstanbul (Hibrit)" value="İstanbul (Hibrit)">
                    </div>

                    <div class="form-group">
                        <label for="description">İlan Açıklaması</label>
                        <textarea id="description" name="description" placeholder="Adaylarda aranan kriterler..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-block">🚀 İlanı Yayınla (Create)</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    // 2. BAŞVURULAR SAYFASI (/applications veya /jobs/:id/applications)
    static renderApplicationsPage(applications, users, jobs, targetJob = null, errorMessage = null, successMessage = null) {
        const titleText = targetJob 
            ? `🎯 "${targetJob.title} (${targetJob.company})" İlanına Gelen Başvurular`
            : `📋 Tüm İş Başvuruları (Applications Many-to-Many)`;

        const rowsHtml = applications.length === 0 ? `
            <tr><td colspan="6" style="text-align:center; padding:20px;" class="text-muted">Henüz başvuru bulunmuyor.</td></tr>
        ` : applications.map(app => {
            const applicant = users.find(u => u.id === app.user_id);
            const job = jobs.find(j => j.id === app.job_posting_id);

            const applicantName = applicant ? applicant.name : `Kullanıcı #${app.user_id}`;
            const applicantEmail = applicant ? applicant.email : '-';
            const jobTitle = job ? `${job.title} @ ${job.company}` : `İlan #${app.job_posting_id}`;

            let statusBadge = "badge-company";
            if (app.status === 'interview') statusBadge = "badge-warning";
            if (app.status === 'accepted') statusBadge = "badge-success";

            return `
            <tr>
                <td><strong>#${app.id}</strong></td>
                <td>
                    <strong>${applicantName}</strong><br>
                    <small class="text-muted">${applicantEmail}</small>
                </td>
                <td>${jobTitle}</td>
                <td><span class="badge ${statusBadge}">${app.status || 'applied'}</span></td>
                <td>${new Date(app.created_at).toLocaleDateString('tr-TR')}</td>
                <td>
                    <form action="/applications/${app.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Başvuruyu geri çekmek/silmek istediğinize emin misiniz?');">
                        <button type="submit" class="btn btn-sm btn-danger">🗑️ İptal Et</button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');

        const alertError = errorMessage ? `
            <div class="alert alert-danger">⚠️ <strong>Hata:</strong> ${errorMessage}</div>
        ` : '';

        const alertSuccess = successMessage ? `
            <div class="alert alert-success">✅ ${successMessage}</div>
        ` : '';

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📋 Başvurular - Alumni Tracking</title>
    <style>
        :root {
            --primary: #2563eb;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
            --success: #16a34a;
            --warning: #f59e0b;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 30px 20px; background-color: var(--bg); color: var(--text); }
        .container { max-width: 1100px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--border); }
        h1 { margin: 0; font-size: 24px; }
        .nav-links a { color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 15px; }
        .nav-links a:hover { text-decoration: underline; }
        .card { background: var(--card-bg); padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); border: 1px solid var(--border); }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
        th { background-color: #f1f5f9; color: var(--text-muted); font-weight: 600; }
        tr:hover { background-color: #f8fafc; }
        .badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
        .badge-company { background: #dbeafe; color: #1e40af; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-success { background: #dcfce7; color: #166534; }
        .btn { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; }
        .btn-danger { background: var(--danger); color: white; }
        .btn-back { background: #e2e8f0; color: #0f172a; margin-bottom: 15px; }
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .alert-danger { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .alert-success { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .text-muted { color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Alumni Tracking - Başvuru Yönetimi</h1>
            <div class="nav-links">
                <a href="/jobs">💼 İş İlanları</a>
                <a href="/users">Mezunlar</a>
                <a href="/announcements">Duyurular</a>
                <a href="/api/swagger">Swagger</a>
            </div>
        </div>

        ${alertError}
        ${alertSuccess}

        <div class="card">
            ${targetJob ? `<a href="/jobs" class="btn btn-back">⬅ Tüm İlanlara Dön</a>` : ''}
            <h2>${titleText} (${applications.length} Başvuru)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Başvuran Mezun</th>
                        <th>İş İlanı & Şirket</th>
                        <th>Durum</th>
                        <th>Başvuru Tarihi</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
        `;
    }
}

module.exports = JobViews;
