/* Перелинковка услуги ↔ кейсы ↔ блог. Все связи заданы в одном месте,
   обратное направление считается автоматически. */

import { services, serviceBySlug } from './services/index.js';
import { cases, caseBySlug } from './cases.js';
import { posts, postBySlug } from './posts.js';

/** Страницы направлений, которых нет в общем списке посадочных. */
const hubs = {
	'/uslugi/': 'Все услуги агентства',
	'/uslugi/seo/': 'Продвижение сайтов',
	'/uslugi/direkt/': 'Яндекс Директ',
	'/uslugi/telegram-ads/': 'Telegram Ads и ведение каналов'
};

const u = (slug) => `/uslugi/${slug}/`;

/** Статья → услуги и кейсы по теме. */
const postMap = {
	'chem-zanimaetsya-marketingovoe-agentstvo': {
		services: [u('kompleksnyj-internet-marketing'), '/uslugi/seo/', '/uslugi/direkt/', '/uslugi/telegram-ads/'],
		cases: ['shinokoff-vyezdnoj-shinomontazh', 'sotovik-magazin-elektroniki', 'direkt-yur-uslugi-spb']
	},
	'kak-vybrat-marketingovoe-agentstvo': {
		services: [u('kompleksnyj-internet-marketing'), u('seo-audit-sajta'), '/uslugi/'],
		cases: ['yur-uslugi-2700-posetitelej', 'modulnye-doma-s-nulya', 'cvety-ryazan']
	},
	'skolko-stoyat-uslugi-marketingovogo-agentstva': {
		services: [u('kompleksnyj-internet-marketing'), '/uslugi/direkt/', '/uslugi/seo/', u('razrabotka-sajtov')],
		cases: ['direkt-yur-uslugi-spb', 'kuhnya-na-zakaz-million', 'nda-200-zaprosov']
	},
	'agentstvo-frilanser-ili-shtatnyj-marketolog': {
		services: [u('kompleksnyj-internet-marketing'), u('seo-konsalting'), u('seo-abonentskoe-soprovozhdenie')],
		cases: ['korrus-tekhniks-dorozhnaya-tekhnika', 'triera-proizvodstvo-lodok', 'vizovyj-centr-msk']
	},
	'seo-ili-yandex-direkt': {
		services: ['/uslugi/seo/', '/uslugi/direkt/', u('kontekstnaya-reklama')],
		cases: ['direkt-yur-uslugi-spb', 'shinokoff-vyezdnoj-shinomontazh', 'vskrytie-avto-spb']
	},
	'reklama-v-telegram-ads': {
		services: ['/uslugi/telegram-ads/', u('kompleksnyj-internet-marketing'), u('kontent-marketing')],
		cases: ['vizovyj-centr-msk', 'ekoniva-tekhnika-diler-selhoztekhniki']
	},
	'crm-i-reklama': {
		services: [u('vnedrenie-crm'), u('veb-analitika'), u('email-marketing'), u('razrabotka-sajtov')],
		cases: ['direkt-yur-uslugi-spb', 'psy-chat-servis-psihologov']
	},
	'email-rassylki-dlya-biznesa': {
		services: [u('email-marketing'), u('vnedrenie-crm'), u('kontent-marketing')],
		cases: ['sotovik-magazin-elektroniki', 'ajfony-gorod-3mln']
	},
	'skolko-stoit-seo-v-spb': {
		services: ['/uslugi/seo/', u('seo-prodvizhenie-sajta'), u('seo-audit-sajta')],
		cases: ['nda-200-zaprosov', 'kuhnya-na-zakaz-million', 'narkologiya-top-10']
	},
	'kak-vybrat-seo-podryadchika': {
		services: ['/uslugi/seo/', u('seo-audit-sajta'), u('seo-konsalting')],
		cases: ['yur-uslugi-2700-posetitelej', 'modulnye-doma-s-nulya', 'cvety-ryazan']
	},
	'seo-i-nejroseti-geo': {
		services: [u('prodvizhenie-v-nejrosetyah'), u('kontent-marketing'), u('prodvizhenie-v-yandex')],
		cases: ['shinokoff-vyezdnoj-shinomontazh', 'psy-chat-servis-psihologov']
	},
	'kommercheskie-faktory-yandex': {
		services: [u('kommercheskie-faktory'), u('konversiya-i-cro'), u('prodvizhenie-v-yandex'), u('razrabotka-sajtov')],
		cases: ['kuhni-na-zakaz-msk', 'vskrytie-avto-spb', 'arbitrazhnyj-yurist-msk']
	},
	'pochemu-sajt-ne-rastet': {
		services: [u('seo-audit-sajta'), u('tehnicheskaya-optimizaciya'), u('struktura-sajta')],
		cases: ['remont-transformatorov', 'kuhni-na-zakaz-msk', 'diler-geely-msk']
	},
	'lokalnoe-seo-spb-rajony': {
		services: [u('lokalnoe-seo'), u('prodvizhenie-sajta-uslug'), u('serm-upravlenie-reputaciej')],
		cases: ['shinokoff-vyezdnoj-shinomontazh', 'vskrytie-avto-spb', 'sotovik-magazin-elektroniki']
	}
};

