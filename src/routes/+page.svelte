<script>
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, geo, stats } from '$lib/config/site.js';
	import { categories } from '$lib/data/categories.js';
	import { services, featuredServices } from '$lib/data/services/index.js';
	import { cases } from '$lib/data/cases.js';
	import { clients } from '$lib/data/clients.js';
	import { mainServices } from '$lib/data/main-services.js';
	import { rankings } from '$lib/data/rankings.js';
	import { generalFaq } from '$lib/data/faq.js';
	import {
		testSteps,
		principles,
		markers,
		otherServices,
		nicheGroups,
		officePhotos
	} from '$lib/data/channel.js';
	import { graph, orgSchema, faqSchema, breadcrumbSchema } from '$lib/seo.js';
	import { lead } from '$lib/lead.svelte.js';

	const title = `Маркетинговое агентство в Санкт-Петербурге — продвижение сайтов, реклама, разработка | ${site.name}`;
	const description =
		'Маркетинговое агентство полного цикла в Санкт-Петербурге: продвижение сайтов в Яндексе и Google, Директ, Telegram Ads, разработка. Ведём проекты под ключ. Начинаем с бесплатного теста.';

	const schema = graph(
		orgSchema(),
		breadcrumbSchema([{ title: 'Главная', href: '/' }]),
		faqSchema(generalFaq),
		{
			'@type': 'WebSite',
			name: site.name,
			url: site.url,
			inLanguage: 'ru-RU',
			publisher: { '@id': site.url + '/#organization' }
		}
	);

	const menu = [
		{ t: 'Услуги', h: '/uslugi/' },
		{ t: 'Кейсы', h: '/keysy/' },
		{ t: 'Агентство', h: '/o-nas/' },
		{ t: 'Контакты', h: '/kontakty/' }
	];

	/* Три основных направления — большие кнопки блока «Услуги». */
	const bigServices = [
		{ t: 'SEO', d: 'Поиск, структура, тексты, ссылки. Ведём до позиций и заявок.', h: '/uslugi/seo/' },
		{ t: 'Разработка', d: 'Сайты и магазины, которые сразу собраны под продвижение.', h: '/kontakty/' },
		{ t: 'Директ', d: 'Один платёж на старте, дальше — процент от прибыли. Без абонентки.', h: '/uslugi/direkt/' },
		{ t: 'Telegram Ads', d: 'Закупка, посевы и контент. 7 клиентских каналов на ведении.', h: '/uslugi/telegram-ads/' }
	];

	let menuOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => (document.body.style.overflow = '');
	});

	const nicheCount = nicheGroups.reduce((a, g) => a + g.items.length, 0);

	/* Проекты на ведении под ключ — позиции подтверждаются выгрузкой,
	   их можно проверить в поиске руками. */
	const turnkey = cases.filter((c) => c.turnkey);
	const withPhoto = cases.filter((c) => c.photo);
	const nf = new Intl.NumberFormat('ru-RU');

	/* Слайдер услуг в заголовке. Все варианты остаются в разметке —
	   поисковик видит их целиком, меняется только видимость. */
	const heroWords = ['SEO', 'Яндекс Директа', 'Telegram Ads'];
	let wordIndex = $state(0);

	$effect(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;
		const id = setInterval(() => {
			wordIndex = (wordIndex + 1) % heroWords.length;
		}, 2400);
		return () => clearInterval(id);
	});

	/** «1 раз», «3 раза», «5 раз» — форма по последней цифре. */
	function razPlural(n) {
		const d10 = n % 10;
		const d100 = n % 100;
		if (d100 >= 11 && d100 <= 14) return 'раз';
		if (d10 === 1) return 'раз';
		if (d10 >= 2 && d10 <= 4) return 'раза';
		return 'раз';
	}

	/** Ключ для отсева одинаковых по смыслу запросов: перестановки слов
	    и словоформы («лодка» / «лодки») схлопываются в одно. */
	function qKey(q) {
		return q
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => !['в', 'на', 'с', 'и', 'для', 'по', 'у', 'от', 'о', 'об'].includes(w))
			.map((w) => (w.length > 4 ? w.replace(/[аеёиоуыэюяьйы]$/, '') : w))
			.sort()
			.join(' ');
	}

	/** Пять самых показательных запросов проекта: сначала позиция, затем частотность.
	    Берём срез с лучшими позициями, перестановки слов схлопываем. */
	/* Переключатель поисковика в блоке «проверьте сами»: показываем срез по выбранной системе,
	   а если по проекту снят только один поисковик — его. */
	let engine = $state('Яндекс');
	const engines = ['Яндекс', 'Google'];

	function topQueries(c, limit = 5) {
		const all = rankings[c.rank] ?? [];
		if (!all.length) return null;
		const sets = all.some((x) => x.engine === engine) ? all.filter((x) => x.engine === engine) : all;
		const best = [...sets].sort((a, b) => {
			const av = a.queries.reduce((x, q) => x + q.pos, 0) / (a.queries.length || 1);
			const bv = b.queries.reduce((x, q) => x + q.pos, 0) / (b.queries.length || 1);
			return av - bv;
		})[0];
		const seen = new Set();
		const queries = [];
		/* Показываем только то, что стоит в ТОП-5: точные позиции не публикуем,
		   выдача шевелится, а «ТОП-5» проверяется руками в любой день. */
		/* Внутри ТОП-5 позиция уже не различает запросы — сортируем по частотности,
		   чтобы наверх выходили те, которые действительно ищут. */
		const pool = best.queries.filter((q) => q.pos <= 5);
		for (const q of [...pool].sort((a, b) => b.freq - a.freq || a.pos - b.pos)) {
			const k = qKey(q.q);
			if (seen.has(k)) continue;
			seen.add(k);
			queries.push(q);
			if (queries.length === limit) break;
		}
		if (!queries.length) return null;
		return { engine: best.engine, city: best.city, queries, exactSum: best.exactSum, top5: best.top5 };
	}

	const turnkeyRows = $derived(turnkey.map((c) => ({ c, r: topQueries(c) })).filter((x) => x.r));

</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<Seo {title} {description} path="/" {schema} />

