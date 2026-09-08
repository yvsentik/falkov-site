<script>
	/* Страница-оффер. На неё нет ни одной ссылки с сайта: не в меню, не в подвале,
	   не в sitemap.xml, в шапке стоит noindex. Открывается только по прямой ссылке,
	   которую менеджер присылает клиенту. */
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions.js';
	import { site, geo } from '$lib/config/site.js';
	import { lead } from '$lib/lead.svelte.js';

	const path = '/vam-ne-podhodit-seo/';

	const steps = [
		{
			n: '01',
			t: 'Окупаемся в Директе',
			d: 'Заходим минимальными вложениями и выводим проект в плюс на платном трафике. Быстро, проверяемо и без месяцев ожидания.'
		},
		{
			n: '02',
			t: 'Находим, что реально приносит деньги',
			d: 'Стабильный поток заявок и самые целевые запросы — те, по которым люди действительно покупают, а не просто читают.'
		},
		{
			n: '03',
			t: 'Только потом идём в SEO',
			d: 'Продвигаем сайт уже по проверенным запросам, с понятной экономикой и без гадания, какой кластер окупится.'
		}
	];

	/* Лендинги на движке Директа. Первый — наш собственный: продвигаем себя
	   ровно тем же способом, что и клиентов. */
	const landings = [
		{ url: 'https://prodvizheniya-sajta-v-spb.clients.site', t: 'Продвижение сайтов', c: 'Санкт-Петербург', own: true },
		{ url: 'https://semejnyj-yurist-kaliningrad.clients.site/', t: 'Семейный юрист', c: 'Калининград' },
		{ url: 'https://vizoviy-centr-moskva.clients.site/', t: 'Визовый центр', c: 'Москва' },
		{ url: 'https://likvidacziya-ooo-spb.clients.site/', t: 'Ликвидация ООО', c: 'Санкт-Петербург' },
		{ url: 'https://medclinic24.clients.site/', t: 'Медицинская клиника', c: 'Круглосуточно' },
		{ url: 'https://arhangelsk-vyvod-iz-zapoya.clients.site/', t: 'Вывод из запоя', c: 'Архангельск' },
		{ url: 'https://moskva-kuznechnaya-masterskaya.clients.site/', t: 'Кузнечная мастерская', c: 'Москва' },
		{ url: 'https://net-dolgov-kaliningrad.clients.site/', t: 'Списание долгов', c: 'Калининград' }
	];

	const pricing = [
		{
			n: '01',
			t: 'Первый месяц — 50 000 ₽',
			d: 'Единственный обязательный платёж. Абсолютно рыночная цена за настройку и ведение контекста.'
		},
		{
			n: '02',
			t: 'Откручиваем 2–3 аккаунта',
			d: 'Иногда за эти же 50 000 ₽ откручиваем и пять. Суть не в объёме работы, а в поиске рабочей стратегии.'
		},
		{
			n: '03',
			t: 'Нашли связку — масштабируем',
			d: 'Как только находим то, что даёт результат, бесконечно создаём аккаунты с этой акцией и льём по схеме «рубль к трём».'
		},
		{
			n: '04',
			t: 'Дальше — на выбор',
			d: 'Либо абонентка 50 000 ₽ в месяц. Либо, если за первый месяц окупаемость выше трёх раз по чистой прибыли, садимся на процент от продаж.'
		}
	];
</script>

<Seo
	title="Вам не подходит SEO, что делать? | {site.name}"
	description="Что делать, когда SEO не подходит: заходим через Директ, окупаемся на минимальных вложениях, находим целевые запросы и только потом идём в поиск."
	{path}
	noindex
/>

