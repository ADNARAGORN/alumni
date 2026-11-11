// middleware/errorMiddleware.js
// 5xx Guardian (Central Error-Handling Middleware)
// Görevi: Beklenmeyen tüm sunucu hatalarını (500, 502, 503, 504, 509 vb.) ve yakalanmamış hataları
// tek merkezde tutar, stack trace'i sadece sunucu terminalinde loglar ve istemciye güvenli bir gerekçe (reason) döner.

const { sendErrorResponse } = require('./errorResponseHelper');
const { appendErrorLog } = require('./fileLogger');

const SERVER_ERROR_CATALOG = {
    500: {
        error: 'Internal Server Error',
        reason: 'Sunucu tarafında beklenmeyen bir hata oluştu.'
    },
    501: {
        error: 'Not Implemented',
        reason: 'İstenen özellik veya HTTP metodu sunucu tarafından henüz uygulanmadı.'
    },
    502: {
        error: 'Bad Gateway',
        reason: 'Sunucu, bağlı olduğu harici servisten geçersiz bir yanıt aldı.'
    },
    503: {
        error: 'Service Unavailable',
        reason: 'Sunucu şu anda bakımda veya aşırı yük nedeniyle geçici olarak hizmet veremiyor.'
    },
    504: {
        error: 'Gateway Timeout',
        reason: 'Veritabanı veya bağlı servis zamanında yanıt vermedi (Zaman aşımı).'
    },
    509: {
        error: 'Bandwidth Limit Exceeded',
        reason: 'Sunucu bant genişliği limiti aşıldı.'
    }
};

// Express'in bunu "Error Middleware" olarak tanıması için 4 parametreli (err, req, res, next) olması ZORUNLUDUR.
const errorGuardian = (err, req, res, next) => {
    const markLogged = () => {
        if (res.locals) res.locals.errorLoggedToFile = true;
    };

    // 1. Eğer express.json() bozuk JSON yüzünden SyntaxError fırlattıysa 400 dön
    if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err) {
        const reason = 'Gönderilen JSON gövdesi (body) sözdizimi açısından hatalı.';
        appendErrorLog(`[HTTP 400] ${req.method} ${req.originalUrl} | Reason: ${reason}`);
        markLogged();
        return sendErrorResponse(req, res, {
            statusCode: 400,
            error: 'Bad Request',
            htmlTitle: 'Geçersiz JSON Formatı',
            reason
        });
    }

    // 2. Durum kodunu belirle (geçerli 4xx/5xx değilse varsayılan 500)
    const rawCode = Number(err.statusCode || err.status);
    const statusCode = (rawCode >= 400 && rawCode <= 599) ? rawCode : 500;

    // 3. Stack trace ASLA istemciye sızdırılmaz — terminale ve logs/error.logs dosyasına yazılır
    if (statusCode >= 500) {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        console.error(`[5xx GUARDIAN] ${time} ${req.method} ${req.originalUrl} -> ${statusCode}`);
        console.error(err.stack || err);

        const catalogEntry = SERVER_ERROR_CATALOG[statusCode] || {
            error: 'Server Error',
            reason: 'Sunucu kaynaklı bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        };
        const reason = err.publicReason || catalogEntry.reason;

        appendErrorLog(`[5xx GUARDIAN - ${statusCode}] ${req.method} ${req.originalUrl} | Reason: ${reason}\n${err.stack || err.message}`);
        markLogged();

        return sendErrorResponse(req, res, {
            statusCode,
            error: catalogEntry.error,
            htmlTitle: `${catalogEntry.error}`,
            reason
        });
    }

    // 4. next(err) ile yönlendirilmiş 4xx hataları
    const clientReason = err.message || 'İstek işlenemedi.';
    appendErrorLog(`[HTTP ${statusCode}] ${req.method} ${req.originalUrl} | Reason: ${clientReason}`);
    markLogged();

    return sendErrorResponse(req, res, {
        statusCode,
        error: err.name || 'Request Error',
        htmlTitle: err.name || 'Hatalı İstek',
        reason: clientReason
    });
};

module.exports = errorGuardian;
