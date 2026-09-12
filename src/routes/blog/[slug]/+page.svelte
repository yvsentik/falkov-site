<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Arrow from '$lib/components/Arrow.svelte';
	import { graph, orgSchema, breadcrumbSchema, articleSchema } from '$lib/seo.js';

	let { data } = $props();
	const p = $derived(data.post);
	const path = $derived(`/blog/${p.slug}/`);
	const crumbs = $derived([
		{ title: 'Главная', href: '/' },
		{ title: 'Блог', href: '/blog/' },
		{ title: p.title, href: path }
	]);
	const schema = $derived(graph(orgSchema(), breadcrumbSchema(crumbs), articleSchema(p)));
	const fmt = (d) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<Seo title={p.metaTitle ?? p.title} description={p.description} {path} {schema} ogType="article" />

<article class="section section--tight">
	<div class="container narrow">
		<Breadcrumbs items={crumbs} />
		<span class="meta">{p.tag} · {fmt(p.date)} · {p.readTime} · {p.author}</span>
		<h1>{p.title}</h1>
		<p class="lead">{p.lead}</p>

		<div class="body">
			{#each p.content as b}
				{#if b.type === 'p'}
					<p>{b.text}</p>
				{:else if b.type === 'h2'}
					<h2>{b.text}</h2>
				{:else if b.type === 'h3'}
					<h3>{b.text}</h3>
				{:else if b.type === 'ul'}
					<ul>
						{#each b.items as it}
							<li>{it}</li>
						{/each}
					</ul>
				{:else if b.type === 'ol'}
					<ol>
						{#each b.items as it}
							<li>{it}</li>
						{/each}
					</ol>
				{:else if b.type === 'quote'}
					<blockquote>{b.text}</blockquote>
				{/if}
			{/each}
		</div>

		<div class="others">
			<h2>Ещё по теме</h2>
			<ul class="others__list">
				{#each data.others as o (o.slug)}
					<li><a href="/blog/{o.slug}/">{o.title} <Arrow /></a></li>
				{/each}
			</ul>
			<p class="others__services">
				Услуги по теме: <a href="/uslugi/seo/">SEO-продвижение</a>,
				<a href="/uslugi/prodvizhenie-v-yandex/">продвижение в Яндексе</a>,
				<a href="/uslugi/seo-audit-sajta/">аудит сайта</a>.
			</p>
		</div>
	</div>
</article>

<CtaBlock
	title="Разберём ваш сайт бесплатно"
	text="Покажем запросы, по которым вас реально вытащить, и что для этого нужно сделать."
/>

<style>
	.narrow {
		max-width: 760px;
	}
	.meta {
		display: block;
		margin: 26px 0 10px;
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.45);
	}
	h1 {
		margin: 0 0 18px;
	}
	.body {
		margin-top: 28px;
	}
	.body :global(p) {
		margin: 0 0 18px;
		line-height: 1.65;
	}
	.body h2 {
		margin: 34px 0 14px;
		font-size: 26px;
		line-height: 1.2;
	}
	.body h3 {
		margin: 26px 0 10px;
		font-size: 20px;
	}
	.body ul,
	.body ol {
		margin: 0 0 18px;
		padding-left: 22px;
		line-height: 1.65;
	}
	.body li {
		margin-bottom: 8px;
	}
	.body blockquote {
		margin: 24px 0;
		padding: 16px 20px;
		border-left: 3px solid rgba(0, 0, 0, 0.25);
		background: rgba(0, 0, 0, 0.03);
		border-radius: 0 12px 12px 0;
		line-height: 1.6;
	}
	.others {
		margin-top: 44px;
		padding-top: 24px;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}
	.others h2 {
		font-size: 20px;
		margin: 0 0 14px;
	}
	.others__list {
		list-style: none;
		padding: 0;
		margin: 0 0 18px;
		display: grid;
		gap: 10px;
	}
	.others__list a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.others__services {
		font-size: 15px;
		color: rgba(0, 0, 0, 0.7);
	}
</style>
