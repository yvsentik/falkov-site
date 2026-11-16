<script>
	import Seo from '$lib/components/Seo.svelte';
	import { goto } from '$app/navigation';
	import { payload as genesishub } from '$lib/data/reports/genesishub/deck.enc.js';

	/* Общий вход: логина нет, слово-пароль само определяет презентацию.
	   Подходит к шифру колоды – открываем её страницу. */
	const decks = [{ payload: genesishub, key: 'genesishub-pass', path: '/kommercheskie-predlozheniya/genesishub-ru/' }];

	let pass = $state('');
	let error = $state('');
	let busy = $state(false);

	const norm = (p) => p.toLowerCase().replace(/[\s_\-–—]+/g, '');
	const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

	async function fits(payload, word) {
		try {
			const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(word), 'PBKDF2', false, ['deriveKey']);
			const key = await crypto.subtle.deriveKey(
				{ name: 'PBKDF2', salt: b64(payload.salt), iterations: 150000, hash: 'SHA-256' },
				base,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			);
			await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(payload.iv) }, key, b64(payload.data));
			return true;
		} catch {
			return false;
		}
	}

	async function open(e) {
		e?.preventDefault();
		if (!pass) return;
		busy = true;
		error = '';
		for (const d of decks) {
			if (await fits(d.payload, norm(pass))) {
				sessionStorage.setItem(d.key, pass);
				goto(d.path);
				return;
			}
		}
		error = 'Пароль не подошёл';
		busy = false;
	}
</script>

<Seo
	title="Доступ к презентации | Фальков"
	description="Закрытые презентации для клиентов агентства."
	path="/kommercheskie-predlozheniya/"
	noindex
/>

<div class="gate">
	<form onsubmit={open}>
		<h1>Доступ к презентации</h1>
		<input type="text" bind:value={pass} placeholder="Пароль" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Пароль" />
		<button type="submit" disabled={busy}>{busy ? 'Проверяем…' : 'Открыть'}</button>
		{#if error}<p class="gate__err">{error}</p>{/if}
	</form>
</div>

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
</style>
