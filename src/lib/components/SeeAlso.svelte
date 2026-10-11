<script>
	/* Блок «Смотрите также»: услуги, кейсы и статьи по теме страницы.
	   Пустые колонки не выводятся. */
	import Arrow from './Arrow.svelte';

	let { services = [], cases = [], posts = [], title = 'Смотрите также', alt = false } = $props();

	const cols = $derived(
		[
			{ h: 'Услуги', all: { href: '/uslugi/', t: 'Все услуги' }, items: services.map((s) => ({ href: s.href, t: s.title })) },
			{
				h: 'Кейсы',
				all: { href: '/keysy/', t: 'Все кейсы' },
				items: cases.map((c) => ({ href: `/keysy/${c.slug}/`, t: c.h1 ?? c.site ?? c.client, d: `${c.industry} · ${c.metrics[0].v} ${c.metrics[0].l}` }))
			},
			{ h: 'Статьи', all: { href: '/blog/', t: 'Весь блог' }, items: posts.map((p) => ({ href: `/blog/${p.slug}/`, t: p.title })) }
		].filter((c) => c.items.length)
	);
</script>

{#if cols.length}
	<section class="section section--tight" class:section--alt={alt}>
		<div class="container">
			<h2 class="also__h">{title}</h2>
			<div class="also" style="--n:{cols.length}">
				{#each cols as col}
					<div class="also__col">
						<h3>{col.h}</h3>
						<ul>
							{#each col.items as it}
								<li>
									<a href={it.href}>{it.t}</a>
									{#if it.d}<span>{it.d}</span>{/if}
								</li>
							{/each}
						</ul>
						<a class="link-arrow also__all" href={col.all.href}>{col.all.t} <Arrow /></a>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.also__h {
		margin: 0 0 clamp(18px, 2.4vw, 30px);
	}
	.also {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 24px);
	}
	.also__col {
		display: flex;
		flex-direction: column;
		gap: 14px;
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: 22px;
		padding: clamp(20px, 2.2vw, 28px);
	}
	.also__col h3 {
		margin: 0;
		font-size: 13px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.55;
	}
	.also__col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
		flex: 1;
		align-content: start;
	}
	.also__col li a {
		font-weight: 600;
		line-height: 1.35;
		text-decoration: underline;
		text-decoration-color: rgba(0, 0, 0, 0.2);
		text-underline-offset: 3px;
	}
	.also__col li span {
		display: block;
		margin-top: 3px;
		font-size: 13px;
		opacity: 0.6;
	}
	@media (max-width: 860px) {
		.also {
			grid-template-columns: 1fr;
		}
	}
</style>
