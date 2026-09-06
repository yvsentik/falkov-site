<script>
	import { lead } from '$lib/lead.svelte.js';
	import ContactForm from './ContactForm.svelte';

	function close() {
		lead.open = false;
	}

	$effect(() => {
		if (!lead.open) return;
		const onKey = (e) => e.key === 'Escape' && close();
		window.addEventListener('keydown', onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prev;
		};
	});
</script>

{#if lead.open}
	<div class="lm" role="dialog" aria-modal="true" aria-labelledby="lm-title">
		<button class="lm__bg" type="button" aria-label="Закрыть" onclick={close}></button>
		<div class="lm__box">
			<button class="lm__x" type="button" aria-label="Закрыть" onclick={close}>
				<span></span><span></span>
			</button>
			<span class="lm__eyebrow">Заявка</span>
			<h2 id="lm-title">Оставить заявку</h2>
			<p class="lm__lead">
				Напишите, как с вами связаться, — ответим в течение рабочего дня и начнём с бесплатного
				разбора.
			</p>
			<ContactForm compact source="Модалка «Оставить заявку»" />
		</div>
	</div>
{/if}

<style>
	.lm {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-items: center;
		padding: 16px;
		animation: lm-in 0.35s var(--ease-soft, var(--ease)) both;
	}
	.lm__bg {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(17, 17, 17, 0.55);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		cursor: pointer;
	}
	.lm__box {
		position: relative;
		width: min(560px, 100%);
		max-height: calc(100dvh - 32px);
		overflow-y: auto;
		padding: clamp(24px, 3.4vw, 40px);
		border-radius: 28px;
		background: var(--paper, #f5f5f5);
		color: var(--ink);
		box-shadow: 0 40px 90px -40px rgba(0, 0, 0, 0.6);
		animation: lm-box 0.5s var(--ease-soft, var(--ease)) both;
	}
	.lm__x {
		position: absolute;
		top: 18px;
		right: 18px;
		width: 40px;
		height: 40px;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		display: grid;
		place-items: center;
	}
	.lm__x span {
		grid-area: 1 / 1;
		display: block;
		width: 16px;
		height: 1.5px;
		background: var(--ink);
		transform: rotate(45deg);
	}
	.lm__x span:last-child {
		transform: rotate(-45deg);
	}
	.lm__eyebrow {
		display: block;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.lm__box h2 {
		margin: 10px 0 10px;
		font-size: clamp(26px, 3vw, 36px);
		letter-spacing: -0.03em;
		line-height: 1.05;
	}
	.lm__lead {
		margin: 0 0 22px;
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	@keyframes lm-in {
		from {
			opacity: 0;
		}
	}
	@keyframes lm-box {
		from {
			opacity: 0;
			transform: translateY(18px) scale(0.98);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lm,
		.lm__box {
			animation: none;
		}
	}
</style>
