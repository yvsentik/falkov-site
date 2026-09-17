<script>
	import Seo from '$lib/components/Seo.svelte';
	import { payload } from '$lib/data/reports/oneischool/deck.enc.js';

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
			sessionStorage.setItem('oneischool-pass', pass);
		} catch {
			error = 'Пароль не подошёл';
		}
		busy = false;
	}

	$effect(() => {
		const saved = sessionStorage.getItem('oneischool-pass');
		if (saved && !deck) {
			pass = saved;
			unlock();
		}
	});

	/* ---------- презентация ---------- */
	let rail = $state();
	let idx = $state(0);

	function go(i) {
		const n = deck?.slides.length ?? 0;
		const t = Math.max(0, Math.min(i, n - 1));
		const el = rail?.children[t];
		if (el) rail.scrollTo({ left: el.offsetLeft, behavior: 'smooth' });
	}
	function onScroll() {
		if (!rail) return;
		idx = Math.round(rail.scrollLeft / rail.clientWidth);
	}
	function onWheel(e) {
		if (!rail) return;
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
		e.preventDefault();
		rail.scrollLeft += e.deltaY;
	}
	function onKey(e) {
		if (!deck) return;
		if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
			e.preventDefault();
			go(idx + 1);
		}
		if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			e.preventDefault();
			go(idx - 1);
		}
	}

	/* ---------- графики ---------- */
	const W = 1000;
	const H = 320;
	const PAD = 26;

	function path(series, keyName) {
		const vals = series.map((p) => p[keyName]);
		const max = Math.max(...vals) * 1.15;
		const step = (W - PAD * 2) / (series.length - 1);
		return series
			.map((p, i) => `${i ? 'L' : 'M'}${(PAD + i * step).toFixed(1)},${(H - PAD - (p[keyName] / max) * (H - PAD * 2)).toFixed(1)}`)
			.join(' ');
	}
	function area(series, keyName) {
		const d = path(series, keyName);
		return `${d} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`;
	}
	function xLabels(series) {
		const months = { '06': 'июнь', '07': 'июль', '08': 'август', '09': 'сентябрь' };
		const step = (W - PAD * 2) / (series.length - 1);
		const seen = new Set();
		const out = [];
		series.forEach((p, i) => {
			const m = p.w.slice(5, 7);
			if (seen.has(m)) return;
			seen.add(m);
			out.push({ x: PAD + i * step, t: months[m] ?? m });
		});
		return out;
	}
</script>

<Seo
	title="Отчёт по продвижению oneischool.com | Фальков"
	description="Закрытая презентация по проекту."
	path="/otchety/oneischool-com/"
	noindex
/>

<svelte:window onkeydown={onKey} />

