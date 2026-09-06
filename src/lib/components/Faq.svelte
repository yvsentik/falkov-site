<script>
	let { items = [], title = 'Частые вопросы' } = $props();
	let openIndex = $state(0);
</script>

<div class="faq">
	{#if title}
		<h2 class="faq__title">{title}</h2>
	{/if}
	<div class="faq__list">
		{#each items as item, i}
			<div class="faq__item" class:open={openIndex === i}>
				<h3>
					<button
						aria-expanded={openIndex === i}
						onclick={() => (openIndex = openIndex === i ? -1 : i)}
					>
						<span>{item.q}</span>
						<span class="faq__sign" aria-hidden="true"></span>
					</button>
				</h3>
				<!-- Ответ всегда в DOM: текст должен индексироваться,
				     даже когда пункт свёрнут. -->
				<div class="faq__answer" aria-hidden={openIndex !== i}>
					<div class="faq__answer-inner">
						<p>{item.a}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.faq__title {
		margin-bottom: clamp(24px, 3vw, 44px);
	}
	.faq__item {
		border-top: 1px solid var(--line);
	}
	.faq__item:last-child {
		border-bottom: 1px solid var(--line);
	}
	.faq__item h3 {
		margin: 0;
		font-size: inherit;
		font-weight: inherit;
		letter-spacing: normal;
	}
	button {
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		padding: 24px 0;
		background: none;
		border: 0;
		cursor: pointer;
		text-align: left;
		font-size: clamp(17px, 1.6vw, 20px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.35;
		transition: color 0.25s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		button:hover {
			color: var(--gold);
		}
	}
	.faq__sign {
		position: relative;
		width: 15px;
		height: 15px;
		flex: none;
		margin-top: 5px;
	}
	.faq__sign::before,
	.faq__sign::after {
		content: '';
		position: absolute;
		background: currentColor;
		transition: transform 0.3s var(--ease);
	}
	.faq__sign::before {
		left: 0;
		top: 7px;
		width: 15px;
		height: 1.5px;
	}
	.faq__sign::after {
		left: 6.75px;
		top: 0;
		width: 1.5px;
		height: 15px;
	}
	.open .faq__sign::after {
		transform: scaleY(0);
	}
	.faq__answer {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows 0.4s var(--ease),
			opacity 0.3s var(--ease);
	}
	.open .faq__answer {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.faq__answer-inner {
		overflow: hidden;
		min-height: 0;
	}
	.faq__answer p {
		padding-bottom: 26px;
		max-width: 54em;
		color: var(--ink-2);
		font-size: 16.5px;
		line-height: 1.65;
		margin: 0;
	}
	:global(.section--dark) .faq__item {
		border-color: rgba(255, 255, 255, 0.14);
	}
	:global(.section--dark) .faq__answer p {
		color: var(--on-dark-2);
	}
</style>
