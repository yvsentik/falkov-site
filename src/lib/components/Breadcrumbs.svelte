<script>
	let { items = [] } = $props();
</script>

<nav class="crumbs" aria-label="Хлебные крошки">
	<ol>
		{#each items as item, i}
			<li>
				{#if i < items.length - 1}
					<a href={item.href}>{item.title}</a>
					<span aria-hidden="true">/</span>
				{:else}
					<span class="current" aria-current="page">{item.title}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.crumbs {
		font-size: 13px;
		color: var(--ink-3);
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	li {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	@media (hover: hover) and (pointer: fine) {
		a:hover {
			color: var(--gold);
		}
	}
	.current {
		color: var(--ink-2);
	}
</style>
