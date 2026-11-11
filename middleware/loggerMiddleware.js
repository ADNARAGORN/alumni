// middleware/loggerMiddleware.js
// Görevi: Sunucuya gelen her isteği (method, route, status code, süre) terminale loglamak,
// ayrıca hata durumlarını (4xx / 5xx) kalıcı olarak logs/error.logs dosyasına kaydetmek.

const { appendErrorLog } = require('./fileLogger');

const loggerMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false }); // Örn: 10:20:30

    // Yanıt istemciye gönderilip bittiğinde (res finish) logu terminale yazdırıyoruz.
    // Böylece controller'ın ürettiği gerçek durum kodunu (200, 201, 404 vb.) ve tam süreyi yakalarız.
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${time} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);

        // Eğer yanıt hata içeriyorsa (4xx veya 5xx) ve errorGuardian tarafından zaten detaylı loglanmadıysa
        // logs/error.logs dosyasına da ek olarak kaydet
        const alreadyLogged = res.locals && res.locals.errorLoggedToFile;
        if (res.statusCode >= 400 && !alreadyLogged) {
            const reasonSuffix = res.locals && res.locals.errorReason ? ` | Reason: ${res.locals.errorReason}` : '';
            appendErrorLog(`[HTTP ${res.statusCode}] ${req.method} ${req.originalUrl} (${duration}ms)${reasonSuffix}`);
        }
    });

    // İsteğin durmaması ve rotalara/controller'lara geçmesi için mutlaka next() çağırılır.
    next();
};

module.exports = loggerMiddleware;
