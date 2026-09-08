<script>
	/* Панель сравнения вариантов главной. Временная – удаляется после выбора. */
	let { current = '' } = $props();

	const variants = [
		{ id: '', label: 'Текущая', href: '/' },
		{ id: 'nulevye', label: '1 · Нулевые', href: '/style/nulevye/' },
		{ id: 'chetko', label: '2 · Чётко и по делу', href: '/style/chetko/' },
		{ id: 'avtor', label: '3 · Авторский', href: '/style/avtor/' }
	];
</script>

<div class="sw">
	<span class="sw__label">Вариант главной</span>
	{#each variants as v}
		<a href={v.href} class:active={v.id === current}>{v.label}</a>
	{/each}
</div>

<style>
	.sw {
		position: fixed;
		z-index: 900;
		left: 50%;
		bottom: 16px;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 6px 6px 15px;
		background: rgba(18, 18, 16, 0.94);
		backdrop-filter: blur(12px);
		border-radius: 100px;
		box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.6);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
		font-size: 13px;
		max-width: calc(100vw - 20px);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.sw::-webkit-scrollbar {
		display: none;
	}
	.sw__label {
		color: rgba(255, 255, 255, 0.42);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
		margin-right: 6px;
	}
	.sw a {
		color: rgba(255, 255, 255, 0.78);
		text-decoration: none;
		padding: 8px 14px;
		border-radius: 100px;
		white-space: nowrap;
		transition: background 0.2s, color 0.2s;
	}
	@media (hover: hover) and (pointer: fine) {
		.sw a:hover {
			color: #fff;
			background: rgba(255, 255, 255, 0.12);
		}
	}
	.sw a.active {
		background: #fff;
		color: #111;
	}
	@media (max-width: 620px) {
		.sw__label {
			display: none;
		}
	}
</style>
