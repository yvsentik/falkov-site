<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, stats } from '$lib/config/site.js';
	import SeeAlso from '$lib/components/SeeAlso.svelte';
	import { cases } from '$lib/data/cases.js';
	import { posts } from '$lib/data/posts.js';
	import { serviceLink } from '$lib/data/links.js';
	import { graph, orgSchema, breadcrumbSchema, abs } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'О нас', href: '/o-nas/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), {
		'@type': 'AboutPage',
		name: `О маркетинговом агентстве «${site.name}»`,
		url: abs('/o-nas/'),
		mainEntity: { '@id': abs('/#organization') }
	});
	const alsoServices = [
		'/uslugi/kompleksnyj-internet-marketing/',
		'/uslugi/seo/',
		'/uslugi/direkt/',
		'/uslugi/telegram-ads/',
		'/uslugi/razrabotka-sajtov/'
	].map(serviceLink);

	const values = [
		{
			t: 'Мы объясняем каждую цифру',
			d: 'Любую работу в отчёте можно перепроверить: доступы к системам съёма позиций и аналитике остаются у вас. Если цифра выглядит странно – спрашивайте, объясним.'
		},
		{
			t: 'Берёмся не за всё',
			d: 'Если по расчёту канал не окупится, мы скажем это до договора. Проект, который не даст результата, вредит нам сильнее, чем упущенная выручка от него.'
		},
		{
			t: 'Не работаем с конкурентами клиента',
			d: 'В одной нише и одном городе ведём один проект. Это ограничивает рост агентства, но иначе конфликт интересов неизбежен.'
		},
		{
			t: 'Отвечаем за результат сами',
			d: 'Разработка, тексты и продвижение – на нашей стороне. Поэтому правки уходят на прод за неделю и за качество отвечаем мы сами.'
		}
	];
</script>

<Seo
	title="О маркетинговом агентстве «{site.name}» – как мы работаем"
	description="Об агентстве «Фальков» из Санкт-Петербурга: какие каналы ведём, как устроена работа, почему начинаем с бесплатного теста и по каким правилам нас можно проверять."
	path="/o-nas/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<div class="head">
			<div>
				<h1>О маркетинговом агентстве «{site.name}»</h1>
			</div>
			<div>
				<p class="lead">
					Ведём маркетинг малого и среднего бизнеса под ключ: поиск, Яндекс Директ, Telegram Ads,
					разработка сайтов, CRM и рассылки. Офис в Санкт-Петербурге, проекты по всей России.
					Через агентство прошло больше 180 проектов – от сайтов услуг на тридцать страниц до
					магазинов с двадцатью тысячами товаров.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="stats">
			{#each stats as s}
				<div use:reveal>
					<b>{s.value}</b>
					<span>{s.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container about">
		<div class="about__side" use:reveal>
			<span class="eyebrow">История</span>
		</div>
		<div class="prose" use:reveal={{ delay: 60 }}>
			<p>
				Агентство выросло из практики: мы начинали как небольшая команда, которая вела продвижение
				для нескольких компаний в Санкт-Петербурге, и довольно быстро столкнулись с тем, что мешает
				рынку больше всего. Знания в маркетинге давно открыты, проблема в разрыве между
				рекомендациями и внедрением.
			</p>
			<p>
				Подрядчик пишет аудит, аудит уходит в задачи, задачи ждут разработчика, разработчик занят
				релизом. Через полгода из тридцати задач сделаны четыре, и все делают вывод, что «SEO не
				работает». Поэтому мы собрали внутри команды разработку и редакцию: теперь правка доходит
				до прода за неделю. Следом к поиску добавились
				<a href="/uslugi/direkt/">Яндекс Директ</a>,
				<a href="/uslugi/telegram-ads/">реклама в Telegram</a>,
				<a href="/uslugi/razrabotka-sajtov/">разработка сайтов</a> и
				<a href="/uslugi/vnedrenie-crm/">CRM</a>: клиенту нужен поток заявок, и одного канала для
				этого обычно мало.
			</p>
			<p>
				Второе, что мы решили с самого начала, – не продавать то, что не окупится. Перед договором
				мы считаем экономику канала: сколько спроса в нише, какая реалистичная конверсия, какой
				средний чек. Если цифры не сходятся, мы говорим об этом прямо и предлагаем то, что
				сработает, – иногда это контекст, иногда работа с картами, иногда вообще не наша услуга.
			</p>
			<p>
				Мы не самое большое агентство в городе и не стремимся им стать: в одной нише и одном
				городе ведём один проект. Часть работ показываем в <a href="/keysy/">кейсах</a>: у проектов
				под ключ открыт сайт и список запросов, позиции можно проверить в поиске.
			</p>
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-head" use:reveal>
			<div class="section-head__title">
				<span class="eyebrow">Принципы</span>
				<h2>Правила, по которым нас можно проверять</h2>
			</div>
			<div>
				<p class="lead">
					Мы формулируем их до договора, чтобы клиенту было с чем сверяться, если что-то пойдёт не
					так.
				</p>
			</div>
		</div>
		<div class="grid grid-2 values">
			{#each values as v, i}
				<div class="value" use:reveal={{ delay: (i % 2) * 70 }}>
					<h3>{v.t}</h3>
					<p>{v.d}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<SeeAlso services={alsoServices} cases={cases.filter((c) => c.turnkey).slice(0, 4)} posts={posts.slice(0, 4)} alt />

<CtaBlock source="О нас" />

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: clamp(28px, 5vw, 72px);
		margin-top: clamp(24px, 3vw, 40px);
		align-items: end;
	}
	h1 {
		max-width: 12em;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}
	.stats > div {
		padding: clamp(24px, 3vw, 36px) clamp(16px, 2vw, 28px) clamp(24px, 3vw, 36px) 0;
	}
	.stats b {
		display: block;
		font-size: clamp(30px, 3.4vw, 46px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		margin-bottom: 10px;
	}
	.stats span {
		font-size: 14px;
		color: var(--ink-3);
		max-width: 15em;
		display: block;
	}
	.about {
		display: grid;
		grid-template-columns: minmax(0, 0.35fr) minmax(0, 1.65fr);
		gap: clamp(20px, 4vw, 56px);
		align-items: start;
	}
	.values {
		gap: clamp(24px, 3vw, 48px) clamp(28px, 5vw, 80px);
	}
	.value {
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
	}
	.value h3 {
		margin-bottom: 14px;
		max-width: 16em;
	}
	.value p {
		color: var(--on-dark-2);
		font-size: 16px;
		margin: 0;
		max-width: 34em;
	}
	@media (max-width: 1000px) {
		.head,
		.about {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
		}
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
