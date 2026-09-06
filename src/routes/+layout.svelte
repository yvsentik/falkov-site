<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LeadModal from '$lib/components/LeadModal.svelte';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { site } from '$lib/config/site.js';

	let { children } = $props();

	// Главная и витрина стилей идут со своей вёрсткой целиком —
	// без светлой общей шапки и подвала. Внутренние страницы пока на старом оформлении.
	const bare = $derived(page.url.pathname === '/' || page.url.pathname.startsWith('/style/'));

	/* Кроссфейд между страницами. Там, где View Transitions нет,
	   навигация просто остаётся мгновенной. */
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (navigation.to?.url.pathname === navigation.from?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	{#if site.counters.yandexMetrika}
		{@html `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${site.counters.yandexMetrika},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});<` + `/script>`}
	{/if}
</svelte:head>

<LeadModal />

{#if bare}
	{@render children()}
{:else}
	<a class="skip-link" href="#main">Перейти к содержимому</a>
	<Header />
	<main id="main">
		{@render children()}
	</main>
	<Footer />
{/if}
