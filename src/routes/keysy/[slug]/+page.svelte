<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Rankings from '$lib/components/Rankings.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site } from '$lib/config/site.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	let { data } = $props();
	const c = $derived(data.item);
	const path = $derived(`/keysy/${c.slug}/`);
	const crumbs = $derived([
		{ title: 'Главная', href: '/' },
		{ title: 'Кейсы', href: '/keysy/' },
		{ title: c.client, href: path }
	]);
	const schema = $derived(
		graph(orgSchema(), breadcrumbSchema(crumbs), {
			'@type': 'Article',
			headline: `Кейс: ${c.client}`,
			description: c.short,
			author: { '@id': '#organization' },
			publisher: { '@id': '#organization' }
		})
	);
</script>

<Seo
	title="Кейс: {c.client} – {c.industry}, {c.region} | агентство {site.name}"
	description="{c.short} Исходные данные, состав работ и результаты в цифрах{c.rank
		? ', позиции можно проверить в поиске самостоятельно'
		: ''}."
	{path}
	{schema}
	ogType="article"
/>

<article>
	<header class="chead" style="--cover: {c.cover}">
		<div class="container">
			<Breadcrumbs items={crumbs} />
			<div class="chead__grid">
				<div class="chead__l">
					<span class="chead__industry">{c.industry}</span>
					<h1>{c.site ?? c.client}</h1>
					{#if c.site}
						<p class="chead__client">{c.client} · {c.region}</p>
						<a class="chead__site" href={c.siteUrl} target="_blank" rel="noopener nofollow">
							Открыть сайт ↗
						</a>
					{/if}
					<p class="chead__lead">{c.short}</p>
				</div>

				{#if c.screenshot}
					<!-- Скриншот подан как окно браузера: сразу видно, что это сайт,
					     и он не спорит по весу с заголовком кейса. -->
					<figure class="win" use:reveal={{ delay: 80 }}>
						<span class="win__bar" aria-hidden="true">
							<span class="win__dots"><i></i><i></i><i></i></span>
							<span class="win__url">{c.site}</span>
						</span>
						<img
							src={c.screenshot}
							width="1200"
							height="833"
							alt="Главная страница сайта {c.site}"
							loading="lazy"
							decoding="async"
						/>
						<figcaption>Сайт на момент съёмки позиций</figcaption>
					</figure>
				{/if}
			</div>

			<div class="chead__metrics">
				{#each c.metrics as m}
					<div>
						<b>{m.v}</b>
						<span>{m.l}</span>
					</div>
				{/each}
			</div>
		</div>
	</header>

	<section class="section section--tight">
		<div class="container cbody">
			<div class="cbody__side">
				<span class="eyebrow">Задача</span>
			</div>
			<div class="prose" use:reveal>
				<p>{c.task}</p>
				<h2>Что мешало расти</h2>
				<ul>
					{#each c.problems as p}
						<li>{p}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<section class="section section--alt section--tight">
		<div class="container cbody">
			<div class="cbody__side">
				<span class="eyebrow">Работы</span>
			</div>
			<div use:reveal>
				<h2 style="margin-bottom:28px">Что сделали</h2>
				<ol class="works">
					{#each c.works as w, i}
						<li>
							<span>{String(i + 1).padStart(2, '0')}</span>
							<p>{w}</p>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</section>

	<section class="section section--tight">
		<div class="container cbody">
			<div class="cbody__side">
				<span class="eyebrow">Результат</span>
			</div>
			<div class="prose" use:reveal>
				<h2 style="margin-top:0">Что получилось</h2>
				<p>{c.result}</p>
				{#if data.service}
					<p>
						Услуга по этому проекту:
						<a href="/uslugi/{data.service.slug}/">{data.service.h1}</a>.
					</p>
				{/if}
			</div>
		</div>
	</section>

	{#if c.rank}
		<section class="section section--alt">
			<div class="container" use:reveal>
				{#if c.ai?.length}
					<section class="ai" use:reveal>
						<span class="eyebrow">Нейросетевая выдача</span>
						<h2>Сайт – источник быстрого ответа Алисы AI</h2>
						<p>
							Помимо классического топа, Яндекс подставляет сайт как источник в «Быстрый ответ
							Алисы AI»: описание услуги, порядок работы и цены собраны по страницам {c.site}.
							Проверяется так же руками – введите запрос и откройте вкладку «Алиса AI».
						</p>
						<ul>
							{#each c.ai as a}
								<li>
									<b>«{a.q}»</b>
									<span>{a.engine} · {a.city}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}
				<Rankings item={c} />
			</div>
		</section>
	{/if}

	<section class="section section--tight">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Ещё кейсы</span>
					<h2>Похожие проекты</h2>
				</div>
				<div>
					<a class="link-arrow" href="/keysy/">Все кейсы <Arrow /></a>
				</div>
			</div>
			<div class="grid grid-3">
				{#each data.others as o}
					<CaseCard item={o} />
				{/each}
			</div>
		</div>
	</section>
</article>

<CtaBlock source="Кейс – {c.client}" title="Посчитаем, что даст SEO вашему проекту" />

<style>
	.ai {
		margin-bottom: clamp(28px, 3.5vw, 48px);
		padding: clamp(22px, 2.6vw, 34px);
		border: 1px dashed var(--line);
		border-radius: 22px;
	}
	.ai h2 {
		margin: 8px 0 12px;
		font-size: clamp(22px, 2.4vw, 32px);
		letter-spacing: -0.025em;
	}
	.ai p {
		margin: 0 0 16px;
		max-width: 62ch;
		color: var(--ink-2);
		line-height: 1.6;
	}
	.ai ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.ai li {
		display: grid;
		gap: 2px;
		padding: 10px 16px;
		border-radius: 100px;
		background: var(--paper-2);
	}
	.ai li b {
		font-weight: 500;
	}
	.ai li span {
		font-size: 11.5px;
		color: var(--ink-3);
	}

	.chead {
		background: var(--cover);
		color: var(--on-dark);
		padding-block: clamp(28px, 4vw, 48px) clamp(34px, 4.5vw, 64px);
		border-radius: 0 0 28px 28px;
	}
	.chead__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr);
		gap: clamp(26px, 4vw, 64px);
		align-items: end;
	}
	.chead :global(.crumbs a),
	.chead :global(.crumbs .current),
	.chead :global(.crumbs) {
		color: rgba(255, 255, 255, 0.6);
	}
	.chead__industry {
		display: block;
		margin: clamp(20px, 2.4vw, 32px) 0 18px;
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
	}
	.chead h1 {
		max-width: 15em;
		color: var(--on-dark);
	}
	.chead__client {
		margin: 14px 0 0;
		font-size: 15px;
		color: rgba(255, 255, 255, 0.7);
	}
	/* окно браузера со скриншотом */
	.win {
		margin: 0;
		border-radius: 14px;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 26px 60px -34px rgba(0, 0, 0, 0.7);
	}
	.win__bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 9px 12px;
		background: #ebebeb;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}
	.win__dots {
		display: flex;
		gap: 5px;
		flex: none;
	}
	.win__dots i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.16);
	}
	.win__url {
		flex: 1;
		min-width: 0;
		padding: 3px 10px;
		border-radius: 100px;
		background: #ffffff;
		font-size: 11px;
		color: #6b6b6b;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.win img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: top center;
	}
	.win figcaption {
		padding: 9px 12px;
		background: var(--card);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.chead__site {
		display: inline-block;
		margin-top: 16px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.85);
		border-bottom: 1px solid rgba(255, 255, 255, 0.35);
		padding-bottom: 2px;
	}
	@media (hover: hover) and (pointer: fine) {
		.chead__site:hover {
			color: #fff;
			border-color: #fff;
		}
	}
	.chead__lead {
		margin-top: 22px;
		font-size: clamp(17px, 1.6vw, 21px);
		color: rgba(255, 255, 255, 0.78);
		max-width: 34em;
		line-height: 1.5;
	}
	.chead__metrics {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(28px, 5vw, 72px);
		margin-top: clamp(32px, 4vw, 52px);
		padding-top: clamp(24px, 3vw, 36px);
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}
	.chead__metrics b {
		display: block;
		font-size: clamp(30px, 3.4vw, 44px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		margin-bottom: 8px;
	}
	.chead__metrics span {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.65);
	}

	.cbody {
		display: grid;
		grid-template-columns: minmax(0, 0.35fr) minmax(0, 1.65fr);
		gap: clamp(20px, 4vw, 56px);
		align-items: start;
	}
	.works {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.works li {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 16px;
		padding: 18px 0;
		border-bottom: 1px solid var(--line);
	}
	.works span {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--gold);
		padding-top: 5px;
	}
	.works p {
		margin: 0;
		font-size: 16px;
		color: var(--ink-2);
	}
	@media (max-width: 900px) {
		.chead__grid {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
		}
		.win {
			max-width: 420px;
		}
	}
	@media (max-width: 860px) {
		.cbody {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
