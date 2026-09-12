<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { reveal } from '$lib/actions.js';
	import { posts } from '$lib/data/posts.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Блог', href: '/blog/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs));
	const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
	const fmt = (d) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<Seo
	title="Блог о продвижении сайтов и маркетинге в Санкт-Петербурге | Фальков"
	description="Разборы от агентства «Фальков»: сколько стоит SEO в СПб, как выбрать подрядчика, коммерческие факторы Яндекса, локальное продвижение по районам, GEO и нейросети."
	path="/blog/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<h1 style="margin:26px 0 24px;max-width:16em">Блог: как работает продвижение и на что уходят деньги</h1>
		<p class="lead" style="max-width:38em">
			Пишем о том, что обычно остаётся за рамками коммерческого предложения: из чего складывается
			цена, по каким признакам видно слабого подрядчика, какие факторы в Яндексе решают исход
			борьбы за ТОП. Разборы основаны на проектах, которые мы ведём в Санкт-Петербурге.
		</p>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="grid">
			{#each sorted as p (p.slug)}
				<article class="post" use:reveal>
					<a class="post__link" href="/blog/{p.slug}/">
						<span class="post__meta">{p.tag} · {fmt(p.date)} · {p.readTime}</span>
						<h2 class="post__title">{p.title}</h2>
						<p class="post__lead">{p.lead}</p>
						<span class="post__more">Читать <Arrow /></span>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<CtaBlock
	title="Разберём ваш сайт так же подробно"
	text="Покажем, какие запросы реально вытянуть в вашей нише и что для этого нужно сделать."
/>

<style>
	.grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}
	.post {
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 18px;
		background: #fff;
		transition: border-color 0.2s ease, transform 0.2s ease;
	}
	.post__link {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
		color: inherit;
		text-decoration: none;
		height: 100%;
	}
	.post__meta {
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.45);
	}
	.post__title {
		font-size: 21px;
		line-height: 1.25;
		margin: 0;
	}
	.post__lead {
		margin: 0;
		color: rgba(0, 0, 0, 0.65);
		font-size: 15px;
		line-height: 1.5;
	}
	.post__more {
		margin-top: auto;
		padding-top: 12px;
		font-size: 14px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	@media (hover: hover) and (pointer: fine) {
		.post:hover {
			border-color: rgba(0, 0, 0, 0.35);
			transform: translateY(-2px);
		}
	}
</style>
