// views/userViews.js: View Katmanı (Tüm CRUD Operasyonları İçin HTML Arayüzleri)
class UserViews {
    // 1. READ (All) & CREATE: Liste Sayfası + Ekleme Formu
    static renderUserListPage(users, errorMessage = null, successMessage = null) {
        const rowsHtml = users.map(user => `
            <tr>
                <td><span class="badge">#${user.id}</span></td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email || '<span class="text-muted">-</span>'}</td>
                <td>${user.graduationYear || '<span class="text-muted">-</span>'}</td>
                <td>${user.department || '<span class="text-muted">-</span>'}</td>
                <td>${user.company || '<span class="text-muted">-</span>'}</td>
                <td>${user.jobTitle || '<span class="text-muted">-</span>'}</td>
                <td class="action-buttons">
                    <a href="/users/${user.id}" class="btn btn-sm btn-info" title="Detay">🔍 Detay</a>
                    <a href="/users/${user.id}/edit" class="btn btn-sm btn-warning" title="Düzenle">✏️ Düzenle</a>
                    <form action="/users/${user.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${user.name} kullanıcısını silmek istediğinize emin misiniz?');">
                        <button type="submit" class="btn btn-sm btn-danger">🗑️ Sil</button>
                    </form>
                </td>
            </tr>
        `).join('');

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
    <title>🎓 Mezun Takip Sistemi - Yönetim Paneli</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f1f5f9;
            --card-bg: #ffffff;
            --text: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
            --success: #16a34a;
            --warning: #f59e0b;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 30px 20px;
            background-color: var(--bg);
            color: var(--text);
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border);
        }
        h1 { margin: 0; font-size: 26px; }
        .nav-links a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            margin-left: 15px;
        }
        .nav-links a:hover { text-decoration: underline; }
        .grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 25px;
        }
        @media (max-width: 960px) {
            .grid { grid-template-columns: 1fr; }
        }
        .card {
            background: var(--card-bg);
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
            border: 1px solid var(--border);
        }
        .card h2 { margin-top: 0; font-size: 20px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
            padding: 12px 10px;
            text-align: left;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
        }
        th { background-color: #f8fafc; color: var(--text-muted); font-weight: 600; }
        tr:hover { background-color: #f8fafc; }
        .badge {
            background-color: #e2e8f0;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }
        .form-group { margin-bottom: 14px; }
        label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        }
        input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
        }
        .btn-block { width: 100%; box-sizing: border-box; }
        .btn:hover { background: var(--primary-hover); }
        .btn-sm { padding: 5px 8px; font-size: 12px; border-radius: 4px; }
        .btn-info { background: #0284c7; }
        .btn-info:hover { background: #0369a1; }
        .btn-warning { background: #f59e0b; color: white; }
        .btn-warning:hover { background: #d97706; }
        .btn-danger { background: #ef4444; }
        .btn-danger:hover { background: #dc2626; }
        .action-buttons { white-space: nowrap; }
        .alert {
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .alert-danger { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .alert-success { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .text-muted { color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Alumni Tracking - Full CRUD Web UI</h1>
            <div class="nav-links">
                <a href="/">Ana Sayfa</a>
                <a href="/api/swagger">Swagger UI</a>
                <a href="/api/users" target="_blank">JSON API</a>
            </div>
        </div>

        ${alertError}
        ${alertSuccess}

        <div class="grid">
            <!-- READ ALL TABLE -->
            <div class="card">
                <h2>📋 Mezun Listesi (Read All)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>İsim</th>
                            <th>E-posta</th>
                            <th>Yıl</th>
                            <th>Bölüm</th>
                            <th>Şirket</th>
                            <th>Ünvan</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>

            <!-- CREATE FORM -->
            <div class="card">
                <h2>➕ Yeni Mezun Ekle (Create)</h2>
                <form action="/users" method="POST">
                    <div class="form-group">
                        <label for="name">Ad Soyad *</label>
                        <input type="text" id="name" name="name" placeholder="Örn: Elif Kaya" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-posta * (Model Kuralı)</label>
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
                        <label for="jobTitle">Ünvan</label>
                        <input type="text" id="jobTitle" name="jobTitle" placeholder="Örn: Backend Developer">
                    </div>
                    <button type="submit" class="btn btn-block">➕ Mezunu Kaydet (Create)</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    // 2. READ (One): Tekil Profil Detay Sayfası
    static renderUserDetailPage(user) {
        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user.name} - Detay</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; padding: 40px 20px; }
        .card { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        h1 { margin-top: 0; font-size: 22px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; font-size: 14px; }
        .lbl { font-weight: 600; color: #64748b; }
        .btn-group { margin-top: 25px; display: flex; gap: 10px; }
        .btn { padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; }
        .btn-back { background: #e2e8f0; color: #0f172a; }
        .btn-edit { background: #f59e0b; color: white; }
    </style>
</head>
<body>
    <div class="card">
        <h1>👤 ${user.name} (Detay Görüntüleme)</h1>
        <div class="row"><span class="lbl">ID:</span><span>#${user.id}</span></div>
        <div class="row"><span class="lbl">E-posta:</span><span>${user.email || '-'}</span></div>
        <div class="row"><span class="lbl">Mezuniyet Yılı:</span><span>${user.graduationYear || '-'}</span></div>
        <div class="row"><span class="lbl">Bölüm:</span><span>${user.department || '-'}</span></div>
        <div class="row"><span class="lbl">Şirket:</span><span>${user.company || '-'}</span></div>
        <div class="row"><span class="lbl">Ünvan:</span><span>${user.jobTitle || '-'}</span></div>
        <div class="btn-group">
            <a href="/users" class="btn btn-back">⬅ Listeye Dön</a>
            <a href="/users/${user.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
        </div>
    </div>
</body>
</html>
        `;
    }

    // 3. UPDATE: Düzenleme Form Sayfası
    static renderUserEditPage(user, errorMessage = null) {
        const alertError = errorMessage ? `
            <div class="alert alert-danger" style="background:#fef2f2; color:#b91c1c; padding:10px; border-radius:6px; margin-bottom:15px;">
                ⚠️ ${errorMessage}
            </div>
        ` : '';

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Düzenle: ${user.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; padding: 40px 20px; }
        .card { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        h1 { margin-top: 0; font-size: 22px; color: #0f172a; margin-bottom: 20px; }
        .form-group { margin-bottom: 14px; }
        label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 600; color: #64748b; }
        input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px; }
        .btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn { padding: 10px 18px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; text-align: center; }
        .btn-primary { background: #2563eb; color: white; flex: 1; }
        .btn-cancel { background: #e2e8f0; color: #0f172a; }
    </style>
</head>
<body>
    <div class="card">
        <h1>✏️ Mezun Bilgilerini Güncelle (#${user.id})</h1>
        ${alertError}
        <form action="/users/${user.id}/update" method="POST">
            <div class="form-group">
                <label for="name">Ad Soyad *</label>
                <input type="text" id="name" name="name" value="${user.name}" required>
            </div>
            <div class="form-group">
                <label for="email">E-posta * (Model Kuralı)</label>
                <input type="email" id="email" name="email" value="${user.email || ''}" required>
            </div>
            <div class="form-group">
                <label for="graduationYear">Mezuniyet Yılı</label>
                <input type="number" id="graduationYear" name="graduationYear" value="${user.graduationYear || ''}">
            </div>
            <div class="form-group">
                <label for="department">Bölüm</label>
                <input type="text" id="department" name="department" value="${user.department || ''}">
            </div>
            <div class="form-group">
                <label for="company">Şirket</label>
                <input type="text" id="company" name="company" value="${user.company || ''}">
            </div>
            <div class="form-group">
                <label for="jobTitle">Ünvan</label>
                <input type="text" id="jobTitle" name="jobTitle" value="${user.jobTitle || ''}">
            </div>
            <div class="btn-group">
                <a href="/users" class="btn btn-cancel">İptal</a>
                <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet (Update)</button>
            </div>
        </form>
    </div>
</body>
</html>
        `;
    }
}

module.exports = UserViews;
