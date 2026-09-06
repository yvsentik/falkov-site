<script>
	import Arrow from './Arrow.svelte';
	let { service, compact = false } = $props();
</script>

<a class="scard" class:compact href="/uslugi/{service.slug}/">
	<div class="scard__body">
		<h3>{service.h1}</h3>
		{#if !compact}
			<p>{service.short}</p>
		{/if}
	</div>
	<div class="scard__foot">
		<span class="scard__price">{service.price.from} <span class="muted">/ {service.price.term}</span></span>
		<span class="scard__arrow"><Arrow /></span>
	</div>
</a>

<style>
	.scard {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 26px;
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: 22px;
		padding: clamp(22px, 2.4vw, 30px);
		min-height: 220px;
		transition:
			transform 0.4s var(--ease),
			border-color 0.4s var(--ease),
			box-shadow 0.4s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.scard:hover {
			transform: translateY(-4px);
			border-color: var(--line);
			box-shadow: 0 20px 50px -34px rgba(16, 16, 16, 0.5);
		}
	}
	.scard.compact {
		min-height: 0;
		gap: 16px;
	}
	h3 {
		font-size: clamp(18px, 1.6vw, 21px);
		margin-bottom: 12px;
	}
	p {
		font-size: 15px;
		color: var(--ink-2);
		line-height: 1.55;
		margin: 0;
	}
	.scard__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding-top: 18px;
		border-top: 1px solid var(--line-soft);
	}
	.scard__price {
		font-size: 14.5px;
		font-weight: 500;
	}
	.scard__price .muted {
		font-weight: 400;
	}
	.scard__arrow {
		display: inline-flex;
		width: 34px;
		height: 34px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--line);
		border-radius: 50%;
		flex: none;
		transition: background 0.3s var(--ease), color 0.3s var(--ease), border-color 0.3s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.scard:hover .scard__arrow {
			background: var(--ink);
			border-color: var(--ink);
			color: #fff;
		}
	}
</style>
