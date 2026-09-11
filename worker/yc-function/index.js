/* Yandex Cloud Function: приём заявок с falkov-marketing.ru (замена Cloudflare Worker –
   workers.dev из России не открывается).
   1) проверяет токен Yandex SmartCaptcha на стороне сервера;
   2) отправляет заявку в Telegram – токен бота живёт только в переменных функции.
   Переменные окружения: SMARTCAPTCHA_SECRET, TG_TOKEN, TG_CHAT_ID. Среда: Node.js 18+, точка входа index.handler. */

const ALLOWED = ['https://falkov-marketing.ru', 'https://www.falkov-marketing.ru', 'http://localhost:5177'];

const cors = (origin) => ({
	'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
});

const reply = (statusCode, data, origin) => ({
	statusCode,
	headers: { 'Content-Type': 'application/json', ...cors(origin) },
	body: JSON.stringify(data)
});

module.exports.handler = async (event) => {
	const h = event.headers || {};
	const origin = h.Origin || h.origin || '';
	if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(origin), body: '' };
	if (event.httpMethod !== 'POST') return reply(405, { ok: false, error: 'method' }, origin);
	if (!ALLOWED.includes(origin)) return reply(403, { ok: false, error: 'origin' }, origin);

	let body;
	try {
		const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
		body = JSON.parse(raw);
	} catch {
		return reply(400, { ok: false, error: 'json' }, origin);
	}
	const { token, text } = body || {};
	if (!token || !text || String(text).length > 3000) return reply(400, { ok: false, error: 'input' }, origin);

	// проверка капчи
	const ip = (h['X-Forwarded-For'] || h['x-forwarded-for'] || '').split(',')[0].trim();
	const check = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ secret: process.env.SMARTCAPTCHA_SECRET, token, ip })
	})
		.then((r) => r.json())
		.catch(() => ({ status: 'error' }));
	if (check.status !== 'ok') return reply(403, { ok: false, error: 'captcha' }, origin);

	// отправка в Telegram
	const tg = await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text: String(text), disable_web_page_preview: true })
	});
	return reply(tg.ok ? 200 : 502, { ok: tg.ok }, origin);
};
