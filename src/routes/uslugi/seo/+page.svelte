<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, geo } from '$lib/config/site.js';
	import { services } from '$lib/data/services/index.js';
	import { categories } from '$lib/data/categories.js';
	import { cases } from '$lib/data/cases.js';
	import { rankings } from '$lib/data/rankings.js';
	import { testSteps } from '$lib/data/channel.js';
	import { graph, orgSchema, breadcrumbSchema, faqSchema } from '$lib/seo.js';

	const path = '/uslugi/seo/';
	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Услуги', href: '/uslugi/' },
		{ title: 'SEO-продвижение', href: path }
	];

	/* Всё, кроме контекста и аналитики, — это SEO. */
	const seoServices = services.filter((s) => s.slug !== 'kontekstnaya-reklama');
	const turnkey = cases.filter((c) => c.turnkey);
	const nf = new Intl.NumberFormat('ru-RU');

	/* Суммарный охват по всем проектам, позиции которых мы снимаем. */
	const totals = Object.values(rankings)
		.flat()
		.reduce(
			(a, set) => ({
				top10: a.top10 + set.top10,
				top3: a.top3 + set.top3,
				exact: a.exact + set.exactSum
			}),
			{ top10: 0, top3: 0, exact: 0 }
		);

	const works = [
		{
			t: 'Семантика и спрос',
			d: 'Собираем весь спрос ниши по региону, чистим от мусора, кластеризуем и накладываем на страницы. Там, где страниц не хватает, проектируем новые.'
		},
		{
			t: 'Техническая база',
			d: 'Индексация, дубли, скорость, Core Web Vitals, ЧПУ, мобильная версия, микроразметка. Пока техничка сломана, остальное не даёт эффекта.'
		},
		{
			t: 'Структура сайта',
			d: 'Достраиваем разделы и посадочные под кластеры, которых сейчас нет: фильтры, подуслуги, гео, бренды и модели.'
		},
		{
			t: 'Контент и мета-теги',
			d: 'Тексты под интент, а не под объём. H1, Title, Description, Schema.org, перелинковка между кластерами.'
		},
		{
			t: 'Коммерческие факторы',
			d: 'Цены, условия, доставка, контакты, отзывы, УТП. Поисковик и человек читают одно и то же: «здесь можно купить».'
		},
		{
			t: 'Внешние сигналы',
			d: 'Ссылочный профиль естественным темпом, упоминания, карточки на картах и в справочниках, работа с репутацией в выдаче.'
		}
	];

	const stages = [
		{ n: '01', t: 'Бесплатный тест', d: 'Собираем ядро, снимаем текущие позиции и показываем, что реально вытащим за первые месяцы. До договора и без обязательств.' },
		{ n: '02', t: 'Аудит и стратегия', d: 'Разбираем сайт и конкурентов в выдаче вашего города: что мешает расти прямо сейчас и в каком порядке это чинить.' },
		{ n: '03', t: 'Техника и структура', d: 'Снимаем технические ограничения и достраиваем недостающие разделы под собранные кластеры.' },
		{ n: '04', t: 'Контент и коммерция', d: 'Тексты, мета-теги, цены, условия, отзывы, формы. Страница должна отвечать на запрос лучше тех, кто выше.' },
		{ n: '05', t: 'Рост и сопровождение', d: 'Наращиваем внешний профиль, добираем новые кластеры, каждый месяц показываем позиции, трафик и обращения.' }
	];

	const faq = [
		{
			q: 'Через сколько будет результат?',
			a: 'Первые сдвиги по низкочастотным запросам видны через 6–10 недель, ощутимый рост трафика — с третьего-четвёртого месяца, выход на плановые показатели по коммерческим запросам — 8–12 месяцев. Ниши с низкой конкуренцией двигаются быстрее, медицина и юристы — медленнее.'
		},
		{
			q: 'Вы гарантируете ТОП-1?',
			a: 'Нет, и никто не может: позиции определяет алгоритм поисковой системы, а не подрядчик. Мы фиксируем плановые показатели по видимости, трафику и обращениям и отвечаем за них. Любая «гарантия ТОП-1» на рынке — это либо продвижение по мусорным запросам, либо мелкий шрифт в договоре.'
		},
		{
			q: 'Можно проверить ваши результаты самому?',
			a: 'Именно для этого мы и публикуем запросы проектов на главной: открываете поиск, выбираете указанный город и вводите запрос. Никакого доступа к нашим отчётам для этого не нужно.'
		},
		{
			q: 'Что входит в бесплатный тест?',
			a: 'Собираем семантику по вашей нише, снимаем текущие позиции сайта, показываем непокрытый спрос и прогноз по первым месяцам. По итогам вы получаете разбор и план — даже если работать дальше не будете.'
		},
		{
			q: 'Нужно ли переделывать сайт?',
			a: 'Чаще всего нет: работаем с текущим сайтом и дорабатываем его по ходу. Полная переделка нужна, если движок не даёт управлять мета-тегами и URL или сайт технически не индексируется. Об этом мы говорим сразу на тесте, до подписания договора.'
		},
		{
			q: 'Вы работаете только по Санкт-Петербургу?',
			a: 'Офис в Петербурге, но проекты ведём по всей России: среди текущих есть Москва, регионы и федеральные направления. Регион влияет на семантику и конкурентов, а не на возможность работать.'
		}
	];

	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), faqSchema(faq), {
		'@type': 'Service',
		name: 'SEO-продвижение сайтов',
		serviceType: 'Поисковое продвижение',
		provider: { '@id': site.url + '/#organization' },
		areaServed: geo.city,
		url: site.url + path,
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Услуги SEO',
			itemListElement: categories.map((c) => ({
				'@type': 'OfferCatalog',
				name: c.title,
				itemListElement: services
					.filter((s) => s.cat === c.slug && s.slug !== 'kontekstnaya-reklama')
					.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.h1 } }))
			}))
		}
	});
