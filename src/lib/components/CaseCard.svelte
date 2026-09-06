<script>
	import Arrow from './Arrow.svelte';
	let { item } = $props();
</script>

<a class="ccard" href="/keysy/{item.slug}/">
	<div class="ccard__top" style="--cover: {item.cover}">
		<span class="ccard__industry">{item.industry}</span>
		<span class="ccard__big">{item.metrics[0].v}</span>
		<span class="ccard__biglabel">{item.metrics[0].l}</span>
	</div>
	<div class="ccard__body">
		{#if item.site}<span class="ccard__client">{item.client}</span>{/if}
		<h3>{item.site ?? item.client}</h3>
		<p>{item.short}</p>
		<div class="ccard__metrics">
			{#each item.metrics.slice(1) as m}
				<div>
					<b>{m.v}</b>
					<span>{m.l}</span>
				</div>
			{/each}
		</div>
		<span class="link-arrow">Смотреть кейс <Arrow /></span>
	</div>
</a>

<style>
	.ccard {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: 22px;
		overflow: hidden;
		transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.ccard:hover {
			transform: translateY(-4px);
			box-shadow: 0 24px 60px -38px rgba(16, 16, 16, 0.55);
		}
	}
	.ccard__top {
		background: var(--cover);
		color: var(--on-dark);
		padding: clamp(24px, 3vw, 34px);
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-height: 200px;
		justify-content: flex-end;
		position: relative;
	}
	.ccard__industry {
		position: absolute;
		top: clamp(20px, 2.4vw, 28px);
		left: clamp(24px, 3vw, 34px);
		font-size: 11.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
	}
	.ccard__big {
		font-size: clamp(40px, 4.6vw, 60px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
	}
	.ccard__biglabel {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.7);
	}
	.ccard__body {
		padding: clamp(22px, 2.6vw, 32px);
		display: flex;
		flex-direction: column;
		gap: 16px;
		flex: 1;
	}
	h3 {
		font-size: clamp(18px, 1.6vw, 21px);
		overflow-wrap: anywhere;
	}
	.ccard__client {
		font-size: 11px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	p {
		font-size: 15px;
		color: var(--ink-2);
		margin: 0;
		line-height: 1.55;
	}
	.ccard__metrics {
		display: flex;
		gap: 26px;
		flex-wrap: wrap;
		padding: 16px 0;
		border-top: 1px solid var(--line-soft);
		border-bottom: 1px solid var(--line-soft);
		margin-top: auto;
	}
	.ccard__metrics b {
		display: block;
		font-size: 21px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.ccard__metrics span {
		font-size: 12.5px;
		color: var(--ink-3);
	}
	.link-arrow {
		align-self: flex-start;
	}
</style>
