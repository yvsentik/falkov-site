<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { serviceBySlug } from '$lib/data/services/index.js';
	import { graph, orgSchema, breadcrumbSchema, faqSchema, serviceSchema } from '$lib/seo.js';

	let { data } = $props();
	const s = $derived(data.service);
	const cat = $derived(data.category);

	const path = $derived(`/uslugi/${s.slug}/`);
	const crumbs = $derived([
		{ title: 'Главная', href: '/' },
		{ title: 'Услуги', href: '/uslugi/' },
		{ title: s.h1, href: path }
	]);
	const schema = $derived(
		graph(orgSchema(), breadcrumbSchema(crumbs), faqSchema(s.faq), serviceSchema(s))
	);
</script>

<Seo title={s.title} description={s.description} {path} {schema} />

<article>
	<!-- Шапка услуги -->
	<header class="shead">
		<div class="container">
			<Breadcrumbs items={crumbs} />
			<div class="shead__grid">
				<div>
					<h1>{s.h1}</h1>
					<p class="lead shead__lead">{s.lead}</p>
					<div class="shead__actions">
						<a class="btn" href="/kontakty/">Обсудить проект <Arrow /></a>
						<a class="btn btn--ghost" href="/uslugi/seo-audit-sajta/">Начать с аудита</a>
					</div>
				</div>
				<aside class="shead__card">
					<div class="shead__price">
						<span class="eyebrow">Стоимость</span>
						<b>{s.price.from}</b>
						<span class="shead__term">{s.price.term}</span>
						<p>{s.price.note}</p>
					</div>
					<div class="shead__results">
						{#each s.results as r}
							<div>
								<b>{r.v}</b>
								<span>{r.l}</span>
							</div>
						{/each}
					</div>
				</aside>
			</div>
		</div>
	</header>

	<!-- Вводный текст -->
	<section class="section section--tight">
		<div class="container intro">
			<div class="intro__title" use:reveal>
				<span class="eyebrow">О услуге</span>
				<h2>Что это и зачем</h2>
			</div>
			<div class="prose" use:reveal={{ delay: 80 }}>
				{#each s.intro as p}
					<p>{p}</p>
				{/each}
			</div>
		</div>
	</section>

	<!-- Проблемы -->
	<section class="section section--alt">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Когда нужно</span>
					<h2>С какими ситуациями к нам приходят</h2>
				</div>
				<div>
					<p class="lead">
						Если узнали свой случай хотя бы в одном пункте – эта услуга решает вашу задачу.
					</p>
				</div>
			</div>
			<div class="grid grid-2">
				{#each s.pains as p, i}
					<div class="pain" use:reveal={{ delay: (i % 2) * 70 }}>
						<h3>{p.t}</h3>
						<p>{p.d}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Состав работ -->
	<section class="section">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Состав</span>
					<h2>Что входит в работу</h2>
				</div>
				<div>
					<p class="lead">
						Конкретный набор под ваш проект утверждается после аудита – здесь базовый состав,
						который входит в услугу по умолчанию.
					</p>
				</div>
			</div>
			<div class="grid grid-3">
				{#each s.includes as item, i}
					<div class="card inc" use:reveal={{ delay: (i % 3) * 60 }}>
						<span class="inc__n">{String(i + 1).padStart(2, '0')}</span>
						<h3>{item.t}</h3>
						<p>{item.d}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Этапы -->
	<section class="section section--dark">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Процесс</span>
					<h2>Как идёт работа</h2>
				</div>
				<div>
					<p class="lead">
						Каждый этап заканчивается результатом, который можно посмотреть и принять, – а не
						строчкой в отчёте.
					</p>
				</div>
			</div>
			<ol class="stages">
				{#each s.stages as st, i}
					<li use:reveal={{ delay: (i % 3) * 60 }}>
						<span class="stages__n">{String(i + 1).padStart(2, '0')}</span>
						<div>
							<h3>{st.t}</h3>
							<p>{st.d}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section">
		<div class="container faq-wrap">
			<div use:reveal>
				<span class="eyebrow">Вопросы</span>
				<h2 style="margin-top:18px">Что спрашивают об этой услуге</h2>
			</div>
			<div use:reveal={{ delay: 80 }}>
				<Faq items={s.faq} title="" />
			</div>
		</div>
	</section>

	<!-- Связанные услуги -->
	{#if data.related.length}
		<section class="section section--alt section--tight">
			<div class="container">
				<div class="section-head" use:reveal>
					<div class="section-head__title">
						<span class="eyebrow">Смотрите также</span>
						<h2>Часто берут вместе</h2>
					</div>
					<div>
						<p class="lead">
							Эти работы дополняют друг друга: результат от каждой выше, когда они идут в связке.
						</p>
					</div>
				</div>
				<div class="grid grid-3">
					{#each data.related as r, i}
						<div use:reveal={{ delay: (i % 3) * 60 }}>
							<ServiceCard service={serviceBySlug[r.slug]} />
						</div>
					{/each}
				</div>
				<div class="more" use:reveal>
					<a class="link-arrow" href="/uslugi/">Все услуги агентства <Arrow /></a>
				</div>
			</div>
		</section>
	{/if}
</article>

<CtaBlock source={s.h1} title="Обсудим ваш проект" />

<style>
	.shead {
		padding-block: clamp(24px, 3vw, 40px) clamp(36px, 5vw, 64px);
	}
	.shead__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
		gap: clamp(28px, 5vw, 72px);
		align-items: start;
		margin-top: clamp(24px, 3vw, 40px);
	}
	h1 {
		max-width: 15em;
	}
	.shead__lead {
		margin-top: 24px;
		max-width: 32em;
	}
	.shead__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 32px;
	}
	.shead__card {
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: var(--radius-lg);
		padding: clamp(24px, 2.6vw, 32px);
	}
	.shead__price b {
		display: block;
		font-size: clamp(32px, 3.4vw, 44px);
		font-weight: 500;
		letter-spacing: -0.04em;
		margin-top: 14px;
	}
	.shead__term {
		font-size: 14px;
		color: var(--ink-3);
	}
	.shead__price p {
		margin: 16px 0 0;
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.shead__results {
		display: grid;
		gap: 16px;
		margin-top: 26px;
		padding-top: 24px;
		border-top: 1px solid var(--line-soft);
	}
	.shead__results b {
		font-size: 20px;
		font-weight: 500;
		margin-right: 10px;
	}
	.shead__results span {
		font-size: 14px;
		color: var(--ink-3);
	}

	.intro {
		display: grid;
		grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr);
		gap: clamp(24px, 5vw, 72px);
		align-items: start;
	}

	.pain {
		padding-top: 24px;
		border-top: 1px solid var(--line);
	}
	.pain h3 {
		font-size: clamp(19px, 1.7vw, 23px);
		margin-bottom: 12px;
	}
	.pain p {
		color: var(--ink-2);
		font-size: 15.5px;
		margin: 0;
		max-width: 34em;
	}

	.inc {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.inc__n {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--gold);
	}
	.inc h3 {
		font-size: 18px;
	}
	.inc p {
		font-size: 14.5px;
		color: var(--ink-2);
		margin: 0;
		line-height: 1.55;
	}

	.stages {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
	}
	.stages li {
		display: grid;
		grid-template-columns: 60px minmax(0, 1fr);
		gap: clamp(14px, 2vw, 32px);
		padding: clamp(20px, 2.4vw, 30px) 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.16);
	}
	.stages__n {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--gold);
		padding-top: 6px;
	}
	.stages h3 {
		margin-bottom: 8px;
	}
	.stages p {
		color: var(--on-dark-2);
		font-size: 15.5px;
		margin: 0;
		max-width: 46em;
	}

	.faq-wrap {
		display: grid;
		grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
		gap: clamp(28px, 5vw, 80px);
		align-items: start;
	}
	.more {
		margin-top: clamp(26px, 3vw, 40px);
	}

	@media (max-width: 1000px) {
		.shead__grid,
		.intro,
		.faq-wrap {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
