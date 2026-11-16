<script>
	import Seo from '$lib/components/Seo.svelte';
	import { payload } from '$lib/data/reports/genesishub/deck.enc.js';

	let pass = $state('');
	let error = $state('');
	let busy = $state(false);
	let deck = $state(null);

	const norm = (p) => p.toLowerCase().replace(/[\s_\-–—]+/g, '');
	const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

	async function unlock(e) {
		e?.preventDefault();
		if (!pass) return;
		busy = true;
		error = '';
		try {
			const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(norm(pass)), 'PBKDF2', false, ['deriveKey']);
			const key = await crypto.subtle.deriveKey(
				{ name: 'PBKDF2', salt: b64(payload.salt), iterations: 150000, hash: 'SHA-256' },
				base,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			);
			const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(payload.iv) }, key, b64(payload.data));
			deck = JSON.parse(new TextDecoder().decode(plain));
			sessionStorage.setItem('genesishub-pass', pass);
		} catch {
			error = 'Пароль не подошёл';
		}
		busy = false;
	}

	$effect(() => {
		const saved = sessionStorage.getItem('genesishub-pass');
		if (saved && !deck) {
			pass = saved;
			unlock();
		}
	});

</script>

<Seo
	title="Предложение для Genesis Hub | Фальков"
	description="Закрытая презентация для клиента."
	path="/kommercheskie-predlozheniya/genesishub-ru/"
	noindex
/>

{#if !deck}
	<div class="gate">
		<form onsubmit={unlock}>
						<h1>Доступ к презентации</h1>
			<input type="text" bind:value={pass} placeholder="Пароль" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Пароль" />
			<button type="submit" disabled={busy}>{busy ? 'Проверяем…' : 'Открыть'}</button>
			{#if error}<p class="gate__err">{error}</p>{/if}
		</form>
	</div>
{:else}
	<main class="kp">{@html deck.html}</main>
{/if}

<style>
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

	.kp {
		background: #fff;
		color: #141a2b;
		font-family: Onest, -apple-system, 'Helvetica Neue', Arial, sans-serif;
		font-size: 17px;
		line-height: 1.5;
		min-height: 100vh;
		padding: clamp(20px, 4vw, 48px) 16px 56px;
	}
	.kp :global(> *) {
		max-width: 860px;
		margin-left: auto;
		margin-right: auto;
	}
	.kp :global(.top) {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		border-bottom: 3px solid #135ee4;
		padding-bottom: 10px;
		margin-bottom: 24px;
	}
	.kp :global(.top b) {
		font-size: 19px;
		color: #12298a;
	}
	.kp :global(.top span) {
		color: #6b7385;
		font-size: 14px;
	}
	.kp :global(h1) {
		font-size: clamp(28px, 4.6vw, 40px);
		line-height: 1.15;
		margin-top: 0;
		margin-bottom: 12px;
		color: #12298a;
		font-weight: 700;
	}
	.kp :global(h2) {
		font-size: clamp(20px, 2.6vw, 24px);
		margin-top: 34px;
		margin-bottom: 12px;
		color: #12298a;
		font-weight: 700;
	}
	.kp :global(p) {
		margin-top: 0;
		margin-bottom: 10px;
	}
	.kp :global(.lead) {
		font-size: 19px;
	}
	.kp :global(.facts) {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 20px;
		margin-bottom: 6px;
	}
	.kp :global(.facts div) {
		background: #eef4ff;
		border-radius: 12px;
		padding: 16px 18px;
	}
	.kp :global(.facts b) {
		display: block;
		font-size: 28px;
		color: #135ee4;
		line-height: 1.2;
		white-space: nowrap;
	}
	.kp :global(.facts span) {
		font-size: 14.5px;
		color: #3c4560;
	}
	.kp :global(.tw) {
		overflow-x: auto;
		margin-bottom: 8px;
	}
	.kp :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 16px;
	}
	.kp :global(th) {
		background: #12298a;
		color: #fff;
		text-align: left;
		padding: 10px 12px;
		font-weight: 600;
	}
	.kp :global(td) {
		border-bottom: 1px solid #d9e0ee;
		padding: 10px 12px;
		vertical-align: top;
	}
	.kp :global(.r) {
		text-align: right;
		white-space: nowrap;
	}
	.kp :global(tr.sum td) {
		background: #eef4ff;
		font-weight: 700;
		border-bottom: none;
	}
	.kp :global(ul) {
		margin-top: 0;
		margin-bottom: 8px;
		padding-left: 22px;
	}
	.kp :global(li) {
		margin-bottom: 7px;
	}
	.kp :global(.box) {
		border: 2px solid #135ee4;
		border-radius: 12px;
		padding: 16px 18px;
		margin-top: 10px;
		margin-bottom: 12px;
	}
	.kp :global(.box b) {
		color: #12298a;
		font-size: 18px;
	}
	.kp :global(.foot) {
		margin-top: 30px;
		padding-top: 14px;
		border-top: 1px solid #d9e0ee;
		font-size: 14.5px;
		color: #3c4560;
	}
	@media (max-width: 640px) {
		.kp {
			font-size: 16px;
		}
		.kp :global(.facts) {
			grid-template-columns: 1fr;
		}
		.kp :global(table) {
			font-size: 14.5px;
		}
		.kp :global(th),
		.kp :global(td) {
			padding: 8px;
		}
	}
	@media print {
		.kp {
			padding: 0;
		}
	}
</style>
