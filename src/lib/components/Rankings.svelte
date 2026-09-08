<script>
	/* Блок «проверьте сами»: позиции проекта по поисковым системам и городам.
	   Данные приходят из rankings.js – он сгенерирован из выгрузок Топвизора. */
	import { rankings } from '$lib/data/rankings.js';

	let { item } = $props();
	const sets = $derived(rankings[item.rank] ?? []);
	const nf = new Intl.NumberFormat('ru-RU');
</script>

{#if sets.length}
	<div class="rk">
		<div class="rk__intro">
			<h2>Проверьте позиции сами</h2>
			<p>
				Ниже – самые сильные коммерческие запросы проекта <a
					href={item.siteUrl}
					target="_blank"
					rel="noopener nofollow">{item.site}</a
				>. Откройте поиск, укажите нужный город и введите запрос – сайт должен быть на указанном
				месте. Частотность приведена точная, по данным Вордстата на момент съёма.
			</p>
			<p class="rk__note">
				Позиции – живая величина: они меняются от апдейта к апдейту и зависят от вашего города и
				истории поиска. Данные ниже сняты в Топвизоре и обновляются при следующей выгрузке.
			</p>
		</div>

		{#each sets as set}
			<section class="rk__set">
				<header class="rk__head">
					<div>
						<span class="rk__engine">{set.engine}</span>
						<span class="rk__city">{set.city}</span>
					</div>
					<dl class="rk__stats">
						<div><dt>В ТОП-3</dt><dd>{nf.format(set.top3)}</dd></div>
						<div><dt>В ТОП-5</dt><dd>{nf.format(set.top5)}</dd></div>
						<div><dt>В ТОП-10</dt><dd>{nf.format(set.top10)}</dd></div>
						<div><dt>Точная частотность</dt><dd>{nf.format(set.exactSum)}</dd></div>
					</dl>
				</header>

				<table class="rk__table">
					<thead>
						<tr>
							<th class="rk__c-pos">Позиция</th>
							<th>Запрос</th>
							<th class="rk__c-freq">Показов в месяц</th>
						</tr>
					</thead>
					<tbody>
						{#each set.queries as q}
							<tr class:top3={q.pos <= 3}>
								<td class="rk__c-pos"><span class="rk__pos">{q.pos}</span></td>
								<td class="rk__q">{q.q}</td>
								<td class="rk__c-freq">{nf.format(q.freq)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{/each}
	</div>
{/if}

<style>
	.rk {
		display: grid;
		gap: clamp(20px, 2.6vw, 32px);
	}
	.rk__intro h2 {
		margin: 0 0 14px;
	}
	.rk__intro p {
		margin: 0 0 10px;
		color: var(--ink-2);
		font-size: 16px;
		line-height: 1.6;
		max-width: 48em;
	}
	.rk__intro a {
		border-bottom: 1px solid var(--gold, #111);
	}
	.rk__note {
		font-size: 14px !important;
		color: var(--ink-3) !important;
	}

	.rk__set {
		background: var(--card, #fff);
		border: 1px solid var(--line-soft, rgba(0, 0, 0, 0.07));
		border-radius: 20px;
		overflow: hidden;
	}
	.rk__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 28px;
		padding: clamp(18px, 2vw, 24px) clamp(18px, 2.2vw, 28px);
		border-bottom: 1px solid var(--line-soft, rgba(0, 0, 0, 0.07));
	}
	.rk__engine {
		font-size: 17px;
		font-weight: 500;
		margin-right: 10px;
	}
	.rk__city {
		font-size: 13px;
		color: var(--ink-3);
		background: rgba(0, 0, 0, 0.05);
		padding: 4px 12px;
		border-radius: 100px;
	}
	.rk__stats {
		display: flex;
		flex-wrap: wrap;
		gap: 18px 26px;
		margin: 0;
	}
	.rk__stats div {
		display: grid;
		gap: 2px;
	}
	.rk__stats dt {
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.rk__stats dd {
		margin: 0;
		font-size: 17px;
		font-weight: 500;
	}

	.rk__table {
		width: 100%;
		border-collapse: collapse;
		font-size: 15px;
	}
	.rk__table th {
		text-align: left;
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 400;
		color: var(--ink-3);
		padding: 12px clamp(12px, 1.6vw, 20px);
	}
	.rk__table td {
		padding: 12px clamp(12px, 1.6vw, 20px);
		border-top: 1px solid var(--line-soft, rgba(0, 0, 0, 0.06));
	}
	.rk__c-pos {
		width: 84px;
	}
	.rk__c-freq {
		width: 150px;
		text-align: right;
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
	}
	.rk__pos {
		display: inline-grid;
		place-items: center;
		min-width: 30px;
		height: 30px;
		padding: 0 8px;
		border-radius: 100px;
		background: rgba(0, 0, 0, 0.06);
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	tr.top3 .rk__pos {
		background: var(--ink, #1a1a18);
		color: #fff;
	}
	.rk__q {
		color: var(--ink);
	}

	@media (max-width: 620px) {
		.rk__c-freq {
			width: 100px;
			font-size: 13px;
		}
		.rk__table {
			font-size: 14px;
		}
		.rk__stats {
			gap: 12px 20px;
		}
	}
</style>
