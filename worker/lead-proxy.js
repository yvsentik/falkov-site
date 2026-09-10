/* Cloudflare Worker: приём заявок с falkov-marketing.ru.
   1) проверяет токен Yandex SmartCaptcha на стороне сервера;
   2) отправляет заявку в Telegram — токен бота живёт только здесь, в секретах воркера.
   Секреты: SMARTCAPTCHA_SECRET, TG_TOKEN, TG_CHAT_ID. */

const ALLOWED = ['https://falkov-marketing.ru', 'https://www.falkov-marketing.ru', 'http://localhost:5177'];

function cors(origin) {
	return {
		'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};
}

const json = (data, status, origin) =>
	new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });

export default {
	async fetch(req, env) {
		const origin = req.headers.get('Origin') || '';
		if (req.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
		if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405, origin);
		if (!ALLOWED.includes(origin)) return json({ ok: false, error: 'origin' }, 403, origin);

		let body;
		try {
			body = await req.json();
		} catch {
			return json({ ok: false, error: 'json' }, 400, origin);
		}
		const { token, text } = body || {};
		if (!token || !text || String(text).length > 3000) return json({ ok: false, error: 'input' }, 400, origin);

		// проверка капчи
		const ip = req.headers.get('CF-Connecting-IP') || '';
		const check = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ secret: env.SMARTCAPTCHA_SECRET, token, ip })
		}).then((r) => r.json()).catch(() => ({ status: 'error' }));
		if (check.status !== 'ok') return json({ ok: false, error: 'captcha' }, 403, origin);

		// отправка в Telegram
		const tg = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text: String(text), disable_web_page_preview: true })
		});
		return json({ ok: tg.ok }, tg.ok ? 200 : 502, origin);
	}
};
