// middleware/notFoundMiddleware.js
// 404 Guardian Middleware:
// - 404 hatalarını yakalar ve "Not Found" kelimesini tekrar etmek yerine gerçek sebebi (yanlış metot, eksik :id, yazım hatası vb.) açıklar.
// - Tarayıcı (HTML) üzerinden gelen geçersiz istekleri genel /404 sayfasına yönlendirir.
// - Postman / API isteklerine gerekçeli 404 JSON yanıtı döner.

const { sendErrorResponse, wantsHtmlResponse } = require('./errorResponseHelper');

function buildNotFoundReason(req) {
    const method = req.method;
    const url = req.originalUrl.split('?')[0];

    // 1. Yaygın yazım / yapı hataları ve nested rota ipuçları
    if (method === 'POST' && (url === '/api/jobs' || url === '/api/jobs/')) {
        return "İş ilanı oluşturmak için '/api/jobs' yerine kullanıcıya bağlı nested rota olan 'POST /api/users/:id/jobs' kullanılmalıdır.";
    }
    if ((method === 'PUT' || method === 'PATCH' || method === 'DELETE') &&
        /^\/api\/(users|announcements|jobs|applications)\/?$/.test(url)) {
        return `'${method} ${url}' isteğinde kayıt ID'si eksik. Güncelleme/silme için sonuna ':id' eklemelisiniz (Örn: ${method} ${url.replace(/\/$/, '')}/1).`;
    }
    if (url === '/api/health' && method !== 'GET') {
        return `'${url}' rotası sunucuda var ancak '${method}' metodunu desteklemiyor; yalnızca 'GET' isteği kabul edilir.`;
    }
    if (url === '/api/user' || url === '/api/job' || url === '/api/announcement' || url === '/api/application') {
        return `Yazım hatası olabilir: Tekil '${url}' yerine çoğul olan '${url}s' adresini kullanmalısınız.`;
    }
    if (url === '/user' || url === '/job' || url === '/announcement' || url === '/application') {
        return `Yazım hatası olabilir: '${url}' yerine '${url}s' sayfasına gitmelisiniz.`;
    }

    // 2. Genel API 404 gerekçesi
    if (url.startsWith('/api')) {
        return `'${method} ${url}' rotası tanımlı API uç noktalarından hiçbiriyle eşleşmedi (Geçersiz yol veya bu adres için desteklenmeyen HTTP metodu). Dokümantasyon: /api/swagger`;
    }

    // 3. Genel Web Sayfası 404 gerekçesi (rastgele URL vb.)
    return `Girilen '${url}' adresi sunucuda kayıtlı bir sayfaya veya statik dosyaya karşılık gelmiyor (URL hatalı yazılmış veya sayfa mevcut değil). Geçerli sayfalar: /, /users, /jobs, /announcements, /applications, /about.`;
}

const notFoundGuardian = (req, res, next) => {
    const reason = buildNotFoundReason(req);

    // Web tarayıcısından gelen geçersiz sayfa isteklerini generic /404 sayfasına yönlendir
    if (wantsHtmlResponse(req) && req.path !== '/404') {
        const query = `path=${encodeURIComponent(req.originalUrl)}&reason=${encodeURIComponent(reason)}`;
        return res.redirect(`/404?${query}`);
    }

    return sendErrorResponse(req, res, {
        statusCode: 404,
        error: 'Not Found',
        htmlTitle: "Ooops! This page can't be found!",
        reason
    });
};

module.exports = notFoundGuardian;
