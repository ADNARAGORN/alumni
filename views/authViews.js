// views/authViews.js — Kayıt Ol (Register), Giriş Yap (Login) ve Çıkış (Logout) Sayfaları (brand.md + DESIGN.md)
const { renderLayout, escapeHtml } = require('./layoutHelper');

class AuthViews {
    // 1. REGISTER PAGE (/register)
    static renderRegisterPage({ errorMessage = null, successMessage = null, formData = {}, currentUser = null } = {}) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Hata:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)} <a href="/login" style="text-decoration:underline; font-weight:700; margin-left:8px;">Şimdi Giriş Yap &rarr;</a></div>`
            : '';

        const selectedRole = formData.role || 'student';

        const bodyHtml = `
            <div class="focused-wrap" style="max-width:720px;">
                <div class="focused-card">
                    <span class="kicker">Kimlik &amp; Hesap Oluşturma</span>
                    <h1>Alumni Ağına Katılın</h1>
                    <p style="font-family:var(--font-editorial); font-size:18px; color:var(--color-muted); margin:0 0 24px 0;">
                        Mezun veya öğrenci hesabınızı oluşturarak açık iş ilanlarına başvurabilir, profilinizi paylaşabilirsiniz.
                    </p>

                    ${alertError}
                    ${alertSuccess}

                    <form action="/register" method="POST">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                            <div class="form-group">
                                <label for="firstName">Ad *</label>
                                <input type="text" id="firstName" name="firstName" value="${escapeHtml(formData.firstName || '')}" placeholder="Örn: Deniz" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Soyad *</label>
                                <input type="text" id="lastName" name="lastName" value="${escapeHtml(formData.lastName || '')}" placeholder="Örn: Karaca" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">E-posta Adresi *</label>
                            <input type="email" id="email" name="email" value="${escapeHtml(formData.email || '')}" placeholder="Örn: deniz.karaca@ogr.iu.edu.tr" required>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                            <div class="form-group">
                                <label for="password">Şifre * (En az 6 karakter)</label>
                                <input type="password" id="password" name="password" minlength="6" placeholder="••••••••" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Şifre Tekrar *</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" minlength="6" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                            <div class="form-group">
                                <label for="role">Hesap Rolü *</label>
                                <select id="role" name="role" required>
                                    <option value="student" ${selectedRole === 'student' ? 'selected' : ''}>Öğrenci (Student)</option>
                                    <option value="alumni" ${selectedRole === 'alumni' ? 'selected' : ''}>Mezun (Alumni)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="graduationYear">Mezuniyet Yılı (veya Beklenen)</label>
                                <input type="number" id="graduationYear" name="graduationYear" min="1950" max="2035" value="${escapeHtml(formData.graduationYear || '2026')}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="department">Bölüm *</label>
                            <input type="text" id="department" name="department" value="${escapeHtml(formData.department || 'Yönetim Bilişim Sistemleri')}" required>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                            <div class="form-group">
                                <label for="company">Şirket (Opsiyonel)</label>
                                <input type="text" id="company" name="company" value="${escapeHtml(formData.company || '')}" placeholder="Örn: Trendyol">
                            </div>
                            <div class="form-group">
                                <label for="jobTitle">Unvan / Pozisyon (Opsiyonel)</label>
                                <input type="text" id="jobTitle" name="jobTitle" value="${escapeHtml(formData.jobTitle || '')}" placeholder="Örn: Software Developer">
                            </div>
                        </div>

                        <div class="btn-group">
                            <a href="/login" class="btn btn-outline">Giriş Sayfası</a>
                            <button type="submit" class="btn btn-primary" style="flex:1;">Hesabı Oluştur (Kayıt Ol) &rarr;</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'Kayıt Ol',
            activePath: '/register',
            bodyHtml,
            currentUser
        });
    }

    // 2. LOGIN PAGE (/login)
    static renderLoginPage({ errorMessage = null, successMessage = null, email = '', nextPath = '', currentUser = null } = {}) {
        const alertError = errorMessage
            ? `<div class="alert alert-danger"><strong>Giriş Başarısız:</strong> ${escapeHtml(errorMessage)}</div>`
            : '';
        const alertSuccess = successMessage
            ? `<div class="alert alert-success">${escapeHtml(successMessage)}</div>`
            : '';
        const hiddenNextInput = nextPath
            ? `<input type="hidden" name="next" value="${escapeHtml(nextPath)}">`
            : '';

        const activeSessionBanner = currentUser ? `
            <div class="alert alert-success" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <strong>Oturum Açık:</strong> ${escapeHtml(currentUser.name)}
                    <span class="tag-square tag-navy" style="margin-left:6px;">${escapeHtml(currentUser.role)}</span>
                </div>
                <div class="action-row">
                    <a href="/profile" class="btn btn-primary btn-sm">Profilim &rarr;</a>
                    ${currentUser.role === 'admin' ? '<a href="/admin" class="btn btn-gold btn-sm">Admin Paneli Aç &rarr;</a>' : ''}
                    <form action="/logout" method="POST" style="display:inline;">
                        <button type="submit" class="btn btn-danger btn-sm">Çıkış Yap</button>
                    </form>
                </div>
            </div>
        ` : '';

        const bodyHtml = `
            <div class="focused-wrap" style="max-width:560px;">
                <div class="focused-card">
                    <span class="kicker">Authentication · Oturum Aç</span>
                    <h1>Hesabınıza Giriş Yapın</h1>
                    <p style="font-family:var(--font-editorial); font-size:18px; color:var(--color-muted); margin:0 0 24px 0;">
                        Kayıtlı e-posta adresiniz ve şifrenizle giriş yaparak JWT oturumunuzu başlatın.
                    </p>

                    ${activeSessionBanner}
                    ${alertError}
                    ${alertSuccess}

                    <form action="/login" method="POST">
                        ${hiddenNextInput}
                        <div class="form-group">
                            <label for="email">E-posta Adresi *</label>
                            <input type="email" id="email" name="email" value="${escapeHtml(email)}" placeholder="Örn: adnan@example.com" required>
                        </div>

                        <div class="form-group">
                            <label for="password">Şifre *</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required>
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary btn-block">Giriş Yap &rarr;</button>
                        </div>
                    </form>

                    <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--color-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:13px;">
                        <span class="td-muted">Henüz hesabınız yok mu?</span>
                        <a href="/register" style="color:var(--color-gold-nav); font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Yeni Kayıt Oluştur &rarr;</a>
                    </div>

                    <div style="margin-top:20px; padding:14px 16px; background:var(--color-ivory); border:1px solid var(--color-border); font-size:12px; color:var(--color-muted);">
                        <strong style="color:var(--color-navy); display:block; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.06em;">Test Hesapları (Şifre: <code>123456</code>)</strong>
                        <div>• Admin: <code>adnan@example.com</code></div>
                        <div>• Mezun (Alumni): <code>cagri@example.com</code></div>
                    </div>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'Giriş Yap',
            activePath: '/login',
            bodyHtml,
            currentUser
        });
    }

    // 3. LOGOUT PAGE (/logout)
    static renderLogoutPage({ userName = null } = {}) {
        const greeting = userName
            ? `Görüşmek üzere ${escapeHtml(userName)}! Oturumunuz güvenle kapatıldı ve token iptal edildi.`
            : 'Oturumunuz güvenle kapatıldı ve tarayıcı çerezi temizlendi.';

        const bodyHtml = `
            <div class="focused-wrap" style="max-width:540px;">
                <div class="focused-card" style="text-align:center;">
                    <span class="kicker">Authentication · Çıkış Yapıldı</span>
                    <h1>Oturumunuz Sonlandırıldı</h1>
                    <p style="font-family:var(--font-editorial); font-size:18px; color:var(--color-muted); margin:0 0 28px 0;">
                        ${greeting}
                    </p>
                    <div class="btn-group" style="justify-content:center;">
                        <a href="/login" class="btn btn-primary btn-sm">Tekrar Giriş Yap</a>
                        <a href="/" class="btn btn-outline btn-sm">&larr; Ana Sayfaya Dön</a>
                    </div>
                </div>
            </div>
        `;

        return renderLayout({
            title: 'Çıkış Yapıldı',
            activePath: '/logout',
            bodyHtml,
            currentUser: null
        });
    }
}

module.exports = AuthViews;
