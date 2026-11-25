// middleware/authMiddleware.js
// Kimlik Doğrulama (Authentication) Guard Middleware'i
// Sorumluluk: Yalnızca "Bu kullanıcı geçerli bir oturuma (JWT / Cookie) sahip mi?" sorusunu kontrol eder.
// Rol / yetki (403 Forbidden) kontrolü yapmaz — o ayrı bir Role/Authorization middleware'inin sorumluluğudur.

const { extractToken, verifyToken } = require('../utils/tokenHelper');
const UserModel = require('../models/userModel');

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

function getSafeNextPath(req) {
    if (req.method !== 'GET') return '';
    const url = req.originalUrl || req.url || '';
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/login') && !url.startsWith('/logout')) {
        return url;
    }
    return '';
}

const requireAuth = (req, res, next) => {
    // Eğer attachUserMiddleware daha önce çalışmadıysa (örn. izole router testleri), token'ı burada da doğrula
    if (!req.user) {
        const token = extractToken(req);
        if (token && !req.authError) {
            const result = verifyToken(token);
            if (result.valid) {
                const user = UserModel.findById(result.payload.id);
                if (user) {
                    req.user = user;
                    req.token = token;
                    if (res.locals) res.locals.currentUser = user;
                } else {
                    req.authError = 'Token sahibi kullanıcı artık sistemde bulunmuyor.';
                }
            } else {
                req.authError = result.reason;
            }
        }
    }

    // Kullanıcı doğrulanmışsa isteğe izin ver
    if (req.user) {
        return next();
    }

    const reason = req.authError || 'Bu işlem için giriş yapmanız gerekmektedir. (Geçerli Bearer Token veya oturum çerezi bulunamadı.)';

    // API isteğiyse 401 Unauthorized JSON dön
    if (isApiRequest(req)) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            reason
        });
    }

    // Web tarayıcı isteğiyse /login sayfasına uyarı mesajıyla yönlendir
    const params = new URLSearchParams();
    params.set('error', reason);
    const nextPath = getSafeNextPath(req);
    if (nextPath) {
        params.set('next', nextPath);
    }

    return res.redirect('/login?' + params.toString());
};

module.exports = requireAuth;
