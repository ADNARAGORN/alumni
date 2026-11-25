// public/js/dynamic-nav.js
// Rol bazlı dinamik navigasyon ve oturum durumunu sunucudaki tek kaynaktan (/api/auth/navigation) senkronize eder.

(async function syncDynamicNavigation() {
    const navEl = document.querySelector('header.navbar nav.nav-links');
    const authSlot = document.getElementById('nav-auth-slot');

    try {
        const res = await fetch('/api/auth/navigation', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        // 1. Üst menü linklerini kullanıcı rolüne göre dinamik oluştur (XSS-safe DOM API)
        if (navEl && Array.isArray(data.navItems)) {
            const currentPath = window.location.pathname;
            navEl.textContent = '';

            data.navItems.forEach(item => {
                const a = document.createElement('a');
                a.href = item.href;
                a.textContent = item.label;
                if (currentPath === item.href) {
                    a.className = 'active';
                }
                navEl.appendChild(a);
            });
        }

        // 2. Sağ üst oturum alanını güncelle
        if (authSlot) {
            authSlot.textContent = '';

            if (data.user) {
                const badge = document.createElement('a');
                badge.href = '/profile';
                badge.title = 'Profilime Git';
                badge.className = data.user.role === 'admin' ? 'tag-square tag-gold' : 'tag-square tag-navy';
                badge.textContent = `${data.user.name} · ${data.user.role || 'user'}`;

                const form = document.createElement('form');
                form.action = '/logout';
                form.method = 'POST';
                form.style.display = 'inline';

                const btn = document.createElement('button');
                btn.type = 'submit';
                btn.className = 'btn btn-outline btn-sm';
                btn.textContent = 'Çıkış Yap';

                form.appendChild(btn);
                authSlot.append(badge, form);
            } else {
                const loginLink = document.createElement('a');
                loginLink.href = '/login';
                loginLink.className = 'btn btn-outline btn-sm';
                loginLink.textContent = 'Giriş Yap';

                const regLink = document.createElement('a');
                regLink.href = '/register';
                regLink.className = 'btn btn-primary btn-sm';
                regLink.textContent = 'Kayıt Ol';

                authSlot.append(loginLink, regLink);
            }
        }
    } catch (_) {
        // Ağ hatası durumunda sunucunun gönderdiği mevcut menü korunur
    }
})();
