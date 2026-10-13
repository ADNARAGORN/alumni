// views/announcementViews.js: Duyuru (Announcement) Yönetim Arayüzü
class AnnouncementViews {
    // 1. Liste Sayfası + Yeni Duyuru Ekleme Formu
    static renderListPage(announcements, errorMessage = null, successMessage = null) {
        const cardsHtml = announcements.length === 0 ? `
            <p class="text-muted" style="text-align:center; padding:30px;">Henüz hiç duyuru eklenmemiş.</p>
        ` : announcements.map(item => `
            <div class="announcement-item">
                <div class="item-header">
                    <div>
                        <span class="category-badge category-${item.category.toLowerCase()}">${item.category}</span>
                        <h3 class="item-title">${item.title}</h3>
                    </div>
                    <span class="item-date">📅 ${item.date}</span>
                </div>
                <p class="item-content">${item.content}</p>
                <div class="item-footer">
                    <span class="item-author">✍️ <strong>Yayınlayan:</strong> ${item.author}</span>
                    <div class="action-buttons">
                        <a href="/announcements/${item.id}" class="btn btn-sm btn-info">🔍 Detay</a>
                        <a href="/announcements/${item.id}/edit" class="btn btn-sm btn-warning">✏️ Düzenle</a>
                        <form action="/announcements/${item.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('${item.title} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
                            <button type="submit" class="btn btn-sm btn-danger">🗑️ Sil</button>
                        </form>
                    </div>
                </div>
            </div>
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
    <title>📢 Duyuru Yönetimi - Alumni Tracking</title>
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
        .announcement-item {
            background: #ffffff;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 16px;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .announcement-item:hover {
            box-shadow: 0 6px 12px rgba(0,0,0,0.05);
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .item-title {
            margin: 6px 0 0 0;
            font-size: 18px;
            color: #1e293b;
        }
        .item-date { font-size: 12px; color: var(--text-muted); font-weight: 500; }
        .item-content {
            color: #334155;
            font-size: 14px;
            line-height: 1.6;
            margin: 10px 0 15px 0;
        }
        .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 12px;
            font-size: 13px;
        }
        .category-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 4px;
            background: #e2e8f0;
            color: #475569;
        }
        .category-kariyer { background: #dbeafe; color: #1e40af; }
        .category-buluşma, .category-bulusma { background: #fef3c7; color: #92400e; }
        .category-etkinlik { background: #dcfce7; color: #166534; }
        .form-group { margin-bottom: 14px; }
        label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
        }
        input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            font-family: inherit;
        }
        textarea { resize: vertical; min-height: 90px; }
        input:focus, textarea:focus, select:focus {
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
        .action-buttons { display: flex; gap: 6px; }
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
            <h1>📢 Alumni Tracking - Duyuru Yönetimi</h1>
            <div class="nav-links">
                <a href="/">Ana Sayfa</a>
                <a href="/users">Mezunlar Paneli</a>
                <a href="/api/swagger">Swagger UI</a>
                <a href="/api/announcements" target="_blank">JSON API</a>
            </div>
        </div>

        ${alertError}
        ${alertSuccess}

        <div class="grid">
            <!-- DUYURU LİSTESİ -->
            <div class="card">
                <h2>📋 Yayınlanan Duyurular (${announcements.length})</h2>
                ${cardsHtml}
            </div>

            <!-- DUYURU OLUŞTURMA FORMU -->
            <div class="card">
                <h2>➕ Yeni Duyuru Yayınla</h2>
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
                        <label for="author">Yayınlayan / Birim</label>
                        <input type="text" id="author" name="author" placeholder="Örn: Kariyer Merkezi" value="Mezunlar Ofisi">
                    </div>

                    <div class="form-group">
                        <label for="content">Duyuru Metni *</label>
                        <textarea id="content" name="content" placeholder="Duyuru detaylarını buraya yazın..." required></textarea>
                    </div>

                    <button type="submit" class="btn btn-block">📢 Duyuruyu Yayınla (Create)</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    // 2. Tekil Duyuru Detay Sayfası
    static renderDetailPage(item) {
        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.title} - Duyuru Detayı</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; padding: 40px 20px; }
        .card { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .badge { background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; }
        h1 { margin: 12px 0; font-size: 22px; color: #0f172a; }
        .meta { color: #64748b; font-size: 13px; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .content { color: #334155; font-size: 15px; line-height: 1.7; white-space: pre-wrap; }
        .btn-group { margin-top: 30px; display: flex; gap: 10px; }
        .btn { padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
        .btn-back { background: #e2e8f0; color: #0f172a; }
        .btn-edit { background: #f59e0b; color: white; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">${item.category}</span>
        <h1>${item.title}</h1>
        <div class="meta">
            <span>📅 Tarih: ${item.date}</span> &nbsp;|&nbsp; 
            <span>✍️ Yayınlayan: ${item.author}</span>
        </div>
        <div class="content">${item.content}</div>
        <div class="btn-group">
            <a href="/announcements" class="btn btn-back">⬅ Duyuru Listesine Dön</a>
            <a href="/announcements/${item.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
        </div>
    </div>
</body>
</html>
        `;
    }

    // 3. Duyuru Düzenleme Form Sayfası
    static renderEditPage(item, errorMessage = null) {
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
    <title>Düzenle: ${item.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; padding: 40px 20px; }
        .card { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        h1 { margin-top: 0; font-size: 22px; color: #0f172a; margin-bottom: 20px; }
        .form-group { margin-bottom: 14px; }
        label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 600; color: #64748b; }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px; font-family: inherit; }
        textarea { resize: vertical; min-height: 120px; }
        .btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn { padding: 10px 18px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; text-align: center; }
        .btn-primary { background: #2563eb; color: white; flex: 1; }
        .btn-cancel { background: #e2e8f0; color: #0f172a; }
    </style>
</head>
<body>
    <div class="card">
        <h1>✏️ Duyuruyu Düzenle (#${item.id})</h1>
        ${alertError}
        <form action="/announcements/${item.id}/update" method="POST">
            <div class="form-group">
                <label for="title">Duyuru Başlığı *</label>
                <input type="text" id="title" name="title" value="${item.title}" required>
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
                <input type="text" id="author" name="author" value="${item.author}">
            </div>

            <div class="form-group">
                <label for="content">Duyuru Metni *</label>
                <textarea id="content" name="content" required>${item.content}</textarea>
            </div>

            <div class="btn-group">
                <a href="/announcements" class="btn btn-cancel">İptal</a>
                <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet (Update)</button>
            </div>
        </form>
    </div>
</body>
</html>
        `;
    }
}

module.exports = AnnouncementViews;