</script>

<Seo
	title="SEO-продвижение сайтов в Санкт-Петербурге — услуги и цены | Фальков"
	description="SEO-продвижение сайтов в СПб и по России: вывод коммерческих запросов в топ Яндекса и Google, техническая оптимизация, структура, контент, ссылки. Бесплатный тест до договора, позиции можно проверить руками."
	{path}
	{schema}
/>

<article>
	<header class="shead">
		<div class="container">
			<Breadcrumbs items={crumbs} />
			<div class="shead__grid">
				<div>
					<span class="eyebrow">Направление 01</span>
					<h1>SEO-продвижение сайтов</h1>
					<p class="lead">
						Выводим коммерческие запросы в топ Яндекса и Google и отвечаем не за строчку в отчёте,
						а за трафик и обращения. Позиции наших проектов можно проверить руками — мы для этого
						публикуем запросы, город и поисковик.
					</p>
					<div class="shead__actions">
						<a class="btn" href={site.manager} target="_blank" rel="noopener">
							Забрать бесплатный тест <Arrow />
						</a>
						<a class="btn btn--ghost" href="/keysy/">Смотреть кейсы</a>
					</div>
				</div>
				<aside class="shead__card">
					<span class="eyebrow">Сейчас на съёме</span>
					<div class="nums">
						<div><b>{nf.format(totals.top10)}</b><span>запросов в ТОП-10</span></div>
						<div><b>{nf.format(totals.top3)}</b><span>из них в ТОП-3</span></div>
						<div><b>{nf.format(totals.exact)}</b><span>суммарная точная частотность</span></div>
					</div>
					<p class="nums__note">
						Цифры по проектам на ведении под ключ. Каждый из них есть на главной — с запросами,
						городом и поисковиком.
					</p>
				</aside>
			</div>
		</div>
	</header>

	<!-- Что входит -->
	<section class="section section--tight">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Что входит</span>
					<h2>Шесть блоков работ</h2>
				</div>
				<div>
					<p class="lead">
						SEO — это не «правка тайтлов». Это шесть параллельных направлений, и результат даёт
						только их сумма: провал в одном тормозит все остальные.
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

	<!-- Этапы -->
	<section class="section section--tight section--alt">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Как идёт работа</span>
					<h2>От теста до сопровождения</h2>
				</div>
				<div>
					<p class="lead">
						Мы показываем результат до договора: сначала тест, потом обязательства. Так проще
						и вам, и нам — берём не все проекты.
					</p>
				</div>
			</div>
			<ol class="stages">
				{#each stages as st, i}
					<li use:reveal={{ delay: i * 50 }}>
						<span class="stages__n">{st.n}</span>
						<h3>{st.t}</h3>
						<p>{st.d}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- Бесплатный тест -->
	<section class="section section--tight">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">До договора</span>
					<h2>Бесплатный тест-драйв</h2>
				</div>
				<div>
					<p class="lead">
						Разбираем нишу и сайт, снимаем текущие позиции и показываем, что вытащим за первые
						месяцы. Разбор остаётся у вас в любом случае.
					</p>
				</div>
			</div>
			<div class="grid grid-3">
				{#each testSteps as t, i}
					<div class="wcard" use:reveal={{ delay: (i % 3) * 60 }}>
						<h3>{t.t}</h3>
						<p>{t.d}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Проекты -->
	<section class="section section--tight section--alt">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Проверяемо</span>
					<h2>Проекты на ведении под ключ</h2>
				</div>
				<div>
					<p class="lead">
						По каждому — свой набор запросов, город и поисковик. Откройте поиск и проверьте
						без нашего участия.
					</p>
				</div>
			</div>
			<div class="projs">
				{#each turnkey as c, i}
					<a class="projs__i" href="/keysy/{c.slug}/" use:reveal={{ delay: (i % 4) * 50 }}>
						<span class="projs__dom">{c.site}</span>
						<span class="projs__cli">{c.client}</span>
						<span class="projs__ind">{c.industry}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Все услуги SEO -->
	{#each categories as c, ci}
		{@const list = seoServices.filter((s) => s.cat === c.slug)}
		{#if list.length}
			<section class="section section--tight" id={c.slug}>
				<div class="container">
					<div class="section-head" use:reveal>
						<div class="section-head__title">
							<span class="eyebrow">Раздел {ci + 1}</span>
							<h2>{c.title}</h2>
						</div>
						<div>
							<p class="lead">{c.lead}</p>
						</div>
					</div>
					<div class="grid grid-3">
						{#each list as s, i}
							<div use:reveal={{ delay: (i % 3) * 50 }}>
								<ServiceCard service={s} />
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	{/each}

	<section class="section section--tight">
		<div class="container">
			<Faq items={faq} />
		</div>
	</section>

	<CtaBlock
		title="Покажем, что вытащим из вашей ниши"
		text="Соберём семантику, снимем текущие позиции и покажем непокрытый спрос. Бесплатно и до договора."
		source="SEO хаб"
	/>
</article>

<style>
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
		padding: clamp(22px, 2.4vw, 32px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
	}
	.nums {
		display: grid;
		gap: 14px;
		margin-top: 14px;
	}
	.nums div {
		display: grid;
		gap: 2px;
	}
	.nums b {
		font-size: clamp(26px, 3vw, 38px);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.nums span {
		font-size: 12.5px;
		color: var(--ink-3);
	}
	.nums__note {
		margin: 18px 0 0;
		padding-top: 14px;
		border-top: 1px solid var(--line-soft);
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-2);
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
	.stages {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: clamp(14px, 1.6vw, 24px);
	}
	.stages li {
		padding-top: 16px;
		border-top: 1px solid var(--line);
	}
	.stages__n {
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
	}
	.stages h3 {
		font-size: 17px;
		letter-spacing: -0.01em;
		margin: 8px 0 6px;
	}
	.stages p {
		margin: 0;
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	.projs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(12px, 1.4vw, 18px);
	}
	.projs__i {
		display: grid;
		gap: 3px;
		padding: clamp(18px, 2vw, 26px);
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 22px;
		transition: transform 0.5s var(--ease), border-color 0.4s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.projs__i:hover {
			transform: translateY(-4px);
			border-color: var(--ink-3);
		}
	}
	.projs__dom {
		font-size: 17px;
		letter-spacing: -0.015em;
		overflow-wrap: anywhere;
	}
	.projs__cli {
		font-size: 13.5px;
		color: var(--ink-2);
	}
	.projs__ind {
		font-size: 10.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
		line-height: 1.5;
	}
	@media (max-width: 1000px) {
		.shead__grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.stages {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.projs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 620px) {
		.stages,
		.projs {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