{#if !deck}
	<div class="gate">
		<form onsubmit={unlock}>
			<span class="gate__kicker">Отчёт для клиента</span>
			<h1>Презентация закрыта паролем</h1>
			<input
				type="password"
				bind:value={pass}
				placeholder="Пароль"
				autocomplete="current-password"
				aria-label="Пароль"
			/>
			<button type="submit" disabled={busy}>{busy ? 'Проверяем…' : 'Открыть'}</button>
			{#if error}<p class="gate__err">{error}</p>{/if}
		</form>
	</div>
{:else}
	<div class="deck">
		<header class="bar">
			<span class="bar__client">{deck.meta.client}</span>
			<span class="bar__mid">{deck.meta.period}</span>
			<span class="bar__num">{idx + 1} / {deck.slides.length}</span>
		</header>

		<div class="rail" bind:this={rail} onscroll={onScroll} onwheel={onWheel}>
			{#each deck.slides as s, i}
				<section class="slide" class:on={i === idx}>
					<div class="inner">
						{#if s.type === 'title'}
							<span class="kicker">{s.kicker}</span>
							<h1 class="big">{s.title}</h1>
							<p class="sub">{s.sub}</p>
							<p class="hint">{s.hint}</p>
						{:else if s.type === 'end'}
							<h1 class="big">{s.title}</h1>
							<p class="sub">{s.sub}</p>
						{:else}
							<span class="kicker">{s.kicker}</span>
							<h2>{s.title}</h2>

							{#if s.type === 'stats'}
								<div class="stats">
									{#each s.stats as st}
										<div><b>{st.v}</b><span>{st.l}</span></div>
									{/each}
								</div>
							{/if}

							{#if s.type === 'tiles'}
								<div class="tiles">
									{#each s.tiles as t}
										<article><h3>{t.h}</h3><p>{t.p}</p></article>
									{/each}
								</div>
							{/if}

							{#if s.type === 'chart'}
								<div class="chart">
									<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" role="img" aria-label={s.title}>
										{#if s.chart === 'metrika'}
											<path class="area area--g" d={area(s.series, 'g')} />
											<path class="line line--g" d={path(s.series, 'g')} />
											<path class="line line--y" d={path(s.series, 'y')} />
										{:else}
											<path class="area area--c" d={area(s.series, 'c')} />
											<path class="line line--c" d={path(s.series, 'c')} />
										{/if}
									</svg>
									<div class="chart__x">
										{#each xLabels(s.series) as l}
											<span style="left: {(l.x / W) * 100}%">{l.t}</span>
										{/each}
									</div>
									<div class="legend">
										{#each s.legend as l}
											<span class="dot dot--{l.k}"></span>{l.n}
										{/each}
									</div>
								</div>
							{/if}

							{#if s.type === 'bars'}
								<div class="bars">
									{#each s.bars as b}
										<div class="bars__i">
											<span class="bars__v">{String(b.v).replace('.', ',')}%</span>
											<span class="bars__bar" style="height: {b.v}%"></span>
											<span class="bars__l">{b.l}</span>
										</div>
									{/each}
								</div>
							{/if}

							{#if s.type === 'split'}
								<div class="split">
									<div class="stats stats--sm">
										{#each s.stats as st}
											<div><b>{st.v}</b><span>{st.l}</span></div>
										{/each}
									</div>
									<div class="jump">
										<span class="jump__from">{s.big.from}</span>
										<span class="jump__arr">→</span>
										<span class="jump__to">{s.big.to}</span>
										<span class="jump__l">{s.big.l}</span>
									</div>
								</div>
							{/if}

							{#if s.type === 'steps'}
								<ol class="steps">
									{#each s.steps as st}
										<li><b>{st.d}</b><span>{st.t}</span></li>
									{/each}
								</ol>
								<p class="result">{s.result}</p>
							{/if}

							{#if s.type === 'table'}
								<table class="tbl">
									<thead>
										<tr>{#each s.head as h}<th>{h}</th>{/each}</tr>
									</thead>
									<tbody>
										{#each s.rows as r}
											<tr>{#each r as c, ci}<td class:num={ci > 0}>{c}</td>{/each}</tr>
										{/each}
									</tbody>
								</table>
							{/if}

							{#if s.points}
								<div class="points">
									{#each s.points as p}
										<div><b>{p.v}</b><span>{p.l}</span></div>
									{/each}
								</div>
							{/if}

							{#if s.note}<p class="note">{s.note}</p>{/if}
						{/if}
					</div>
				</section>
			{/each}
		</div>

		<nav class="dots" aria-label="Слайды">
			<button class="nav" type="button" onclick={() => go(idx - 1)} aria-label="Назад">←</button>
			{#each deck.slides as _, i}
				<button class="dot-btn" class:on={i === idx} type="button" onclick={() => go(i)} aria-label="Слайд {i + 1}"></button>
			{/each}
			<button class="nav" type="button" onclick={() => go(idx + 1)} aria-label="Вперёд">→</button>
		</nav>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
	}
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

	.deck {
		--ink: #111;
		--ink-2: #5a5a5a;
		--ink-3: #9a9a9a;
		--line: rgba(0, 0, 0, 0.12);
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background: #f2f2f0;
		color: var(--ink);
		overflow: hidden;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 14px clamp(16px, 4vw, 48px);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		border-bottom: 1px solid var(--line);
	}
	.bar__client {
		color: var(--ink);
	}
	.rail {
		flex: 1;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}
	.rail::-webkit-scrollbar {
		display: none;
	}
	.slide {
		flex: 0 0 100%;
		scroll-snap-align: start;
		display: grid;
		place-items: center;
		padding: clamp(18px, 3vw, 40px) clamp(16px, 4vw, 48px);
		overflow-y: auto;
	}
	.inner {
		width: min(1180px, 100%);
		opacity: 0;
		transform: translateY(14px);
		transition: opacity 0.45s ease, transform 0.45s ease;
	}
	.slide.on .inner {
		opacity: 1;
		transform: none;
	}
	.kicker {
		display: block;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.big {
		margin: 0;
		font-size: clamp(34px, 6.4vw, 86px);
		line-height: 1;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: -0.01em;
	}
	h2 {
		margin: 0 0 clamp(18px, 2.4vw, 30px);
		font-size: clamp(26px, 3.6vw, 48px);
		line-height: 1.05;
		font-weight: 400;
		text-transform: uppercase;
	}
	.sub {
		margin: 16px 0 0;
		font-size: clamp(15px, 1.6vw, 20px);
		color: var(--ink-2);
	}
	.hint {
		margin: 28px 0 0;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 14px;
	}
	.stats div {
		background: #fff;
		border-radius: 18px;
		padding: clamp(18px, 2vw, 26px);
		border: 1px solid var(--line);
	}
	.stats b {
		display: block;
		font-size: clamp(30px, 4.4vw, 58px);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.stats span {
		display: block;
		margin-top: 10px;
		font-size: 13px;
		line-height: 1.4;
		color: var(--ink-2);
	}
	.stats--sm b {
		font-size: clamp(26px, 3vw, 40px);
	}
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 14px;
	}
	.tiles article {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: clamp(18px, 2vw, 24px);
	}
	.tiles h3 {
		margin: 0 0 8px;
		font-size: clamp(16px, 1.7vw, 20px);
		font-weight: 500;
		line-height: 1.25;
	}
	.tiles p {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.chart {
		position: relative;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: 14px 14px 6px;
	}
	.chart svg {
		width: 100%;
		height: clamp(180px, 26vh, 300px);
		display: block;
	}
	.line {
		fill: none;
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
	}
	.line--g,
	.line--c {
		stroke: #111;
	}
	.line--y {
		stroke: #b3b3b3;
	}
	.area {
		fill: rgba(17, 17, 17, 0.07);
		stroke: none;
	}
	.chart__x {
		position: relative;
		height: 18px;
	}
	.chart__x span {
		position: absolute;
		transform: translateX(-50%);
		font-size: 11px;
		color: var(--ink-3);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.legend {
		display: flex;
		gap: 18px;
		align-items: center;
		font-size: 12px;
		color: var(--ink-2);
		padding: 6px 2px 4px;
	}
	.dot {
		width: 10px;
		height: 2px;
		display: inline-block;
		margin-right: 6px;
		background: #111;
	}
	.dot--y {
		background: #b3b3b3;
	}
	.bars {
		display: flex;
		gap: clamp(10px, 3vw, 34px);
		align-items: flex-end;
		height: clamp(180px, 30vh, 300px);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: 18px clamp(14px, 3vw, 30px);
	}
	.bars__i {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
		gap: 8px;
	}
	.bars__v {
		font-size: clamp(14px, 1.5vw, 18px);
	}
	.bars__bar {
		width: 100%;
		background: #141414;
		border-radius: 8px 8px 0 0;
		min-height: 4px;
	}
	.bars__l {
		font-size: 12px;
		color: var(--ink-3);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.split {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 16px;
		align-items: stretch;
	}
	.jump {
		background: #141414;
		color: #fff;
		border-radius: 18px;
		padding: clamp(18px, 2vw, 28px);
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 12px;
	}
	.jump__from {
		font-size: clamp(22px, 2.6vw, 34px);
		color: rgba(255, 255, 255, 0.45);
	}
	.jump__arr {
		color: rgba(255, 255, 255, 0.45);
	}
	.jump__to {
		font-size: clamp(34px, 5vw, 64px);
		line-height: 1;
	}
	.jump__l {
		flex: 1 0 100%;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.6);
	}
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
		counter-reset: s;
	}
	.steps li {
		display: flex;
		gap: 16px;
		align-items: baseline;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 14px 18px;
	}
	.steps b {
		flex: 0 0 clamp(96px, 12vw, 150px);
		font-weight: 500;
	}
	.steps span {
		color: var(--ink-2);
		font-size: 15px;
	}
	.result {
		margin: 16px 0 0;
		font-size: clamp(15px, 1.6vw, 19px);
		line-height: 1.45;
		max-width: 46em;
	}
	.tbl {
		width: 100%;
		border-collapse: collapse;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 18px;
		overflow: hidden;
		font-size: clamp(14px, 1.5vw, 17px);
	}
	.tbl th,
	.tbl td {
		text-align: left;
		padding: 12px 18px;
		border-bottom: 1px solid var(--line);
	}
	.tbl th {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 500;
	}
	.tbl tr:last-child td {
		border-bottom: none;
	}
	.tbl td.num {
		text-align: right;
		width: 90px;
		font-variant-numeric: tabular-nums;
	}
	.points {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(16px, 3vw, 44px);
		margin-top: 18px;
	}
	.points b {
		font-size: clamp(22px, 2.6vw, 34px);
		font-weight: 400;
		display: block;
		line-height: 1;
	}
	.points span {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: var(--ink-2);
		max-width: 20em;
	}
	.note {
		margin: 18px 0 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-2);
		max-width: 52em;
	}
	.dots {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px;
		border-top: 1px solid var(--line);
	}
	.dot-btn {
		width: 8px;
		height: 8px;
		border-radius: 100px;
		border: 0;
		background: rgba(0, 0, 0, 0.18);
		cursor: pointer;
		padding: 0;
		transition: background 0.2s ease, width 0.2s ease;
	}
	.dot-btn.on {
		background: #141414;
		width: 22px;
	}
	.nav {
		border: 1px solid var(--line);
		background: transparent;
		border-radius: 100px;
		width: 30px;
		height: 30px;
		cursor: pointer;
		font-size: 14px;
		color: var(--ink-2);
	}
	@media (max-width: 720px) {
		.split {
			grid-template-columns: 1fr;
		}
		.steps li {
			flex-direction: column;
			gap: 4px;
		}
	}
</style>
