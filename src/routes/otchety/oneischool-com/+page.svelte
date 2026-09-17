<script>
	import Seo from '$lib/components/Seo.svelte';
	import { project, strategy, events } from '$lib/data/reports/oneischool/timeline.js';
	import auditSadiki from '$lib/data/reports/oneischool/audit-sadiki.html?raw';
	import auditShkoly from '$lib/data/reports/oneischool/audit-shkoly.html?raw';
	import analysisHtml from '$lib/data/reports/oneischool/analysis.html?raw';
	import { metrics } from '$lib/data/reports/oneischool/metrics.js';
	const nf = new Intl.NumberFormat('ru-RU');

	const reports = {
		'audit-sadiki': { title: 'Аудит раздела детских садов, июнь 2026', html: auditSadiki },
		'audit-shkoly': { title: 'Аудит сайта и раздела школ, сентябрь 2026', html: auditShkoly }
	};

	let rail = $state();
	let progress = $state(0);
	let active = $state(0);

	/* Горизонтальная лента: тачпад двумя пальцами работает сам, вертикальное
	   колесо тоже листает вбок, пока лента не упёрлась в край. */
	function onWheel(e) {
		if (!rail) return;
		const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
		if (horizontal) return;
		const max = rail.scrollWidth - rail.clientWidth;
		const next = rail.scrollLeft + e.deltaY;
		if ((e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max - 1)) return;
		e.preventDefault();
		rail.scrollLeft = next;
	}

	/* Перетаскивание мышью, как на доске. */
	let drag = null;
	function down(e) {
		if (e.target.closest('details, a, button, table')) return;
		drag = { x: e.clientX, left: rail.scrollLeft };
		rail.setPointerCapture?.(e.pointerId);
	}
	function move(e) {
		if (!drag) return;
		rail.scrollLeft = drag.left - (e.clientX - drag.x);
	}
	function up() {
		drag = null;
	}

	function onScroll() {
		if (!rail) return;
		const max = rail.scrollWidth - rail.clientWidth;
		progress = max > 0 ? rail.scrollLeft / max : 0;
		const cards = [...rail.querySelectorAll('.card')];
		const mid = rail.scrollLeft + rail.clientWidth / 2;
		let best = 0;
		cards.forEach((c, i) => {
			if (c.offsetLeft <= mid) best = i;
		});
		active = best;
	}

	function go(i) {
		const card = rail?.querySelectorAll('.card')[i];
		if (card) rail.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
	}

	function key(e) {
		if (e.key === 'ArrowRight') go(Math.min(active + 1, events.length - 1));
		if (e.key === 'ArrowLeft') go(Math.max(active - 1, 0));
	}
</script>

<Seo
	title="Отчёт по продвижению oneischool.com, июнь – сентябрь 2026 | Фальков"
	description="Рабочая хронология проекта ONE! International School: аудиты, редизайн, переезд и динамика позиций."
	path="/otchety/oneischool-com/"
	noindex
/>

