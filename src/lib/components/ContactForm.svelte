<script>
	import { site } from '$lib/config/site.js';
	import Arrow from './Arrow.svelte';
	import { reachGoal } from '$lib/goals.js';

	let { compact = false, source = 'Форма на сайте' } = $props();

	/* Способы связи: метка, подсказка к полю и как подписать в заявке. */
	const channels = [
		{ id: 'phone', label: 'Телефон', hint: '+7 (999) 123-45-67', type: 'tel' },
		{ id: 'telegram', label: 'Telegram', hint: '@username или номер', type: 'text' },
		{ id: 'whatsapp', label: 'WhatsApp', hint: '+7 (999) 123-45-67', type: 'tel' },
		{ id: 'max', label: 'MAX', hint: 'номер или ссылка', type: 'text' }
	];

	let name = $state('');
	let channel = $state('phone');
	let contact = $state('');
	let url = $state('');
	let comment = $state('');
	let agree = $state(false);
	let status = $state('idle'); // idle | sending | ok | error

	/* Антиспам без внешних сервисов: скрытое поле-ловушка (люди его не видят,
	   боты заполняют) и слишком быстрая отправка. t0 ставится при гидрации в браузере. */
	let hp = $state('');
	const t0 = Date.now();

	/* SmartCaptcha: галочка «Я не робот» появляется после первого нажатия «Отправить»,
	   после проверки заявка уходит сама. Без formEndpoint токен на сервере не проверяется –
	   капча только отсекает простых ботов в браузере. */
	const useCaptcha = Boolean(site.captcha?.sitekey);
	let showCaptcha = $state(false);
	let captchaReady = $state(false); // iframe виджета загрузился – прячем крутилку
	let captchaEl = $state();
	let captchaToken = $state('');
	let widgetId = null;

	/* скрипт капчи грузим сразу при открытии формы, чтобы галочка после «Отправить» появлялась без паузы */
	$effect(() => {
		if (!useCaptcha || document.querySelector('script[data-smartcaptcha]')) return;
		const s = document.createElement('script');
		s.src = 'https://smartcaptcha.yandexcloud.net/captcha.js';
		s.defer = true;
		s.dataset.smartcaptcha = '1';
		document.head.appendChild(s);
	});

	$effect(() => {
		if (!useCaptcha || !showCaptcha || !captchaEl) return;
		const mount = () => {
			widgetId = window.smartCaptcha.render(captchaEl, {
				sitekey: site.captcha.sitekey,
				hl: 'ru',
				callback: (t) => {
					captchaToken = t;
					send();
				}
			});
			const ready = () => (captchaReady = true);
			const frame = captchaEl.querySelector('iframe');
			if (frame) frame.addEventListener('load', ready, { once: true });
			setTimeout(ready, 4000); // запасной вариант, если load не пришёл
		};
		if (window.smartCaptcha) return mount();
		let s = document.querySelector('script[data-smartcaptcha]');
		if (!s) {
			s = document.createElement('script');
			s.src = 'https://smartcaptcha.yandexcloud.net/captcha.js';
			s.defer = true;
			s.dataset.smartcaptcha = '1';
			document.head.appendChild(s);
		}
		s.addEventListener('load', mount, { once: true });
	});

	const cur = $derived(channels.find((c) => c.id === channel));

	/* Маска телефона: +7 (999) 123-45-67. Префикс «+7» отрезаем как код страны,
	   ведущую 8/7 убираем, только если цифр набралось 11 (8 999 …), – так 812 для СПб
	   не ломается. Скобку ставим только после 4-й цифры, чтобы Backspace не застревал. */
	function formatPhone(v) {
		const raw = v.trim();
		let d = (raw.startsWith('+7') ? raw.slice(2) : raw).replace(/\D/g, '');
		if (d.length > 10 && /^[78]/.test(d)) d = d.slice(1);
		d = d.slice(0, 10);
		if (!d) return '+7 (';
		let out = '+7 (' + d.slice(0, 3);
		if (d.length > 3) out += ') ' + d.slice(3, 6);
		if (d.length > 6) out += '-' + d.slice(6, 8);
		if (d.length > 8) out += '-' + d.slice(8, 10);
		return out;
	}
	function onContactInput(e) {
		if (cur.type !== 'tel') return;
		contact = formatPhone(e.currentTarget.value);
	}
	function onContactFocus() {
		if (cur.type === 'tel' && !contact) contact = '+7 (';
	}

	/* Текст заявки одинаковый для бэкенда и для чата с менеджером. */
	function message() {
		return [
			`Заявка с сайта (${source})`,
			`Имя: ${name.trim()}`,
			`Связь: ${cur.label} – ${contact.trim()}`,
			url.trim() && `Сайт: ${url.trim()}`,
			comment.trim() && `Задача: ${comment.trim()}`
		]
			.filter(Boolean)
			.join('\n');
	}

	async function submit(event) {
		event.preventDefault();
		if (!agree) return;
		// бот: показываем «успех», ничего не отправляем и цель не считаем
		if (hp || Date.now() - t0 < 2500) {
			status = 'ok';
			return;
		}
		if (useCaptcha && !captchaToken) {
			// показываем галочку; после проверки callback сам вызовет send()
			showCaptcha = true;
			status = 'captcha';
			return;
		}
		send();
	}

	async function send() {
		reachGoal('lead_submit', { channel: cur.label, source });

		const bot = site.telegramBot;
		const auto = Boolean((bot?.token && bot?.chatId) || site.formEndpoint);

		/* Ни бота, ни бэкенда: открываем чат с менеджером, текст уже набран –
		   человеку остаётся нажать «отправить». */
		if (!auto) {
			const href = `${site.manager}?text=${encodeURIComponent(message())}`;
			window.open(href, '_blank', 'noopener');
			status = 'ok';
			return;
		}

		status = 'sending';
		try {
			const res = site.formEndpoint
				? await fetch(site.formEndpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ token: captchaToken, text: message() })
					})
				: await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ chat_id: bot.chatId, text: message(), disable_web_page_preview: true })
					});
			status = res.ok ? 'ok' : 'error';
		} catch {
			status = 'error';
		}
		if (status === 'error' && useCaptcha && widgetId !== null) {
			window.smartCaptcha?.reset(widgetId);
			captchaToken = '';
		}
	}
