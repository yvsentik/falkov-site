<script>
	import { site, geo } from '$lib/config/site.js';
	import { categories } from '$lib/data/categories.js';
	import { featuredServices } from '$lib/data/services/index.js';

	const year = 2026;
</script>

<footer class="footer">
	<div class="container">
		<div class="footer__top">
			<div class="footer__brand">
				<a class="logo" href="/">
					<span class="logo__mark" aria-hidden="true"></span>
					<span class="logo__text">{site.name}</span>
				</a>
				<p class="footer__tag">{site.tagline}</p>
				<a class="footer__tg" href={site.telegram} target="_blank" rel="noopener">
					Telegram-канал агентства — {site.telegramLabel}
				</a>
			</div>

			<div class="footer__cols">
				<div class="footer__col">
					<h3>Направления</h3>
					<ul>
						{#each categories as c}
							<li><a href="/uslugi/#{c.slug}">{c.title}</a></li>
						{/each}
						<li><a href="/uslugi/">Все 50 услуг</a></li>
					</ul>
				</div>
				<div class="footer__col">
					<h3>Популярные услуги</h3>
					<ul>
						{#each featuredServices.slice(0, 7) as s}
							<li><a href="/uslugi/{s.slug}/">{s.h1}</a></li>
						{/each}
					</ul>
				</div>
				<div class="footer__col">
					<h3>Агентство</h3>
					<ul>
						<li><a href="/o-nas/">О нас</a></li>
						<li><a href="/keysy/">Кейсы</a></li>
						<li><a href="/otzyvy/">Отзывы</a></li>
						<li><a href="/kontakty/">Контакты</a></li>
					</ul>
				</div>
				<div class="footer__col">
					<h3>Контакты</h3>
					<ul class="footer__contacts">
						<li><a href="tel:{site.phoneHref}">{site.phone}</a></li>
						<li><a href="mailto:{site.email}">{site.email}</a></li>
						<li>{site.address.city}, {site.address.street}</li>
						<li class="muted">{site.workHours}</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="footer__bottom">
			<p>© {year} {site.legalName}. SEO-продвижение {geo.cityIn}.</p>
			<div class="footer__legal">
				<a href="/politika-konfidencialnosti/">Политика конфиденциальности</a>
				<a href="/sitemap.xml">Карта сайта</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-radius: 28px 28px 0 0;
		background: var(--dark);
		color: var(--on-dark-2);
		padding-block: clamp(48px, 6vw, 88px) 32px;
		font-size: 15px;
	}
	.footer__top {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 2.6fr);
		gap: clamp(28px, 5vw, 72px);
		padding-bottom: clamp(36px, 5vw, 64px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
	}
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: var(--on-dark);
	}
	.logo__mark {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--gold);
	}
	.logo__text {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: 0.04em;
	}
	.footer__tag {
		margin: 14px 0 22px;
		max-width: 20em;
	}
	.footer__tg {
		display: inline-block;
		color: var(--on-dark);
		border-bottom: 1px solid var(--gold);
		padding-bottom: 3px;
		font-size: 14px;
	}
	.footer__tg:hover {
		color: var(--gold);
	}
	.footer__cols {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(20px, 3vw, 40px);
	}
	.footer__col h3 {
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--on-dark);
		margin-bottom: 18px;
		font-weight: 500;
	}
	.footer__col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 11px;
	}
	.footer__col a {
		transition: color 0.25s var(--ease);
	}
	.footer__col a:hover {
		color: var(--gold);
	}
	.footer__contacts a {
		color: var(--on-dark);
	}
	.footer__bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 14px;
		padding-top: 26px;
		font-size: 13px;
	}
	.footer__bottom p {
		margin: 0;
	}
	.footer__legal {
		display: flex;
		gap: 22px;
	}
	.footer__legal a:hover {
		color: var(--gold);
	}
	@media (max-width: 980px) {
		.footer__top {
			grid-template-columns: minmax(0, 1fr);
		}
		.footer__cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		.footer__cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}
	}
</style>
