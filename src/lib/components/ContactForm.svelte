<script>
	import { site } from '$lib/config/site.js';
	import Arrow from './Arrow.svelte';

	let { compact = false, source = 'Форма на сайте' } = $props();

	let name = $state('');
	let contact = $state('');
	let url = $state('');
	let comment = $state('');
	let agree = $state(false);
	let status = $state('idle'); // idle | sending | ok | fallback | error

	async function submit(event) {
		event.preventDefault();
		if (!agree) return;
		if (!site.formEndpoint) {
			status = 'fallback';
			return;
		}
		status = 'sending';
		try {
			const res = await fetch(site.formEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, contact, url, comment, source })
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
			<h3>Заявка отправлена</h3>
			<p>Свяжемся в течение рабочего дня. Если вопрос срочный — пишите в Telegram: <a href={site.telegram}>{site.telegramLabel}</a>.</p>
		</div>
	{:else}
		<div class="form__grid">
			<label>
				<span>Имя</span>
				<input type="text" bind:value={name} required autocomplete="name" placeholder="Как к вам обращаться" />
			</label>
			<label>
				<span>Телефон или Telegram</span>
				<input type="text" bind:value={contact} required placeholder="+7 ··· или @username" />
			</label>
			<label class="full">
				<span>Сайт</span>
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

		{#if status === 'fallback'}
			<p class="form__note">
				Форма ещё не подключена к обработчику. Напишите нам напрямую:
				<a href={site.telegram}>{site.telegramLabel}</a> · <a href="mailto:{site.email}">{site.email}</a>
			</p>
		{/if}
		{#if status === 'error'}
			<p class="form__note">
				Не удалось отправить. Напишите в Telegram: <a href={site.telegram}>{site.telegramLabel}</a>
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
	label {
		display: grid;
		gap: 7px;
	}
	label > span {
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	input[type='text'],
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
	input[type='text']:focus,
	textarea:focus {
		border-color: var(--gold);
		outline: none;
	}
	textarea {
		resize: vertical;
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
		accent-color: var(--gold);
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
	}
	@media (max-width: 620px) {
		.form__grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	:global(.section--dark) label > span {
		color: var(--on-dark-2);
	}
	:global(.section--dark) input[type='text'],
	:global(.section--dark) textarea {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.18);
		color: var(--on-dark);
	}
	:global(.section--dark) .check {
		color: var(--on-dark-2);
	}
	:global(.section--dark) .form__done p,
	:global(.section--dark) .form__note {
		color: var(--on-dark-2);
	}
</style>
