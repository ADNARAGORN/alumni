// middleware/errorResponseHelper.js
// 404 Guardian ve 5xx Guardian için ortak, tutarlı JSON / HTML hata yanıtı yardımcısı (brand.md + DESIGN.md)

const { renderLayout, escapeHtml } = require('../views/layoutHelper');

function wantsHtmlResponse(req) {
    const acceptHeader = (req.headers && req.headers.accept) || '';
    const url = req.originalUrl || '';
    return !url.startsWith('/api') && acceptHeader.includes('text/html');
}

function renderErrorHtml({ statusCode, title, reason }) {
    const bodyHtml = `
        <div class="focused-wrap">
            <div class="focused-card" style="text-align:center;">
                <span class="kicker">HTTP ${escapeHtml(statusCode)}</span>
                <p style="font-family:var(--font-display); font-size:72px; font-weight:700; color:var(--color-gold); margin:6px 0 0 0; line-height:1;">${escapeHtml(statusCode)}</p>
                <h1>${escapeHtml(title)}</h1>
                <div class="alert alert-danger" style="text-align:left; word-break:break-word;">
                    <strong>Sebep / Reason:</strong> ${escapeHtml(reason)}
                </div>
                <div class="btn-group" style="justify-content:center;">
                    <a href="/" class="btn btn-primary btn-sm">&larr; Ana Sayfaya Dön</a>
                </div>
            </div>
        </div>
    `;

    return renderLayout({
        title: `${statusCode} · ${title}`,
        bodyHtml
    });
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
