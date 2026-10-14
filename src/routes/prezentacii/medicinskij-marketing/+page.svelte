<script>
	import Seo from '$lib/components/Seo.svelte';
	import { deck } from '$lib/data/guides/medicina.js';

	/* ---------- листание слайдов ---------- */
	let stage = $state();
	let current = $state(0);

	function go(n) {
		if (!stage) return;
		const i = Math.max(0, Math.min(deck.slides.length - 1, n));
		stage.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	function onScroll() {
		if (!stage) return;
		current = Math.round(stage.scrollTop / stage.clientHeight);
	}
	function onKey(e) {
		if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
			e.preventDefault();
			go(current + 1);
		}
		if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
			e.preventDefault();
			go(current - 1);
		}
	}
</script>

<svelte:window onkeydown={onKey} />

<Seo
	title="{deck.meta.title} — гайд | Фальков"
	description="Как в медицине приходит клиент: срочные и несрочные услуги, Яндекс, Google, карты, отзывы, SEO и окупаемый Директ."
	path="/prezentacii/medicinskij-marketing/"
	noindex
/>

<header class="bar">
	<a class="bar__brand" href="/">falkov <i>маркетинг</i></a>
	<span class="bar__client">{deck.meta.label} · {deck.meta.title}</span>
	<span class="bar__n">{current + 1} / {deck.slides.length}</span>
</header>

