<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, geo } from '$lib/config/site.js';
	import { graph, orgSchema, breadcrumbSchema, faqSchema } from '$lib/seo.js';

	const path = '/uslugi/direkt/';
	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Услуги', href: '/uslugi/' },
		{ title: 'Яндекс Директ', href: path }
	];

	/* Схема оплаты — главное отличие от рынка, поэтому идёт первым блоком. */
	const model = [
		{
			n: '01',
			t: 'Один платёж на старте',
			d: 'Оплачиваете запуск: аналитику ниши, сборку кабинета, семантику, объявления и посадочную. Это единственный фиксированный платёж за всё время работы.'
		},
		{
			n: '02',
			t: 'Дальше — только из прибыли',
			d: 'Когда кампании начали приносить деньги, мы берём процент от прибыли, которую заработала наша настройка. Не заработали — не берём.'
		},
		{
			n: '03',
			t: 'Абонентки нет',
			d: 'Нет схемы «вы платите каждый месяц, а мы раз в две недели меняем ставку». Наш доход растёт только вместе с вашим — значит, выжимать проект максимально выгодно нам самим.'
		}
	];

	const proofs = [
		{ v: '15 000 ₽', l: 'расход на Директ в день', s: 'на одном из текущих проектов' },
		{ v: '100 000 ₽', l: 'выручка в тот же день', s: 'скриншоты кабинета — в канале' },
		{ v: '100–150 ₽', l: 'цена лида, юруслуги СПб', s: 'с первого дня жизни кампании' }
	];

	const works = [
		{ t: 'Разбор ниши и экономики', d: 'Считаем, сколько вы можете платить за заявку и за клиента. Если экономика не сходится — говорим об этом до денег, а не после.' },
		{ t: 'Сборка кабинета', d: 'Структура кампаний, семантика, минус-слова, объявления, расширения, корректировки по устройствам, гео и времени.' },
		{ t: 'Посадочная под трафик', d: 'Трафик приземляется туда, где на него отвечают. Правим или собираем лендинг — часть кейсов начиналась именно с этого.' },
		{ t: 'Аналитика и коллтрекинг', d: 'Метрика, цели, сквозная аналитика. Без этого невозможно считать прибыль, а вся модель оплаты держится именно на ней.' },
		{ t: 'Ведение и оптимизация', d: 'Ставки, площадки, аудитории, чистка запросов, тесты объявлений. Каждый день, а не «раз в месяц отчёт».' },
		{ t: 'Связка с SEO', d: 'Директ быстро показывает, какие запросы дают заявки, — это напрямую уточняет приоритеты в продвижении и наоборот.' }
	];

	const faq = [
		{
			q: 'Как именно считается процент от прибыли?',
			a: 'Мы фиксируем в договоре, что считаем прибылью: выручка с заявок, приведённых рекламой, минус рекламный бюджет и себестоимость. Считаем по вашим данным из CRM и аналитики, доступ к которым остаётся у вас. Процент обсуждается на старте и зависит от ниши и маржинальности.'
		},
		{
			q: 'Почему стартовый платёж вообще нужен?',
			a: 'Запуск — это несколько недель работы команды до первого рубля выручки: аналитика, семантика, кабинет, объявления, посадочная, аналитика. Стартовый платёж покрывает эту часть. Всё, что дальше, мы зарабатываем вместе с вами.'
		},
		{
			q: 'Кто платит рекламный бюджет?',
			a: 'Бюджет вы платите Яндексу напрямую, со своего кабинета. Мы к деньгам на рекламу не прикасаемся — так вы в любой момент видите реальный расход и можете его остановить.'
		},
		{
			q: 'Через сколько будут заявки?',
			a: 'Кампании запускаются за неделю-полторы, первые обращения обычно идут в первые дни после запуска. На проекте по юруслугам в Петербурге лид пошёл по 100–150 рублей с первого дня жизни кампании.'
		},
		{
			q: 'Где посмотреть подтверждения?',
			a: 'Скриншоты кабинетов с расходом и выручкой мы выкладываем в Telegram-канале агентства, часть кейсов дублируется в канал в MAX. Это те же цифры, что и в отчётах клиентам, просто без имён проектов там, где клиент попросил не называть.'
		},
		{
			q: 'Вы берёте любые проекты?',
			a: 'Нет. Модель работает только там, где сходится экономика и где можно достоверно считать прибыль. Если ниша перегрета настолько, что клик стоит дороже вашей маржи, мы скажем это сразу и предложим начать с SEO.'
		}
	];

	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), faqSchema(faq), {
		'@type': 'Service',
		name: 'Настройка и ведение Яндекс Директа',
		serviceType: 'Контекстная реклама',
		provider: { '@id': site.url + '/#organization' },
		areaServed: geo.city,
		url: site.url + path
	});
</script>

<Seo
	title="Яндекс Директ с оплатой из прибыли — контекстная реклама в СПб | Фальков"
	description="Настройка и ведение Яндекс Директа без абонентской платы: один платёж на старте, дальше процент от прибыли, которую принесла наша настройка. Скриншоты расходов и выручки — в Telegram-канале агентства."
	{path}
	{schema}
/>

