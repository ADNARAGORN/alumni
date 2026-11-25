// utils/tokenHelper.js
// Standart HS256 JWT üretimi, doğrulaması, cookie ayrıştırma ve logout sonrası token iptali (revocation)

const crypto = require('crypto');

const COOKIE_NAME = 'alumni_token';
const DEFAULT_TTL_SECONDS = 2 * 60 * 60; // 2 saat

// Logout yapılmış token'ların tekrar kullanılmasını engelleyen iptal listesi
const revokedTokens = new Set();

function getSecret() {
    return process.env.JWT_SECRET || 'alumni_fallback_dev_secret_2026';
}

function base64UrlEncode(input) {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    return Buffer.from(padded, 'base64').toString('utf8');
}

function signToken(payload, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const body = {
        ...payload,
        iat: now,
        exp: now + ttlSeconds
    };

    const headerPart = base64UrlEncode(JSON.stringify(header));
    const payloadPart = base64UrlEncode(JSON.stringify(body));
    const signingInput = `${headerPart}.${payloadPart}`;
    const signature = base64UrlEncode(
        crypto.createHmac('sha256', getSecret()).update(signingInput).digest()
    );

    return `${signingInput}.${signature}`;
}

function verifyToken(token) {
    if (!token || typeof token !== 'string') {
        return { valid: false, reason: 'Token bulunamadı.' };
    }

    if (revokedTokens.has(token)) {
        return { valid: false, reason: 'Oturum sonlandırılmış (logout yapılmış token).' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        return { valid: false, reason: 'Token formatı geçersiz.' };
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    const expectedSig = base64UrlEncode(
        crypto.createHmac('sha256', getSecret()).update(`${headerPart}.${payloadPart}`).digest()
    );

    const sigBuf = Buffer.from(signaturePart);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return { valid: false, reason: 'Token imzası geçersiz (değiştirilmiş veya sahte token).' };
    }

    try {
        const payload = JSON.parse(base64UrlDecode(payloadPart));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return { valid: false, reason: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.' };
        }
        return { valid: true, payload };
    } catch {
        return { valid: false, reason: 'Token içeriği okunamadı.' };
    }
}

function revokeToken(token) {
    if (token && typeof token === 'string') {
        revokedTokens.add(token);
    }
}

function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader || typeof cookieHeader !== 'string') return cookies;
    cookieHeader.split(';').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx === -1) return;
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        cookies[key] = decodeURIComponent(val);
    });
    return cookies;
}

function extractToken(req) {
    // 1. Öncelik: Authorization: Bearer <token> header'ı (Postman / API)
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }

    // 2. Öncelik: HttpOnly Cookie (Web Tarayıcısı)
    const cookies = parseCookies(req.headers && req.headers.cookie);
    if (cookies[COOKIE_NAME]) {
        return cookies[COOKIE_NAME];
    }

    return null;
}

function setAuthCookie(res, token) {
    res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${DEFAULT_TTL_SECONDS}`
    );
}

function clearAuthCookie(res) {
    res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
    );
}

module.exports = {
    COOKIE_NAME,
    signToken,
    verifyToken,
    revokeToken,
    extractToken,
    setAuthCookie,
    clearAuthCookie
};
