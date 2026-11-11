// middleware/errorResponseHelper.js
// 404 Guardian ve 5xx Guardian için ortak, tutarlı JSON / HTML hata yanıtı yardımcısı

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function wantsHtmlResponse(req) {
    const acceptHeader = (req.headers && req.headers.accept) || '';
    const url = req.originalUrl || '';
    return !url.startsWith('/api') && acceptHeader.includes('text/html');
}

function renderErrorHtml({ statusCode, title, reason }) {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${statusCode} - ${escapeHtml(title)}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f8fafc; color: #0f172a;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; margin: 0; padding: 20px;
        }
        .card {
            max-width: 520px; width: 100%; background: #ffffff;
            padding: 36px; border-radius: 14px; text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
        }
        .code { font-size: 56px; font-weight: 800; color: #ef4444; margin: 0; }
        h1 { font-size: 22px; margin: 8px 0 14px 0; }
        .reason {
            background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;
            padding: 12px 16px; border-radius: 8px; font-size: 14px;
            margin: 18px 0 24px 0; word-break: break-word;
        }
        a {
            display: inline-block; background: #2563eb; color: #ffffff;
            text-decoration: none; padding: 10px 20px; border-radius: 8px;
            font-weight: 600; font-size: 14px;
        }
        a:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="card">
        <p class="code">${statusCode}</p>
        <h1>${escapeHtml(title)}</h1>
        <div class="reason">
            <strong>Reason:</strong> ${escapeHtml(reason)}
        </div>
        <a href="/">⬅ Ana Sayfaya Dön</a>
    </div>
</body>
</html>
    `;
}

function sendErrorResponse(req, res, { statusCode, error, reason, htmlTitle }) {
    if (res.locals) {
        res.locals.errorReason = reason;
    }

    if (wantsHtmlResponse(req)) {
        return res.status(statusCode).send(renderErrorHtml({
            statusCode,
            title: htmlTitle || error,
            reason
        }));
    }

    return res.status(statusCode).json({
        status: statusCode,
        error,
        reason,
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    sendErrorResponse,
    wantsHtmlResponse
};
