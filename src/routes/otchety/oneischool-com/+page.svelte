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

	/* ---------- длинная лента вправо ---------- */
	let strip = $state();
	let progress = $state(0);

	function onScroll() {
		if (!strip) return;
		const max = strip.scrollWidth - strip.clientWidth;
		progress = max > 0 ? strip.scrollLeft / max : 0;
	}
	function onWheel(e) {
		if (!strip) return;
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
		e.preventDefault();
		strip.scrollLeft += e.deltaY;
	}
	let drag = null;
	function down(e) {
		if (e.target.closest('a, button, input')) return;
		drag = { x: e.clientX, left: strip.scrollLeft };
	}
	function move(e) {
		if (drag) strip.scrollLeft = drag.left - (e.clientX - drag.x);
	}
	function up() {
		drag = null;
	}
	function onKey(e) {
		if (!deck || !strip) return;
		const step = strip.clientWidth * 0.8;
		if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
			e.preventDefault();
			strip.scrollBy({ left: step, behavior: 'smooth' });
		}
		if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			e.preventDefault();
			strip.scrollBy({ left: -step, behavior: 'smooth' });
		}
		if (e.key === 'Home') strip.scrollTo({ left: 0, behavior: 'smooth' });
		if (e.key === 'End') strip.scrollTo({ left: strip.scrollWidth, behavior: 'smooth' });
	}

	/* ---------- графики ---------- */
	const W = 1000;
	const H = 300;
	const PAD = 24;
	function path(series, k) {
		const max = Math.max(...series.map((p) => p[k])) * 1.15;
		const step = (W - PAD * 2) / (series.length - 1);
		return series
			.map((p, i) => `${i ? 'L' : 'M'}${(PAD + i * step).toFixed(1)},${(H - PAD - (p[k] / max) * (H - PAD * 2)).toFixed(1)}`)
			.join(' ');
	}
	function area(series, k) {
		return `${path(series, k)} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`;
	}
	function xLabels(series) {
		const months = { '06': 'июнь', '07': 'июль', '08': 'август', '09': 'сентябрь' };
		const step = (W - PAD * 2) / (series.length - 1);
		const seen = new Set();
		const out = [];
		series.forEach((p, i) => {
			const m = p.w.slice(5, 7);
			if (!seen.has(m)) {
				seen.add(m);
				out.push({ x: ((PAD + i * step) / W) * 100, t: months[m] ?? m });
			}
		});
		return out;
	}
</script>

<Seo title="Отчёт по продвижению oneischool.com | Фальков" description="Закрытая презентация по проекту." path="/otchety/oneischool-com/" noindex />

<svelte:window onkeydown={onKey} onpointerup={up} onpointermove={move} />

