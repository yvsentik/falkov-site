<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, stats } from '$lib/config/site.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'О нас', href: '/o-nas/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs), { '@type': 'AboutPage', name: `О агентстве ${site.name}` });

	const values = [
		{
			t: 'Мы объясняем, а не впечатляем',
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
			d: 'Разработка, тексты и продвижение – на нашей стороне. Поэтому правки уходят на прод за неделю и мы отвечаем за качество, а не пересылаем претензии дальше.'
		}
	];
</script>

<Seo
	title="О агентстве {site.name} – маркетинговое агентство в Санкт-Петербурге"
	description="Маркетинговое агентство в Санкт-Петербурге: 180+ проектов, бесплатный тест до договора, позиции можно проверить руками. Как мы работаем, каких принципов придерживаемся и за что отвечаем."
	path="/o-nas/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<div class="head">
			<div>
				<h1>Агентство, которое отвечает за заявки</h1>
			</div>
			<div>
				<p class="lead">
					Мы занимаемся поисковым продвижением и специализируемся на рынке Санкт-Петербурга.
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
				рынку больше всего. Не отсутствием знаний – знания в SEO давно открыты, – а разрывом между
				рекомендациями и внедрением.
			</p>
			<p>
				Подрядчик пишет аудит, аудит уходит в задачи, задачи ждут разработчика, разработчик занят
				релизом. Через полгода из тридцати задач сделаны четыре, и все делают вывод, что «SEO не
				работает». Поэтому мы собрали внутри команды разработку и редакцию: теперь правка доходит
				до прода за неделю, а не за квартал.
			</p>
			<p>
				Второе, что мы решили с самого начала, – не продавать то, что не окупится. Перед договором
				мы считаем экономику канала: сколько спроса в нише, какая реалистичная конверсия, какой
				средний чек. Если цифры не сходятся, мы говорим об этом прямо и предлагаем то, что
				сработает, – иногда это контекст, иногда работа с картами, иногда вообще не наша услуга.
			</p>
			<p>
				У нас собственная методика работы с семантикой и структурой и
				{stats[1].value.replace('+', '')} проектов за плечами. Мы не самое большое
				агентство в городе и не стремимся им стать: в одной нише и одном городе мы ведём один
				проект.
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
