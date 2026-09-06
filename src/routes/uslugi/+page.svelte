<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { services } from '$lib/data/services/index.js';
	import { categories } from '$lib/data/categories.js';
	import { directions } from '$lib/data/directions.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Услуги', href: '/uslugi/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), {
		'@type': 'CollectionPage',
		name: 'Услуги SEO-агентства в Санкт-Петербурге',
		url: '/uslugi/',
		hasPart: services.map((s) => ({ '@type': 'Service', name: s.h1, url: `/uslugi/${s.slug}/` }))
	});
</script>

<Seo
	title="Услуги маркетингового агентства в Санкт-Петербурге — SEO, Директ, Telegram Ads"
	description="Три направления работы агентства «Фальков» в СПб: SEO-продвижение сайтов, Яндекс Директ с оплатой из прибыли и Telegram Ads. Внутри — 50 посадочных под ниши, типы сайтов и CMS."
	path="/uslugi/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<div class="head">
			<div>
				<h1>Услуги маркетингового агентства в Санкт-Петербурге</h1>
				<p class="lead">
					Работа делится на три направления: SEO, Яндекс Директ и Telegram Ads. Можно взять одно,
					можно отдать маркетинг целиком — ниже подробно про каждое и все {services.length} посадочных,
					из которых собирается работа под конкретный проект.
				</p>
			</div>
			<div class="head__nav">
				<span class="eyebrow">Разделы SEO</span>
				<ul>
					{#each categories as c}
						<li><a href="#{c.slug}">{c.title}</a></li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Главная разбивка: три направления работы агентства -->
<section class="section section--tight">
	<div class="container">
		<div class="dirs">
			{#each directions as d, i}
				<a class="dirs__i" href={d.href} use:reveal={{ delay: i * 80 }}>
					<span class="dirs__n">{d.n}</span>
					<span class="dirs__t">{d.title}</span>
					<span class="dirs__s">{d.short}</span>
					<span class="dirs__lead">{d.lead}</span>
					<ul class="dirs__list">
						{#each d.bullets as b}<li>{b}</li>{/each}
					</ul>
					<span class="dirs__m"><b>{d.metric.v}</b><i>{d.metric.l}</i></span>
					<span class="dirs__go">Подробнее <Arrow /></span>
				</a>
			{/each}
		</div>
	</div>
</section>

{#each categories as c, ci}
	<section class="section section--tight" class:section--alt={ci % 2 === 1} id={c.slug}>
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Направление {ci + 1}</span>
					<h2>{c.title}</h2>
				</div>
				<div>
					<p class="lead">{c.lead}</p>
				</div>
			</div>
			<div class="grid grid-3">
				{#each services.filter((s) => s.cat === c.slug) as s, i}
					<div use:reveal={{ delay: (i % 3) * 50 }}>
						<ServiceCard service={s} />
					</div>
				{/each}
			</div>
		</div>
	</section>
{/each}

<section class="section section--tight">
	<div class="container">
		<div class="prose" use:reveal>
			<h2>Как выбрать услугу</h2>
			<p>
				Если вы не знаете, с чего начать, начните с <a href="/uslugi/seo-audit-sajta/">аудита</a>: он
				показывает, что мешает сайту расти и какие работы дадут наибольший эффект на вашем проекте.
				По итогам аудита мы собираем формат работы под задачу — иногда это полный цикл, а иногда
				достаточно закрыть один участок.
			</p>
			<p>
				Если сайт уже получает органический трафик и задача — не потерять позиции, подойдёт
				<a href="/uslugi/seo-abonentskoe-soprovozhdenie/">абонентское сопровождение</a>. Если у вас
				есть своя команда и не хватает стратегии — <a href="/uslugi/seo-konsalting/">консалтинг</a>.
				Если нужен результат без вашего участия в процессе —
				<a href="/uslugi/seo-pod-klyuch/">SEO под ключ</a>.
			</p>
			<p>
				Не уверены, какой формат подходит? Напишите нам — разберём ситуацию и скажем прямо, что
				нужно вашему проекту, даже если это не наша услуга.
			</p>
		</div>
	</div>
</section>

<CtaBlock source="Каталог услуг" />

<style>
	/* три направления верхнего уровня */
	.dirs {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(12px, 1.4vw, 20px);
	}
	.dirs__i {
		display: grid;
		align-content: start;
		gap: 8px;
		padding: clamp(22px, 2.4vw, 32px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
		transition: transform 0.5s var(--ease), border-color 0.4s var(--ease),
			box-shadow 0.5s var(--ease);
	}
	.dirs__i:hover {
		transform: translateY(-5px);
		border-color: var(--ink-3);
		box-shadow: 0 30px 60px -40px rgba(0, 0, 0, 0.45);
	}
	.dirs__n {
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
	}
	.dirs__t {
		font-size: clamp(24px, 2.6vw, 34px);
		letter-spacing: -0.03em;
		line-height: 1.05;
	}
	.dirs__s {
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.dirs__lead {
		margin-top: 6px;
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	.dirs__list {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	.dirs__list li {
		position: relative;
		padding-left: 18px;
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.45;
	}
	.dirs__list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 8px;
		height: 1px;
		background: var(--ink-3);
	}
	.dirs__m {
		display: grid;
		gap: 2px;
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--line-soft);
	}
	.dirs__m b {
		font-size: 22px;
		font-weight: 400;
		letter-spacing: -0.02em;
	}
	.dirs__m i {
		font-style: normal;
		font-size: 11.5px;
		color: var(--ink-3);
	}
	.dirs__go {
		margin-top: 12px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	@media (max-width: 900px) {
		.dirs {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.head {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
		gap: clamp(28px, 5vw, 72px);
		margin-top: clamp(24px, 3vw, 40px);
		align-items: start;
	}
	h1 {
		max-width: 14em;
		margin-bottom: 26px;
	}
	.lead {
		max-width: 34em;
	}
	.head__nav ul {
		list-style: none;
		margin: 18px 0 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.head__nav li {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 13px 0;
		border-bottom: 1px solid var(--line);
		font-size: 15px;
	}
	.head__nav li span {
		color: var(--ink-3);
		font-size: 13px;
	}
	.head__nav a:hover {
		color: var(--gold);
	}
	@media (max-width: 900px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
