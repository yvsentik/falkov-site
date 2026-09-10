<script>
	/* Коммерческое предложение под конкретный проект. На страницу нет ссылок
	   с сайта, в шапке noindex, в sitemap её нет. Ссылку отправляет менеджер. */
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions.js';
	import { site } from '$lib/config/site.js';
	import { lead } from '$lib/lead.svelte.js';

	const path = '/kommercheskie-predlozheniya/priviata-ru/';
	const client = 'priviata.ru';

	/* Съём видимости priviata.ru. bad — запросы, по которым сайт светиться не должен. */
	const visibility = [
		{ q: 'школьницы приват', pos: 2, ws: '3 286', bad: true },
		{ q: 'приваты школьниц', pos: 4, ws: '3 123', bad: true },
		{ q: 'приват школа', pos: 4, ws: '266', bad: true },
		{ q: 'школа петроградский район', pos: 6, ws: '6 342' },
		{ q: 'частная школа петроградский район', pos: 6, ws: '44' },
		{ q: 'школа полного дня спб', pos: 6, ws: '29' },
		{ q: 'zapis privat', pos: 11, ws: '589', bad: true },
		{ q: 'частный приват', pos: 12, ws: '2 604', bad: true },
		{ q: 'школа правда', pos: 13, ws: '21 460', bad: true },
		{ q: 'школьница в привате', pos: 13, ws: '543', bad: true },
		{ q: 'приват колледж', pos: 20, ws: '269', bad: true },
		{ q: 'школы припяти', pos: 22, ws: '894', bad: true }
	];

	const plan = [
		{
			n: '01',
			t: 'Контекст',
			sub: 'Директ и Яндекс Карты',
			body: [
				'Скучно и заезжено, берём на себя. Из интересного здесь только одно: мы умеем крутить Директ в три раза дешевле кого угодно в нише. Всё легально, Яндекс сам выкатывает свои бесконечные акции.',
				'Проблема в том, что большинство агентств эти способы игнорируют. В них агентству невозможно получить кешбэк с открученного бюджета клиента. Нам лично выгоднее сделать вашу рекламу дешевле в три раза и заработать доверие.'
			],
			tags: ['Яндекс Директ', 'Яндекс Карты', 'Трафик в 3 раза дешевле']
		},
		{
			n: '02',
			t: 'SEO и сайт',
			sub: 'Сейчас здесь беда полная',
			body: [
				'Первые две недели уходят на разговоры со всеми ЛПР школы и директорами. Нам нужно понять ожидания руководящего состава по позиционированию школы в интернете и по стратегическому развитию.',
				'Дальше на вашем домене разворачиваем новый сайт: красивый, продающий. Десятки новых страниц, посадочные под разные рекламные креативы и, главное, под поиск. Продвигать одностраничник бессмысленно.'
			],
			tags: ['Новый сайт на вашем домене', 'Десятки посадочных', 'Чистка выдачи']
		},
		{
			n: '03',
			t: 'Telegram Ads и ВК',
			sub: 'Длинный цикл сделки',
			body: [
				'Мама выбирает школу долго. У современной мамы в телефоне все соцсети, она смотрит блогеров и читает новости. Инфлюенс-маркетингом сразу заниматься не будем, сначала надо обуздать Telegram, потом ВК.',
				'Главное преимущество Telegram: через официальный кабинет TG Ads свою рекламу можно засунуть в канал любого конкурента и в любой канал по школьному обучению и образованию.',
				'Как это выглядит: переупаковываем канал, создаём в нём понятную воронку продаж, раскрываем преимущества, отвечаем на основные боли других частных школ и бюджетных учреждений. Контент преимущественно не видео, а живые фотографии из жизни школы и анонсы. В идеале делаем лицо бренда, чтобы канал вёлся от лица конкретного человека. Это не принуждает к блогерству, но раз в две недели нужно будет сфотографировать что-то в школе под новость.'
			],
			tags: ['Аудитории конкурентов', 'Каналы по образованию', 'Родители дошкольников']
		},
		{
			n: '04',
			t: 'Вертикальный контент',
			sub: 'Рилс, подкасты. Но не первым',
			body: [
				'Снимать мы умеем, ведём одного из самых крупных блогеров по визам и ВНЖ в РФ. Подкасты, рилсы, вертикалка: никаких проблем.',
				'Единственное, это направление вообще не будем ставить в первую очередь. Здесь результат не гарантирован в ближайшем будущем. Да и трафик вести некуда, пока сайт слабый и соцсети пустые.'
			],
			tags: ['Рилсы', 'Подкасты', 'Позже по очереди']
		}
	];

	/* Блогер, которого ведём. Цифры сняты 10 сентября 2026, оба канала открыты. */
	const blogger = [
		{
			net: 'Telegram',
			num: '76 299',
			unit: 'подписчиков',
			name: 'Dmitrii_visa.news ✈️ Europe',
			href: 'https://t.me/+ONvYBircl11iOTJi',
			label: 't.me/+ONvYBircl11iOTJi'
		},
		{
			net: 'Instagram',
			num: '59 900',
			unit: 'подписчиков',
			name: 'Dmitrii Volkov, аккаунт с галочкой',
			href: 'https://www.instagram.com/dmitrii.visa.news/',
			label: '@dmitrii.visa.news'
		}
	];

	const bonuses = [
		{
			t: 'Партнёрства с крупным бизнесом',
			d: 'Сотрудничество в образовании с большими брендами вроде Т-Банка. У клиента это дало и охват, и доверие родителей.'
		},
		{
			t: 'Сообщество родителей',
			d: 'Создание бизнес-сообщества родителей вокруг школы. Работает на сарафан лучше любой рекламы.'
		},
		{
			t: 'Родительские мероприятия',
			d: 'Формат, который поднял клиенту количество продаж и конверсию в договор.'
		}
	];
