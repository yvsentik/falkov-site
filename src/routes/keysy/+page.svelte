<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import { reveal } from '$lib/actions.js';
	import { cases } from '$lib/data/cases.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Кейсы', href: '/keysy/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs));
</script>

<Seo
	title="Кейсы маркетингового агентства в СПб – 45+ проектов с цифрами"
	description="Кейсы SEO-агентства в СПб: интернет-магазин, стоматология, производство, ремонт квартир, автосервис. Исходные данные, состав работ, сроки и измеримые результаты."
	path="/keysy/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<h1 style="margin:26px 0 24px;max-width:16em">Кейсы маркетингового агентства: 45+ проектов и результаты в цифрах</h1>
		<p class="lead" style="max-width:38em">
			В каждом кейсе указана исходная точка, конкретный состав работ, сроки и результат в цифрах.
			Названия клиентов обезличены там, где действует NDA. У проектов с пометкой «ведение под
			ключ» открыт сайт и полный список позиций – их можно проверить в поиске самостоятельно.
		</p>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="grid grid-3">
			{#each cases as c, i}
				<div use:reveal={{ delay: (i % 3) * 60 }}>
					<CaseCard item={c} />
				</div>
			{/each}
		</div>
	</div>
</section>

<CtaBlock source="Кейсы" title="Хотите такой же результат?" />
