/* Cloudflare Worker: ретранслятор заявок в Telegram.
   Из России workers.dev не открывается, а из Yandex Cloud не открывается api.telegram.org,
   поэтому цепочка такая: сайт → Yandex Cloud Function (проверка капчи) → этот воркер → Telegram.
   Воркер принимает только запросы с ключом X-Relay-Key, который знает функция.
   Секреты: RELAY_KEY, TG_TOKEN, TG_CHAT_ID. */

const json = (data, status) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export default {
	async fetch(req, env) {
		if (req.method === 'GET') return json({ ok: true, relay: true }, 200); // проверка связи
		if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
		if (!env.RELAY_KEY || req.headers.get('X-Relay-Key') !== env.RELAY_KEY) return json({ ok: false, error: 'key' }, 403);

		let body;
		try {
			body = await req.json();
		} catch {
			return json({ ok: false, error: 'json' }, 400);
		}
		const text = String(body?.text || '');
		if (!text || text.length > 3000) return json({ ok: false, error: 'input' }, 400);

		const tg = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text, disable_web_page_preview: true })
		});
		return json({ ok: tg.ok }, tg.ok ? 200 : 502);
	}
};