{#if !deck}
	<div class="gate">
		<form onsubmit={unlock}>
			<span class="gate__kicker">Отчёт для клиента</span>
			<h1>Презентация закрыта паролем</h1>
			<input type="password" bind:value={pass} placeholder="Пароль" autocomplete="current-password" aria-label="Пароль" />
			<button type="submit" disabled={busy}>{busy ? 'Проверяем…' : 'Открыть'}</button>
			{#if error}<p class="gate__err">{error}</p>{/if}
		</form>
	</div>
{:else}
	<div class="stage">
		<header class="bar">
			<span class="bar__client">{deck.meta.client}</span>
			<span>{deck.meta.site}</span>
			<span class="bar__period">{deck.meta.period}</span>
		</header>

		<div class="strip" bind:this={strip} onscroll={onScroll} onwheel={onWheel} onpointerdown={down}>
			{#each deck.blocks as b}
				<section class="b b--{b.w}">
					<div class="axis">
						{#if b.mark}
							<span class="axis__dot"></span>
							<span class="axis__mark">{b.mark}</span>
						{/if}
					</div>

					<div class="body">
						{#if b.type === 'intro' || b.type === 'end'}
							{#if b.kicker}<span class="kicker">{b.kicker}</span>{/if}
							<h1>{b.title}</h1>
							<p class="sub">{b.sub}</p>
										{:else}
							<span class="kicker">{b.kicker}</span>
							<h2>{b.title}</h2>
							<div class="cols" class:cols--shot={b.shots?.length}>
							<div class="main">

							{#if b.lead}<p class="lead">{b.lead}</p>{/if}

							{#if b.tiles}
								<div class="tiles">
									{#each b.tiles as t}
										<article><h3>{t.h}</h3><p>{t.p}</p></article>
									{/each}
								</div>
							{/if}

							{#if b.lines}
								<ul class="lines">
									{#each b.lines as l}<li>{l}</li>{/each}
								</ul>
							{/if}

							{#if b.steps}
								<div class="steps">
									{#each b.steps as s}
										<div><b>{s.n}</b><span>{s.t}</span></div>
									{/each}
								</div>
							{/if}

							{#if b.kick}<p class="kick">{b.kick}</p>{/if}

							{#if b.type === 'chart'}
								<div class="chart">
									<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" role="img" aria-label={b.title}>
										{#if b.chart === 'metrika'}
											<path class="area" d={area(b.series, 'g')} />
											<path class="line" d={path(b.series, 'g')} />
											<path class="line line--2" d={path(b.series, 'y')} />
										{:else}
											<path class="area" d={area(b.series, 'c')} />
											<path class="line" d={path(b.series, 'c')} />
										{/if}
									</svg>
									<div class="chart__x">
										{#each xLabels(b.series) as l}<span style="left: {l.x}%">{l.t}</span>{/each}
									</div>
									<div class="legend">
										{#each b.legend as l}<span class="dot dot--{l.k}"></span>{l.n}{/each}
									</div>
								</div>
							{/if}

							{#if b.type === 'bars'}
								<div class="bars">
									{#each b.bars as x}
										<div class="bars__i">
											<span class="bars__v">{String(x.v).replace('.', ',')}%</span>
											<span class="bars__bar" style="height: {x.v}%"></span>
											<span class="bars__l">{x.l}</span>
										</div>
									{/each}
								</div>
							{/if}

							{#if b.type === 'table'}
								<table class="tbl">
									<thead><tr>{#each b.head as h}<th>{h}</th>{/each}</tr></thead>
									<tbody>
										{#each b.rows as r}
											<tr>{#each r as c, ci}<td class:num={ci > 0}>{c}</td>{/each}</tr>
										{/each}
									</tbody>
								</table>
							{/if}

							{#if b.points}
								<div class="points">
									{#each b.points as p}<div><b>{p.v}</b><span>{p.l}</span></div>{/each}
								</div>
							{/if}

							{#if b.table}
								<table class="tbl tbl--sm">
									<thead><tr>{#each b.table.head as h}<th>{h}</th>{/each}</tr></thead>
									<tbody>
										{#each b.table.rows as r}
											<tr>{#each r as c, ci}<td class:num={ci > 0}>{c}</td>{/each}</tr>
										{/each}
									</tbody>
								</table>
							{/if}

							{#if b.type === 'groups'}
								<div class="groups">
									{#each b.groups as g}
										<div class="groups__i">
											<div class="groups__bars">
												<span class="gb gb--1" style="height: {g.t1}%"><i>{String(g.t1).replace('.', ',')}</i></span>
												<span class="gb gb--3" style="height: {g.t3}%"><i>{String(g.t3).replace('.', ',')}</i></span>
												<span class="gb gb--10" style="height: {g.t10}%"><i>{String(g.t10).replace('.', ',')}</i></span>
											</div>
											<span class="groups__l">{g.l}</span>
										</div>
									{/each}
								</div>
								<div class="legend">
									<span class="sw sw--1"></span>ТОП-1
									<span class="sw sw--3"></span>ТОП-3
									<span class="sw sw--10"></span>ТОП-10
								</div>
							{/if}

							{#if b.links}
								<p class="links">
									{#each b.links as l}<a href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>{/each}
								</p>
							{/if}

							{#if b.note}<p class="note">{b.note}</p>{/if}
							</div>
							{#if b.shots?.length}
								<div class="shots">
									{#each b.shots as sh}
										<figure>
											<a href={sh.src} target="_blank" rel="noopener"><img src={sh.src} alt={sh.cap} loading="lazy" /></a>
											<figcaption>{sh.cap}</figcaption>
										</figure>
									{/each}
								</div>
							{/if}
							</div>
						{/if}
					</div>
				</section>
			{/each}
		</div>

		<footer class="foot">
			<div class="progress"><span style="transform: scaleX({progress})"></span></div>
		</footer>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
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

	.stage {
		--ink: #111;
		--ink-2: #5a5a5a;
		--ink-3: #9a9a9a;
		--line: rgba(0, 0, 0, 0.14);
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background: #f2f2f0;
		color: var(--ink);
	}
	.bar {
		display: flex;
		gap: 18px;
		align-items: baseline;
		padding: 14px clamp(16px, 3vw, 40px);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		border-bottom: 1px solid var(--line);
	}
	.bar__client {
		color: var(--ink);
	}
	.bar__period {
		margin-left: auto;
	}

	.strip {
		flex: 1;
		display: flex;
		align-items: stretch;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		cursor: grab;
		padding: 0 clamp(16px, 3vw, 40px);
	}
	.strip::-webkit-scrollbar {
		display: none;
	}
	.strip:active {
		cursor: grabbing;
	}
	.b {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		padding-right: clamp(28px, 4vw, 70px);
		min-width: 0;
	}
	.b--narrow {
		width: min(560px, 82vw);
	}
	.b--mid {
		width: min(680px, 88vw);
	}
	.b--wide {
		width: min(960px, 92vw);
	}
	.b--chart {
		width: min(880px, 92vw);
	}

	/* ось времени: линия проходит сквозь все блоки */
	.axis {
		position: relative;
		height: 62px;
		flex: none;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.axis::before {
		content: '';
		position: absolute;
		left: 0;
		right: -1px;
		top: 50%;
		height: 1px;
		background: var(--line);
	}
	.axis__dot {
		position: relative;
		width: 9px;
		height: 9px;
		border-radius: 100px;
		background: #141414;
	}
	.axis__mark {
		position: relative;
		background: #f2f2f0;
		padding-right: 10px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
	}
	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: clamp(14px, 2vw, 26px) 0 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.kicker {
		display: block;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 8px;
	}
	h1 {
		margin: 0;
		font-size: clamp(32px, 4.6vw, 62px);
		line-height: 1;
		font-weight: 400;
		text-transform: uppercase;
	}
	h2 {
		margin: 0 0 clamp(14px, 1.6vw, 22px);
		font-size: clamp(24px, 2.8vw, 40px);
		line-height: 1.05;
		font-weight: 400;
		text-transform: uppercase;
	}
	.sub {
		margin: 14px 0 0;
		color: var(--ink-2);
		font-size: clamp(14px, 1.4vw, 18px);
	}
	.hint {
		margin: 26px 0 0;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.lead {
		margin: 0 0 16px;
		font-size: clamp(16px, 1.8vw, 22px);
		line-height: 1.35;
		max-width: 26em;
	}
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 12px;
	}
	.tiles article {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 18px 20px;
	}
	.tiles h3 {
		margin: 0 0 6px;
		font-size: 17px;
		font-weight: 500;
	}
	.tiles p {
		margin: 0;
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	.lines {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.lines li {
		font-size: clamp(16px, 1.7vw, 21px);
		line-height: 1.35;
		padding-left: 22px;
		position: relative;
	}
	.lines li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 12px;
		height: 1px;
		background: #141414;
	}
	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 12px;
	}
	.steps div {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 16px 18px;
	}
	.steps b {
		display: block;
		font-size: 12px;
		color: var(--ink-3);
		font-weight: 400;
		margin-bottom: 8px;
	}
	.steps span {
		font-size: 15px;
		line-height: 1.4;
	}
	.kick {
		margin: 0;
		background: #141414;
		color: #fff;
		border-radius: 16px;
		padding: 16px 20px;
		font-size: clamp(14px, 1.5vw, 17px);
		line-height: 1.45;
		max-width: 40em;
	}
	.chart {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 12px 12px 6px;
	}
	.chart svg {
		width: 100%;
		height: clamp(150px, 24vh, 260px);
		display: block;
	}
	.line {
		fill: none;
		stroke: #111;
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
	}
	.line--2 {
		stroke: #b3b3b3;
	}
	.area {
		fill: rgba(17, 17, 17, 0.07);
		stroke: none;
	}
	.chart__x {
		position: relative;
		height: 16px;
	}
	.chart__x span {
		position: absolute;
		transform: translateX(-50%);
		font-size: 11px;
		color: var(--ink-3);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.legend {
		display: flex;
		gap: 16px;
		align-items: center;
		font-size: 12px;
		color: var(--ink-2);
		padding: 4px 2px;
	}
	.dot {
		width: 10px;
		height: 2px;
		background: #111;
		display: inline-block;
		margin-right: 6px;
	}
	.dot--y {
		background: #b3b3b3;
	}
	.bars {
		display: flex;
		gap: clamp(10px, 2vw, 26px);
		align-items: flex-end;
		height: clamp(150px, 24vh, 250px);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 16px 20px;
	}
	.bars__i {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		gap: 6px;
	}
	.bars__v {
		font-size: 15px;
	}
	.bars__bar {
		width: 100%;
		background: #141414;
		border-radius: 6px 6px 0 0;
	}
	.bars__l {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.tbl {
		width: 100%;
		border-collapse: collapse;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		overflow: hidden;
		font-size: clamp(14px, 1.4vw, 16px);
	}
	.tbl th,
	.tbl td {
		text-align: left;
		padding: 11px 16px;
		border-bottom: 1px solid var(--line);
	}
	.tbl th {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 500;
	}
	.tbl tr:last-child td {
		border-bottom: none;
	}
	.tbl td.num {
		text-align: right;
		width: 80px;
		font-variant-numeric: tabular-nums;
	}
	.points {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(14px, 2.4vw, 34px);
	}
	.points b {
		display: block;
		font-size: clamp(22px, 2.4vw, 32px);
		font-weight: 400;
		line-height: 1;
	}
	.points span {
		display: block;
		margin-top: 5px;
		font-size: 12px;
		color: var(--ink-2);
	}
	.note {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-2);
		max-width: 42em;
	}
	.cols {
		display: grid;
		gap: 18px;
		align-items: start;
	}
	.cols--shot {
		grid-template-columns: 1.1fr 0.9fr;
	}
	.main > * + * {
		margin-top: 14px;
	}
	.shots figure {
		margin: 0;
	}
	.shots img {
		width: 100%;
		max-height: clamp(220px, 52vh, 560px);
		object-fit: contain;
		object-position: top;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: #fff;
		display: block;
	}
	.shots figcaption {
		margin-top: 6px;
		font-size: 12px;
		color: var(--ink-3);
	}
	.links {
		margin: 0;
	}
	.links a {
		font-size: 14px;
		color: var(--ink);
	}
	.tbl--sm {
		font-size: 14px;
	}
	.tbl--sm th,
	.tbl--sm td {
		padding: 9px 14px;
	}
	.groups {
		display: flex;
		gap: clamp(12px, 3vw, 40px);
		align-items: flex-end;
		height: clamp(180px, 30vh, 300px);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 26px 20px 14px;
	}
	.groups__i {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
	}
	.groups__bars {
		flex: 1;
		display: flex;
		align-items: flex-end;
		gap: 6px;
	}
	.gb {
		flex: 1;
		position: relative;
		border-radius: 5px 5px 0 0;
		min-height: 3px;
	}
	.gb i {
		position: absolute;
		left: 50%;
		top: -20px;
		transform: translateX(-50%);
		font-style: normal;
		font-size: 11px;
		color: var(--ink-2);
		white-space: nowrap;
	}
	.gb--1 {
		background: #141414;
	}
	.gb--3 {
		background: #6b6b6b;
	}
	.gb--10 {
		background: #c9c9c9;
	}
	.groups__l {
		text-align: center;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.sw {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		display: inline-block;
		margin: 0 6px 0 12px;
	}
	.sw--1 {
		background: #141414;
	}
	.sw--3 {
		background: #6b6b6b;
	}
	.sw--10 {
		background: #c9c9c9;
	}
	@media (max-width: 860px) {
		.cols--shot {
			grid-template-columns: 1fr;
		}
	}
	.foot {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px clamp(16px, 3vw, 40px) 12px;
		border-top: 1px solid var(--line);
	}
	.progress {
		flex: 1;
		height: 2px;
		background: var(--line);
		overflow: hidden;
	}
	.progress span {
		display: block;
		height: 100%;
		background: #141414;
		transform-origin: left center;
		transition: transform 0.12s linear;
	}
	.foot__hint {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
		white-space: nowrap;
	}
</style>