</script>

<Seo
	title="План продвижения {client} | {site.name}"
	description="Коммерческое предложение по комплексному маркетингу для частной школы {client}: контекст, сайт и SEO, Telegram Ads, вертикальный контент."
	{path}
	noindex
/>

<div class="cp">
	<header class="cp-head">
		<a class="cp-logo" href="/">falkov<span>маркетинг</span></a>
		<a class="cp-tg" href={site.manager} target="_blank" rel="noopener">{site.managerLabel}</a>
	</header>

	<nav class="cp-crumbs" aria-label="Хлебные крошки">
		<a href="/">Главная</a>
		<span aria-hidden="true">/</span>
		<span>Коммерческие предложения</span>
		<span aria-hidden="true">/</span>
		<b>{client}</b>
	</nav>

	<!-- ЗАГОЛОВОК -->
	<section class="cp-hero">
		<span class="cp-eyebrow">Коммерческое предложение</span>
		<h1>План продвижения <span class="cp-dom">priviata.ru</span></h1>
		<p class="cp-lead">
			Комплексный маркетинг для частной школы: что делаем, в каком порядке и почему именно так.
		</p>
		<div class="cp-hero__acts">
			<button class="cp-btn cp-btn--solid" type="button" onclick={() => (lead.open = true)}>
				Обсудить план
			</button>
			<a class="cp-btn" href={site.manager} target="_blank" rel="noopener">Написать Роману</a>
		</div>
	</section>

	<!-- ТЕКУЩАЯ СИТУАЦИЯ -->
	<section class="cp-sec">
		<div class="cp-sec__head" use:reveal>
			<span class="cp-n">01</span>
			<h2>Где вы сейчас</h2>
		</div>
		<div class="cp-grid cp-grid--4">
			<div class="cp-card" use:reveal>
				<h3>Одностраничник</h3>
				<p>Доверия вызывает сильно меньше, чем нормальный многостраничный сайт.</p>
			</div>
			<div class="cp-card" use:reveal={{ delay: 60 }}>
				<h3>Соцсети на нуле</h3>
				<p>ВК и Telegram пустые. Каналов, куда вести тёплую аудиторию, просто нет.</p>
			</div>
			<div class="cp-card" use:reveal={{ delay: 120 }}>
				<h3>SEO на дне</h3>
				<p>Видимость собрана из мусора. Ниже полный съём, там всё видно.</p>
			</div>
			<div class="cp-card" use:reveal={{ delay: 180 }}>
				<h3>Нужен комплекс</h3>
				<p>Одним каналом такой бизнес не вытащить. Нужен маркетинг целиком.</p>
			</div>
		</div>
	</section>

	<!-- КТО МЫ -->
	<section class="cp-sec cp-sec--dark">
		<div class="cp-inner">
			<div class="cp-sec__head" use:reveal>
				<span class="cp-n">02</span>
				<h2>Кто мы</h2>
			</div>
			<div class="cp-who">
				<div use:reveal>
					<p>
						Более 50 бизнесов продвигали и продвигаем. В портфеле есть крупные бренды: Роснефть,
						ARAVIA, ЭкоНива.
					</p>
					<p>
						Успешно продвигаем две частные школы и три частных детских сада. Опыта накопилось
						много, и ничего не мешает переложить его на ваш проект.
					</p>
				</div>
				<a class="cp-rival" href="https://oneischool.com/" target="_blank" rel="noopener" use:reveal={{ delay: 80 }}>
					<span class="cp-rival__label">Самое важное</span>
					<span class="cp-rival__t">Мы ведём маркетинг вашего конкурента в Москве</span>
					<span class="cp-rival__link">oneischool.com <i aria-hidden="true">↗</i></span>
				</a>
			</div>
		</div>
	</section>

	<!-- ПРИНЦИПЫ -->
	<section class="cp-sec">
		<div class="cp-sec__head" use:reveal>
			<span class="cp-n">03</span>
			<h2>Как мы работаем</h2>
		</div>
		<div class="cp-grid cp-grid--3">
			<div class="cp-card" use:reveal>
				<h3>Лезем в отдел продаж</h3>
				<p>
					Отвечаем не только за трафик. Настраиваем аналитику, связываем маркетинг с продажами и
					смотрим, что происходит с заявкой после клика.
				</p>
			</div>
			<div class="cp-card" use:reveal={{ delay: 60 }}>
				<h3>Не работаем молча</h3>
				<p>
					Отчёты раз в месяц никого не спасали. Для работы с нами бизнесу нужно назначить ЛПР,
					который будет с нами на связи ежедневно.
				</p>
			</div>
			<div class="cp-card" use:reveal={{ delay: 120 }}>
				<h3>Сначала скучно</h3>
				<p>
					Заходим проверенными беспроигрышными направлениями. Смелые эксперименты включаем
					только после того, как пошла окупаемость.
				</p>
			</div>
		</div>

		<p class="cp-claim" use:reveal>
			<b>И очень важно смотреть на сезон.</b> Если в сентябре ждём рост заявок из госшкол, странно
			игнорировать контекст и делать ставку на SEO, которое даст лиды далеко не в первый месяц.
		</p>
	</section>

	<!-- ПЛАН -->
	<section class="cp-sec">
		<div class="cp-sec__head" use:reveal>
			<span class="cp-n">04</span>
			<h2>Наше видение ситуации</h2>
		</div>

		{#each plan as p, i}
			<article class="cp-step" use:reveal={{ delay: (i % 2) * 60 }}>
				<div class="cp-step__l">
					<span class="cp-step__n">{p.n}</span>
					<h3>{p.t}</h3>
					<span class="cp-step__sub">{p.sub}</span>
					<ul class="cp-tags">
						{#each p.tags as t}<li>{t}</li>{/each}
					</ul>
				</div>
				<div class="cp-step__r">
					{#each p.body as par}<p>{par}</p>{/each}

					{#if p.n === '02'}
						<!-- Съём видимости и сравнение дизайна показываем прямо внутри блока про SEO -->
						<div class="cp-vis">
							<div class="cp-vis__head">
								<span class="cp-vis__label">Текущая видимость priviata.ru</span>
								<span class="cp-vis__note">
									Сайт светится по запросам каких-то уродов. «Школьницы приват» это 18+.
									На старте сотрудничества это недоразумение надо исправлять: такими темпами
									вполне можно потерять домен.
								</span>
							</div>
							<div class="cp-tbl" role="table">
								<div class="cp-tbl__h" role="row">
									<span role="columnheader">Запрос</span>
									<span role="columnheader">Поз.</span>
									<span role="columnheader">Wordstat</span>
								</div>
								{#each visibility as v}
									<div class="cp-tbl__r" class:bad={v.bad} role="row">
										<span class="cp-tbl__q">
											{v.q}
											{#if v.bad}<em>мусор</em>{/if}
										</span>
										<span class="cp-tbl__p">{v.pos}</span>
										<span class="cp-tbl__w">{v.ws}</span>
									</div>
								{/each}
							</div>
						</div>

						<div class="cp-ba">
							<span class="cp-ba__label">Редизайн</span>
							<h4 class="cp-ba__t">
								Как мы сделали редизайн двум частным школам и трём частным детсадам в Москве
							</h4>
							<p class="cp-ba__sub">Разницу сравните сами, обе версии открыты.</p>
							<div class="cp-ba__grid">
								<a class="cp-ba__i" href="https://old.oneischool.com/" target="_blank" rel="noopener">
									<span class="cp-ba__pic">
										<img
											src="/cp/priviata/oneischool-before.jpg"
											width="1280"
											height="760"
											alt="Сайт ONE! International School до работы с нами"
											loading="lazy"
											decoding="async"
										/>
									</span>
									<span class="cp-ba__cap">
										<b>Было</b>
										<span>old.oneischool.com</span>
										<i aria-hidden="true">↗</i>
									</span>
								</a>
								<a class="cp-ba__i is-new" href="https://oneischool.com/" target="_blank" rel="noopener">
									<span class="cp-ba__pic">
										<img
											src="/cp/priviata/oneischool-after.jpg"
											width="1280"
											height="760"
											alt="Сайт ONE! International School после работы с нами"
											loading="lazy"
											decoding="async"
										/>
									</span>
									<span class="cp-ba__cap">
										<b>Стало</b>
										<span>oneischool.com</span>
										<i aria-hidden="true">↗</i>
									</span>
								</a>
							</div>
						</div>
					{/if}

					{#if p.n === '04'}
						<div class="cp-blog">
							<span class="cp-blog__label">Тот самый блогер по визам и ВНЖ</span>
							<div class="cp-blog__grid">
								{#each blogger as b}
									<a class="cp-blog__i" href={b.href} target="_blank" rel="noopener">
										<span class="cp-blog__net">{b.net}</span>
										<span class="cp-blog__num">{b.num}</span>
										<span class="cp-blog__unit">{b.unit}</span>
										<span class="cp-blog__name">{b.name}</span>
										<span class="cp-blog__link">{b.label} <i aria-hidden="true">↗</i></span>
									</a>
								{/each}
							</div>
							<span class="cp-blog__note">
								Цифры на 10 сентября 2026. Оба канала открыты, можно зайти и посмотреть.
							</span>
						</div>
					{/if}
				</div>
			</article>
		{/each}

		<p class="cp-more" use:reveal>Остальные направления будем обсуждать в процессе.</p>
	</section>

	<!-- ВЫВОДЫ -->
	<section class="cp-sec cp-sec--dark">
		<div class="cp-inner">
			<div class="cp-sec__head" use:reveal>
				<span class="cp-n">05</span>
				<h2>Что в итоге</h2>
			</div>
			<p class="cp-out" use:reveal>
				Стратегия проверена опытом, понятна здравым смыслом и приносит окупаемость максимально
				быстро.
			</p>
			<ol class="cp-out__list">
				<li use:reveal><b>Директ</b> даёт трафика больше и дешевле, чем сейчас.</li>
				<li use:reveal={{ delay: 60 }}>
					<b>Сайт</b> переделывается и расширяется под SEO и под доверие.
				</li>
				<li use:reveal={{ delay: 120 }}>
					<b>Telegram</b> упаковывается вокруг личного бренда директора или владельца школы.
				</li>
				<li use:reveal={{ delay: 180 }}>
					<b>Вертикальный контент</b> подхватывает этот же личный бренд, когда придёт время.
				</li>
			</ol>
		</div>
	</section>

	<!-- БОНУСЫ -->
	<section class="cp-sec">
		<div class="cp-sec__head" use:reveal>
			<span class="cp-n">06</span>
			<h2>Бонусом</h2>
		</div>
		<p class="cp-sec__lead" use:reveal>
			В работе используем наработки нашего клиента, которые подняли школе продажи, конверсию и
			прибыль.
		</p>
		<div class="cp-grid cp-grid--3">
			{#each bonuses as b, i}
				<div class="cp-card" use:reveal={{ delay: (i % 3) * 60 }}>
					<h3>{b.t}</h3>
					<p>{b.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ФИНАЛ -->
	<section class="cp-sec cp-sec--dark">
		<div class="cp-inner">
			<div class="cp-cta" use:reveal>
				<h2>Обсудим план?</h2>
				<p>
					Разберём по пунктам, посчитаем бюджеты и сроки. Начать можно с любого блока, порядок
					подстроим под ваш сезон.
				</p>
				<div class="cp-cta__acts">
					<button class="cp-btn cp-btn--light" type="button" onclick={() => (lead.open = true)}>
						Оставить заявку
					</button>
					<a class="cp-btn cp-btn--ghost" href="/keysy/">Посмотреть кейсы</a>
					<a class="cp-btn cp-btn--ghost" href={site.manager} target="_blank" rel="noopener">
						Написать Роману в Telegram
					</a>
				</div>
			</div>
		</div>
	</section>

	<footer class="cp-foot">
		<a href="/">На главную falkov-marketing.ru</a>
		<a href="tel:{site.phoneHref}">{site.phone}</a>
	</footer>
</div>

<style>
	.cp {
		--pad: clamp(16px, 3vw, 40px);
		--wide: 1180px;
		background: var(--paper);
		color: var(--ink);
		padding-bottom: clamp(30px, 4vw, 60px);
	}
	.cp :global(:where(a)) {
		color: inherit;
		text-decoration: none;
	}

	.cp-head {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: clamp(18px, 2.4vw, 28px) var(--pad) 0;
	}
	.cp-logo {
		display: inline-flex;
		align-items: baseline;
		gap: 10px;
		font-size: clamp(15px, 1.4vw, 18px);
		font-weight: 600;
	}
	.cp-logo span {
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.cp-tg {
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-2);
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
	}

	.cp-crumbs {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: clamp(20px, 2.6vw, 32px) var(--pad) 0;
		font-size: 12px;
		color: var(--ink-3);
	}
	.cp-crumbs a {
		border-bottom: 1px solid var(--line);
	}
	.cp-crumbs b {
		font-weight: 400;
		color: var(--ink);
	}

	/* кнопки */
	.cp-btn {
		display: inline-block;
		padding: 14px 26px;
		border: 1px solid var(--line);
		border-radius: 100px;
		background: transparent;
		font: inherit;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
		cursor: pointer;
		transition: background 0.3s var(--ease), color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}
	.cp-btn--solid {
		background: var(--dark);
		border-color: var(--dark);
		color: #fff;
	}
	.cp-btn--light {
		background: #fff;
		border-color: #fff;
		color: var(--dark);
	}
	.cp-btn--ghost {
		border-color: rgba(255, 255, 255, 0.3);
		color: var(--on-dark);
	}
	@media (hover: hover) and (pointer: fine) {
		.cp-btn:hover {
			background: var(--dark);
			border-color: var(--dark);
			color: #fff;
		}
		.cp-btn--solid:hover {
			background: var(--ink-2);
			border-color: var(--ink-2);
		}
		.cp-btn--light:hover,
		.cp-btn--ghost:hover {
			background: #fff;
			border-color: #fff;
			color: var(--dark);
		}
	}

	/* хиро */
	.cp-hero {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(18px, 2.4vw, 32px) var(--pad) clamp(28px, 3.6vw, 52px);
	}
	.cp-eyebrow {
		display: block;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: clamp(14px, 1.8vw, 22px);
	}
	.cp-hero h1 {
		margin: 0 0 18px;
		font-size: clamp(32px, 6vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.04em;
	}
	.cp-dom {
		display: inline-block;
		padding: 0 0.16em;
		border-radius: 12px;
		background: var(--dark);
		color: var(--on-dark);
	}
	.cp-lead {
		margin: 0;
		max-width: 54ch;
		font-size: clamp(15px, 1.5vw, 19px);
		line-height: 1.6;
		color: var(--ink-2);
	}
	.cp-hero__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(22px, 2.8vw, 34px);
	}

	/* секции */
	.cp-sec {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(24px, 3.2vw, 46px) var(--pad);
	}
	.cp-sec--dark {
		max-width: none;
		padding-inline: var(--pad);
	}
	.cp-sec--dark > .cp-inner {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(28px, 3.8vw, 56px) clamp(20px, 3vw, 48px);
		border-radius: 28px;
		background: var(--dark);
		color: var(--on-dark);
	}
	.cp-sec--dark h2 {
		color: var(--on-dark);
	}
	.cp-sec--dark .cp-n {
		color: var(--on-dark-2);
	}
	.cp-sec__head {
		display: flex;
		align-items: baseline;
		gap: 16px;
		margin-bottom: clamp(18px, 2.4vw, 30px);
	}
	.cp-sec__head h2 {
		margin: 0;
		font-size: clamp(26px, 3.4vw, 44px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.cp-n {
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
	}
	.cp-sec__lead {
		margin: 0 0 clamp(16px, 2vw, 24px);
		max-width: 56ch;
		font-size: clamp(14px, 1.4vw, 17px);
		line-height: 1.6;
		color: var(--ink-2);
	}

	/* карточки */
	.cp-grid {
		display: grid;
		gap: clamp(12px, 1.4vw, 18px);
	}
	.cp-grid--3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.cp-grid--4 {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
	.cp-card {
		padding: clamp(18px, 2.2vw, 28px);
		border: 1px solid var(--line);
		border-radius: 22px;
		background: var(--card);
	}
	.cp-card h3 {
		margin: 0 0 8px;
		font-size: clamp(16px, 1.6vw, 20px);
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.cp-card p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}

	/* кто мы */
	.cp-who {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: clamp(20px, 3vw, 44px);
		align-items: start;
	}
	.cp-who p {
		margin: 0 0 14px;
		max-width: 46ch;
		font-size: clamp(15px, 1.5vw, 18px);
		line-height: 1.6;
		color: var(--on-dark-2);
	}
	.cp-rival {
		display: grid;
		gap: 8px;
		padding: clamp(20px, 2.4vw, 30px);
		border-radius: 22px;
		background: #fff;
		color: var(--dark);
		transition: transform 0.4s var(--ease);
	}
	.cp-rival__label {
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.cp-rival__t {
		font-size: clamp(18px, 2vw, 24px);
		line-height: 1.3;
		letter-spacing: -0.02em;
	}
	.cp-rival__link {
		margin-top: 4px;
		font-size: 13px;
		color: var(--ink-2);
	}
	.cp-rival__link i {
		font-style: normal;
		margin-left: 6px;
		display: inline-block;
		transition: transform 0.35s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.cp-rival:hover {
			transform: translateY(-3px);
		}
		.cp-rival:hover .cp-rival__link i {
			transform: translate(2px, -2px);
		}
	}

	.cp-claim {
		margin: clamp(16px, 2vw, 24px) 0 0;
		padding: clamp(18px, 2.2vw, 26px) clamp(20px, 2.4vw, 30px);
		border-radius: 22px;
		background: var(--paper-2);
		font-size: clamp(15px, 1.5vw, 19px);
		line-height: 1.5;
		letter-spacing: -0.01em;
	}
	.cp-claim b {
		font-weight: 500;
	}

	/* шаги плана */
	.cp-step {
		display: grid;
		grid-template-columns: minmax(0, 0.62fr) minmax(0, 1.38fr);
		gap: clamp(18px, 3vw, 48px);
		padding: clamp(22px, 2.8vw, 36px) 0;
		border-top: 1px solid var(--line);
	}
	.cp-step__n {
		display: block;
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		margin-bottom: 8px;
	}
	.cp-step__l h3 {
		margin: 0 0 6px;
		font-size: clamp(24px, 3vw, 38px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.cp-step__sub {
		display: block;
		font-size: 13.5px;
		color: var(--ink-3);
	}
	.cp-tags {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.cp-tags li {
		padding: 7px 13px;
		border-radius: 100px;
		background: var(--paper-2);
		font-size: 12px;
		color: var(--ink-2);
	}
	.cp-step__r p {
		margin: 0 0 14px;
		font-size: clamp(14.5px, 1.4vw, 17px);
		line-height: 1.65;
		color: var(--ink-2);
	}
	.cp-step__r p:last-of-type {
		margin-bottom: 0;
	}

	/* съём видимости */
	.cp-vis {
		margin-top: clamp(20px, 2.4vw, 30px);
		padding: clamp(18px, 2.2vw, 26px);
		border: 1px dashed var(--line);
		border-radius: 22px;
	}
	.cp-vis__label {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.cp-vis__note {
		display: block;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink);
		max-width: 60ch;
	}
	.cp-tbl {
		margin-top: clamp(16px, 2vw, 22px);
		border-top: 1px solid var(--line);
	}
	.cp-tbl__h,
	.cp-tbl__r {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 54px 84px;
		gap: 10px;
		align-items: center;
		padding: 9px 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.cp-tbl__h {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.cp-tbl__q {
		font-size: 14.5px;
		overflow-wrap: anywhere;
	}
	.cp-tbl__q em {
		font-style: normal;
		margin-left: 8px;
		padding: 2px 8px;
		border-radius: 100px;
		background: var(--dark);
		color: #fff;
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.cp-tbl__r.bad .cp-tbl__q {
		color: var(--ink);
	}
	.cp-tbl__r:not(.bad) .cp-tbl__q {
		color: var(--ink-3);
	}
	.cp-tbl__p,
	.cp-tbl__w {
		font-size: 13px;
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	/* было / стало */
	/* было / стало */
	.cp-ba {
		margin-top: clamp(20px, 2.4vw, 30px);
		padding: clamp(20px, 2.4vw, 30px);
		border-radius: 24px;
		background: var(--dark);
		color: var(--on-dark);
	}
	.cp-ba__label {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--on-dark-2);
	}
	.cp-ba__t {
		margin: 10px 0 8px;
		max-width: 30ch;
		font-size: clamp(19px, 2.2vw, 28px);
		line-height: 1.2;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.cp-ba__sub {
		margin: 0 0 clamp(16px, 2vw, 22px);
		font-size: 14px;
		color: var(--on-dark-2);
	}
	.cp-ba__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(10px, 1.4vw, 16px);
	}
	.cp-ba__i {
		display: block;
		border-radius: 16px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.06);
		transition: transform 0.45s var(--ease), background 0.35s var(--ease);
	}
	.cp-ba__pic {
		display: block;
		position: relative;
		overflow: hidden;
	}
	.cp-ba img {
		display: block;
		width: 100%;
		height: auto;
		filter: grayscale(0.35);
		transition: filter 0.45s var(--ease), transform 0.6s var(--ease);
	}
	.cp-ba__i.is-new img {
		filter: none;
	}
	.cp-ba__cap {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 12px 16px;
		font-size: 12.5px;
		color: var(--on-dark-2);
	}
	.cp-ba__cap b {
		font-weight: 500;
		font-size: 14px;
		color: #fff;
	}
	.cp-ba__cap i {
		margin-left: auto;
		font-style: normal;
		transition: transform 0.35s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.cp-ba__i:hover {
			transform: translateY(-4px);
			background: rgba(255, 255, 255, 0.12);
		}
		.cp-ba__i:hover img {
			filter: none;
			transform: scale(1.015);
		}
		.cp-ba__i:hover .cp-ba__cap i {
			transform: translate(2px, -2px);
		}
	}

	.cp-more {
		margin: clamp(18px, 2.2vw, 26px) 0 0;
		padding-top: clamp(18px, 2.2vw, 26px);
		border-top: 1px solid var(--line);
		font-size: 14.5px;
		color: var(--ink-3);
	}

	/* выводы */
	.cp-out {
		margin: 0 0 clamp(18px, 2.2vw, 26px);
		max-width: 56ch;
		font-size: clamp(16px, 1.8vw, 22px);
		line-height: 1.45;
		letter-spacing: -0.015em;
		color: var(--on-dark);
	}
	.cp-out__list {
		list-style: none;
		counter-reset: out;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(12px, 1.6vw, 20px);
	}
	.cp-out__list li {
		counter-increment: out;
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.18);
		font-size: 15px;
		line-height: 1.55;
		color: var(--on-dark-2);
	}
	.cp-out__list li::before {
		content: '0' counter(out);
		display: block;
		margin-bottom: 6px;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		color: var(--on-dark-2);
	}
	.cp-out__list b {
		font-weight: 500;
		color: #fff;
	}

	/* финал */
	.cp-cta h2 {
		margin: 0 0 12px;
		font-size: clamp(24px, 3vw, 38px);
		letter-spacing: -0.03em;
		color: var(--on-dark);
	}
	.cp-cta p {
		margin: 0 0 22px;
		max-width: 52ch;
		font-size: 15px;
		line-height: 1.6;
		color: var(--on-dark-2);
	}
	.cp-cta__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.cp-foot {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		padding: clamp(24px, 3vw, 40px) var(--pad) 0;
		font-size: 13px;
		color: var(--ink-2);
	}
	.cp-foot a {
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
	}

	@media (max-width: 1000px) {
		.cp-grid--4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.cp-who,
		.cp-step {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 760px) {
		.cp-grid--3,
		.cp-grid--4,
		.cp-out__list,
		.cp-ba__grid,
		.cp-blog__grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.cp-sec__head {
			flex-direction: column;
			gap: 6px;
		}
	}
</style>
