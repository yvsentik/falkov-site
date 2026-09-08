<script>
	import { page } from '$app/state';
	import { featuredServices } from '$lib/data/services/index.js';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
</script>

<svelte:head>
	<title>Страница не найдена – 404</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<section class="section">
	<div class="container">
		<span class="eyebrow">Ошибка {page.status}</span>
		<h1 style="margin:18px 0 20px">Такой страницы нет</h1>
		<p class="lead" style="max-width:30em">
			Возможно, адрес изменился или содержит опечатку. Загляните в каталог услуг или напишите нам –
			подскажем, где искать.
		</p>
		<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:32px">
			<a class="btn" href="/">На главную</a>
			<a class="btn btn--ghost" href="/uslugi/">Все услуги</a>
		</div>
	</div>
</section>

<section class="section section--alt section--tight">
	<div class="container">
		<h2 style="margin-bottom:32px">Часто ищут</h2>
		<div class="grid grid-3">
			{#each featuredServices.slice(0, 6) as s}
				<ServiceCard service={s} compact />
			{/each}
		</div>
	</div>
</section>
