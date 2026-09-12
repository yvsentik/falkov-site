<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, geo } from '$lib/config/site.js';
	import { tgProjects } from '$lib/data/directions.js';
	import { graph, orgSchema, breadcrumbSchema, faqSchema } from '$lib/seo.js';

	const path = '/uslugi/telegram-ads/';
	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Услуги', href: '/uslugi/' },
		{ title: 'Telegram Ads', href: path }
	];

	const works = [
		{ t: 'Стратегия и позиционирование', d: 'Кому и что говорим, чем канал отличается от соседних, какой пост человек должен увидеть первым после подписки.' },
		{ t: 'Закупка в Telegram Ads', d: 'Работа с официальным кабинетом: таргет по каналам и интересам, тексты объявлений, ставки, ограничения площадки.' },
		{ t: 'Посевы у каналов', d: 'Ручной отбор площадок, проверка на накрутку, переговоры, размещение и сверка результата с обещанным охватом.' },
		{ t: 'Контент канала', d: 'Реклама приводит человека, а остаётся он из-за постов. Ведём контент вместе с закупкой, одной командой.' },
		{ t: 'Воронка до заявки', d: 'Куда человек пишет, что ему отвечают, как это фиксируется. Подписчик без заявки – не результат.' },
		{ t: 'Отчётность по деньгам', d: 'Стоимость подписчика и стоимость обращения по каждому источнику: кабинет, посевы, конкретный канал.' }
	];

	const faq = [
		{
			q: 'Что значит «комплексное ведение»?',
			a: 'Мы не закупаем трафик отдельно от всего остального. По этим проектам на нашей стороне и реклама, и контент канала, и связка с сайтом: SEO, Директ и Telegram Ads ведёт одна команда с общей отчётностью. Поэтому мы отвечаем за обращение.'
		},
		{
			q: 'Можно взять только Telegram Ads?',
			a: 'Можно, но мы сразу говорим: изолированная закупка работает хуже. Если канал не ведётся или заявку некому обработать, деньги уходят в подписчиков, которые ничего не приносят.'
		},
		{
			q: 'Сколько стоит подписчик?',
			a: 'Сильно зависит от ниши: в люксе и ювелирке подписчик дороже, но и чек другой; в b2b-агро аудитория узкая, зато решение принимает конкретный человек. Цифры по вашей нише считаем на разборе, до старта.'
		},
		{
			q: 'Нужен ли бюджет в валюте?',
			a: 'Официальный кабинет Telegram Ads работает с евро и с порогом входа. Мы разбираем на старте, какой объём имеет смысл в вашей нише и что дешевле начать с посевов.'
		},
		{
			q: 'Где посмотреть результаты?',
			a: 'Каналы клиентов открыты – ссылки ниже, можно зайти и посмотреть, как они выглядят и что в них публикуется. Цифры по стоимости подписчика и обращениям показываем на разборе: это данные клиентов.'
		}
	];

	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), faqSchema(faq), {
		'@type': 'Service',
		name: 'Реклама и ведение каналов в Telegram',
		serviceType: 'Telegram Ads',
		provider: { '@id': site.url + '/#organization' },
		areaServed: geo.city,
		url: site.url + path
	});
</script>

<Seo
	title="Telegram Ads и ведение каналов – реклама в Telegram | Агентство Фальков"
	description="Реклама в Telegram Ads и комплексное ведение каналов: закупка, посевы, контент и воронка до заявки. 7 клиентских каналов на постоянном ведении – от люксовой посуды до сельхозтехники."
	{path}
	{schema}
/>