</script>

<form class="form" class:compact onsubmit={submit}>
	{#if status === 'ok'}
		<div class="form__done">
			<h3>Заявка готова</h3>
			<p>
				{#if site.formEndpoint || (site.telegramBot?.token && site.telegramBot?.chatId)}
					Заявка у менеджера, свяжемся в течение рабочего дня. Если срочно – пишите напрямую:
					<a href={site.manager} target="_blank" rel="noopener">{site.managerLabel}</a>.
				{:else}
					Открыли чат с менеджером {site.managerName} – текст заявки уже в поле, осталось нажать
					«отправить». Если чат не открылся, напишите напрямую:
					<a href={site.manager} target="_blank" rel="noopener">{site.managerLabel}</a>.
				{/if}
			</p>
		</div>
	{:else}
		<div class="form__grid">
			<label class="full">
				<span>Имя</span>
				<input type="text" bind:value={name} required autocomplete="name" placeholder="Как к вам обращаться" />
			</label>

			<div class="field full">
				<span class="field__label">Как связаться</span>
				<div class="seg" role="radiogroup" aria-label="Способ связи">
					{#each channels as c}
						<label class="seg__i" class:on={channel === c.id}>
							<input type="radio" name="channel" value={c.id} bind:group={channel} />
							{c.label}
						</label>
					{/each}
				</div>
			</div>

			<label class="full">
				<span>{cur.label}</span>
				<input
					type={cur.type}
					bind:value={contact}
					oninput={onContactInput}
					onfocus={onContactFocus}
					required
					inputmode={cur.type === 'tel' ? 'tel' : 'text'}
					pattern={cur.type === 'tel' ? '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}' : undefined}
					title={cur.type === 'tel' ? 'Номер из 10 цифр после +7' : undefined}
					autocomplete={channel === 'telegram' || channel === 'max' ? 'off' : 'tel'}
					placeholder={cur.hint}
				/>
			</label>

			<label class="full">
				<span>Сайт <i>необязательно</i></span>
				<input type="text" bind:value={url} placeholder="example.ru" />
			</label>

			{#if !compact}
				<label class="full">
					<span>Задача</span>
					<textarea rows="3" bind:value={comment} placeholder="Коротко о проекте и о том, что нужно"></textarea>
				</label>
			{/if}
		</div>

		<label class="hp" aria-hidden="true">
			Не заполняйте это поле
			<input type="text" name="company_site" tabindex="-1" autocomplete="off" bind:value={hp} />
		</label>

		<label class="check">
			<input type="checkbox" bind:checked={agree} required />
			<span>
				Согласен с <a href="/politika-konfidencialnosti/">политикой обработки персональных данных</a>
			</span>
		</label>

		{#if status === 'captcha'}
			<p class="form__note">Подтвердите, что вы не робот, и заявка уйдёт сама.</p>
		{/if}
		{#if useCaptcha && showCaptcha}
			<div class="captcha-wrap">
				{#if !captchaReady}
					<div class="captcha-load" aria-hidden="true"><span class="captcha-spin"></span>Загружаем проверку…</div>
				{/if}
				<div class="captcha" bind:this={captchaEl}></div>
			</div>
		{/if}

		<button class="btn btn--wide" type="submit" disabled={status === 'sending'}>
			{status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
			<Arrow />
		</button>

		{#if status === 'error'}
			<p class="form__note">
				Не удалось отправить. Напишите менеджеру:
				<a href={site.manager} target="_blank" rel="noopener">{site.managerLabel}</a>
			</p>
		{/if}
	{/if}
</form>

<style>
	.form__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		margin-bottom: 18px;
	}
	.full {
		grid-column: 1 / -1;
	}
	label,
	.field {
		display: grid;
		gap: 7px;
		align-content: start;
	}
	.form__grid label > span,
	.field__label {
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.form__grid label > span i {
		font-style: normal;
		text-transform: none;
		letter-spacing: 0;
		margin-left: 6px;
		opacity: 0.7;
	}
	input[type='text'],
	input[type='tel'],
	textarea {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--card);
		font: inherit;
		font-size: 16px;
		color: var(--ink);
		transition: border-color 0.25s var(--ease);
	}
	input:focus,
	textarea:focus {
		border-color: var(--gold);
		outline: none;
	}
	textarea {
		resize: vertical;
	}
	/* сегментированный выбор способа связи */
	.seg {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 4px;
		padding: 4px;
		border: 1px solid var(--line);
		border-radius: 100px;
		background: var(--card);
	}
	.seg__i {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 9px 10px;
		border-radius: 100px;
		font-size: 13px;
		white-space: nowrap;
		cursor: pointer;
		color: var(--ink-2);
		transition: background 0.25s var(--ease), color 0.25s var(--ease);
	}
	.seg__i.on {
		background: var(--ink);
		color: #fff;
	}
	/* радио скрыто, но остаётся внутри своей плашки и фокусируемо с клавиатуры */
	.seg__i input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
	.seg__i:focus-within {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	/* появляется после первого «Отправить» */
	.captcha-wrap {
		position: relative;
		min-height: 102px;
		margin-bottom: 16px;
	}
	.captcha-load {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 12px;
		font-size: 13px;
		color: rgba(0, 0, 0, 0.55);
	}
	.captcha-spin {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(0, 0, 0, 0.15);
		border-top-color: rgba(0, 0, 0, 0.7);
		border-radius: 50%;
		animation: captcha-spin 0.8s linear infinite;
	}
	@keyframes captcha-spin {
		to {
			transform: rotate(360deg);
		}
	}
	.captcha {
		position: relative;
		z-index: 1;
		min-height: 102px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.check {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		margin-bottom: 18px;
		font-size: 13.5px;
		color: var(--ink-3);
		line-height: 1.45;
	}
	.check input {
		margin-top: 3px;
		accent-color: var(--ink);
		width: 16px;
		height: 16px;
		flex: none;
	}
	.check a {
		border-bottom: 1px solid var(--line);
	}
	.form__note {
		margin-top: 14px;
		font-size: 14px;
		color: var(--ink-2);
	}
	.form__note a,
	.form__done a {
		border-bottom: 1px solid var(--gold);
	}
	.form__done h3 {
		margin-bottom: 10px;
	}
	.form__done p {
		color: var(--ink-2);
		line-height: 1.55;
	}
	@media (max-width: 620px) {
		.form__grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.seg {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			border-radius: 18px;
		}
		.seg__i {
			border-radius: 12px;
		}
	}
	:global(.section--dark) .form__grid label > span,
	:global(.section--dark) .field__label {
		color: var(--on-dark-2);
	}
	:global(.section--dark) input[type='text'],
	:global(.section--dark) input[type='tel'],
	:global(.section--dark) textarea,
	:global(.section--dark) .seg {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.18);
		color: var(--on-dark);
	}
	:global(.section--dark) .seg__i.on {
		background: #fff;
		color: var(--dark);
	}
	:global(.section--dark) .check,
	:global(.section--dark) .form__done p,
	:global(.section--dark) .form__note {
		color: var(--on-dark-2);
	}
</style>