<main class="stage" bind:this={stage} onscroll={onScroll}>
	{#each deck.slides as s}
		<section class="slide" class:dark={s.kind === 'cover'}>
			<div class="slide__in">
				{#if s.kicker}<span class="kicker">{s.kicker}</span>{/if}
				<h2>{s.title}</h2>
				{#if s.text}<p class="lead">{s.text}</p>{/if}

				{#if s.points}
					<ul class="points">
						{#each s.points as p, k}
							<li><b>{String(k + 1).padStart(2, '0')}</b><span>{p}</span></li>
						{/each}
					</ul>
				{/if}

				{#if s.quote}<blockquote class="quote">«{s.quote}»</blockquote>{/if}

				{#if s.steps}
					<ol class="steps" style="--n:{s.steps.length}">
						{#each s.steps as st, k}
							<li><i>{k + 1}</i><b>{st[0]}</b><span>{st[1]}</span></li>
						{/each}
					</ol>
				{/if}

				{#if s.chips}
					<div class="chips">
						{#each s.chips as c}<span>{c}</span>{/each}
					</div>
				{/if}

				{#if s.items}
					<div class="price" style="--n:{s.items.length}">
						{#each s.items as it}
							<div class="price__card">
								<strong>{it[0]}</strong>
								<em>{it[1]}</em>
								<span>{it[2]}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<nav class="nav">
	<button type="button" onclick={() => go(current - 1)} disabled={current === 0} aria-label="Назад">↑</button>
	<button type="button" onclick={() => go(current + 1)} disabled={current === deck.slides.length - 1} aria-label="Дальше">↓</button>
</nav>

<style>

	.bar {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 5;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 16px clamp(16px, 4vw, 56px);
		font-size: 13px;
		color: #fff;
		mix-blend-mode: difference;
		pointer-events: none;
	}
	.bar__brand {
		font-weight: 600;
		font-size: 15px;
	}
	.bar__brand i {
		font-style: normal;
		font-weight: 400;
		opacity: 0.6;
	}
	.bar__client {
		opacity: 0.7;
	}

	.stage {
		height: 100vh;
		height: 100dvh;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		background: #f5f5f5;
		color: #111;
	}
	.slide {
		min-height: 100vh;
		min-height: 100dvh;
		scroll-snap-align: start;
		display: grid;
		align-items: center;
		padding: 88px clamp(20px, 6vw, 96px) 72px;
	}
	.slide.dark {
		background: #0f0f0f;
		color: #f4f4f4;
	}
	.slide__in {
		width: min(1040px, 100%);
		margin: 0 auto;
	}
	.kicker {
		display: block;
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		opacity: 0.5;
		margin-bottom: 20px;
	}
	h2 {
		margin: 0;
		font-size: clamp(32px, 5.4vw, 68px);
		line-height: 1.04;
		letter-spacing: -0.03em;
		font-weight: 500;
	}
	.lead {
		margin: 24px 0 0;
		font-size: clamp(17px, 1.9vw, 24px);
		line-height: 1.45;
		max-width: 34ch;
		color: rgba(17, 17, 17, 0.72);
	}
	.slide.dark .lead {
		color: rgba(255, 255, 255, 0.78);
	}
	.slide.dark h2 {
		color: #fff;
	}

	.points {
		list-style: none;
		margin: clamp(28px, 5vh, 56px) 0 0;
		padding: 0;
		display: grid;
		gap: 0;
	}
	.points li {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 16px;
		padding: clamp(14px, 2.2vh, 22px) 0;
		border-top: 1px solid rgba(0, 0, 0, 0.12);
		font-size: clamp(17px, 1.75vw, 23px);
		line-height: 1.4;
	}
	.points b {
		font-weight: 500;
		opacity: 0.35;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(28px, 5vh, 56px);
	}
	.chips span {
		padding: 14px 22px;
		border-radius: 100px;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.1);
		font-size: clamp(15px, 1.4vw, 19px);
	}

	.steps {
		list-style: none;
		margin: clamp(28px, 5vh, 56px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 12px;
	}
	.steps li {
		background: #fff;
		border-radius: 22px;
		padding: 22px;
		display: grid;
		gap: 10px;
		align-content: start;
	}
	.steps i {
		font-style: normal;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #111;
		color: #fff;
		display: grid;
		place-items: center;
		font-size: 14px;
	}
	.steps b {
		font-weight: 600;
		font-size: 17px;
	}
	.steps span {
		font-size: 14.5px;
		line-height: 1.45;
		opacity: 0.7;
	}

	.price {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 14px;
		margin-top: clamp(28px, 5vh, 56px);
	}
	.price__card {
		border-radius: 28px;
		padding: clamp(24px, 3.4vw, 44px);
		background: #111;
		color: #fff;
		display: grid;
		gap: 8px;
		align-content: start;
	}
	.bar__brand {
		pointer-events: auto;
		color: inherit;
		text-decoration: none;
	}
	.quote {
		margin: clamp(24px, 4vh, 44px) 0 0;
		padding: clamp(20px, 3vw, 36px);
		border-radius: 28px;
		background: #111;
		color: #fff;
		font-size: clamp(22px, 2.6vw, 36px);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}
	.slide.dark .points li {
		border-top-color: rgba(255, 255, 255, 0.16);
	}
	.slide.dark .chips span {
		background: transparent;
		border-color: rgba(255, 255, 255, 0.28);
		color: #fff;
	}
	.slide.dark .steps li {
		background: #1b1b1b;
	}
	.slide.dark .steps i {
		background: #fff;
		color: #111;
	}
	.price__card:last-child:not(:first-child) {
		background: #fff;
		color: #111;
	}
	.price__card strong {
		font-size: clamp(40px, 6vw, 84px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
	}
	.price__card em {
		font-style: normal;
		font-size: clamp(15px, 1.5vw, 20px);
		opacity: 0.6;
	}
	.price__card span {
		margin-top: 14px;
		font-size: clamp(15px, 1.4vw, 19px);
		line-height: 1.45;
	}

	.nav {
		position: fixed;
		right: clamp(16px, 4vw, 56px);
		bottom: 24px;
		z-index: 5;
		display: grid;
		gap: 8px;
	}
	.nav button {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.14);
		background: #fff;
		color: #111;
		font-size: 17px;
		cursor: pointer;
	}
	.nav button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	@media (max-width: 900px) {
		.price {
			grid-template-columns: 1fr;
		}
		.steps {
			grid-template-columns: 1fr;
		}
		.steps li {
			grid-template-columns: 36px 1fr;
			column-gap: 14px;
			padding: 16px;
		}
		.steps i {
			grid-row: 1 / 3;
		}
		.price {
			grid-template-columns: 1fr;
		}
		.bar__client {
			display: none;
		}
		.points li {
			grid-template-columns: 34px 1fr;
		}
		.slide {
			padding: 76px 20px 88px;
		}
	}

	/* печать в PDF: каждый слайд на своей странице */
	@media print {
		.bar,
		.nav {
			display: none;
		}
		.stage {
			height: auto;
			overflow: visible;
		}
		.slide {
			min-height: 100vh;
			break-after: page;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
