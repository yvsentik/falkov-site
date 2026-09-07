/* Цели Яндекс Метрики. Имена целей создаются в кабинете как «JavaScript-событие»
   с тем же идентификатором. Если счётчик не подключён — вызовы молча ничего не делают. */
import { site } from '$lib/config/site.js';

export const GOALS = {
	tg_click: 'Клик по ссылке в Telegram (менеджер или канал)',
	max_click: 'Клик по ссылке в MAX',
	phone_click: 'Клик по номеру телефона',
	lead_open: 'Открыта форма «Оставить заявку»',
	lead_submit: 'Отправлена заявка из формы'
};

export function reachGoal(name, params) {
	const id = site.counters.yandexMetrika;
	if (!id || typeof window === 'undefined' || typeof window.ym !== 'function') return;
	window.ym(Number(id), 'reachGoal', name, params);
}

/** Одна делегированная подписка на клики по всему документу:
    любая ссылка на t.me / max.ru / tel: — цель, без правок в каждой кнопке. */
export function trackContactClicks() {
	const onClick = (e) => {
		const a = e.target.closest?.('a[href]');
		if (!a) return;
		const href = a.getAttribute('href') || '';
		if (href.startsWith('tel:')) reachGoal('phone_click', { href });
		else if (/^https?:\/\/(t\.me|telegram\.me)\//.test(href)) reachGoal('tg_click', { href });
		else if (/^https?:\/\/(www\.)?max\.ru\//.test(href)) reachGoal('max_click', { href });
	};
	document.addEventListener('click', onClick, { capture: true });
	return () => document.removeEventListener('click', onClick, { capture: true });
}
