// utils/passwordHelper.js
// Node.js yerleşik crypto.scryptSync ile güvenli, tuzlanmış (salted) şifre hashleme ve doğrulama yardımcısı

const crypto = require('crypto');

function hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(String(plainPassword), salt, 64).toString('hex');
    return `${salt}:${derivedKey}`;
}

function verifyPassword(plainPassword, storedHash) {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, keyHex] = storedHash.split(':');
    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedBuffer = crypto.scryptSync(String(plainPassword), salt, 64);
    if (keyBuffer.length !== derivedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

module.exports = {
    hashPassword,
    verifyPassword
};