<div class="rep-page">
	<header class="top">
		<a class="back" href="/">falkov <span>маркетинг</span></a>
		<span class="top__label">Отчёт для клиента</span>
	</header>

	<section class="hero">
		<span class="eyebrow">{project.period}</span>
		<h1>{project.client}</h1>
		<p class="site">{project.site}</p>
		<p class="lead">
			Хронология работ по проекту: что делали, в каком порядке, что из этого получилось. Лента
			листается вбок двумя пальцами по тачпаду, колесом мыши или перетаскиванием. Под каждой датой
			лежит короткое описание, а развёрнутые отчёты открываются по клику.
		</p>
	</section>

	<section class="strategy">
		<div class="col">
			<h2>Почему всё просело</h2>
			{#each strategy.problem as p}<p>{p}</p>{/each}
		</div>
		<div class="col">
			<h2>На что давим</h2>
			{#each strategy.bet as p}<p>{p}</p>{/each}
		</div>
		<div class="col col--note">
			<h2>Важное уточнение</h2>
			<p>{strategy.note}</p>
			<a class="tv" href={project.topvisor} target="_blank" rel="noopener">Позиции в Топвизоре</a>
		</div>
	</section>

	<section class="nums">
		<h2>Цифры за период</h2>
		<div class="hl">
			{#each metrics.highlights as h}
				<div class="hl__i">
					<b>{h.v}</b>
					<span>{h.l}</span>
				</div>
			{/each}
		</div>

		<div class="ntab">
			<table>
				<thead>
					<tr>
						<th>Месяц</th>
						<th>Визиты</th>
						<th>В день</th>
						<th>Google</th>
						<th>Яндекс</th>
						<th>Клики GSC</th>
						<th>CTR</th>
						<th>ТОП-10</th>
					</tr>
				</thead>
				<tbody>
					{#each metrics.months as m}
						<tr>
							<th scope="row">{m.m}</th>
							<td>{nf.format(m.visits)}</td>
							<td>{String(m.perDay).replace('.', ',')}</td>
							<td>{nf.format(m.google)}</td>
							<td>{nf.format(m.yandex)}</td>
							<td>{nf.format(m.clicks)}</td>
							<td>{m.ctr}</td>
							<td>{m.top10}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<p class="nums__sum">
			Трафик прошёл цикл «спад каникул, дно в августе, отскок в сентябре», и всё это время
			видимость в Яндексе росла: доля запросов в ТОП-10 поднялась с 70% в июне до 78,5% на
			последнем съёме, а внутри коммерческого ядра до 84,5%. Сильнее всего вырос кластер садов,
			который в июне был самым слабым.
		</p>

		<div class="wins">
			<span class="wins__h">Заметные движения по позициям</span>
			<ul>
				{#each metrics.wins as w}
					<li><b>{w[0]}</b><span>{w[1]} → {w[2]}</span></li>
				{/each}
			</ul>
		</div>

		<details class="rep rep--wide">
			<summary>Развернуть полный разбор по месяцам</summary>
			<div class="rep__body">{@html analysisHtml}</div>
		</details>
	</section>

	<section class="tl" aria-label="Хронология работ">
		<div class="tl__head">
			<h2>Хронология</h2>
			<div class="tl__nav">
				{#each events as e, i}
					<button class:on={i === active} type="button" onclick={() => go(i)}>{e.label}</button>
				{/each}
			</div>
		</div>

		<div class="tl__bar"><span style="transform: scaleX({progress})"></span></div>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="rail"
			bind:this={rail}
			onwheel={onWheel}
			onscroll={onScroll}
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={up}
			onkeydown={key}
			tabindex="0"
			role="list"
		>
			{#each events as e, i}
				<article class="card" class:on={i === active} role="listitem">
					<div class="card__date">
						<b>{e.label}</b>
						<span>{e.tag}</span>
					</div>
					<h3>{e.title}</h3>
					{#each e.text as p}<p>{p}</p>{/each}

					{#if e.shots?.length}
						<div class="shots">
							{#each e.shots as s}
								<figure>
									<a href={s.src} target="_blank" rel="noopener" title="Открыть в полном размере">
										<img src={s.src} alt={s.cap} loading="lazy" onerror={(ev) => (ev.currentTarget.closest('figure').hidden = true)} />
									</a>
									<figcaption>{s.cap}</figcaption>
								</figure>
							{/each}
						</div>
					{/if}

					{#if e.links?.length}
						<p class="links">
							{#each e.links as l}
								<a href={l.href} target="_blank" rel="noopener">{l.label}</a>
							{/each}
						</p>
					{/if}

					{#if e.report}
						<details class="rep">
							<summary>Развернуть отчёт: {reports[e.report].title}</summary>
							<div class="rep__body">{@html reports[e.report].html}</div>
						</details>
					{/if}
				</article>
			{/each}
			<div class="tail" aria-hidden="true"></div>
		</div>
		<p class="hint">Листайте вбок: двумя пальцами по тачпаду, колесом или перетаскиванием</p>
	</section>
</div>

<style>
	.rep-page {
		--ink: #111;
		--ink-2: #565656;
		--ink-3: #949494;
		--line: rgba(0, 0, 0, 0.12);
		--panel: #fff;
		background: #f5f5f5;
		color: var(--ink);
		min-height: 100vh;
		padding-bottom: 80px;
		font-size: 16px;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px clamp(16px, 4vw, 56px);
		border-bottom: 1px solid var(--line);
	}
	.back {
		font-weight: 600;
		letter-spacing: 0.02em;
		color: inherit;
		text-decoration: none;
	}
	.back span {
		font-weight: 400;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-left: 6px;
	}
	.top__label {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.hero {
		padding: clamp(36px, 6vw, 80px) clamp(16px, 4vw, 56px) 0;
		max-width: 1400px;
	}
	.eyebrow {
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.hero h1 {
		margin: 12px 0 4px;
		font-size: clamp(30px, 5vw, 62px);
		font-weight: 400;
		line-height: 1.05;
		text-transform: uppercase;
		letter-spacing: 0.01em;
	}
	.site {
		margin: 0 0 18px;
		color: var(--ink-2);
	}
	.lead {
		max-width: 44em;
		line-height: 1.6;
		color: var(--ink-2);
		margin: 0;
	}
	.strategy {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 16px;
		padding: clamp(28px, 4vw, 48px) clamp(16px, 4vw, 56px);
		max-width: 1400px;
	}
	.col {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 20px;
		padding: clamp(20px, 2.2vw, 28px);
	}
	.col h2 {
		margin: 0 0 14px;
		font-size: 13px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 500;
	}
	.col p {
		margin: 0 0 12px;
		line-height: 1.6;
		font-size: 15px;
	}
	.col p:last-of-type {
		margin-bottom: 0;
	}
	.col--note {
		background: #141414;
		border-color: #141414;
		color: #f2f2f2;
	}
	.col--note h2 {
		color: rgba(255, 255, 255, 0.55);
	}
	.tv {
		display: inline-block;
		margin-top: 16px;
		color: #fff;
		font-size: 14px;
	}
	.nums {
		padding: clamp(10px, 2vw, 20px) clamp(16px, 4vw, 56px) clamp(20px, 3vw, 36px);
		max-width: 1400px;
	}
	.nums h2 {
		margin: 0 0 18px;
		font-size: clamp(22px, 2.6vw, 32px);
		font-weight: 400;
		text-transform: uppercase;
	}
	.hl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 12px;
		margin-bottom: 20px;
	}
	.hl__i {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: 18px 20px;
	}
	.hl__i b {
		display: block;
		font-size: clamp(26px, 3vw, 38px);
		font-weight: 400;
		line-height: 1;
	}
	.hl__i span {
		display: block;
		margin-top: 8px;
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.45;
	}
	.ntab {
		overflow-x: auto;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 18px;
	}
	.ntab table {
		width: 100%;
		min-width: 680px;
		border-collapse: collapse;
		font-size: 14px;
	}
	.ntab th,
	.ntab td {
		padding: 12px 14px;
		text-align: left;
		border-bottom: 1px solid var(--line);
		white-space: nowrap;
	}
	.ntab thead th {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 500;
	}
	.ntab tbody tr:last-child th,
	.ntab tbody tr:last-child td {
		border-bottom: none;
	}
	.ntab tbody th {
		font-weight: 500;
	}
	.ntab td {
		color: var(--ink-2);
	}
	.nums__sum {
		max-width: 46em;
		margin: 18px 0 0;
		line-height: 1.6;
		color: var(--ink-2);
		font-size: 15px;
	}
	.wins {
		margin-top: 20px;
	}
	.wins__h {
		display: block;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.wins ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
		max-width: 620px;
	}
	.wins li {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px dashed var(--line);
		padding-bottom: 8px;
		font-size: 15px;
	}
	.wins li b {
		font-weight: 400;
	}
	.wins li span {
		color: var(--ink);
		white-space: nowrap;
	}
	.rep--wide {
		margin-top: 22px;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 18px;
		padding: 18px 20px;
	}
	.tl {
		padding: clamp(20px, 3vw, 40px) 0 0;
	}
	.tl__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 16px 24px;
		padding: 0 clamp(16px, 4vw, 56px) 18px;
	}
	.tl__head h2 {
		margin: 0;
		font-size: clamp(22px, 2.6vw, 32px);
		font-weight: 400;
		text-transform: uppercase;
	}
	.tl__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.tl__nav button {
		border: 1px solid var(--line);
		background: transparent;
		border-radius: 100px;
		padding: 7px 14px;
		font: inherit;
		font-size: 13px;
		color: var(--ink-2);
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}
	.tl__nav button.on {
		background: #141414;
		border-color: #141414;
		color: #fff;
	}
	.tl__bar {
		height: 2px;
		background: var(--line);
		margin: 0 clamp(16px, 4vw, 56px) 20px;
		overflow: hidden;
	}
	.tl__bar span {
		display: block;
		height: 100%;
		background: #141414;
		transform-origin: left center;
		transform: scaleX(0);
		transition: transform 0.15s linear;
	}
	.rail {
		display: flex;
		gap: 18px;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 8px clamp(16px, 4vw, 56px) 30px;
		scroll-snap-type: x proximity;
		scrollbar-width: thin;
		cursor: grab;
		outline: none;
	}
	.rail:active {
		cursor: grabbing;
	}
	.card {
		flex: 0 0 min(620px, 88vw);
		scroll-snap-align: start;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 22px;
		padding: clamp(20px, 2.4vw, 30px);
		max-height: 70vh;
		overflow-y: auto;
		opacity: 0.55;
		transform: translateY(6px) scale(0.985);
		transition: opacity 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
	}
	.card.on {
		opacity: 1;
		transform: none;
		box-shadow: 0 30px 70px -50px rgba(0, 0, 0, 0.6);
	}
	.card__date {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 12px;
	}
	.card__date b {
		font-size: clamp(22px, 2.4vw, 30px);
		font-weight: 400;
	}
	.card__date span {
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		border: 1px solid var(--line);
		border-radius: 100px;
		padding: 4px 10px;
	}
	.card h3 {
		margin: 0 0 12px;
		font-size: 19px;
		font-weight: 500;
		line-height: 1.3;
	}
	.card p {
		margin: 0 0 12px;
		line-height: 1.6;
		font-size: 15px;
		color: var(--ink-2);
	}
	.shots {
		display: grid;
		gap: 10px;
		margin: 14px 0;
	}
	.shots figure {
		margin: 0;
	}
	.shots img {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--line);
		display: block;
	}
	.shots figcaption {
		margin-top: 6px;
		font-size: 12px;
		color: var(--ink-3);
	}
	.links a {
		font-size: 14px;
		margin-right: 14px;
	}
	.rep {
		margin-top: 14px;
		border-top: 1px solid var(--line);
		padding-top: 14px;
	}
	.rep summary {
		cursor: pointer;
		font-size: 14px;
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		color: var(--ink);
	}
	.rep summary::-webkit-details-marker {
		display: none;
	}
	.rep summary::after {
		content: '+';
		font-size: 18px;
		line-height: 1;
		color: var(--ink-3);
	}
	.rep[open] summary::after {
		content: '–';
	}
	.rep__body {
		margin-top: 14px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.rep__body :global(h2) {
		font-size: 18px;
		color: var(--ink);
		margin: 22px 0 10px;
		font-weight: 500;
	}
	.rep__body :global(h3) {
		font-size: 16px;
		color: var(--ink);
		margin: 18px 0 8px;
		font-weight: 500;
	}
	.rep__body :global(h4) {
		font-size: 14px;
		color: var(--ink);
		margin: 14px 0 6px;
	}
	.rep__body :global(p) {
		margin: 0 0 10px;
	}
	.rep__body :global(p.lbl) {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--ink-3);
		margin: 10px 0 2px;
	}
	.rep__body :global(ul) {
		margin: 0 0 12px;
		padding-left: 18px;
	}
	.rep__body :global(li) {
		margin-bottom: 6px;
	}
	.rep__body :global(.rtab) {
		overflow-x: auto;
		margin: 0 0 16px;
	}
	.rep__body :global(table) {
		border-collapse: collapse;
		width: 100%;
		font-size: 13px;
		min-width: 420px;
	}
	.rep__body :global(th),
	.rep__body :global(td) {
		border-bottom: 1px solid var(--line);
		padding: 8px 10px;
		text-align: left;
		vertical-align: top;
	}
	.rep__body :global(th) {
		color: var(--ink);
		font-weight: 500;
		white-space: nowrap;
	}
	.tail {
		flex: 0 0 clamp(16px, 20vw, 220px);
	}
	.hint {
		margin: 0;
		padding: 0 clamp(16px, 4vw, 56px);
		font-size: 12px;
		color: var(--ink-3);
	}
	@media (max-width: 640px) {
		.card {
			max-height: none;
		}
	}
</style>
