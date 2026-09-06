<script>
	import { page } from '$app/state';
	import { site, nav } from '$lib/config/site.js';
	import Arrow from './Arrow.svelte';

	let open = $state(false);
	let scrolled = $state(false);
	let openSub = $state(null);

	const menu = nav;

	function onScroll() {
		scrolled = window.scrollY > 12;
	}

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
	});
</script>

<svelte:window on:scroll={onScroll} />

<header class="header" class:scrolled class:open>
	<div class="header__inner container">
		<a class="logo" href="/" aria-label="{site.name} — на главную">
			<span class="logo__mark" aria-hidden="true"></span>
			<span class="logo__text">falkov<span class="logo__dot">.</span>agency</span>
		</a>

		<nav class="nav" aria-label="Основное меню">
			<ul>
				{#each menu as item}
					<li class="nav__item" class:has-sub={item.children?.length}>
						<a
							href={item.href}
							class:active={page.url.pathname.startsWith(item.href) && item.href !== '/'}>{item.title}</a
						>
						{#if item.children?.length}
							<div class="submenu">
								<ul>
									{#each item.children as child}
										<li><a href={child.href}>{child.title}</a></li>
									{/each}
								</ul>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		<div class="header__actions">
			<a class="phone" href="tel:{site.phoneHref}">{site.phone}</a>
			<a class="btn btn--sm" href="/kontakty/">Обсудить проект <Arrow /></a>
			<button
				class="burger"
				aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				<span></span><span></span>
			</button>
		</div>
	</div>
</header>

{#if open}
	<div class="mobile">
		<div class="mobile__inner container">
			<ul class="mobile__list">
				{#each menu as item}
					<li>
						{#if item.children?.length}
							<button
								class="mobile__toggle"
								aria-expanded={openSub === item.title}
								onclick={() => (openSub = openSub === item.title ? null : item.title)}
							>
								{item.title}<span>{openSub === item.title ? '−' : '+'}</span>
							</button>
							{#if openSub === item.title}
								<ul class="mobile__sub">
									<li><a href={item.href} onclick={() => (open = false)}>Все · {item.title}</a></li>
									{#each item.children as child}
										<li><a href={child.href} onclick={() => (open = false)}>{child.title}</a></li>
									{/each}
								</ul>
							{/if}
						{:else}
							<a href={item.href} onclick={() => (open = false)}>{item.title}</a>
						{/if}
					</li>
				{/each}
			</ul>
			<div class="mobile__foot">
				<a class="mobile__phone" href="tel:{site.phoneHref}">{site.phone}</a>
				<a class="btn btn--wide" href="/kontakty/" onclick={() => (open = false)}>Обсудить проект</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 60;
		background: color-mix(in srgb, var(--paper) 88%, transparent);
		backdrop-filter: saturate(150%) blur(14px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.3s var(--ease), background 0.3s var(--ease);
	}
	.header.scrolled {
		border-bottom-color: var(--line-soft);
	}
	.header__inner {
		display: flex;
		align-items: center;
		gap: 28px;
		height: 76px;
	}
	.logo {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex: none;
	}
	.logo__mark {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--gold);
		align-self: center;
	}
	.logo__text {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: 0.04em;
	}
	.logo__dot {
		color: var(--ink-3);
	}
	.nav {
		margin-left: auto;
	}
	.nav > ul {
		display: flex;
		align-items: center;
		gap: 26px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.nav__item {
		position: relative;
	}
	.nav__item > a {
		font-size: 15px;
		padding: 26px 0;
		display: inline-block;
		transition: color 0.25s var(--ease);
	}
	.nav__item > a:hover,
	.nav__item > a.active {
		color: var(--gold);
	}
	.submenu {
		position: absolute;
		top: 100%;
		left: -18px;
		min-width: 288px;
		background: var(--card);
		border: 1px solid var(--line-soft);
		border-radius: var(--radius-lg);
		padding: 10px;
		box-shadow: 0 24px 60px -34px rgba(16, 16, 16, 0.5);
		opacity: 0;
		visibility: hidden;
		transform: translateY(6px);
		transition: all 0.28s var(--ease);
	}
	.nav__item:hover .submenu,
	.nav__item:focus-within .submenu {
		opacity: 1;
		visibility: visible;
		transform: none;
	}
	.submenu ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.submenu a {
		display: block;
		padding: 9px 14px;
		font-size: 14.5px;
		border-radius: var(--radius);
		color: var(--ink-2);
		transition: background 0.2s var(--ease), color 0.2s var(--ease);
	}
	.submenu a:hover {
		background: var(--paper-2);
		color: var(--ink);
	}
	.header__actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: none;
	}
	.phone {
		font-size: 15px;
		font-weight: 500;
		white-space: nowrap;
	}
	.phone:hover {
		color: var(--gold);
	}
	:global(.btn--sm) {
		padding: 12px 20px !important;
		font-size: 14px !important;
	}
	.burger {
		display: none;
		width: 42px;
		height: 42px;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
	}
	.burger span {
		display: block;
		width: 16px;
		height: 1.5px;
		background: var(--ink);
	}
	.mobile {
		position: fixed;
		inset: 76px 0 0;
		z-index: 55;
		background: var(--paper);
		overflow-y: auto;
		padding-block: 24px 40px;
	}
	.mobile__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.mobile__list > li {
		border-bottom: 1px solid var(--line-soft);
	}
	.mobile__list a,
	.mobile__toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 17px 0;
		font-size: 20px;
		letter-spacing: -0.02em;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
	}
	.mobile__sub {
		list-style: none;
		margin: 0 0 12px;
		padding: 0 0 0 14px;
		border-left: 1px solid var(--line);
	}
	.mobile__sub a {
		font-size: 16px;
		padding: 11px 0;
		color: var(--ink-2);
	}
	.mobile__foot {
		margin-top: 32px;
		display: grid;
		gap: 16px;
	}
	.mobile__phone {
		font-size: 24px;
		font-weight: 500;
	}
	@media (max-width: 1120px) {
		.nav {
			display: none;
		}
		.burger {
			display: flex;
		}
	}
	@media (max-width: 720px) {
		.phone,
		.header__actions :global(.btn) {
			display: none;
		}
		.header__actions {
			margin-left: auto;
		}
		.header__inner {
			height: 68px;
		}
		.mobile {
			inset: 68px 0 0;
		}
	}
</style>
