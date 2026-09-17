<script>
	import Seo from '$lib/components/Seo.svelte';

	/* Раздел закрыт от поиска: это рабочие отчёты для клиентов, ссылок на них с сайта нет. */
	const reports = [
		{
			href: '/otchety/oneischool-com/',
			client: 'ONE! International School',
			site: 'oneischool.com',
			period: 'июнь – сентябрь 2026'
		}
	];
</script>

<Seo
	title="Отчёты по проектам | Фальков"
	description="Закрытый раздел с отчётами по проектам агентства."
	path="/otchety/"
	noindex
/>

<div class="hub">
	<header class="top">
		<a class="back" href="/">falkov <span>маркетинг</span></a>
		<span class="top__label">Отчёты</span>
	</header>
	<section>
		<h1>Отчёты по проектам</h1>
		<p class="lead">Раздел закрыт от индексации. Ссылку на отчёт получает только клиент.</p>
		<ul>
			{#each reports as r}
				<li>
					<a href={r.href}>
						<b>{r.client}</b>
						<span>{r.site}</span>
						<i>{r.period}</i>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.hub {
		min-height: 100vh;
		background: #f5f5f5;
		color: #111;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px clamp(16px, 4vw, 56px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	}
	.back {
		font-weight: 600;
		color: inherit;
		text-decoration: none;
	}
	.back span {
		font-weight: 400;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #949494;
		margin-left: 6px;
	}
	.top__label {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #949494;
	}
	section {
		padding: clamp(36px, 6vw, 72px) clamp(16px, 4vw, 56px);
		max-width: 900px;
	}
	h1 {
		margin: 0 0 12px;
		font-size: clamp(26px, 4vw, 46px);
		font-weight: 400;
		text-transform: uppercase;
	}
	.lead {
		color: #565656;
		margin: 0 0 28px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	li a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 12px;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 18px;
		padding: 20px 22px;
		color: inherit;
		text-decoration: none;
	}
	li b {
		font-weight: 500;
		font-size: 18px;
	}
	li span {
		color: #565656;
	}
	li i {
		margin-left: auto;
		font-style: normal;
		font-size: 13px;
		color: #949494;
	}
</style>