<article>
	<header class="shead">
		<div class="container">
			<Breadcrumbs items={crumbs} />
			<div class="shead__grid">
				<div>
					<span class="eyebrow">Направление 02</span>
					<h1>Яндекс Директ с оплатой из прибыли</h1>
					<p class="lead">
						Мы не работаем на абонентке. Клиент платит один раз на старте, дальше — только
						процент от прибыли, которую принесла наша настройка. Никакого «заплатили, а мы
						ничего не делаем»: наш доход растёт вместе с вашим.
					</p>
					<div class="shead__actions">
						<a class="btn" href={site.manager} target="_blank" rel="noopener">
							Обсудить запуск <Arrow />
						</a>
						<a class="btn btn--ghost" href={site.telegramChannel} target="_blank" rel="noopener">
							Кейсы в канале
						</a>
					</div>
				</div>
				<aside class="shead__card">
					<span class="eyebrow">Из текущих проектов</span>
					<div class="nums">
						{#each proofs as p}
							<div>
								<b>{p.v}</b>
								<span>{p.l}</span>
								<i>{p.s}</i>
							</div>
						{/each}
					</div>
				</aside>
			</div>
		</div>
	</header>

	<!-- Модель оплаты -->
	<section class="section section--tight section--dark">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Как мы берём деньги</span>
					<h2>Один платёж, дальше — из заработанного</h2>
				</div>
				<div>
					<p class="lead">
						Большинство агентств живёт с абонентской платы: пришли деньги — и хорошо, результат
						вторичен. У нас наоборот: после запуска мы зарабатываем только тогда, когда
						заработали вы.
					</p>
				</div>
			</div>
			<div class="model">
				{#each model as m, i}
					<div use:reveal={{ delay: i * 80 }}>
						<span class="model__n">{m.n}</span>
						<h3>{m.t}</h3>
						<p>{m.d}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Пруфы -->
	<section class="section section--tight">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Подтверждения</span>
					<h2>Скриншоты кабинетов, а не обещания</h2>
				</div>
				<div>
					<p class="lead">
						Расход и выручку по проектам мы выкладываем скриншотами прямо в канале агентства.
						Часть кейсов дублируется в канал в MAX.
					</p>
				</div>
			</div>
			<div class="chan">
				<a class="chan__i" href={site.telegramChannel} target="_blank" rel="noopener" use:reveal>
					<span class="chan__t">Telegram-канал агентства</span>
					<span class="chan__h">{site.telegramLabel}</span>
					<span class="chan__d">
						Кейсы по Директу и SEO: расход, выручка, цена лида. Там же — разборы ниш и
						внутренняя кухня агентства.
					</span>
					<span class="chan__go">Открыть канал <Arrow /></span>
				</a>
				<a class="chan__i" href={site.max} target="_blank" rel="noopener" use:reveal={{ delay: 80 }}>
					<span class="chan__t">Канал в MAX</span>
					<span class="chan__h">Дубли кейсов</span>
					<span class="chan__d">
						Часть кейсов выкладываем в MAX — если вам удобнее там, подписывайтесь и пишите
						сразу в этом мессенджере.
					</span>
					<span class="chan__go">Открыть MAX <Arrow /></span>
				</a>
			</div>
		</div>
	</section>

	<!-- Что делаем -->
	<section class="section section--tight section--alt">
		<div class="container">
			<div class="section-head" use:reveal>
				<div class="section-head__title">
					<span class="eyebrow">Что входит</span>
					<h2>Работы по проекту</h2>
				</div>
				<div>
					<p class="lead">
						Мы отвечаем за весь путь от запроса до заявки, включая посадочную. Иначе не за что
						брать процент от прибыли.
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
			<p class="more" use:reveal>
				<a class="link-arrow" href="/uslugi/kontekstnaya-reklama/">
					Как Директ работает в связке с SEO <Arrow />
				</a>
			</p>
		</div>
	</section>

	<CtaBlock
		title="Посчитаем, сходится ли экономика"
		text="Разберём нишу и цифры: сколько вы можете платить за заявку и есть ли смысл заходить в Директ. Если не сходится — скажем сразу."
		source="Директ хаб"
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
		gap: 16px;
		margin-top: 14px;
	}
	.nums div {
		display: grid;
		gap: 2px;
	}
	.nums b {
		font-size: clamp(24px, 2.8vw, 34px);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.nums span {
		font-size: 13px;
		color: var(--ink-2);
	}
	.nums i {
		font-style: normal;
		font-size: 11.5px;
		color: var(--ink-3);
	}
	.model {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(16px, 2vw, 32px);
	}
	.model > div {
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}
	.model__n {
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
	}
	.model h3 {
		font-size: clamp(19px, 1.8vw, 24px);
		letter-spacing: -0.02em;
		margin: 10px 0 8px;
	}
	.model p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--on-dark-2);
	}
	.chan {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(14px, 1.6vw, 22px);
	}
	.chan__i {
		display: grid;
		align-content: start;
		gap: 6px;
		padding: clamp(22px, 2.4vw, 32px);
		border: 1px solid var(--line);
		border-radius: 26px;
		background: var(--card);
		transition: transform 0.5s var(--ease), border-color 0.4s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.chan__i:hover {
			transform: translateY(-5px);
			border-color: var(--ink-3);
		}
	}
	.chan__t {
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.chan__h {
		font-size: clamp(20px, 2vw, 27px);
		letter-spacing: -0.025em;
	}
	.chan__d {
		margin-top: 6px;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.chan__go {
		margin-top: 14px;
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
	.more {
		margin: clamp(22px, 2.6vw, 34px) 0 0;
	}
	@media (max-width: 1000px) {
		.shead__grid,
		.model,
		.chan {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