<article>
	<header class="shead">
		<div class="container">
			<Breadcrumbs items={crumbs} />
			<div class="shead__grid">
				<div>
					<span class="eyebrow">Направление 03</span>
					<h1>Telegram Ads и ведение каналов</h1>
					<p class="lead">
						Каналы ниже – наши проекты на комплексном ведении: реклама, посевы, контент и
						воронка до заявки на одной стороне. Ниши разные – от люксовой посуды и
						драгоценных камней до сельхозтехники и семеноводства.
					</p>
					<div class="shead__actions">
						<a class="btn" href={site.manager} target="_blank" rel="noopener">
							Обсудить канал <Arrow />
						</a>
						<a class="btn btn--ghost" href={site.telegramChannel} target="_blank" rel="noopener">
							Наш канал {site.telegramLabel}
						</a>
					</div>
				</div>
				<aside class="shead__card">
					<span class="eyebrow">Сейчас на ведении</span>
					<b class="big">{tgProjects.length}</b>
					<span class="big__l">клиентских каналов</span>
					<p class="note">
						Все они открыты – заходите и смотрите, как выглядит канал, который ведём мы.
						Цифры по стоимости подписчика показываем на разборе: это данные клиентов.
					</p>
				</aside>
			</div>
		</div>
	</header>

	<!-- Кому это подходит: главный аргумент направления -->
	<section class="section section--tight section--dark">
		<div class="container">
			<div class="fit">
				<div class="fit__l" use:reveal>
					<span class="eyebrow">Кому подходит</span>
					<h2>Идеально, если у вас долгий цикл сделки</h2>
					<p class="fit__lead">
						Контекст и поиск ловят человека в момент, когда он уже готов купить. Но есть ниши,
						где решение зреет неделями и месяцами: дорогой товар, сложная услуга, b2b,
						несколько согласований внутри компании. Горячего трафика там мало, и он дорогой.
					</p>
					<p class="fit__lead">
						Telegram работает иначе. Человек подписывается задолго до покупки, живёт рядом с
						вашим каналом и приходит к решению внутри него – на постах, разборах и живых
						примерах. Поэтому эту услугу можно продавать не только по горячему спросу.
					</p>
				</div>
				<div class="fit__r" use:reveal={{ delay: 100 }}>
					<span class="eyebrow">Что мы делаем</span>
					<ol class="fit__steps">
						<li>
							<b>Находим, где обитает ваша аудитория</b>
							<span>Каналы, чаты и интересы, в которых реально сидят ваши покупатели.</span>
						</li>
						<li>
							<b>Готовим канал к продвижению</b>
							<span>Упаковка, оформление, структура постов – визуально приятный канал, в который не стыдно вести платный трафик.</span>
						</li>
						<li>
							<b>Даём первые заявки</b>
							<span>Запускаем закупку и посевы и доводим человека до обращения.</span>
						</li>
						<li>
							<b>Берём всё комплексно</b>
							<span>Реклама, контент и воронка на одной стороне – за адекватные деньги, без агентской наценки за каждый чих.</span>
						</li>
					</ol>
					<a class="btn btn--light" href={site.manager} target="_blank" rel="noopener">
						Обсудить свой канал <Arrow />
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Каналы клиентов -->
	<section class="section section--tight">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Проекты</span>
					<h2>Каналы на комплексном ведении</h2>
				</div>
				<div>
					<p class="lead">
						У каждого своя аудитория и своя задача. Общее одно: подписчик должен превращаться
						в обращение, иначе это просто трафик.
					</p>
				</div>
			</div>
			<div class="chans">
				{#each tgProjects as p, i}
					<a class="chans__i" href={p.url} target="_blank" rel="noopener" use:reveal={{ delay: (i % 2) * 70 }}>
						<span class="chans__top">
							<span class="chans__n">{p.name}</span>
							<span class="chans__h">{p.handle}</span>
						</span>
						<span class="chans__niche">{p.niche}</span>
						<span class="chans__about">{p.about}</span>
						<span class="chans__task"><i>Задача</i>{p.task}</span>
						<span class="chans__go">Открыть канал <Arrow /></span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Что делаем -->
	<section class="section section--tight section--alt">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Что входит</span>
					<h2>Работы по каналу</h2>
				</div>
				<div>
					<p class="lead">
						Закупка без контента и воронки не работает, поэтому мы берём канал целиком –
						и отвечаем за обращения.
					</p>
				</div>
			</div>
			<div class="grid grid-3">
				{#each works as w, i}
					<div class="wcard" use:reveal={{ delay: (i % 3) * 60 }}>
						<h3>{w.t}</h3>
						<p>{w.d}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="section section--tight">
		<div class="container">
			<Faq items={faq} />
		</div>
	</section>

	<CtaBlock
		title="Разберём ваш канал и нишу"
		text="Посмотрим, что уже есть, где брать аудиторию и сколько будет стоить обращение. Бесплатно и до договора."
		source="Telegram Ads хаб"
	/>
</article>

<style>
	.fit {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(26px, 4vw, 70px);
		align-items: start;
	}
	.fit h2 {
		margin: 10px 0 0;
		font-size: clamp(28px, 3.6vw, 50px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.fit__lead {
		margin: clamp(16px, 1.8vw, 22px) 0 0;
		font-size: clamp(15px, 1.2vw, 17px);
		line-height: 1.65;
		color: var(--on-dark-2);
	}
	.fit__steps {
		list-style: none;
		counter-reset: fit;
		margin: 14px 0 26px;
		padding: 0;
		display: grid;
		gap: 14px;
	}
	.fit__steps li {
		counter-increment: fit;
		display: grid;
		gap: 3px;
		padding-top: 13px;
		border-top: 1px solid var(--line);
	}
	.fit__steps b {
		font-weight: 400;
		font-size: clamp(16px, 1.4vw, 19px);
		letter-spacing: -0.015em;
	}
	.fit__steps b::before {
		content: '0' counter(fit);
		margin-right: 10px;
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--on-dark-2);
	}
	.fit__steps span {
		font-size: 14px;
		line-height: 1.55;
		color: var(--on-dark-2);
	}
	@media (max-width: 900px) {
		.fit {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.shead {
		padding-block: clamp(24px, 3vw, 44px) clamp(30px, 4vw, 60px);
	}
	.shead__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.9fr);
		gap: clamp(24px, 4vw, 64px);
		align-items: start;
		margin-top: clamp(16px, 2vw, 28px);
	}
	.shead__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(20px, 2.4vw, 30px);
	}
	.shead__card {
		display: grid;
		justify-items: start;
		padding: clamp(22px, 2.4vw, 32px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
	}
	.big {
		font-size: clamp(52px, 7vw, 88px);
		font-weight: 400;
		letter-spacing: -0.05em;
		line-height: 1;
		margin-top: 10px;
	}
	.big__l {
		font-size: 13px;
		color: var(--ink-2);
	}
	.note {
		margin: 18px 0 0;
		padding-top: 14px;
		border-top: 1px solid var(--line-soft);
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	.chans {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(12px, 1.4vw, 20px);
	}
	.chans__i {
		display: grid;
		align-content: start;
		gap: 7px;
		padding: clamp(20px, 2.2vw, 30px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
		transition: transform 0.5s var(--ease), border-color 0.4s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.chans__i:hover {
			transform: translateY(-5px);
			border-color: var(--ink-3);
		}
	}
	.chans__top {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
	}
	.chans__n {
		font-size: clamp(19px, 1.8vw, 24px);
		letter-spacing: -0.025em;
	}
	.chans__h {
		font-size: 12.5px;
		color: var(--ink-3);
		overflow-wrap: anywhere;
	}
	.chans__niche {
		font-size: 10.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.chans__about {
		margin-top: 4px;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.chans__task {
		display: grid;
		gap: 3px;
		margin-top: 8px;
		padding-top: 12px;
		border-top: 1px solid var(--line-soft);
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	.chans__task i {
		font-style: normal;
		font-size: 10.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.chans__go {
		margin-top: 12px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.wcard h3 {
		font-size: 18px;
		letter-spacing: -0.01em;
		margin-bottom: 8px;
	}
	.wcard p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	@media (max-width: 1000px) {
		.shead__grid,
		.chans {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