<div class="of">
	<header class="of-head">
		<a class="of-logo" href="/">falkov<span>маркетинг</span></a>
		<a class="of-tg" href={site.manager} target="_blank" rel="noopener">
			{site.managerLabel}
		</a>
	</header>

	<!-- ЗАГОЛОВОК -->
	<section class="of-hero">
		<span class="of-eyebrow">Предложение о сотрудничестве · {geo.city}</span>
		<h1>Вам не подходит SEO, что делать?</h1>
		<p class="of-lead">
			Это предложение мы присылаем, когда видим: заходить в поиск прямо сейчас — значит полгода
			жечь деньги без заявок. Тогда мы разворачиваем порядок. Сначала окупаемся минимальными
			вложениями в Директе, находим стабильный поток заявок и самые целевые запросы — и только
			потом продвигаем сайт в поиске.
		</p>
		<div class="of-hero__acts">
			<button class="of-btn of-btn--solid" type="button" onclick={() => (lead.open = true)}>
				Обсудить проект
			</button>
			<a class="of-btn" href={site.manager} target="_blank" rel="noopener">
				Написать Роману
			</a>
		</div>
	</section>

	<!-- СУТЬ -->
	<section class="of-sec">
		<div class="of-sec__head" use:reveal>
			<h2>Как устроено</h2>
			<p>Три шага, в которых деньги появляются раньше, чем заканчивается терпение.</p>
		</div>
		<div class="of-grid of-grid--3">
			{#each steps as s, i}
				<div class="of-card" use:reveal={{ delay: i * 70 }}>
					<span class="of-n">{s.n}</span>
					<h3>{s.t}</h3>
					<p>{s.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ПОЧЕМУ РАБОТАЕТ -->
	<section class="of-sec of-sec--dark">
		<div class="of-inner">
			<div class="of-sec__head" use:reveal>
				<h2>Почему наш подход работает</h2>
				<p>
					Помимо правильной настройки аккаунта у нас есть то, чего нет у большинства подрядчиков.
				</p>
			</div>
			<div class="of-promo" use:reveal>
				<div class="of-promo__l">
					<span class="of-promo__label">Акция Яндекса</span>
					<span class="of-promo__math">
						<b>15 000 ₽</b>
						<i>пополнение</i>
					</span>
					<span class="of-promo__plus" aria-hidden="true">+</span>
					<span class="of-promo__math">
						<b>30 000 ₽</b>
						<i>бонусом</i>
					</span>
					<span class="of-promo__plus" aria-hidden="true">=</span>
					<span class="of-promo__math">
						<b>×3</b>
						<i>к каждому рублю</i>
					</span>
				</div>
				<p class="of-promo__note">
					Мы абсолютно легально используем на небольших проектах акцию Яндекса: пополняете счёт на
					15 тысяч — получаете ещё 30 тысяч бонусом. Мы отдельно уточняли это у самого Яндекса.
				</p>
				<p class="of-promo__note">
					И это не разовый трюк. Мы <b>бесконечно создаём новые аккаунты и пополняем их по этой
					же акции</b> — поэтому стоим в топе поиска не рывками, а перманентно, и клик обходится
					нам втрое дешевле, чем конкуренту, который платит полную цену.
				</p>
			</div>

			<div class="of-turbo" use:reveal>
				<div class="of-turbo__head">
					<span class="of-promo__label">Входит в стоимость старта</span>
					<h3>Лендинг на движке Директа</h3>
					<p>
						Дело не в визуале: такие сайты Яндекс скрыто бустит сам. Зайдите в любую
						сверхконкурентную нишу — наркология, юристы, медицина — там в выдаче почти одни
						они. Когда у людей бюджеты по 100 000 ₽ в день, игнорировать эту стратегию просто
						нет шансов.
					</p>
					<p>
						Шаблон выглядит скромно, но мы стараемся собирать такие лендинги красивыми. Свой
						собственный продвигаем ровно в этом же формате — он первый в списке.
					</p>
				</div>
				<ul class="of-turbo__list">
					{#each landings as l}
						<li>
							<a href={l.url} target="_blank" rel="noopener">
								<span class="of-turbo__t">
									{l.t}
									{#if l.own}<em>наш</em>{/if}
								</span>
								<span class="of-turbo__c">{l.c}</span>
								<span class="of-turbo__go" aria-hidden="true">↗</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- КАК ЭТО ВЫГЛЯДИТ -->
	<section class="of-sec">
		<div class="of-sec__head" use:reveal>
			<h2>Как это будет выглядеть</h2>
			<p>Считаем на конкретных цифрах, чтобы было видно, откуда берётся преимущество.</p>
		</div>

		<div class="of-math" use:reveal>
			<div class="of-math__i">
				<b>1–2</b>
				<span>аккаунта на новый номер телефона к началу сотрудничества</span>
			</div>
			<span class="of-math__op" aria-hidden="true">→</span>
			<div class="of-math__i">
				<b>30 000 ₽</b>
				<span>вы пополняете — по 15 тысяч на каждый</span>
			</div>
			<span class="of-math__op" aria-hidden="true">=</span>
			<div class="of-math__i of-math__i--hi">
				<b>90 000 ₽</b>
				<span>рабочего рекламного бюджета на руках</span>
			</div>
		</div>

		<p class="of-claim" use:reveal>
			Слить такие деньги в ноль невозможно: трафик у нас банально стоит <b>в три раза дешевле</b>,
			чем у конкурента, который платит за клики по полной.
		</p>
	</section>

	<!-- ЦЕНЫ -->
	<section class="of-sec">
		<div class="of-sec__head" use:reveal>
			<h2>Сколько стоят наши услуги</h2>
			<p>Подобное сотрудничество мы не предлагаем большим компаниям — только небольшим проектам.</p>
		</div>

		<ol class="of-price">
			{#each pricing as p, i}
				<li use:reveal={{ delay: (i % 2) * 60 }}>
					<span class="of-n">{p.n}</span>
					<h3>{p.t}</h3>
					<p>{p.d}</p>
				</li>
			{/each}
		</ol>

		<div class="of-share" use:reveal>
			<div>
				<span class="of-share__label">Процент от продаж</span>
				<p>
					Настраиваем всю аналитику, общаемся с колл-центром, смотрим и помогаем в продажах. Чаще
					всего берём за работу <b>10% от выручки</b> либо <b>20% от чистой прибыли</b>.
				</p>
			</div>
			<div>
				<span class="of-share__label">Когда результаты сверх плана</span>
				<p>
					Берём весь маркетинговый расход на себя за <b>50% от стоимости клиентов</b>, которых
					приносим. Пример свежего такого проекта покажем в диалоге — просто спросите.
				</p>
			</div>
		</div>
	</section>

	<!-- P.S. -->
	<section class="of-sec of-sec--dark">
		<div class="of-inner">
			<div class="of-ps" use:reveal>
				<span class="of-ps__label">P.S.</span>
				<p>
					Главное — мы адекватные люди. Никогда не попросим денег, если не будет результата.
					Условия сотрудничества в процессе в одну сторону не меняем. Мы реально умеем в
					маркетинг — поэтому и не требуем от клиента бесконечных абонентских платежей.
				</p>
			</div>

			<div class="of-cta" use:reveal>
				<h2>Обсудим ваш проект?</h2>
				<div class="of-cta__acts">
					<button class="of-btn of-btn--light" type="button" onclick={() => (lead.open = true)}>
						Оставить заявку
					</button>
					<a class="of-btn of-btn--ghost" href={site.manager} target="_blank" rel="noopener">
						Написать Роману в Telegram
					</a>
				</div>
			</div>
		</div>
	</section>

	<footer class="of-foot">
		<a href="/">На главную falkov-marketing.ru</a>
		<a href="tel:{site.phoneHref}">{site.phone}</a>
	</footer>
</div>

<style>
	.of {
		--pad: clamp(16px, 3vw, 40px);
		--wide: 1100px;
		background: var(--paper);
		color: var(--ink);
		padding-bottom: clamp(30px, 4vw, 60px);
	}
	.of :global(:where(a)) {
		color: inherit;
		text-decoration: none;
	}

	/* шапка */
	.of-head {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: clamp(18px, 2.4vw, 28px) var(--pad);
	}
	.of-logo {
		display: inline-flex;
		align-items: baseline;
		gap: 10px;
		font-size: clamp(15px, 1.4vw, 18px);
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.of-logo span {
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.of-tg {
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-2);
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
	}

	/* кнопки */
	.of-btn {
		display: inline-block;
		padding: 14px 26px;
		border: 1px solid var(--line);
		border-radius: 100px;
		background: transparent;
		font: inherit;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
		cursor: pointer;
		transition: background 0.3s var(--ease), color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}
	.of-btn--solid {
		background: var(--dark);
		border-color: var(--dark);
		color: #fff;
	}
	.of-btn--light {
		background: #fff;
		border-color: #fff;
		color: var(--dark);
	}
	.of-btn--ghost {
		border-color: rgba(255, 255, 255, 0.3);
		color: var(--on-dark);
	}
	@media (hover: hover) and (pointer: fine) {
		.of-btn:hover {
			background: var(--dark);
			border-color: var(--dark);
			color: #fff;
		}
		.of-btn--solid:hover {
			background: var(--ink-2);
			border-color: var(--ink-2);
		}
		.of-btn--light:hover,
		.of-btn--ghost:hover {
			background: #fff;
			border-color: #fff;
			color: var(--dark);
		}
	}

	/* заголовок */
	.of-hero {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(20px, 3vw, 40px) var(--pad) clamp(30px, 4vw, 56px);
	}
	.of-eyebrow {
		display: block;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: clamp(16px, 2vw, 24px);
	}
	.of-hero h1 {
		font-size: clamp(32px, 6vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.04em;
		margin: 0 0 clamp(18px, 2.4vw, 28px);
		max-width: 14em;
	}
	.of-lead {
		margin: 0;
		max-width: 58ch;
		font-size: clamp(15px, 1.5vw, 19px);
		line-height: 1.6;
		color: var(--ink-2);
	}
	.of-hero__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(24px, 3vw, 36px);
	}

	/* секции */
	.of-sec {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(26px, 3.4vw, 48px) var(--pad);
	}
	.of-sec--dark {
		max-width: none;
		padding-inline: var(--pad);
	}
	.of-sec--dark > .of-inner {
		max-width: var(--wide);
		margin-inline: auto;
		padding: clamp(30px, 4vw, 60px) clamp(20px, 3vw, 48px);
		border-radius: 28px;
		background: var(--dark);
		color: var(--on-dark);
	}
	.of-sec--dark h2 {
		color: var(--on-dark);
	}
	.of-sec--dark .of-sec__head p {
		color: var(--on-dark-2);
	}
	.of-sec__head {
		margin-bottom: clamp(20px, 2.6vw, 32px);
	}
	.of-sec__head h2 {
		margin: 0 0 10px;
		font-size: clamp(24px, 3.2vw, 40px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.of-sec__head p {
		margin: 0;
		max-width: 52ch;
		font-size: clamp(14px, 1.3vw, 16px);
		line-height: 1.6;
		color: var(--ink-2);
	}

	/* карточки */
	.of-grid {
		display: grid;
		gap: clamp(12px, 1.4vw, 18px);
	}
	.of-grid--3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.of-card {
		padding: clamp(20px, 2.4vw, 30px);
		border: 1px solid var(--line);
		border-radius: 22px;
		background: var(--card);
	}
	.of-n {
		display: block;
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.of-card h3,
	.of-price h3 {
		margin: 0 0 8px;
		font-size: clamp(17px, 1.7vw, 21px);
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.of-card p,
	.of-price p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}

	/* акция */
	.of-promo {
		display: grid;
		gap: clamp(18px, 2.4vw, 28px);
		padding: clamp(20px, 2.6vw, 32px);
		border: 1px dashed rgba(255, 255, 255, 0.25);
		border-radius: 22px;
	}
	.of-promo__l {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: clamp(14px, 2vw, 26px);
	}
	.of-promo__label {
		flex-basis: 100%;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--on-dark-2);
	}
	.of-promo__math {
		display: grid;
		gap: 3px;
	}
	.of-promo__math b {
		font-size: clamp(26px, 4vw, 46px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1;
		color: #fff;
	}
	.of-promo__math i {
		font-style: normal;
		font-size: 12px;
		color: var(--on-dark-2);
	}
	.of-promo__plus {
		font-size: clamp(20px, 2.6vw, 30px);
		color: var(--on-dark-2);
		line-height: 1.4;
	}
	.of-promo__note {
		margin: 0;
		max-width: 62ch;
		font-size: clamp(14px, 1.3vw, 16px);
		line-height: 1.6;
		color: var(--on-dark-2);
	}

	/* лендинги на движке Директа */
	.of-turbo {
		margin-top: clamp(16px, 2vw, 24px);
		padding: clamp(20px, 2.6vw, 32px);
		border: 1px dashed rgba(255, 255, 255, 0.25);
		border-radius: 22px;
	}
	.of-turbo__head h3 {
		margin: 10px 0 12px;
		font-size: clamp(20px, 2.4vw, 28px);
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: #fff;
	}
	.of-turbo__head p {
		margin: 0 0 12px;
		max-width: 62ch;
		font-size: clamp(14px, 1.3vw, 16px);
		line-height: 1.6;
		color: var(--on-dark-2);
	}
	.of-turbo__list {
		list-style: none;
		margin: clamp(16px, 2vw, 22px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
	}
	.of-turbo__list a {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 12px 16px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
		transition: background 0.3s var(--ease);
	}
	.of-turbo__t {
		font-size: 15px;
		color: var(--on-dark);
	}
	.of-turbo__t em {
		font-style: normal;
		margin-left: 8px;
		padding: 2px 8px;
		border-radius: 100px;
		background: #fff;
		color: var(--dark);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.of-turbo__c {
		font-size: 11.5px;
		color: var(--on-dark-2);
	}
	.of-turbo__go {
		margin-left: auto;
		color: var(--on-dark-2);
		transition: transform 0.35s var(--ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.of-turbo__list a:hover {
			background: rgba(255, 255, 255, 0.13);
		}
		.of-turbo__list a:hover .of-turbo__go {
			transform: translate(2px, -2px);
		}
	}

	/* расчёт */
	.of-math {
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: clamp(10px, 1.4vw, 16px);
	}
	.of-math__i {
		flex: 1 1 200px;
		display: grid;
		align-content: start;
		gap: 6px;
		padding: clamp(18px, 2.2vw, 26px);
		border: 1px solid var(--line);
		border-radius: 22px;
		background: var(--card);
	}
	.of-math__i--hi {
		background: var(--dark);
		border-color: var(--dark);
		color: var(--on-dark);
	}
	.of-math__i b {
		font-size: clamp(26px, 3.4vw, 40px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1;
	}
	.of-math__i span {
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.of-math__i--hi span {
		color: var(--on-dark-2);
	}
	.of-math__op {
		align-self: center;
		font-size: 20px;
		color: var(--ink-3);
	}
	.of-claim {
		margin: clamp(16px, 2vw, 24px) 0 0;
		padding: clamp(18px, 2.2vw, 26px) clamp(20px, 2.4vw, 30px);
		border-radius: 22px;
		background: var(--paper-2);
		font-size: clamp(15px, 1.5vw, 19px);
		line-height: 1.5;
		letter-spacing: -0.01em;
	}
	.of-claim b {
		font-weight: 500;
	}

	/* цены */
	.of-price {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(12px, 1.4vw, 18px);
	}
	.of-price li {
		padding: clamp(20px, 2.4vw, 30px);
		border: 1px solid var(--line);
		border-radius: 22px;
		background: var(--card);
	}
	.of-share {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(16px, 2.4vw, 34px);
		margin-top: clamp(16px, 2vw, 24px);
		padding-top: clamp(20px, 2.4vw, 30px);
		border-top: 1px solid var(--line);
	}
	.of-share__label {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 10px;
	}
	.of-share p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	.of-share b {
		font-weight: 500;
		color: var(--ink);
	}

	/* p.s. и финал */
	.of-ps {
		display: flex;
		gap: clamp(16px, 2.4vw, 30px);
		align-items: flex-start;
	}
	.of-ps__label {
		flex: none;
		font-size: 12px;
		letter-spacing: 0.16em;
		color: var(--on-dark-2);
		padding-top: 4px;
	}
	.of-ps p {
		margin: 0;
		max-width: 62ch;
		font-size: clamp(16px, 1.8vw, 22px);
		line-height: 1.5;
		letter-spacing: -0.015em;
		color: var(--on-dark);
	}
	.of-cta {
		margin-top: clamp(28px, 3.4vw, 46px);
		padding-top: clamp(24px, 3vw, 36px);
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	.of-cta h2 {
		margin: 0 0 18px;
		font-size: clamp(22px, 2.8vw, 34px);
		letter-spacing: -0.03em;
		color: var(--on-dark);
	}
	.of-cta__acts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	/* подвал */
	.of-foot {
		max-width: var(--wide);
		margin-inline: auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		padding: clamp(24px, 3vw, 40px) var(--pad) 0;
		font-size: 13px;
		color: var(--ink-2);
	}
	.of-foot a {
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
	}

	@media (max-width: 860px) {
		.of-grid--3,
		.of-price,
		.of-share,
		.of-turbo__list {
			grid-template-columns: minmax(0, 1fr);
		}
		.of-math__op {
			display: none;
		}
		.of-ps {
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
