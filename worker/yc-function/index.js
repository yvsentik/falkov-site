/* Yandex Cloud Function: приём заявок с falkov-marketing.ru.
   1) проверяет токен Yandex SmartCaptcha на стороне сервера;
   2) передаёт заявку в Cloudflare Worker (worker/lead-proxy.js), он отправляет в Telegram:
      из Yandex Cloud api.telegram.org не открывается.
   Переменные окружения: SMARTCAPTCHA_SECRET, RELAY_URL, RELAY_KEY. Node.js 22, точка входа index.handler. */

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

	// проверка связи с ретранслятором: GET ?ping=1
	if (event.httpMethod === 'GET' && event.queryStringParameters?.ping) {
		const r = await fetch(process.env.RELAY_URL, { signal: AbortSignal.timeout(5000) })
			.then((x) => x.status)
			.catch((e) => 'ERR ' + e.message);
		return reply(200, { relay: r }, origin);
	}

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
		body: new URLSearchParams({ secret: process.env.SMARTCAPTCHA_SECRET, token, ip }),
		signal: AbortSignal.timeout(4000)
	})
		.then((r) => r.json())
		.catch(() => ({ status: 'error' }));
	if (check.status !== 'ok') return reply(403, { ok: false, error: 'captcha' }, origin);

	// передача в ретранслятор → Telegram
	const relay = await fetch(process.env.RELAY_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Relay-Key': process.env.RELAY_KEY },
		body: JSON.stringify({ text: String(text) }),
		signal: AbortSignal.timeout(6000)
	}).catch(() => null);
	const ok = Boolean(relay?.ok);
	return reply(ok ? 200 : 502, { ok }, origin);
};
