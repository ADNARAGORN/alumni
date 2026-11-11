// middleware/fileLogger.js
// Görevi: Hata loglarını (4xx / 5xx ve stack trace) kalıcı olarak logs/error.logs dosyasına yazmak.

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const errorLogPath = path.join(logsDir, 'error.logs');

function formatTimestamp(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
}

function appendErrorLog(entry) {
    try {
        ensureLogsDir();
        const line = `[${formatTimestamp()}] ${entry}\n`;
        fs.appendFileSync(errorLogPath, line, 'utf8');
    } catch (fsErr) {
        // Dosya yazma hatası sunucuyu çökertmemeli
        console.error('Log dosyasına yazılamadı:', fsErr.message);
    }
}

module.exports = {
    appendErrorLog,
    errorLogPath
};
