// middleware/attachUserMiddleware.js
// İstekle gelen JWT (Authorization: Bearer veya HttpOnly Cookie) geçerliyse req.user ve res.locals.currentUser bilgisini yükler.

const { extractToken, verifyToken } = require('../utils/tokenHelper');
const UserModel = require('../models/userModel');

const attachUserMiddleware = (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        req.user = null;
        if (res.locals) res.locals.currentUser = null;
        return next();
    }

    const result = verifyToken(token);
    if (!result.valid) {
        req.user = null;
        req.authError = result.reason;
        if (res.locals) res.locals.currentUser = null;
        return next();
    }

    // Kullanıcının hâlâ sistemde mevcut olduğunu doğrula
    const user = UserModel.findById(result.payload.id);
    if (!user) {
        req.user = null;
        req.authError = 'Token sahibi kullanıcı artık sistemde bulunmuyor.';
        if (res.locals) res.locals.currentUser = null;
        return next();
    }

    req.user = user;
    req.token = token;
    if (res.locals) res.locals.currentUser = user;
    return next();
};

module.exports = attachUserMiddleware;
