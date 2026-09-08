<script>
	import { site } from '$lib/config/site.js';
	import Arrow from './Arrow.svelte';
	import { reachGoal } from '$lib/goals.js';

	let { compact = false, source = 'Форма на сайте' } = $props();

	/* Способы связи: метка, подсказка к полю и как подписать в заявке. */
	const channels = [
		{ id: 'phone', label: 'Телефон', hint: '+7 ···', type: 'tel' },
		{ id: 'telegram', label: 'Telegram', hint: '@username или номер', type: 'text' },
		{ id: 'whatsapp', label: 'WhatsApp', hint: '+7 ···', type: 'tel' },
		{ id: 'max', label: 'MAX', hint: 'номер или ссылка', type: 'text' }
	];

	let name = $state('');
	let channel = $state('phone');
	let contact = $state('');
	let url = $state('');
	let comment = $state('');
	let agree = $state(false);
	let status = $state('idle'); // idle | sending | ok | error

	const cur = $derived(channels.find((c) => c.id === channel));

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
						body: JSON.stringify({ name, channel: cur.label, contact, url, comment, source, text: message() })
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
					required
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

		<label class="check">
			<input type="checkbox" bind:checked={agree} required />
			<span>
				Согласен с <a href="/politika-konfidencialnosti/">политикой обработки персональных данных</a>
			</span>
		</label>

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
