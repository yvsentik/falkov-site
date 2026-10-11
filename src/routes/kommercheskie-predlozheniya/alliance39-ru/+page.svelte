<script>
	import Seo from '$lib/components/Seo.svelte';
	import { payload } from '$lib/data/reports/alliance39/deck.enc.js';

	let pass = $state('');
	let error = $state('');
	let busy = $state(false);
	let deck = $state(null);

	const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

	async function unlock(e) {
		e?.preventDefault();
		if (!pass) return;
		busy = true;
		error = '';
		try {
			const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
			const key = await crypto.subtle.deriveKey(
				{ name: 'PBKDF2', salt: b64(payload.salt), iterations: 150000, hash: 'SHA-256' },
				base,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			);
			const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(payload.iv) }, key, b64(payload.data));
			deck = JSON.parse(new TextDecoder().decode(plain));
			sessionStorage.setItem('alliance39-pass', pass);
		} catch {
			error = 'Пароль не подошёл';
		}
		busy = false;
	}

	$effect(() => {
		const saved = sessionStorage.getItem('alliance39-pass');
		if (saved && !deck) {
			pass = saved;
			unlock();
		}
	});

	/* ---------- листание слайдов ---------- */
	let stage = $state();
	let current = $state(0);

	function go(n) {
		if (!stage || !deck) return;
		const i = Math.max(0, Math.min(deck.slides.length - 1, n));
		stage.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	function onScroll() {
		if (!stage) return;
		current = Math.round(stage.scrollTop / stage.clientHeight);
	}
	function onKey(e) {
		if (!deck) return;
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
	title="Предложение для «Альянс 39» | Фальков"
	description="Закрытая презентация для клиента."
	path="/kommercheskie-predlozheniya/alliance39-ru/"
	noindex
/>

{#if !deck}
	<div class="gate">
		<form onsubmit={unlock}>
			<span class="gate__kicker">Предложение для клиента</span>
			<h1>Презентация закрыта паролем</h1>
			<input type="password" bind:value={pass} placeholder="Пароль" autocomplete="current-password" aria-label="Пароль" />
			<button type="submit" disabled={busy}>{busy ? 'Проверяем…' : 'Открыть'}</button>
			{#if error}<p class="gate__err">{error}</p>{/if}
		</form>
	</div>
{:else}
	<header class="bar">
		<span class="bar__brand">falkov <i>маркетинг</i></span>
		<span class="bar__client">{deck.meta.client} · {deck.meta.site}</span>
		<span class="bar__n">{current + 1} / {deck.slides.length}</span>
	</header>

	<main class="stage" bind:this={stage} onscroll={onScroll}>
		{#each deck.slides as s, i}
			<section class="slide slide--{s.kind}" class:dark={s.kind === 'cover'}>
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

					{#if s.chips}
						<div class="chips">
							{#each s.chips as c}<span>{c}</span>{/each}
						</div>
					{/if}

					{#if s.steps}
						<ol class="steps">
							{#each s.steps as st, k}
								<li><i>{k + 1}</i><b>{st[0]}</b><span>{st[1]}</span></li>
							{/each}
						</ol>
					{/if}

					{#if s.items}
						<div class="price">
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
{/if}

<style>
	.gate {
		min-height: 100vh;
		display: grid;
		place-items: center;
		background: #0f0f0f;
		color: #f4f4f4;
		padding: 24px;
	}
	.gate form {
		width: min(420px, 100%);
		display: grid;
		gap: 12px;
	}
	.gate__kicker {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}
	.gate h1 {
		margin: 0 0 8px;
		font-size: 26px;
		font-weight: 400;
	}
	.gate input {
		background: #1b1b1b;
		border: 1px solid #2c2c2c;
		border-radius: 12px;
		padding: 14px 16px;
		color: #fff;
		font: inherit;
	}
	.gate button {
		background: #fff;
		color: #111;
		border: 0;
		border-radius: 12px;
		padding: 14px 16px;
		font: inherit;
		cursor: pointer;
	}
	.gate__err {
		margin: 0;
		color: #ff8080;
		font-size: 14px;
	}

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
		grid-template-columns: repeat(5, minmax(0, 1fr));
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
		grid-template-columns: 1.3fr 1fr;
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
	.price__card:last-child {
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