/** Кейсы для страниц, у которых нет прямой привязки через поле service в кейсе. */
const extraCases = {
	'/uslugi/kompleksnyj-internet-marketing/': cases.filter((c) => c.turnkey).map((c) => c.slug),
	'/uslugi/razrabotka-sajtov/': ['direkt-yur-uslugi-spb', 'kuhni-na-zakaz-msk', 'arbitrazhnyj-yurist-msk'],
	'/uslugi/vnedrenie-crm/': ['direkt-yur-uslugi-spb', 'psy-chat-servis-psihologov'],
	'/uslugi/email-marketing/': ['sotovik-magazin-elektroniki', 'ajfony-gorod-3mln'],
	'/uslugi/direkt/': ['direkt-yur-uslugi-spb', 'vskrytie-avto-spb', 'shinokoff-vyezdnoj-shinomontazh'],
	'/uslugi/telegram-ads/': ['vizovyj-centr-msk', 'ekoniva-tekhnika-diler-selhoztekhniki']
};

export function serviceLink(href) {
	if (hubs[href]) return { href, title: hubs[href] };
	const s = serviceBySlug[href.replace(/^\/uslugi\/|\/$/g, '')];
	return s ? { href, title: s.h1 } : null;
}

const uniq = (arr) => [...new Set(arr)];

export function linksForPost(slug) {
	const m = postMap[slug] ?? { services: [], cases: [] };
	return {
		services: m.services.map(serviceLink).filter(Boolean),
		cases: m.cases.map((s) => caseBySlug[s]).filter(Boolean)
	};
}

/** Соседние статьи: сначала с тем же тегом, потом по кругу от текущей. */
export function otherPosts(slug, limit = 3) {
	const i = posts.findIndex((p) => p.slug === slug);
	const cur = posts[i];
	const ring = posts.map((_, k) => posts[(i + 1 + k) % posts.length]).filter((p) => p.slug !== slug);
	return uniq([...ring.filter((p) => p.tag === cur.tag), ...ring]).slice(0, limit);
}

export function postsForService(href, limit = 3) {
	return posts.filter((p) => postMap[p.slug]?.services.includes(href)).slice(0, limit);
}

export function casesForService(href, limit = 3) {
	const slug = href.replace(/^\/uslugi\/|\/$/g, '');
	const direct = cases.filter((c) => c.service === slug).map((c) => c.slug);
	return uniq([...(extraCases[href] ?? []), ...direct])
		.map((s) => caseBySlug[s])
		.filter(Boolean)
		.slice(0, limit);
}

export function postsForCase(slug, limit = 3) {
	const direct = posts.filter((p) => postMap[p.slug]?.cases.includes(slug));
	const c = caseBySlug[slug];
	const byService = c ? posts.filter((p) => postMap[p.slug]?.services.includes(u(c.service))) : [];
	return uniq([...direct, ...byService]).slice(0, limit);
}

export function servicesForCase(slug, limit = 4) {
	const c = caseBySlug[slug];
	if (!c) return [];
	const hrefs = [u(c.service)];
	for (const [href, list] of Object.entries(extraCases)) if (list.includes(slug)) hrefs.push(href);
	if (c.service !== 'kontekstnaya-reklama') hrefs.push('/uslugi/seo/');
	return uniq(hrefs).map(serviceLink).filter(Boolean).slice(0, limit);
}

/** Похожие кейсы: по кругу от текущего, чтобы ссылки получали все, а не первые три. */
export function otherCases(slug, limit = 3) {
	const i = cases.findIndex((c) => c.slug === slug);
	const cur = cases[i];
	const ring = cases.map((_, k) => cases[(i + 1 + k) % cases.length]).filter((c) => c.slug !== slug);
	return uniq([...ring.filter((c) => c.industry === cur.industry), ...ring]).slice(0, limit);
}

export { services, postBySlug };
