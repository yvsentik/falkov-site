<script>
	import { site } from '$lib/config/site.js';
	import { abs } from '$lib/seo.js';

	let {
		title,
		description,
		path = '/',
		schema = null,
		noindex = false,
		ogType = 'website',
		image = site.ogImage
	} = $props();

	const canonical = $derived(abs(path));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
	{/if}

	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={abs(image)} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={abs(image)} />

	{#if site.verification.yandex}
		<meta name="yandex-verification" content={site.verification.yandex} />
	{/if}
	{#if site.verification.google}
		<meta name="google-site-verification" content={site.verification.google} />
	{/if}

	{#if schema}
		{@html `<script type="application/ld+json">${schema}<` + `/script>`}
	{/if}
</svelte:head>