<div class="fk">
	<!-- СЛУЖЕБНАЯ СТРОКА -->
	<div class="fk-utilbar">
		<div class="fk-util">
			<span>{geo.city}</span>
			<a class="fk-util__mid" href={site.telegramChannel} target="_blank" rel="noopener">
				Канал агентства {site.telegramLabel}
			</a>
			<a href={site.manager} target="_blank" rel="noopener">{site.managerLabel}</a>
		</div>
	</div>

	<!-- ШАПКА -->
	<header class="fk-head" class:is-scrolled={scrolled} class:is-open={menuOpen}>
		<div class="fk-head__in">
			<a class="fk-logo" href="/" aria-label="falkov — на главную">
				falkov<span class="fk-logo__sub">маркетинг</span>
			</a>
			<nav class="fk-head__nav" aria-label="Основное меню">
				{#each menu as n}<a href={n.h}>{n.t}</a>{/each}
			</nav>
			<div class="fk-head__acts">
				<button class="fk-pill fk-pill--solid fk-pill--sm" type="button" onclick={() => (lead.open = true)}>Оставить заявку</button>
				<button
					class="fk-burger"
					class:is-on={menuOpen}
					aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
				>
					<span></span><span></span>
				</button>
			</div>
		</div>
	</header>

	{#if menuOpen}
		<div class="fk-mob">
			<nav class="fk-mob__nav" aria-label="Меню">
				{#each menu as n, i}
					<a href={n.h} style="--i:{i}" onclick={() => (menuOpen = false)}>
						<span>{n.t}</span><i>→</i>
					</a>
				{/each}
			</nav>
			<div class="fk-mob__foot" style="--i:{menu.length}">
				<button class="fk-pill fk-pill--solid" type="button" onclick={() => (lead.open = true)}>Оставить заявку</button>
				<a href={site.telegramChannel} target="_blank" rel="noopener">Канал {site.telegramLabel}</a>
				<span>{geo.city} · {site.address.street}</span>
			</div>
		</div>
	{/if}

	<!-- ХИРО -->
	<section class="fk-hero">
		<div class="fk-hero__grid">
			<div class="fk-hero__panel" use:reveal>
				<span class="fk-eyebrow">Маркетинговое агентство · {geo.city}</span>
				<h1>
					Приводим клиентов малому и среднему бизнесу из
					<span class="fk-rot">
						{#each heroWords as w, i}
							{#if i > 0}<span class="visually-hidden">, </span>{/if}
							<span class="fk-rot__w" class:is-on={i === wordIndex}>{w}</span>
						{/each}
					</span>
				</h1>
				<div class="fk-hero__acts">
					<button class="fk-pill fk-pill--solid" type="button" onclick={() => (lead.open = true)}>Оставить заявку</button>

					<a
						class="fk-msg"
						href={site.manager}
						target="_blank"
						rel="noopener"
						title="Написать в Telegram"
						aria-label="Написать в Telegram"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M21.94 4.3 18.9 19.06c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19l-10.75 6.77-4.63-1.45c-1-.31-1.02-1 .21-1.48L20.64 3.1c.84-.31 1.57.2 1.3 1.2Z"
							/>
						</svg>
					</a>

					<a
						class="fk-msg"
						href={site.max}
						target="_blank"
						rel="noopener"
						title="Написать в MAX"
						aria-label="Написать в мессенджер MAX"
					>
						<svg viewBox="0 0 100 100" aria-hidden="true">
							<path
								fill="currentColor"
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M50.76 0c27.53 0 49.12 22.34 49.12 49.89S77.61 99.23 51.02 99.23c-9.43 0-14.01-1.33-21.37-6.54-.5-.36-1.2-.26-1.63.19-5.66 6.04-20.17 10.28-20.83 2.03C7.19 80.53 0 71.18 0 49.61 0 21.3 23.22 0 50.76 0m.77 24.55c-13.07-.68-23.26 8.39-25.51 22.58-1.86 11.75 1.44 26.07 4.26 26.8 1.2.3 4.08-1.9 6.18-3.88.4-.37.99-.44 1.45-.15 3.27 2 6.97 3.5 11.05 3.71 13.42.7 25.3-9.8 26-23.21.71-13.42-10.01-25.14-23.43-25.85"
							/>
						</svg>
					</a>
				</div>
			</div>

			<figure class="fk-hero__media" use:reveal={{ delay: 80 }}>
				<img
					class="fk-hero__img"
					src="/tg/2354-2.jpg"
					width="600"
					height="800"
					alt="Офис агентства в Санкт-Петербурге с панорамными окнами"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</figure>
		</div>
	</section>

	<!-- АНОНС КАНАЛА -->
	<section class="fk-anons-wrap">
		<a
			class="fk-anons"
			href={site.telegramChannel}
			target="_blank"
			rel="noopener"
			use:reveal
		>
			<span class="fk-anons__ico" aria-hidden="true">
				<svg viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M21.94 4.3 18.9 19.06c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19l-10.75 6.77-4.63-1.45c-1-.31-1.02-1 .21-1.48L20.64 3.1c.84-.31 1.57.2 1.3 1.2Z"
					/>
				</svg>
			</span>
			<span class="fk-anons__txt">
				<b>40+ кейсов</b> в канале, <b>1000+ подписчиков</b> и жизнь агентства
			</span>
			<span class="fk-anons__go">
				{site.telegramLabel}
				<i aria-hidden="true">→</i>
			</span>
		</a>
	</section>

	<!-- ЛОГОТИПЫ КЛИЕНТОВ -->
	<section class="fk-clients" aria-label="Клиенты агентства">
		<div class="fk-marquee">
			<!-- список продублирован: вторая копия скрыта от скринридера
			     и нужна только для бесшовной прокрутки -->
			{#each [0, 1] as copy}
				<ul class="fk-marquee__row" aria-hidden={copy === 1 ? 'true' : undefined}>
					{#each clients as c}
						<li>
							<img
								class:boost={c.boost}
								src={c.logo}
								alt={c.name}
								loading="lazy"
								decoding="async"
							/>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</section>

	<!-- ВЕДЕНИЕ ПОД КЛЮЧ -->
	<section class="fk-sec" id="pod-klyuch">
		<div class="fk-sec__head">
			<h2>Проекты на ведении под ключ</h2>
			<p class="fk-note">
				Здесь мы отвечаем за маркетинг целиком: структуру сайта, тексты, посадочные, поиск и
				сопровождение.
			</p>
		</div>

		<!-- Главный аргумент раздела: позиции проверяются без нашего участия -->
		<p class="fk-claim" use:reveal>
			<span class="fk-claim__mark" aria-hidden="true"></span>
			<span class="fk-claim__txt">
				<b>Позиции наших проектов можно проверить руками прямо сейчас</b>
				<i>Откройте поиск, выберите город и введите запрос.</i>
			</span>
			<span class="fk-eng" role="group" aria-label="Поисковая система">
				{#each engines as e}
					<button class="fk-eng__b" class:on={engine === e} onclick={() => (engine = e)}>{e}</button>
				{/each}
			</span>
		</p>

		<div class="fk-tbl" role="table" aria-label="Проекты на ведении и их запросы в топе">
			<div class="fk-tbl__head" role="row">
				<span role="columnheader">Проект</span>
				<span role="columnheader">Где проверять</span>
				<span role="columnheader">Запросы в ТОП-5 — введите и посмотрите сами</span>
			</div>

			{#each turnkeyRows as { c, r }, i (c.slug)}
				<div class="fk-tbl__row" role="row" use:reveal={{ delay: i * 70 }}>
					<div class="fk-tbl__proj" role="cell">
						<span class="fk-logo-plate" class:dark={c.logoTone === 'dark'}>
							<img src={c.logo} alt="Логотип {c.client}" loading="lazy" decoding="async" />
						</span>
						<a class="fk-tbl__dom" href={c.siteUrl} target="_blank" rel="noopener nofollow">
							{c.site}<i aria-hidden="true">↗</i>
						</a>
						<span class="fk-tbl__cli">{c.client}</span>
						<span class="fk-tbl__ind">{c.industry}</span>
						<a class="fk-tbl__case" href="/keysy/{c.slug}/">Кейс и все позиции →</a>
					</div>

					<div class="fk-tbl__where" role="cell">
						<span class="fk-tbl__eng">{r.engine}</span>
						<span class="fk-tbl__city">{r.city}</span>
						<span class="fk-tbl__sum">
							{nf.format(r.top5)} запросов в ТОП-5 · {nf.format(r.exactSum)} частотность
						</span>
					</div>

					<div class="fk-tbl__qcell" role="cell">
						<ul class="fk-tbl__qs">
							{#each r.queries as q}
								<li>
									<span class="fk-tbl__q">{q.q}</span>
									<span class="fk-tbl__freq">{nf.format(q.freq)} {razPlural(q.freq)}/мес</span>
								</li>
							{/each}
						</ul>
						{#if c.ai?.length}
							<!-- Источник быстрого ответа Алисы AI — это тоже топ, только нейросетевой -->
							<p class="fk-ai">
								<span class="fk-ai__tag">AI</span>
								<span>
									Сайт — источник быстрого ответа <b>Алисы AI</b> в Яндексе по запросу
									{#each c.ai as a, i}{i ? ', ' : ' '}<b class="fk-ai__q">«{a.q}»</b>{/each}
								</span>
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- УСЛУГИ: три больших направления -->
	<section class="fk-sec" id="uslugi">
		<div class="fk-sec__head">
			<h2>Услуги</h2>
			<p class="fk-note">
				Четыре направления, которыми закрываем маркетинг. Можно взять одно, можно отдать всё целиком.
			</p>
		</div>
		<div class="fk-big">
			{#each bigServices as b, i}
				<a class="fk-big__i" href={b.h} use:reveal={{ delay: i * 90 }}>
					<span class="fk-big__n">{String(i + 1).padStart(2, '0')}</span>
					<span class="fk-big__t">{b.t}</span>
					<span class="fk-big__d">{b.d}</span>
					<span class="fk-big__go" aria-hidden="true">→</span>
				</a>
			{/each}
		</div>
		<div class="fk-big__cta" use:reveal>
			<a class="fk-pill fk-pill--solid" href="/keysy/">Смотреть условия и кейсы</a>
		</div>
	</section>

	<!-- ЦИФРЫ -->
	<section class="fk-stats">
		{#each stats as s, i}
			<div use:reveal={{ delay: i * 60 }}>
				<b>{s.value}</b>
				<span>{s.label}</span>
			</div>
		{/each}
	</section>

	<!-- ВИДЕО -->
	<section class="fk-sec fk-sec--tight" id="video">
		<div class="fk-video" use:reveal>
			<div class="fk-video__text">
				<span class="fk-eyebrow">Коротко о подходе</span>
				<h2>Почему стоит отправить сайт на тест</h2>
				<p>
					Записал без воды: как устроен бесплатный тест, что мы успеваем показать до договора и по
					каким признакам видно, что проект выстрелит.
				</p>
			</div>
			<!-- Видео из закрепа канала. Замедление 10% задаётся playbackRate,
			     чтобы не переделывать исходный файл. -->
			<video
				class="fk-video__player"
				src="/video/podhod.mp4"
				controls
				playsinline
				preload="metadata"
				onloadedmetadata={(e) => (e.currentTarget.playbackRate = 0.9)}
			>
				<track kind="captions" />
				Ваш браузер не умеет проигрывать видео.
				<a href={site.telegramChannel} target="_blank" rel="noopener">Смотреть в канале</a>
			</video>
		</div>
	</section>

	<!-- БЕСПЛАТНЫЙ ТЕСТ -->
	<section class="fk-sec" id="test">
		<div class="fk-sec__head">
			<h2>Бесплатный тест вместо коммерческого предложения</h2>
			<p class="fk-note">
				Сначала показываем рост на вашем сайте, потом обсуждаем сотрудничество. Тест подсвечивает
				точки роста лучше любого платного аудита и ни к чему не обязывает.
			</p>
		</div>
		<ol class="fk-steps">
			{#each testSteps as s, i}
				<li use:reveal={{ delay: (i % 5) * 50 }}>
					<span class="fk-steps__n">{String(i + 1).padStart(2, '0')}</span>
					<h3>{s.t}</h3>
					<p>{s.d}</p>
				</li>
			{/each}
		</ol>
		<div class="fk-markers">
			<span class="fk-eyebrow">Когда результат будет быстрым</span>
			<div>
				{#each markers as m, i}
					<div use:reveal={{ delay: i * 60 }}>
						<b>{m.t}</b>
						<span>{m.d}</span>
					</div>
				{/each}
			</div>
		</div>
		<a class="fk-pill fk-pill--solid fk-pill--wide" href={site.manager} target="_blank" rel="noopener">
			Отправить сайт на тест — написать {site.managerName} {site.managerLabel}
		</a>
	</section>

	<!-- КЕЙСЫ -->
	<section class="fk-sec" id="keysy">
		<div class="fk-sec__head">
			<h2>Кейсы</h2>
			<p class="fk-note">
				Скриншоты позиций и метрики, а не рассказы. Часть клиентов под NDA, поэтому где-то ниша и
				регион закрыты.
			</p>
		</div>

		<div class="fk-feature">
			<div class="fk-feature__panel" use:reveal>
				<h2>45+ проектов</h2>
				<p>
					Медицина, юристы, авто, e-commerce, производство, недвижимость. Ниже — часть, остальное
					покажем на встрече или в канале.
				</p>
				<div class="fk-feature__acts">
					<a class="fk-pill fk-pill--solid" href="/keysy/">Все кейсы</a>
					<a class="fk-pill" href={site.telegramChannel} target="_blank" rel="noopener">
						Ещё 45+ в канале
					</a>
				</div>
			</div>

			<img
				class="fk-feature__img"
				src="/tg/2339-1.jpg"
				width="600"
				height="800"
				alt="Два экрана с отчётами Яндекс Метрики по проектам агентства"
				loading="lazy"
				decoding="async"
			/>
		</div>

		<div class="fk-cases">
			{#each cases.filter((x) => !x.turnkey).slice(0, 6) as c, i}
				<a class="fk-case" href="/keysy/{c.slug}/" use:reveal={{ delay: (i % 3) * 60 }}>
					<span class="fk-shot">
						<img src={c.photo} width="600" height="400" alt="Результат по проекту: {c.client}" loading="lazy" decoding="async" />
					</span>
					<span class="fk-case__ind">{c.industry} · {c.region}</span>
					<span class="fk-case__row">
						<b>{c.metrics[0].v}</b>
						<span>{c.metrics[0].l}</span>
					</span>
					<span class="fk-case__t">{c.site ?? c.client}</span>
					<span class="fk-case__d">{c.short}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- ПРИНЦИПЫ -->
	<section class="fk-sec">
		<div class="fk-sec__head">
			<h2>Как мы работаем</h2>
			<p class="fk-note">
				Схема «полгода что-то делаем, вот отчётик, платите дальше» — рабочая бизнес-модель, но не
				наша.
			</p>
		</div>
		<div class="fk-princ">
			{#each principles as p, i}
				<div use:reveal={{ delay: (i % 3) * 60 }}>
					<h3>{p.t}</h3>
					<p>{p.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- УСЛУГИ -->
	<section class="fk-sec fk-sec--alt" id="formaty">
		<div class="fk-sec__head">
			<h2>Форматы работы</h2>
			<p class="fk-note">
				Можно взять одно направление, а можно отдать маркетинг целиком. Формат обсуждаем после
				бесплатного теста — когда уже видно, что вытащим из проекта.
			</p>
		</div>

		<div class="fk-main">
			{#each mainServices as m, i}
				<a
					class="fk-main__item"
					class:featured={m.featured}
					href={m.href}
					use:reveal={{ delay: (i % 3) * 60 }}
				>
					<span class="fk-main__n">{String(i + 1).padStart(2, '0')}</span>
					<span class="fk-main__t">{m.t}</span>
					<span class="fk-main__d">{m.d}</span>
					<span class="fk-main__note">{m.note}</span>
				</a>
			{/each}
		</div>

		<h3 class="fk-subh">Направления поискового продвижения</h3>
		<div class="fk-chips">
			{#each categories as c}
				<a class="fk-chip" href="/uslugi/#{c.slug}">{c.title}</a>
			{/each}
			<a class="fk-chip fk-chip--all" href="/uslugi/">Все {services.length} услуг →</a>
		</div>
	</section>

	<!-- НИШИ -->
	<section class="fk-sec">
		<div class="fk-sec__head">
			<h2>Ниши, в которых уже есть результат</h2>
			<p class="fk-note">
				{nicheCount} направлений из наших кейсов. Если вашей ниши в списке нет — это не отказ, просто
				спросите.
			</p>
		</div>
		<div class="fk-niches">
			{#each nicheGroups as g, i}
				<div use:reveal={{ delay: (i % 4) * 50 }}>
					<span class="fk-niches__h">{g.title}</span>
					<ul>
						{#each g.items as n}<li>{n}</li>{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<!-- НАПРАВЛЕНИЯ -->
	<section class="fk-sec fk-sec--alt">
		<div class="fk-sec__head">
			<h2>Стратегия зависит от того, что за сайт</h2>
			<a class="fk-more" href="/uslugi/">Все услуги →</a>
		</div>
		<div class="fk-dirs">
			{#each categories as c, i}
				<a href="/uslugi/#{c.slug}" use:reveal={{ delay: i * 50 }}>
					<span>{c.title}</span>
					<i>{c.lead}</i>
					<b>{services.filter((s) => s.cat === c.slug).length}</b>
				</a>
			{/each}
		</div>
	</section>

	<!-- АГЕНТСТВО -->
	<section class="fk-sec fk-sec--tight" id="agentstvo">
		<div class="fk-about">
			<div class="fk-about__text" use:reveal>
				<span class="fk-eyebrow">Агентство</span>
				<h2>Работаем лично, а не через личный кабинет</h2>
				<p>
					Ковид доказал, что агентство спокойно живёт онлайн. Но если есть возможность встретиться с
					клиентом лично — я её не упускаю. Ничего не продаёт наши услуги лучше, чем разговор с
					глазу на глаз: можно не только рассказать про кейс, но и тут же показать его внутрянку с
					личного компьютера.
				</p>
				<p>
					Офис — {site.address.city}, {site.address.street}. {site.addressNote}.
				</p>
				<div class="fk-about__acts">
					<a class="fk-pill fk-pill--solid" href="/o-nas/">Об агентстве</a>
					<a class="fk-pill" href="/kontakty/">Контакты</a>
				</div>
			</div>
			<div class="fk-about__photos" use:reveal={{ delay: 80 }}>
				{#each officePhotos as p}
					<figure>
						<img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
						<figcaption>{p.cap}</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<!-- ПОДВАЛ -->
	<footer class="fk-foot">
		<div class="fk-foot__cols">
			<div>
				<span class="fk-foot__h">Услуги</span>
				{#each featuredServices.slice(0, 6) as s}
					<a href="/uslugi/{s.slug}/">{s.h1}</a>
				{/each}
				<a href="/uslugi/">Все {services.length} услуг</a>
			</div>
			<div>
				<span class="fk-foot__h">Направления</span>
				{#each categories as c}
					<a href="/uslugi/#{c.slug}">{c.title}</a>
				{/each}
			</div>
			<div>
				<span class="fk-foot__h">Агентство</span>
				<a href="/o-nas/">О нас</a>
				<a href="/keysy/">Кейсы</a>
				<a href="/kontakty/">Контакты</a>
			</div>
			<div>
				<span class="fk-foot__h">Связаться</span>
				<a href={site.manager} target="_blank" rel="noopener">{site.managerLabel} — заявки</a>
				<a href={site.telegramChannel} target="_blank" rel="noopener">{site.telegramLabel} — канал</a>
				<a href="tel:{site.phoneHref}">{site.phone}</a>
				<span class="fk-foot__mut">{site.address.city}, {site.address.street}</span>
				<span class="fk-foot__mut">{site.workHours}</span>
			</div>
		</div>
		<div class="fk-foot__bottom">
			<span>© 2026 {site.name} · Маркетинговое агентство {geo.cityIn}</span>
			<a href="/politika-konfidencialnosti/">Политика конфиденциальности</a>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background: #f5f5f5;
	}

	.fk {
		/* только чёрный и оттенки серого */
		--bg: #f5f5f5;
		--panel: #ffffff;
		--tile: #e8e8e8;
		--ink: #111111;
		--ink-2: #565656;
		--ink-3: #949494;
		--line: rgba(0, 0, 0, 0.12);
		--line-soft: rgba(0, 0, 0, 0.07);
		--dark: #141414;
		--pad: clamp(16px, 3vw, 40px);
		--wide: 1440px;

		background: var(--bg);
		color: var(--ink);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		letter-spacing: -0.005em;
	}
	/* :where() обнуляет вес сброса — иначе он перебивает цвет кнопок */
	.fk :global(:where(a)) {
		color: inherit;
		text-decoration: none;
	}

	.fk-eyebrow {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 16px;
	}
	.fk-eyebrow--light {
		color: rgba(255, 255, 255, 0.45);
	}

	/* фотографии выводим в оригинальном цвете */
	.fk :global(img) {
		display: block;
		transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
	}
	.fk-shot,
	.fk-strip__item .fk-shot {
		display: block;
		background: var(--tile);
		border-radius: 18px;
		overflow: hidden;
		aspect-ratio: 3 / 2;
	}
	.fk-shot--tall {
		aspect-ratio: 4 / 5;
	}
	/* скриншот сайта показываем «шапкой»: верх страницы, а не растянутый кадр */
	.fk-shot--site {
		aspect-ratio: 16 / 10;
		background: #fff;
	}
	.fk-shot--site img {
		object-position: top center;
	}
	.fk-shot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-case:hover .fk-shot img,
		.fk-strip__item:hover .fk-shot img {
			transform: scale(1.02);
		}
	}

	/* служебная строка */
	.fk-utilbar {
		border-bottom: 1px solid var(--line-soft);
	}
	.fk-util {
		max-width: var(--wide);
		margin-inline: auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 10px var(--pad);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-util > :last-child {
		justify-self: end;
	}
	.fk-util__mid {
		text-decoration: underline !important;
		text-underline-offset: 3px;
		color: var(--ink);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-util a:hover {
			color: var(--ink);
		}
	}

	/* шапка — липкая, со стеклом */
	.fk-head {
		position: sticky;
		top: 0;
		z-index: 60;
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		backdrop-filter: saturate(160%) blur(16px);
		-webkit-backdrop-filter: saturate(160%) blur(16px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.45s var(--ease), background 0.45s var(--ease);
	}
	.fk-head.is-scrolled {
		border-bottom-color: var(--line-soft);
	}
	.fk-head.is-open {
		background: var(--paper);
	}
	.fk-head__in {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		align-items: center;
		gap: clamp(16px, 3vw, 44px);
		padding: 14px var(--pad);
		min-height: 66px;
	}
	.fk-logo {
		font-size: clamp(15px, 1.4vw, 18px);
		letter-spacing: 0.02em;
		font-weight: 600;
		white-space: nowrap;
		flex: none;
	}
	.fk-logo__sub {
		margin-left: 10px;
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-head__nav {
		margin-left: auto;
		display: flex;
		gap: clamp(18px, 2.4vw, 38px);
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.fk-head__nav a {
		position: relative;
		color: var(--ink-2);
		padding-block: 4px;
		transition: color 0.3s var(--ease);
	}
	.fk-head__nav a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right center;
		transition: transform 0.45s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-head__nav a:hover {
			color: var(--ink);
		}
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-head__nav a:hover::after {
			transform: scaleX(1);
			transform-origin: left center;
		}
	}
	.fk-head__acts {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: none;
	}
	.fk-burger {
		display: none;
		width: 42px;
		height: 42px;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		transition: background 0.35s var(--ease), border-color 0.35s var(--ease);
	}
	.fk-burger span {
		display: block;
		width: 16px;
		height: 1.5px;
		background: var(--ink);
		transition: transform 0.45s var(--ease), opacity 0.3s var(--ease);
	}
	.fk-burger.is-on span:first-child {
		transform: translateY(3.25px) rotate(45deg);
	}
	.fk-burger.is-on span:last-child {
		transform: translateY(-3.25px) rotate(-45deg);
	}

	/* мобильное меню */
	.fk-mob {
		position: fixed;
		inset: 66px 0 0;
		z-index: 55;
		background: var(--paper);
		overflow-y: auto;
		padding: clamp(16px, 4vw, 34px) var(--pad) 48px;
		animation: fk-mob-in 0.5s var(--ease) both;
	}
	@keyframes fk-mob-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
	.fk-mob__nav {
		display: grid;
	}
	.fk-mob__nav a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 0;
		border-bottom: 1px solid var(--line-soft);
		font-size: clamp(24px, 8vw, 34px);
		letter-spacing: -0.03em;
		animation: fk-item-in 0.6s var(--ease) both;
		animation-delay: calc(70ms * var(--i) + 60ms);
	}
	.fk-mob__nav a i {
		font-style: normal;
		color: var(--ink-3);
		transition: transform 0.4s var(--ease);
	}
	.fk-mob__nav a:active i {
		transform: translateX(6px);
	}
	@keyframes fk-item-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}
	.fk-mob__foot {
		margin-top: 30px;
		display: grid;
		gap: 14px;
		justify-items: start;
		font-size: 14px;
		color: var(--ink-2);
		animation: fk-item-in 0.6s var(--ease) both;
		animation-delay: calc(70ms * var(--i) + 60ms);
	}

	/* блок «Услуги» — три большие кнопки */
	.fk-big {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
		gap: clamp(12px, 1.4vw, 20px);
	}
	.fk-big__i {
		position: relative;
		display: grid;
		align-content: start;
		gap: 10px;
		min-height: clamp(200px, 22vw, 280px);
		padding: clamp(22px, 2.4vw, 34px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
		overflow: hidden;
		transition: transform 0.55s var(--ease), border-color 0.45s var(--ease),
			box-shadow 0.55s var(--ease), color 0.45s var(--ease);
	}
	.fk-big__i::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--dark);
		transform: translateY(101%);
		transition: transform 0.6s var(--ease);
	}
	.fk-big__i > * {
		position: relative;
		z-index: 1;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-big__i:hover {
			transform: translateY(-6px);
			border-color: transparent;
			color: var(--on-dark);
			box-shadow: 0 30px 60px -38px rgba(0, 0, 0, 0.6);
		}
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-big__i:hover::before {
			transform: none;
		}
	}
	.fk-big__n {
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
	}
	.fk-big__t {
		font-size: clamp(24px, 2.4vw, 36px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.fk-big__d {
		font-size: 14.5px;
		color: var(--ink-2);
		max-width: 30ch;
		transition: color 0.45s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-big__i:hover .fk-big__d,
		.fk-big__i:hover .fk-big__n {
			color: var(--on-dark-2);
		}
	}
	.fk-big__go {
		margin-top: auto;
		align-self: end;
		justify-self: end;
		font-size: 22px;
		transition: transform 0.5s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-big__i:hover .fk-big__go {
			transform: translateX(8px);
		}
	}
	.fk-big__cta {
		margin-top: clamp(18px, 2vw, 28px);
		display: flex;
		justify-content: center;
	}
	.fk-pill--sm {
		padding: 11px 20px;
		font-size: 13px;
	}

	/* анонс канала */
	.fk-anons-wrap {
		max-width: var(--wide);
		margin-inline: auto;
		padding: 0 var(--pad) clamp(10px, 1.6vw, 20px);
	}
	.fk-anons {
		display: flex;
		align-items: center;
		gap: clamp(14px, 2vw, 22px);
		padding: clamp(14px, 1.8vw, 20px) clamp(16px, 2.2vw, 26px);
		border-radius: 100px;
		background: var(--dark);
		color: var(--on-dark);
		transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease);
	}
	.fk-anons__ico {
		flex: none;
		display: grid;
		place-items: center;
		width: clamp(38px, 4vw, 46px);
		height: clamp(38px, 4vw, 46px);
		border-radius: 100px;
		background: rgba(255, 255, 255, 0.12);
		transition: background 0.4s var(--ease), color 0.4s var(--ease);
	}
	.fk-anons__ico svg {
		width: 55%;
		height: 55%;
	}
	.fk-anons__txt {
		font-size: clamp(14px, 1.5vw, 19px);
		line-height: 1.35;
		letter-spacing: -0.01em;
	}
	.fk-anons__txt b {
		font-weight: 500;
		color: #fff;
	}
	.fk-anons__go {
		margin-left: auto;
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--on-dark-2);
		transition: color 0.4s var(--ease);
	}
	.fk-anons__go i {
		font-style: normal;
		font-size: 15px;
		transition: transform 0.45s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-anons:hover {
			transform: translateY(-3px);
			box-shadow: 0 26px 50px -34px rgba(0, 0, 0, 0.7);
		}
		.fk-anons:hover .fk-anons__ico {
			background: #fff;
			color: var(--dark);
		}
		.fk-anons:hover .fk-anons__go {
			color: #fff;
		}
		.fk-anons:hover .fk-anons__go i {
			transform: translateX(5px);
		}
	}

	/* хиро */
	.fk-hero {
		max-width: var(--wide);
		margin-inline: auto;
		padding: 0 var(--pad) clamp(28px, 4vw, 48px);
	}
	.fk-hero__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.82fr);
		gap: clamp(20px, 3vw, 40px);
		align-items: stretch;
	}
	.fk-hero__panel {
		background: var(--panel);
		border-radius: 26px;
		padding: clamp(24px, 3.4vw, 52px);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.fk h1 {
		margin: 0 0 18px;
		font-size: clamp(19px, 3.4vw, 46px);
		font-weight: 400;
		letter-spacing: 0.01em;
		text-transform: uppercase;
		line-height: 1.1;
		hyphens: none;
	}
	/* Направления — столбиком под заголовком. Активное чёрное и с меткой слева,
	   остальные светло-серые. Ничего не похоже на кнопки, все видны всегда. */
	.fk-rot {
		display: grid;
		gap: clamp(2px, 0.3vw, 6px);
		margin-top: clamp(14px, 1.6vw, 22px);
	}
	.fk-rot__w {
		position: relative;
		padding-left: clamp(22px, 2.2vw, 34px);
		font-size: clamp(18px, 2.4vw, 30px);
		line-height: 1.2;
		letter-spacing: -0.01em;
		text-transform: none;
		color: #c9c9c9;
		transition: color 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
	}
	/* метка-риска у активного направления */
	.fk-rot__w::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.52em;
		width: clamp(12px, 1.3vw, 20px);
		height: 2px;
		background: currentColor;
		transform: scaleX(0.18);
		transform-origin: left center;
		transition:
			transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
			opacity 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
		opacity: 0.5;
	}
	.fk-rot__w.is-on {
		color: var(--ink);
	}
	.fk-rot__w.is-on::before {
		transform: none;
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.fk-rot__w,
		.fk-rot__w::before {
			transition: none;
		}
	}

	.fk-hero__panel p {
		margin: 0;
		font-size: clamp(14px, 1.15vw, 17px);
		line-height: 1.6;
		color: var(--ink-2);
		max-width: 32em;
	}
	.fk-hero__acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 34px);
	}

	/* кнопки-мессенджеры рядом с основной */
	.fk-msg {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		flex: none;
		border-radius: 100px;
		background: var(--panel);
		color: var(--ink);
		box-shadow: inset 0 0 0 1px var(--line);
		transition: background 0.25s, color 0.25s, box-shadow 0.25s;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-msg:hover {
			background: var(--ink);
			color: #fff;
			box-shadow: inset 0 0 0 1px var(--ink);
		}
	}
	.fk-msg svg {
		width: 21px;
		height: 21px;
		display: block;
	}
	/* фото 600×800 — не растягиваем его на всю ширину, иначе мылит */
	.fk-hero__media {
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.fk-hero__img {
		width: 100%;
		height: 100%;
		max-height: clamp(320px, 46vw, 560px);
		object-fit: cover;
		object-position: center 42%;
		border-radius: 26px;
		background: var(--tile);
	}
	.fk-hero__media figcaption {
		margin-top: 12px;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	/* пилюли */
	.fk-pill {
		display: inline-block;
		padding: 12px 24px;
		border: 0;
		font: inherit;
		cursor: pointer;
		border-radius: 100px;
		background: var(--panel);
		color: var(--ink);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		transition: background 0.28s, color 0.28s;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-pill:hover {
			background: var(--ink);
			color: #fff;
		}
	}
	.fk-pill--solid {
		background: var(--ink);
		color: #fff;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-pill--solid:hover {
			background: var(--panel);
			color: var(--ink);
		}
	}
	.fk-pill--light {
		background: #fff;
		color: var(--ink);
	}
	.fk-pill--onDark {
		background: transparent;
		color: rgba(255, 255, 255, 0.85);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-pill--onDark:hover {
			background: #fff;
			color: var(--ink);
		}
	}
	.fk-pill--wide {
		display: block;
		width: fit-content;
		margin: clamp(24px, 3vw, 40px) auto 0;
		text-align: center;
	}

	/* лента кейсов */
	.fk-strip {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: clamp(240px, 26vw, 340px);
		gap: clamp(8px, 1vw, 14px);
		overflow-x: auto;
		/* первая плитка встаёт по левому краю контейнера, хвост уходит за экран */
		padding-left: max(var(--pad), calc((100% - var(--wide)) / 2 + var(--pad)));
		padding-right: var(--pad);
		padding-bottom: clamp(32px, 4vw, 56px);
		scrollbar-width: none;
	}
	.fk-strip::-webkit-scrollbar {
		display: none;
	}
	.fk-strip__domain {
		display: block;
		margin-top: 12px;
		font-size: 16px;
	}
	.fk-strip__cap {
		display: block;
		margin-top: 4px;
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-strip__v {
		display: block;
		margin-top: 8px;
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.4;
	}

	/* цифры */
	.fk-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		max-width: var(--wide);
		margin: 0 auto;
		padding: 0 var(--pad);
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}
	.fk-stats > div {
		padding: clamp(22px, 3vw, 36px) 20px clamp(22px, 3vw, 36px) 0;
	}
	.fk-stats > div + div {
		border-left: 1px solid var(--line);
		padding-left: 20px;
	}
	.fk-stats b {
		display: block;
		font-size: clamp(22px, 2.6vw, 34px);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 8px;
	}
	.fk-stats span {
		font-size: 12.5px;
		color: var(--ink-3);
		line-height: 1.4;
	}

	/* секции */
	.fk-sec {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(48px, 6vw, 88px) var(--pad);
	}
	.fk-sec--tight {
		padding-block: clamp(24px, 3vw, 40px);
	}
	.fk-sec--alt {
		max-width: none;
		background: #efefec;
	}
	.fk-sec--alt > * {
		max-width: var(--wide);
		margin-inline: auto;
	}
	.fk-sec__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px 40px;
		margin-bottom: clamp(24px, 3vw, 40px);
	}
	.fk h2 {
		margin: 0;
		font-size: clamp(18px, 2.2vw, 30px);
		hyphens: none;
		font-weight: 400;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		line-height: 1.15;
		max-width: 18em;
	}
	.fk-note {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 34em;
	}
	.fk-more {
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-2);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-more:hover {
			color: var(--ink);
		}
	}
	.fk-subh {
		margin: clamp(36px, 4vw, 56px) 0 18px;
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	/* бесплатный тест */
	.fk-steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: clamp(12px, 1.6vw, 20px);
	}
	.fk-steps li {
		background: var(--panel);
		border-radius: 18px;
		padding: clamp(18px, 2vw, 24px);
		display: grid;
		gap: 9px;
		align-content: start;
	}
	.fk-steps__n {
		font-size: 10.5px;
		letter-spacing: 0.1em;
		color: var(--ink-3);
	}
	.fk-steps h3 {
		margin: 0;
		font-size: 15.5px;
		font-weight: 500;
		line-height: 1.3;
	}
	.fk-steps p {
		margin: 0;
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.fk-markers {
		margin-top: clamp(28px, 3vw, 44px);
		padding-top: clamp(24px, 3vw, 34px);
		border-top: 1px solid var(--line);
	}
	.fk-markers > div {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(16px, 3vw, 48px);
	}
	.fk-markers b {
		display: block;
		font-size: 16px;
		font-weight: 500;
		margin-bottom: 8px;
	}
	.fk-markers span {
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.55;
	}

	/* лента логотипов клиентов */
	.fk-clients {
		padding: clamp(8px, 1.4vw, 18px) 0 clamp(28px, 3.4vw, 46px);
		overflow: hidden;
	}
	.fk-marquee {
		display: flex;
		width: max-content;
		animation: fk-slide 24s linear infinite;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-marquee:hover {
			animation-play-state: paused;
		}
	}
	@keyframes fk-slide {
		to {
			transform: translateX(-50%);
		}
	}
	.fk-marquee__row {
		display: flex;
		align-items: center;
		gap: clamp(38px, 5vw, 78px);
		margin: 0;
		padding: 0 clamp(19px, 2.5vw, 39px);
		list-style: none;
	}
	.fk-marquee__row li {
		flex: none;
		display: grid;
		place-items: center;
		height: 44px;
	}
	/* высота одна на всех, ширина по пропорции; серый — чтобы лента
	   не спорила с чёрно-белой палитрой сайта */
	.fk-marquee img {
		/* высота в пикселях, а не в процентах: в grid-ячейке процент
		   схлопывается в auto и логотипы разъезжаются по размеру */
		height: 34px;
		width: auto;
		max-width: 180px;
		object-fit: contain;
		filter: grayscale(1);
		opacity: 0.55;
		transition: opacity 0.3s, filter 0.3s;
	}
	/* бледные логотипы вытягиваем контрастом, чтобы не терялись в ряду */
	.fk-marquee img.boost {
		filter: grayscale(1) contrast(1.45) brightness(0.82);
		opacity: 0.9;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-marquee__row li:hover img {
			filter: grayscale(1);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fk-marquee {
			animation: none;
			width: 100%;
			justify-content: center;
			flex-wrap: wrap;
		}
		.fk-marquee__row[aria-hidden='true'] {
			display: none;
		}
		.fk-marquee__row {
			flex-wrap: wrap;
			justify-content: center;
			row-gap: 18px;
		}
	}

	/* акцентная плашка «проверьте сами» */
	.fk-claim {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: clamp(14px, 2vw, 24px);
		margin: 0 0 clamp(18px, 2.4vw, 28px);
		padding: clamp(20px, 2.6vw, 30px) clamp(20px, 3vw, 36px);
		background: var(--dark);
		color: #f0f0f0;
		border-radius: 22px;
	}
	.fk-claim__txt {
		/* flex-basis держит текст цельным блоком: без него переключатель
		   сжимает его до одного слова в строку на узких экранах */
		flex: 1 1 min(100%, 300px);
		min-width: 0;
		display: grid;
		gap: 7px;
	}
	.fk-claim b {
		font-size: clamp(20px, 2.6vw, 34px);
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.fk-claim i {
		font-style: normal;
		font-size: clamp(13px, 1.1vw, 15px);
		line-height: 1.45;
		color: var(--on-dark-2);
	}
	.fk-claim__mark {
		flex: none;
		width: clamp(34px, 4vw, 46px);
		height: clamp(34px, 4vw, 46px);
		border-radius: 100px;
		background: #f0f0f0;
		position: relative;
	}
	/* галочка внутри кружка — чистый CSS, без иконок */
	.fk-claim__mark::after {
		content: '';
		position: absolute;
		left: 34%;
		top: 24%;
		width: 26%;
		height: 46%;
		border: solid var(--dark);
		border-width: 0 2.5px 2.5px 0;
		transform: rotate(45deg);
	}

	/* переключатель Яндекс / Google */
	.fk-eng {
		margin-left: auto;
		flex: none;
		display: inline-flex;
		padding: 4px;
		border-radius: 100px;
		background: rgba(255, 255, 255, 0.12);
		gap: 2px;
	}
	.fk-eng__b {
		border: 0;
		background: transparent;
		border-radius: 100px;
		padding: 9px 18px;
		font: inherit;
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		transition: background 0.25s var(--ease), color 0.25s var(--ease);
	}
	.fk-eng__b.on {
		background: #fff;
		color: var(--dark);
	}

	/* ведение под ключ — таблица проектов */
	.fk-tbl {
		border-top: 1px solid var(--line);
	}
	.fk-tbl__head,
	.fk-tbl__row {
		display: grid;
		grid-template-columns: minmax(210px, 0.9fr) minmax(150px, 0.6fr) minmax(0, 1.9fr);
		gap: clamp(18px, 2.4vw, 40px);
	}
	.fk-tbl__head {
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-tbl__row {
		padding: clamp(16px, 1.8vw, 24px) 0;
		border-bottom: 1px solid var(--line-soft);
		align-items: center;
	}

	.fk-logo-plate {
		display: grid;
		place-items: center;
		height: 92px;
		margin-bottom: 18px;
		padding: 14px 22px;
		border-radius: 16px;
		background: #f0f0f0;
		overflow: hidden;
	}
	.fk-logo-plate.dark {
		background: #141414;
	}
	/* фиксированная высота выравнивает логотипы по одной оптической линии,
	   ширина считается по пропорции. Процентную высоту брать нельзя —
	   в grid-ячейке она схлопывается в auto и картинка распухает. */
	.fk-logo-plate img {
		height: 52px;
		width: auto;
		max-width: 100%;
		object-fit: contain;
	}
	.fk-tbl__proj {
		display: grid;
		gap: 3px;
		justify-items: start;
	}
	.fk-tbl__proj .fk-logo-plate {
		height: 46px;
		width: 100%;
		margin-bottom: 9px;
		padding: 8px 16px;
		border-radius: 12px;
	}
	.fk-tbl__proj .fk-logo-plate img {
		height: 26px;
	}
	.fk-tbl__dom {
		font-size: clamp(16px, 1.35vw, 19px);
		letter-spacing: -0.015em;
		overflow-wrap: anywhere;
	}
	.fk-tbl__dom i {
		font-style: normal;
		font-size: 0.62em;
		margin-left: 5px;
		color: var(--ink-3);
		transition: transform 0.35s var(--ease);
		display: inline-block;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-tbl__dom:hover i {
			transform: translate(2px, -2px);
		}
	}
	.fk-tbl__cli {
		font-size: 13px;
		color: var(--ink-2);
	}
	.fk-tbl__ind {
		font-size: 10.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
		line-height: 1.5;
	}
	.fk-tbl__case {
		margin-top: 8px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-2);
		border-bottom: 1px solid var(--line);
		padding-bottom: 3px;
		transition: color 0.3s var(--ease), border-color 0.3s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-tbl__case:hover {
			color: var(--ink);
			border-bottom-color: var(--ink);
		}
	}

	.fk-tbl__where {
		display: grid;
		gap: 4px;
		justify-items: start;
	}
	.fk-tbl__eng {
		font-size: 15px;
	}
	.fk-tbl__city {
		font-size: 13.5px;
		color: var(--ink-2);
	}
	.fk-tbl__sum {
		margin-top: 6px;
		font-size: 11.5px;
		color: var(--ink-3);
		line-height: 1.5;
		max-width: 22ch;
	}

	.fk-tbl__qcell {
		min-width: 0;
	}
	.fk-ai {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		margin: 10px 0 0;
		padding: 9px 12px;
		border: 1px dashed var(--line);
		border-radius: 14px;
		font-size: 13px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	.fk-ai b {
		font-weight: 500;
		color: var(--ink);
	}
	.fk-ai__tag {
		flex: none;
		padding: 2px 7px;
		border-radius: 100px;
		background: var(--dark);
		color: #fff;
		font-size: 10px;
		letter-spacing: 0.14em;
		line-height: 1.5;
	}
	.fk-tbl__qs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 3px;
	}
	.fk-tbl__qs li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		padding: 7px 16px;
		background: var(--panel);
		border-radius: 100px;
	}
	.fk-tbl__q {
		font-size: 14.5px;
		overflow-wrap: anywhere;
	}
	.fk-tbl__freq {
		font-size: 11px;
		color: var(--ink-3);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	/* видео */
	.fk-video {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: clamp(20px, 3vw, 44px);
		align-items: center;
		background: var(--panel);
		border-radius: 26px;
		padding: clamp(20px, 2.4vw, 30px);
	}
	.fk-video__text {
		padding: clamp(4px, 1.4vw, 22px);
	}
	.fk-video__text p {
		margin: 16px 0 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
		max-width: 32em;
	}
	.fk-video__player {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 18px;
		background: #000;
	}

	/* основные услуги */
	.fk-main {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 22px);
	}
	.fk-main__item {
		background: var(--panel);
		border-radius: 22px;
		padding: clamp(22px, 2.4vw, 30px);
		display: grid;
		gap: 10px;
		align-content: start;
		transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-main__item:hover {
			transform: translateY(-4px);
		}
	}
	.fk-main__item.featured {
		background: var(--dark);
		color: #f0f0f0;
	}
	.fk-main__n {
		font-size: 10.5px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
	}
	.fk-main__item.featured .fk-main__n {
		color: rgba(255, 255, 255, 0.5);
	}
	.fk-main__t {
		font-size: clamp(19px, 1.9vw, 24px);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		line-height: 1.15;
	}
	.fk-main__d {
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.fk-main__item.featured .fk-main__d {
		color: rgba(255, 255, 255, 0.72);
	}
	.fk-main__note {
		margin-top: 6px;
		padding-top: 14px;
		border-top: 1px solid var(--line-soft);
		font-size: 11px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-main__item.featured .fk-main__note {
		border-color: rgba(255, 255, 255, 0.18);
		color: rgba(255, 255, 255, 0.55);
	}
	.fk-chip--all {
		background: var(--ink);
		color: #fff;
	}

	/* большой блок */
	.fk-feature {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
		gap: clamp(16px, 2vw, 26px);
		align-items: stretch;
	}
	.fk-feature__panel {
		background: var(--panel);
		border-radius: 26px;
		padding: clamp(24px, 3.4vw, 48px);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.fk-feature__panel p {
		margin: 14px 0 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
		max-width: 30em;
	}
	.fk-feature__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 32px);
	}
	/* исходник 600×800 — не растягиваем его на всю ширину, иначе мылит */
	.fk-feature__img {
		width: 100%;
		height: 100%;
		max-height: clamp(300px, 42vw, 520px);
		object-fit: cover;
		object-position: center 30%;
		border-radius: 26px;
		background: var(--tile);
	}

	.fk-cases {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 24px);
		margin-top: clamp(14px, 1.8vw, 24px);
	}
	.fk-case {
		display: grid;
		gap: 6px;
		align-content: start;
	}
	.fk-case .fk-shot {
		margin-bottom: 12px;
	}
	.fk-case__ind {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-case__row {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--line);
		margin-bottom: 6px;
	}
	.fk-case__row b {
		font-size: clamp(22px, 2.2vw, 30px);
		font-weight: 400;
		letter-spacing: -0.02em;
	}
	.fk-case__row span {
		font-size: 12px;
		color: var(--ink-3);
	}
	.fk-case__t {
		font-size: 15.5px;
		line-height: 1.3;
	}
	.fk-case__d {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.5;
	}

	/* принципы */
	.fk-princ {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(20px, 2.6vw, 40px);
	}
	.fk-princ > div {
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}
	.fk-princ h3 {
		margin: 0 0 10px;
		font-size: 17px;
		font-weight: 500;
		letter-spacing: 0;
	}
	.fk-princ p {
		margin: 0;
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.55;
	}

	/* услуги */
	.fk-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: clamp(22px, 2.6vw, 32px);
	}
	.fk-chip {
		padding: 9px 16px;
		border-radius: 100px;
		background: var(--tile);
		font-size: 12.5px;
		color: var(--ink-2);
		transition: background 0.25s, color 0.25s;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-chip:hover {
			background: var(--ink);
			color: #fff;
		}
	}
	.fk-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 22px);
	}
	.fk-card {
		background: var(--panel);
		border-radius: 18px;
		padding: clamp(20px, 2.2vw, 26px);
		display: grid;
		gap: 7px;
		align-content: start;
		transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-card:hover {
			transform: translateY(-4px);
		}
	}
	.fk-card__cat {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.fk-card__t {
		font-size: 16px;
		line-height: 1.3;
	}
	.fk-card__d {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.fk-card__p {
		margin-top: 6px;
		padding-top: 12px;
		border-top: 1px solid var(--line-soft);
		font-size: 13.5px;
	}
	.fk-card__p i {
		font-style: normal;
		color: var(--ink-3);
	}
	.fk-other {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 22px);
	}
	.fk-other > div {
		background: var(--panel);
		border-radius: 18px;
		padding: clamp(18px, 2vw, 24px);
		display: grid;
		gap: 8px;
		align-content: start;
	}
	.fk-other b {
		font-size: 15px;
		font-weight: 500;
	}
	.fk-other span {
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.5;
	}

	/* ниши */
	.fk-niches {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(18px, 2.4vw, 36px);
	}
	.fk-niches__h {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		padding-bottom: 12px;
		margin-bottom: 12px;
		border-bottom: 1px solid var(--line);
	}
	.fk-niches ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 7px;
	}
	.fk-niches li {
		font-size: 13.5px;
		color: var(--ink-2);
	}

	/* направления */
	.fk-dirs {
		border-top: 1px solid var(--line);
	}
	.fk-dirs a {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr) 60px;
		gap: clamp(14px, 3vw, 40px);
		align-items: center;
		padding: clamp(18px, 2.2vw, 26px) 0;
		border-bottom: 1px solid var(--line);
		transition: padding-inline 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), background 0.3s;
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-dirs a:hover {
			padding-inline: 16px;
			background: var(--panel);
		}
	}
	.fk-dirs span {
		font-size: clamp(16px, 1.7vw, 20px);
	}
	.fk-dirs i {
		font-style: normal;
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.fk-dirs b {
		font-size: 12px;
		font-weight: 400;
		color: var(--ink-3);
		text-align: right;
	}

	/* агентство */
	.fk-about {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: clamp(20px, 3vw, 48px);
		align-items: center;
		background: var(--panel);
		border-radius: 26px;
		padding: clamp(18px, 2vw, 28px);
	}
	.fk-about__text {
		padding: clamp(4px, 1vw, 16px);
	}
	.fk-about__text p {
		margin: 14px 0 0;
		font-size: 14.5px;
		line-height: 1.62;
		color: var(--ink-2);
		max-width: 34em;
	}
	.fk-about__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
	.fk-about__acts .fk-pill {
		background: var(--tile);
	}
	.fk-about__acts .fk-pill--solid {
		background: var(--ink);
		color: #fff;
	}
	.fk-about__photos {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.fk-about__photos figure {
		margin: 0;
	}
	.fk-about__photos img {
		width: 100%;
		height: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		border-radius: 16px;
		background: var(--tile);
	}
	.fk-about__photos figcaption {
		margin-top: 8px;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	/* подвал */
	.fk-foot {
		max-width: var(--wide);
		margin: clamp(48px, 6vw, 88px) auto 0;
		padding: 0 var(--pad);
	}
	.fk-foot__cols {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(20px, 3vw, 40px);
		padding-bottom: clamp(28px, 3vw, 44px);
		border-bottom: 1px solid var(--line);
	}
	.fk-foot__cols > div {
		display: grid;
		gap: 9px;
		align-content: start;
	}
	.fk-foot__h {
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 6px;
	}
	.fk-foot__cols a {
		font-size: 13.5px;
		color: var(--ink-2);
	}
	@media (hover: hover) and (pointer: fine) {
		.fk-foot__cols a:hover {
			color: var(--ink);
		}
	}
	.fk-foot__mut {
		font-size: 13px;
		color: var(--ink-3);
	}
	.fk-foot__bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		padding: 20px 0 32px;
		font-size: 11.5px;
		letter-spacing: 0.06em;
		color: var(--ink-3);
	}

	/* адаптив */
	@media (max-width: 1180px) {
		.fk-steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.fk-niches,
		.fk-other {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 1000px) {
		.fk-grid,
		.fk-cases,
		.fk-princ,
		.fk-main {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.fk-tbl__head {
			display: none;
		}
		.fk-tbl__row {
			grid-template-columns: minmax(0, 1fr);
			gap: 18px;
		}
		.fk-tbl__proj .fk-logo-plate {
			width: auto;
			min-width: 180px;
		}
		.fk-tbl__where {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: 4px 12px;
		}
		.fk-tbl__sum {
			margin-top: 0;
			max-width: none;
			flex-basis: 100%;
		}
		.fk-tbl__qs li {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 1px;
			padding: 7px 16px 8px;
			border-radius: 16px;
		}
		.fk-claim {
			align-items: flex-start;
		}
		.fk-eng {
			margin-left: 0;
			width: 100%;
			justify-content: stretch;
		}
		.fk-eng__b {
			flex: 1;
			padding: 10px 14px;
		}
		.fk-foot__cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 860px) {
		.fk-anons {
			flex-wrap: wrap;
			border-radius: 26px;
			row-gap: 12px;
		}
		.fk-anons__txt {
			flex: 1 1 200px;
		}
		.fk-anons__go {
			margin-left: 0;
			flex-basis: 100%;
			padding-top: 12px;
			border-top: 1px solid rgba(255, 255, 255, 0.15);
			justify-content: space-between;
		}
		.fk-head__nav {
			display: none;
		}
		.fk-burger {
			display: flex;
		}
		.fk-head__acts .fk-pill--sm {
			display: none;
		}
		.fk-head__acts {
			margin-left: auto;
		}
		.fk-big {
			grid-template-columns: minmax(0, 1fr);
		}
		.fk-hero__grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.fk-hero__media {
			order: -1;
		}
		.fk-hero__img {
			max-height: 46vh;
		}
		.fk-feature {
			grid-template-columns: minmax(0, 1fr);
		}
		.fk-feature__img {
			order: -1;
			max-height: 42vh;
		}
		.fk-stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.fk-stats > div:nth-child(3) {
			border-left: 0;
			padding-left: 0;
		}
		.fk-markers > div {
			grid-template-columns: minmax(0, 1fr);
		}
		.fk-about,
		.fk-video {
			grid-template-columns: minmax(0, 1fr);
		}
		.fk-dirs a {
			grid-template-columns: minmax(0, 1fr) 40px;
		}
		.fk-dirs i {
			grid-column: 1 / -1;
			margin-top: 6px;
		}
	}
	/* очень узкие экраны и сжатая панель предпросмотра */
	@media (max-width: 400px) {
		.fk h1 {
			font-size: 17px;
			letter-spacing: 0;
		}
		.fk-hero__panel {
			padding: 18px;
		}
		.fk-feature__panel {
			padding: 18px;
		}
		.fk-card,
		.fk-steps li,
		.fk-other > div,
		.fk-revs figure {
			padding: 18px;
		}
	}

	@media (max-width: 620px) {
		.fk-util {
			grid-template-columns: auto auto;
			font-size: 9.5px;
		}
		.fk-util__mid {
			display: none;
		}
		.fk-logo {
			letter-spacing: 0.22em;
		}
		.fk-steps,
		.fk-grid,
		.fk-cases,
		.fk-princ,
		.fk-main,
		.fk-niches,
		.fk-other,
		.fk-foot__cols {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
