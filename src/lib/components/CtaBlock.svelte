<script>
	import { site } from '$lib/config/site.js';
	import ContactForm from './ContactForm.svelte';
	import { reveal } from '$lib/actions.js';

	let {
		title = 'Разберём ваш сайт и покажем точки роста',
		text = 'Пришлём короткий разбор: что мешает расти сейчас, какой спрос вы не закрываете и с чего начинать. Бесплатно, без обязательств и без звонков «просто узнать, актуально ли».',
		source = 'CTA'
	} = $props();
</script>

<section class="section cta">
	<div class="container">
	<div class="cta__inner">
		<div use:reveal>
			<span class="eyebrow">Первый шаг</span>
			<h2>{title}</h2>
			<p class="lead">{text}</p>
			<ul class="cta__list">
				<li>Разбор технического состояния и структуры</li>
				<li>Оценка непокрытого спроса в вашей нише по СПб</li>
				<li>Сравнение с тремя конкурентами из ТОП-10</li>
				<li>План первых шагов с приоритетами</li>
			</ul>
			<div class="cta__direct">
				<a href="tel:{site.phoneHref}">{site.phone}</a>
				<a href={site.telegram} target="_blank" rel="noopener">{site.telegramLabel}</a>
			</div>
		</div>
		<div class="cta__form" use:reveal={{ delay: 100 }}>
			<ContactForm {source} />
		</div>
	</div>
	</div>
</section>

<style>
	.cta :global(h2) {
		color: var(--on-dark);
	}
	.cta :global(.lead),
	.cta :global(.muted),
	.cta :global(.eyebrow) {
		color: var(--on-dark-2);
	}
	.cta :global(label > span) {
		color: var(--on-dark-2);
	}
	.cta :global(input[type='text']),
	.cta :global(textarea) {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.18);
		color: var(--on-dark);
	}
	.cta :global(.check) {
		color: var(--on-dark-2);
	}
	.cta {
		padding-block: clamp(20px, 3vw, 40px);
	}
	.cta__inner {
		background: var(--dark);
		color: var(--on-dark);
		border-radius: 28px;
		padding: clamp(32px, 5vw, 72px) clamp(22px, 4vw, 60px);
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(32px, 6vw, 88px);
		align-items: start;
	}
	h2 {
		margin: 18px 0 20px;
		max-width: 14em;
	}
	.lead {
		max-width: 34em;
	}
	.cta__list {
		list-style: none;
		margin: 30px 0 0;
		padding: 0;
		display: grid;
		gap: 12px;
		font-size: 15.5px;
		color: var(--on-dark);
	}
	.cta__list li {
		padding-left: 22px;
		position: relative;
	}
	.cta__list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		width: 8px;
		height: 1px;
		background: var(--gold);
	}
	.cta__direct {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: 34px;
		font-size: 17px;
	}
	.cta__direct a {
		color: var(--on-dark);
		border-bottom: 1px solid var(--gold);
		padding-bottom: 3px;
	}
	@media (hover: hover) and (pointer: fine) {
		.cta__direct a:hover {
			color: var(--gold);
		}
	}
	.cta__form {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: var(--radius-lg);
		padding: clamp(22px, 3vw, 36px);
	}
	@media (max-width: 900px) {
		.cta__inner {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
