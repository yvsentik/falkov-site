<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import { reveal } from '$lib/actions.js';
	import { reviews } from '$lib/data/reviews.js';
	import { site } from '$lib/config/site.js';
	import { graph, orgSchema, breadcrumbSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Отзывы', href: '/otzyvy/' }
	];
	const schema = graph(orgSchema(), breadcrumbSchema(crumbs));
	const fmt = (d) => new Date(d).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
</script>

<Seo
	title="Отзывы о SEO-агентстве в Санкт-Петербурге — мнения клиентов"
	description="Отзывы клиентов о работе SEO-агентства в СПб: интернет-магазины, клиники, производство, услуги. Публикуем с согласия клиентов, по каждому готовы дать контакт."
	path="/otzyvy/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<h1 style="margin:26px 0 24px;max-width:13em">Отзывы клиентов</h1>
		<p class="lead" style="max-width:38em">
			Публикуем только те отзывы, на которые получили согласие. По любому из них готовы дать контакт
			клиента для проверки — если он не против. Присылать «отзывы» без имени и должности мы считаем
			бессмысленным.
		</p>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="reviews">
			{#each reviews as r, i}
				<figure class="review" use:reveal={{ delay: (i % 2) * 60 }}>
					<blockquote>{r.text}</blockquote>
					<figcaption>
						<b>{r.name}</b>
						<span>{r.role}</span>
						<span class="review__date">{fmt(r.date)}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<section class="section section--alt section--tight">
	<div class="container">
		<div class="prose" use:reveal>
			<h2 style="margin-top:0">Где ещё нас можно проверить</h2>
			<p>
				Отзывы на сайте компании — самый слабый формат доказательства: их пишет сама компания и она
				же решает, что публиковать. Поэтому мы рекомендуем смотреть шире.
			</p>
			<ul>
				<li>Карточка организации в Яндекс Бизнесе и 2ГИС — отзывы там модерируются площадкой.</li>
				<li>Наш <a href={site.telegram}>Telegram-канал</a> — там мы разбираем реальные проекты, в том числе неудачные.</li>
				<li><a href="/keysy/">Кейсы</a> с цифрами: по каждому готовы показать динамику в системах аналитики.</li>
			</ul>
			<p>
				И самый честный способ: попросите на встрече контакт клиента из вашей ниши. Мы дадим его,
				если клиент согласен на такое общение.
			</p>
		</div>
	</div>
</section>

<CtaBlock source="Отзывы" />

<style>
	.reviews {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(16px, 2vw, 28px);
	}
	.review {
		margin: 0;
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: var(--radius-lg);
		padding: clamp(24px, 2.6vw, 34px);
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.review blockquote {
		margin: 0;
		font-size: 16.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.review figcaption {
		display: grid;
		gap: 3px;
		padding-top: 18px;
		border-top: 1px solid var(--line-soft);
		margin-top: auto;
	}
	.review figcaption b {
		font-weight: 500;
	}
	.review figcaption span {
		font-size: 13.5px;
		color: var(--ink-3);
	}
	.review__date {
		font-size: 12.5px !important;
	}
	@media (max-width: 720px) {
		.reviews {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
