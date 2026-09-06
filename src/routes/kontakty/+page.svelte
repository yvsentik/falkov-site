<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import { reveal } from '$lib/actions.js';
	import { site } from '$lib/config/site.js';
	import { generalFaq } from '$lib/data/faq.js';
	import { graph, orgSchema, breadcrumbSchema, faqSchema } from '$lib/seo.js';

	const crumbs = [
		{ title: 'Главная', href: '/' },
		{ title: 'Контакты', href: '/kontakty/' }
	];
	const schema = graph(
		orgSchema(),
		breadcrumbSchema(crumbs),
		faqSchema(generalFaq.slice(0, 5)),
		{ '@type': 'ContactPage', name: 'Контакты' }
	);
</script>

<Seo
	title="Контакты SEO-агентства в Санкт-Петербурге — телефон, адрес, Telegram"
	description="Контакты агентства в Санкт-Петербурге: телефон, почта, Telegram, адрес офиса и режим работы. Оставьте заявку — разберём сайт и ответим в течение рабочего дня."
	path="/kontakty/"
	{schema}
/>

<section class="section section--tight">
	<div class="container">
		<Breadcrumbs items={crumbs} />
		<h1 style="margin:26px 0 24px;max-width:12em">Контакты</h1>
		<p class="lead" style="max-width:36em">
			Напишите или позвоните — на первом созвоне разберём вашу ситуацию и скажем, что нужно проекту.
			Даже если это не наша услуга.
		</p>
	</div>
</section>

<section class="section section--tight">
	<div class="container contacts">
		<div class="contacts__info" use:reveal>
			<div class="cblock">
				<span class="eyebrow">Связаться</span>
				<a class="cblock__big" href="tel:{site.phoneHref}">{site.phone}</a>
				<a class="cblock__big" href="mailto:{site.email}">{site.email}</a>
			</div>

			<div class="cblock">
				<span class="eyebrow">Мессенджеры</span>
				<ul>
					<li><a href={site.telegram} target="_blank" rel="noopener">Telegram — {site.telegramLabel}</a></li>
					<li><a href={site.whatsapp} target="_blank" rel="noopener">WhatsApp</a></li>
					<li><a href={site.vk} target="_blank" rel="noopener">ВКонтакте</a></li>
				</ul>
			</div>

			<div class="cblock">
				<span class="eyebrow">Офис</span>
				<p>{site.address.city}, {site.address.street}</p>
				<p class="muted">{site.workHours}</p>
			</div>

			<div class="cblock">
				<span class="eyebrow">Реквизиты</span>
				<p>{site.legalName}</p>
				<p class="muted">
					ИНН ·········· · ОГРН ··············<br />
					<span class="todo">Заполните реальные реквизиты в src/lib/config/site.js</span>
				</p>
			</div>
		</div>

		<div class="contacts__form" use:reveal={{ delay: 80 }}>
			<h2>Оставьте заявку</h2>
			<p class="contacts__note">
				Ответим в течение рабочего дня. Пришлём короткий разбор сайта и вопросы по проекту — без
				звонков «уточнить, актуально ли».
			</p>
			<ContactForm source="Страница контактов" />
		</div>
	</div>
</section>

<section class="section section--alt section--tight">
	<div class="container">
		<Faq items={generalFaq} title="Частые вопросы" />
	</div>
</section>

<style>
	.contacts {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(28px, 5vw, 80px);
		align-items: start;
	}
	.contacts__info {
		display: grid;
		gap: clamp(24px, 3vw, 40px);
	}
	.cblock {
		padding-top: 22px;
		border-top: 1px solid var(--line);
	}
	.cblock .eyebrow {
		margin-bottom: 16px;
	}
	.cblock__big {
		display: block;
		font-size: clamp(21px, 2.2vw, 28px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-bottom: 8px;
	}
	.cblock__big:hover {
		color: var(--gold);
	}
	.cblock ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.cblock ul a {
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
	}
	.cblock ul a:hover {
		color: var(--gold);
		border-color: var(--gold);
	}
	.cblock p {
		margin: 0 0 6px;
		font-size: 16px;
	}
	.todo {
		font-size: 12.5px;
		color: var(--gold);
	}
	.contacts__form {
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: var(--radius-lg);
		padding: clamp(24px, 3vw, 40px);
	}
	.contacts__note {
		margin: 16px 0 26px;
		color: var(--ink-2);
		font-size: 15.5px;
		line-height: 1.55;
	}
	@media (max-width: 900px) {
		.contacts {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
