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

	/* ---------- части отчёта ---------- */
	let part = $state(1);

	function setPart(n) {
		part = n;
		try {
			sessionStorage.setItem('oneischool-part', String(n));
		} catch {}
	}

	$effect(() => {
		if (!deck) return;
		const saved = sessionStorage.getItem('oneischool-part');
		if (saved === '2') part = 2;
		if (saved === '3' && deck.part3) part = 3;
	});

	/* ---------- длинная лента вправо ---------- */
	let strip = $state();
	let progress = $state(0);
	let audit = $state(null);

	/* блок оживает, когда въезжает в кадр */
	$effect(() => {
		if (!deck || !strip) return;
		const io = new IntersectionObserver(
			(entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
			{ root: strip, threshold: 0.25 }
		);
		strip.querySelectorAll('.b').forEach((el) => io.observe(el));
		return () => io.disconnect();
	});

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
		if (e.key === 'Escape') audit = null;
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
			<span class="bar__site">{deck.meta.site}</span>
			{#if deck.part2}
				<nav class="parts" aria-label="Части отчёта">
					<button type="button" class:on={part === 1} onclick={() => setPart(1)}>Часть 1 · хроника</button>
					<button type="button" class:on={part === 2} onclick={() => setPart(2)}>Часть 2 · данные</button>
					{#if deck.part3}
						<button type="button" class:on={part === 3} onclick={() => setPart(3)}>Часть 3 · блог</button>
					{/if}
				</nav>
			{/if}
			<span class="bar__period">{deck.meta.period}</span>
		</header>

		{#if part === 1}
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
							<h1>{b.title}</h1>
							<p class="sub">{b.sub}</p>
										{:else}
							<h2>{b.title}</h2>
							<div class="cols" class:cols--shot={b.shots?.length && !b.shotsRow}>
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

							{#if b.type === 'table2'}
								<div class="t2">
									{#each [b.left, b.right] as part}
										<table class="tbl tbl--sm">
											<thead><tr>{#each b.head as h}<th>{h}</th>{/each}</tr></thead>
											<tbody>
												{#each part as r, ri}
													<tr style="--i: {ri + 1}">{#each r as c, ci}<td class:num={ci > 0} class:up={ci === 3}>{c}</td>{/each}</tr>
												{/each}
											</tbody>
										</table>
									{/each}
								</div>
							{/if}

							{#if b.pages}
								<ul class="pages">
									{#each b.pages as pg}
										<li><b>{pg[0]}</b><span>{pg[1]}</span></li>
									{/each}
								</ul>
							{/if}

							{#if b.dropdown}
								<details class="dd">
									<summary>{b.dropdown.label}</summary>
									<div class="dd__body">
										{#each b.dropdown.items as it}
											<div class="dd__i">
												<span class="dd__url">{it.url}</span>
												{#if it.queries?.length}
													<span class="dd__q">{#each it.queries as q}<i>{q}</i>{/each}</span>
												{/if}
												<b>{it.title}</b>
												<p>{it.desc}</p>
											</div>
										{/each}
									</div>
								</details>
							{/if}

							{#if b.compare}
								<div class="cmp">
									{#each [b.compare.a, b.compare.b] as side, si}
										<div class="cmp__col" class:cmp__col--keep={si === 1}>
											<span class="cmp__h">{side.h}</span>
											<ul>{#each side.items as it}<li>{it}</li>{/each}</ul>
										</div>
									{/each}
								</div>
							{/if}

							{#if b.audit}
								<p class="links">
									<button class="abtn" type="button" onclick={() => (audit = b.audit)}>{b.auditLabel ?? 'Открыть ↗'}</button>
								</p>
							{/if}

							{#if b.links}
								<p class="links">
									{#each b.links as l}<a href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>{/each}
								</p>
							{/if}

							{#if b.note}<p class="note">{b.note}</p>{/if}
							</div>
							{#if b.shots?.length}
								<div class="shots" class:shots--row={b.shotsRow}>
									{#each b.shots as sh}
										<figure class:tall={sh.tall}>
											<a href={sh.src} target="_blank" rel="noopener"><img src={sh.src} alt={sh.cap} decoding="async" /></a>
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
		{:else if part === 2}
			<div class="p2">
				<div class="p2__in">
					<header class="p2__head">
						<h1>{deck.part2.title}</h1>
						<p class="sub">{deck.part2.sub}</p>
					</header>

					{#each deck.part2.sections as s}
						<section class="p2__s">
							<div class="p2__mark"><span></span>{s.mark}</div>
							<div class="body">
								<h2>{s.title}</h2>
								{#if s.lead}<p class="lead">{s.lead}</p>{/if}

								{#if s.points}
									<div class="points">
										{#each s.points as p}<div><b>{p.v}</b><span>{p.l}</span></div>{/each}
									</div>
								{/if}

								{#if s.tiles}
									<div class="tiles">
										{#each s.tiles as t}<article><h3>{t.h}</h3><p>{t.p}</p></article>{/each}
									</div>
								{/if}

								{#if s.steps}
									<div class="steps">
										{#each s.steps as st}<div><b>{st.n}</b><span>{st.t}</span></div>{/each}
									</div>
								{/if}

								{#if s.lines}
									<ul class="lines">
										{#each s.lines as l}<li>{l}</li>{/each}
									</ul>
								{/if}

								{#if s.table}
									<div class="p2__tw">
										<table class="tbl tbl--sm">
											<thead><tr>{#each s.table.head as h}<th>{h}</th>{/each}</tr></thead>
											<tbody>
												{#each s.table.rows as r}
													<tr>{#each r as c}<td>{c}</td>{/each}</tr>
												{/each}
											</tbody>
										</table>
									</div>
								{/if}

								{#if s.shots}
									<div class="p2__shots" class:p2__shots--grid={s.shotsGrid}>
										{#each s.shots as sh}
											<figure>
												<a href={sh.src} target="_blank" rel="noopener"><img src={sh.src} alt={sh.cap} decoding="async" /></a>
												<figcaption>{sh.cap}</figcaption>
											</figure>
										{/each}
									</div>
								{/if}

								{#if s.kick}<p class="kick">{s.kick}</p>{/if}
								{#if s.note}<p class="note">{s.note}</p>{/if}
							</div>
						</section>
					{/each}
				</div>
			</div>
		{:else}
			<div class="p2 p3">
				<div class="p2__in">
					<header class="p2__head">
						<h1>{deck.part3.title}</h1>
						<p class="sub">{deck.part3.sub}</p>
					</header>

					<section class="p2__s">
						<div class="p2__mark"><span></span>Файлы</div>
						<div class="body">
							<h2>Скачать</h2>
							<ul class="lines">
								{#each deck.part3.files as f}
									<li><a href={f.href} target="_blank" rel="noopener">{f.label} ↗</a></li>
								{/each}
							</ul>
						</div>
					</section>

					<section class="p2__s">
						<div class="p2__mark"><span></span>Структура</div>
						<div class="body p3__doc">
							<h2>Как устроен блог</h2>
							{@html deck.part3.struct_html}
						</div>
					</section>

					<section class="p2__s">
						<div class="p2__mark"><span></span>Статьи</div>
						<div class="body">
							<h2>15 статей целиком</h2>
							<p class="lead">Нажмите на заголовок, чтобы развернуть текст. Голубые плашки внутри это заглушки под фото с описанием кадра.</p>
							{#each ['Детский сад', 'Выбор школы', 'Педагоги', 'Подготовка к школе', 'Обучение в школе'] as cat}
								<h3 class="p3__cat">{cat}</h3>
								{#each deck.part3.articles.filter((a) => a.cat === cat) as a}
									<details class="p3__art">
										<summary>
											<span class="p3__n">{String(a.n).padStart(2, '0')}</span>
											<span class="p3__t">{a.h1}</span>
											<span class="p3__w">{a.words} слов</span>
										</summary>
										<div class="p3__meta">
											<div><b>URL</b> {a.url}</div>
											<div><b>Title</b> {a.title}</div>
											<div><b>Description</b> {a.desc}</div>
											<div><b>Ссылаться со страниц</b> {a.link_from}</div>
											<div><a href={a.file} target="_blank" rel="noopener">Скачать docx ↗</a></div>
										</div>
										<div class="p3__doc">
											{@html a.html}
										</div>
									</details>
								{/each}
							{/each}
						</div>
					</section>

					<section class="p2__s">
						<div class="p2__mark"><span></span>Перелинковка</div>
						<div class="body">
							<h2>Какой блок на какой странице ведёт на какую статью</h2>
							<p class="lead">82 точки на 24 страницах. Приоритет: с чего начинать.</p>
							<div class="p2__tw p3__links">
								<table class="tbl tbl--sm">
									<thead><tr><th>Страница</th><th>Блок на странице</th><th>Статья</th><th>Анкор</th><th>Как поставить</th><th>Приоритет</th></tr></thead>
									<tbody>
										{#each deck.part3.links as r}
											<tr class="pr-{r[8] === 'Высокий' ? 'h' : r[8] === 'Средний' ? 'm' : 'l'}">
												<td><b>{r[0]}</b><br /><small>{r[1]}</small></td>
												<td>{r[2]}</td>
												<td><small>{r[3]}</small> {r[4]}</td>
												<td>{r[6]}</td>
												<td>{r[7]}</td>
												<td>{r[8]}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				</div>
			</div>
		{/if}

		{#if audit}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="ov" onclick={(e) => e.target === e.currentTarget && (audit = null)}>
				<div class="ov__panel">
					<div class="ov__head">
						<b>{deck.audits[audit].title}</b>
						<button type="button" onclick={() => (audit = null)} aria-label="Закрыть">✕</button>
					</div>
					<div class="ov__body">{@html deck.audits[audit].html}</div>
				</div>
			</div>
		{/if}
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

	/* переключатель частей */
	.parts {
		display: flex;
		gap: 4px;
		margin-left: 6px;
		align-self: center;
	}
	.parts button {
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: var(--ink-3);
		background: transparent;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 6px 12px;
		cursor: pointer;
		white-space: nowrap;
	}
	.parts button.on {
		background: var(--ink);
		border-color: var(--ink);
		color: #f2f2f0;
	}
	.parts button:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}

	/* вторая часть: вертикальная выгрузка */
	.p2 {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.p2__in {
		max-width: 980px;
		margin: 0 auto;
		padding: clamp(28px, 5vw, 56px) clamp(16px, 3vw, 40px) 90px;
	}
	.p2__head h1 {
		margin: 0 0 10px;
		font-size: clamp(28px, 4.4vw, 46px);
		font-weight: 400;
		line-height: 1.08;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}
	.p2__head .sub {
		margin: 0;
		max-width: 60ch;
	}
	.p2__s {
		margin-top: clamp(34px, 5vw, 62px);
		padding-top: clamp(20px, 3vw, 30px);
		border-top: 1px solid var(--line);
	}
	.p2__mark {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 14px;
	}
	.p2__mark span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ink);
		flex: none;
	}
	.p2 .body {
		display: grid;
		gap: 18px;
	}
	.p2 .body h2 {
		margin: 0;
	}
	.p2 .lines li {
		font-size: clamp(15px, 1.4vw, 18px);
	}
	.p2__tw {
		overflow-x: auto;
	}
	.p2__tw .tbl {
		min-width: 520px;
	}
	.p2__tw .tbl td:first-child {
		white-space: nowrap;
		font-weight: 500;
	}
	.p2__tw .tbl td:last-child:not(:first-child) {
		white-space: nowrap;
		color: var(--ink-2);
	}
	.p2__shots {
		display: grid;
		gap: 18px;
	}
	.p2__shots--grid {
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 14px;
	}
	.p2__shots figure {
		margin: 0;
	}
	.p2__shots img {
		display: block;
		width: 100%;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: #fff;
	}
	.p2__shots figcaption {
		margin-top: 8px;
		font-size: 13px;
		color: var(--ink-2);
	}
	/* третья часть: блог */
	.p3 .lines a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.p3__cat {
		margin: 22px 0 8px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.p3__art {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 14px;
		margin-bottom: 8px;
		overflow: hidden;
	}
	.p3__art summary {
		list-style: none;
		cursor: pointer;
		display: grid;
		grid-template-columns: 34px 1fr auto;
		gap: 12px;
		align-items: baseline;
		padding: 14px 18px;
		font-size: clamp(15px, 1.4vw, 18px);
		line-height: 1.3;
	}
	.p3__art summary::-webkit-details-marker {
		display: none;
	}
	.p3__art summary::before {
		content: '+';
		grid-column: 1;
		font-family: monospace;
		color: var(--ink-3);
	}
	.p3__art[open] summary::before {
		content: '−';
	}
	.p3__n {
		display: none;
	}
	.p3__w {
		font-size: 12px;
		color: var(--ink-3);
		white-space: nowrap;
	}
	.p3__meta {
		display: grid;
		gap: 4px;
		padding: 0 18px 14px;
		font-size: 12.5px;
		color: var(--ink-2);
		border-bottom: 1px solid var(--line);
	}
	.p3__meta b {
		color: var(--ink-3);
		font-weight: 500;
		margin-right: 6px;
	}
	.p3__meta a {
		color: var(--ink);
	}
	.p3__doc {
		padding: 6px 18px 20px;
		max-width: 76ch;
		font-size: 15.5px;
		line-height: 1.55;
	}
	.p3__doc :global(h3) {
		margin: 24px 0 8px;
		font-size: 19px;
		font-weight: 500;
	}
	.p3__doc :global(h4) {
		margin: 16px 0 6px;
		font-size: 16px;
		font-weight: 500;
	}
	.p3__doc :global(p) {
		margin: 0 0 10px;
	}
	.p3__doc :global(ul),
	.p3__doc :global(ol) {
		margin: 0 0 12px;
		padding-left: 22px;
	}
	.p3__doc :global(li) {
		margin-bottom: 5px;
	}
	.p3__doc :global(.ph) {
		background: #eaf1fb;
		color: #2b4c9b;
		border-radius: 10px;
		padding: 10px 14px;
		font-size: 13px;
		font-style: italic;
		margin: 12px 0;
	}
	.p3__doc :global(.co) {
		background: #f3f6ee;
		border-left: 3px solid #6b8e4e;
		border-radius: 0 10px 10px 0;
		padding: 10px 14px;
		margin: 12px 0;
		font-size: 14.5px;
	}
	.p3__doc :global(.co p) {
		margin: 0 0 4px;
	}
	.p3__doc :global(.tw) {
		overflow-x: auto;
		margin: 10px 0 14px;
	}
	.p3__doc :global(table) {
		border-collapse: collapse;
		width: 100%;
		min-width: 420px;
		font-size: 13.5px;
	}
	.p3__doc :global(th),
	.p3__doc :global(td) {
		border: 1px solid var(--line);
		padding: 7px 10px;
		text-align: left;
		vertical-align: top;
	}
	.p3__doc :global(th) {
		background: #f4f4f2;
		font-weight: 500;
	}
	.p3__links .tbl {
		min-width: 900px;
		font-size: 12.5px;
	}
	.p3__links td {
		vertical-align: top;
	}
	.p3__links small {
		color: var(--ink-3);
	}
	.p3__links tr.pr-h td:last-child {
		color: #1f6b4a;
		font-weight: 500;
	}
	.p3__links tr.pr-l td:last-child {
		color: var(--ink-3);
	}
	@media (max-width: 720px) {
		.bar {
			flex-wrap: wrap;
			gap: 10px 14px;
		}
		.bar__period {
			margin-left: 0;
		}
		.parts {
			order: 3;
			width: 100%;
			margin-left: 0;
		}
		.parts button {
			flex: 1;
		}
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
	/* появление: блок и его дети въезжают с задержкой */
	.b .body > * {
		opacity: 0;
		transform: translateY(18px);
		transition: opacity 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.b.in .body > * {
		opacity: 1;
		transform: none;
	}
	.b .tiles article,
	.b .steps > div,
	.b .points > div,
	.b .lines li,
	.b .tbl tbody tr,
	.b .cmp__col,
	.b .shots figure {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.b.in .tiles article,
	.b.in .steps > div,
	.b.in .points > div,
	.b.in .lines li,
	.b.in .tbl tbody tr,
	.b.in .cmp__col,
	.b.in .shots figure {
		opacity: 1;
		transform: none;
	}
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(1) { transition-delay: 0.1s; }
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(2) { transition-delay: 0.2s; }
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(3) { transition-delay: 0.3s; }
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(4) { transition-delay: 0.4s; }
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(5) { transition-delay: 0.5s; }
	.b.in :is(.tiles, .steps, .points, .lines, .cmp) > :nth-child(6) { transition-delay: 0.6s; }
	.b.in .tbl tbody tr:nth-child(n) { transition-delay: calc(0.08s * var(--i, 1)); }
	.b.in .shots figure { transition-delay: 0.35s; }
	.b .gb,
	.b .bars__bar {
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.b.in .gb,
	.b.in .bars__bar {
		transform: scaleY(1);
	}
	.b.in .gb--1 { transition-delay: 0.15s; }
	.b.in .gb--3 { transition-delay: 0.3s; }
	.b.in .gb--10 { transition-delay: 0.45s; }
	.b .gb i { opacity: 0; transition: opacity 0.4s ease 0.9s; }
	.b.in .gb i { opacity: 1; }
	.axis__dot {
		transform: scale(0.4);
		opacity: 0;
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.5s ease;
	}
	.b.in .axis__dot {
		transform: none;
		opacity: 1;
	}
	.b.in .axis__dot::after {
		content: '';
		position: absolute;
		inset: -6px;
		border-radius: 100px;
		border: 1px solid #141414;
		animation: pulse 1.6s ease-out 0.3s 2;
		opacity: 0;
	}
	@keyframes pulse {
		0% { transform: scale(0.5); opacity: 0.7; }
		100% { transform: scale(1.8); opacity: 0; }
	}
	.axis__mark {
		opacity: 0;
		transform: translateX(-8px);
		transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;
	}
	.b.in .axis__mark {
		opacity: 1;
		transform: none;
	}
	.cmp {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.cmp__col {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 16px 18px;
	}
	.cmp__col--keep {
		background: #141414;
		color: #fff;
		border-color: #141414;
	}
	.cmp__h {
		display: block;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.cmp__col--keep .cmp__h {
		color: rgba(255, 255, 255, 0.55);
	}
	.cmp ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 5px;
		font-size: 14px;
	}
	.cmp__col:not(.cmp__col--keep) li {
		color: var(--ink-2);
		text-decoration: line-through;
		text-decoration-color: rgba(0, 0, 0, 0.35);
	}
	.abtn {
		border: 1px solid #141414;
		background: #141414;
		color: #fff;
		border-radius: 100px;
		padding: 10px 18px;
		font: inherit;
		font-size: 14px;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}
	.abtn:hover {
		transform: translateY(-1px);
		box-shadow: 0 12px 24px -14px rgba(0, 0, 0, 0.6);
	}
	.ov {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(6px);
		display: grid;
		place-items: center;
		padding: 24px;
		z-index: 50;
		animation: fade 0.25s ease;
	}
	@keyframes fade {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	.ov__panel {
		width: min(980px, 100%);
		height: min(88vh, 100%);
		background: #fff;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: rise 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	@keyframes rise {
		from { transform: translateY(24px); opacity: 0; }
		to { transform: none; opacity: 1; }
	}
	.ov__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 16px 22px;
		border-bottom: 1px solid var(--line);
	}
	.ov__head b {
		font-weight: 500;
	}
	.ov__head button {
		border: 0;
		background: #f2f2f0;
		border-radius: 100px;
		width: 34px;
		height: 34px;
		cursor: pointer;
		font-size: 14px;
	}
	.ov__body {
		overflow-y: auto;
		padding: 8px 26px 30px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.ov__body :global(h2) { font-size: 20px; color: var(--ink); margin: 26px 0 10px; font-weight: 500; }
	.ov__body :global(h3) { font-size: 16px; color: var(--ink); margin: 22px 0 8px; font-weight: 500; }
	.ov__body :global(h4) { font-size: 14px; color: var(--ink); margin: 14px 0 6px; }
	.ov__body :global(p) { margin: 0 0 10px; }
	.ov__body :global(p.lbl) { font-size: 11px; letter-spacing: 0.12em; color: var(--ink-3); margin: 12px 0 2px; }
	.ov__body :global(ul) { margin: 0 0 12px; padding-left: 18px; }
	.ov__body :global(li) { margin-bottom: 6px; }
	.ov__body :global(.rtab) { overflow-x: auto; margin: 0 0 16px; }
	.ov__body :global(table) { border-collapse: collapse; width: 100%; font-size: 13px; min-width: 420px; }
	.ov__body :global(th), .ov__body :global(td) { border-bottom: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
	.ov__body :global(th) { color: var(--ink); font-weight: 500; white-space: nowrap; }
	.b--xwide {
		width: min(1240px, 94vw);
	}
	.t2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.t2 .tbl--sm th,
	.t2 .tbl--sm td {
		padding: 7px 12px;
		font-size: 13.5px;
	}
	.tbl td.up {
		color: #141414;
		font-weight: 500;
	}
	.pages {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.pages li {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 13px 16px;
		opacity: 0;
		transform: translateY(14px);
		transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.b.in .pages li {
		opacity: 1;
		transform: none;
	}
	.b.in .pages li:nth-child(2n) { transition-delay: 0.12s; }
	.b.in .pages li:nth-child(n + 3) { transition-delay: 0.2s; }
	.b.in .pages li:nth-child(n + 5) { transition-delay: 0.3s; }
	.b.in .pages li:nth-child(n + 7) { transition-delay: 0.4s; }
	.pages b {
		display: block;
		font-weight: 500;
		font-size: 15px;
	}
	.pages span {
		display: block;
		margin-top: 3px;
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.4;
	}
	@media (max-width: 860px) {
		.t2,
		.pages {
			grid-template-columns: 1fr;
		}
	}
	.shots--row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.shots--row img {
		max-height: clamp(160px, 34vh, 380px);
	}
	/* длинный скриншот страницы: листается внутри рамки */
	.shots figure.tall {
		max-height: clamp(260px, 62vh, 620px);
		overflow-y: auto;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: #fff;
	}
	.shots figure.tall img {
		max-height: none;
		border: 0;
		border-radius: 0;
		object-fit: initial;
	}
	.dd {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 14px 18px;
	}
	.dd summary {
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 15px;
	}
	.dd summary::-webkit-details-marker {
		display: none;
	}
	.dd summary::after {
		content: '+';
		font-size: 20px;
		line-height: 1;
		color: var(--ink-3);
		transition: transform 0.25s ease;
	}
	.dd[open] summary::after {
		transform: rotate(45deg);
	}
	.dd__body {
		margin-top: 12px;
		max-height: clamp(180px, 38vh, 380px);
		overflow-y: auto;
		display: grid;
		gap: 10px;
		padding-right: 6px;
	}
	.dd__i {
		border-top: 1px solid var(--line);
		padding-top: 10px;
	}
	.dd__url {
		display: block;
		font-size: 11px;
		color: var(--ink-3);
		letter-spacing: 0.04em;
		margin-bottom: 3px;
		word-break: break-all;
	}
	.dd__i b {
		display: block;
		font-weight: 500;
		font-size: 14.5px;
		line-height: 1.35;
	}
	.dd__i p {
		margin: 4px 0 0;
		font-size: 13.5px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	.dd__q {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin: 4px 0 7px;
	}
	.dd__q i {
		font-style: normal;
		font-size: 12px;
		line-height: 1;
		padding: 5px 9px;
		border-radius: 100px;
		background: #f0f0ee;
		color: var(--ink-2);
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
