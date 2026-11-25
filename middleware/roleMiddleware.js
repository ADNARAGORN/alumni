// middleware/roleMiddleware.js
// Yetkilendirme (Authorization / RBAC) Middleware'i — 403 Forbidden
// Sorumluluk: Kimliği doğrulanmış (req.user mevcut) kullanıcının rolünün veya kaynak sahipliğinin
// ilgili işlem için yeterli olup olmadığını denetler.

const { renderLayout, escapeHtml } = require('../views/layoutHelper');

function isApiRequest(req) {
    const url = req.originalUrl || req.url || '';
    const accept = (req.headers && req.headers.accept) ? req.headers.accept : '';
    const contentType = (req.headers && req.headers['content-type']) ? req.headers['content-type'] : '';

    return (
        url.startsWith('/api') ||
        (accept.includes('application/json') && !accept.includes('text/html')) ||
        contentType.includes('application/json')
    );
}

function sendForbidden(req, res, reason, requiredRoles = null) {
    if (isApiRequest(req)) {
        return res.status(403).json({
            status: 403,
            error: 'Forbidden',
            reason,
            currentRole: req.user ? req.user.role : null,
            ...(requiredRoles ? { requiredRoles } : {})
        });
    }

    const roleMeta = requiredRoles
        ? `<div class="detail-row"><span class="detail-label">Gerekli Roller</span><span class="detail-value">${escapeHtml(requiredRoles.join(', '))}</span></div>`
        : '';

    const bodyHtml = `
        <div class="focused-wrap" style="max-width:580px;">
            <div class="focused-card" style="text-align:center;">
                <span class="kicker">HTTP 403 · Forbidden</span>
                <p style="font-family:var(--font-display); font-size:64px; font-weight:700; color:var(--color-gold); margin:6px 0 0 0; line-height:1;">403</p>
                <h1>Bu İşlem İçin Yetkiniz Yok</h1>
                <p style="font-family:var(--font-editorial); font-size:18px; color:var(--color-muted); margin:0 0 24px 0;">
                    Oturumunuz açık ancak hesabınızın rolü veya sahiplik yetkisi bu işlemi gerçekleştirmek için yeterli değil.
                </p>

                <div class="alert alert-danger" style="text-align:left;">
                    <strong>Gerekçe:</strong> ${escapeHtml(reason)}
                </div>

                <div style="text-align:left; margin:20px 0;">
                    <div class="detail-row">
                        <span class="detail-label">Mevcut Hesap</span>
                        <span class="detail-value">${escapeHtml(req.user ? `${req.user.name} (${req.user.role})` : 'Bilinmiyor')}</span>
                    </div>
                    ${roleMeta}
                </div>

                <div class="btn-group" style="justify-content:center;">
                    <a href="/" class="btn btn-primary btn-sm">&larr; Ana Sayfaya Dön</a>
                    <a href="/jobs" class="btn btn-outline btn-sm">İş İlanları</a>
                    <a href="/users" class="btn btn-outline btn-sm">Mezunlar</a>
                </div>
            </div>
        </div>
    `;

    const html = renderLayout({
        title: '403 Yetkisiz İşlem',
        bodyHtml,
        currentUser: req.user || null
    });

    return res.status(403).send(html);
}

/**
 * Rol tabanlı erişim kontrolü (RBAC)
 * Örn: router.post('/announcements', requireAuth, requireRole('admin'), controller.create)
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            if (isApiRequest(req)) {
                return res.status(401).json({
                    status: 401,
                    error: 'Unauthorized',
                    reason: 'Bu işlem için önce giriş yapmanız gerekmektedir.'
                });
            }
            return res.redirect('/login?error=' + encodeURIComponent('Bu işlem için önce giriş yapmanız gerekmektedir.'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            const reason = `Bu işlem için yetkiniz bulunmuyor. İzin verilen roller: [${allowedRoles.join(', ')}], mevcut rolünüz: '${req.user.role}'.`;
            return sendForbidden(req, res, reason, allowedRoles);
        }

        return next();
    };
}

/**
 * Kaynak sahipliği kontrolü (Owner veya Admin)
 * Admin tüm kaynaklara erişebilir; diğer roller yalnızca kendilerine ait kaynakta işlem yapabilir.
 * Kaynak henüz bulunamadıysa (ownerId === null/undefined), controller'ın 404 dönmesi için isteği geçirir.
 */
function requireOwnerOrAdmin(getOwnerId, options = {}) {
    return (req, res, next) => {
        if (!req.user) {
            if (isApiRequest(req)) {
                return res.status(401).json({
                    status: 401,
                    error: 'Unauthorized',
                    reason: 'Bu işlem için önce giriş yapmanız gerekmektedir.'
                });
            }
            return res.redirect('/login?error=' + encodeURIComponent('Bu işlem için önce giriş yapmanız gerekmektedir.'));
        }

        // Admin her zaman tam yetkilidir
        if (req.user.role === 'admin') {
            return next();
        }

        // Admin olmayan kullanıcı profil güncellerken kendi rolünü değiştirmeye çalışırsa engelle (Privilege Escalation koruması)
        if (options.preventRoleChange && req.body && req.body.role !== undefined && req.body.role !== req.user.role) {
            return sendForbidden(
                req,
                res,
                'Rol değiştirme işlemi yalnızca sistem yöneticisi (admin) tarafından yapılabilir.',
                ['admin']
            );
        }

        const ownerId = getOwnerId(req);

        // Kaynak yoksa 404 dönülmesi için controller'a bırak
        if (ownerId === null || ownerId === undefined) {
            return next();
        }

        if (Number(ownerId) !== Number(req.user.id)) {
            return sendForbidden(
                req,
                res,
                'Bu kaynak üzerinde yalnızca kaynak sahibi veya sistem yöneticisi (admin) işlem yapabilir.'
            );
        }

        return next();
    };
}

module.exports = {
    requireRole,
    requireOwnerOrAdmin
};
