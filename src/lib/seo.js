import { site, geo } from './config/site.js';

export const abs = (path = '/') => site.url.replace(/\/$/, '') + path;

/** Организация – выводится на каждой странице. */
export function orgSchema() {
	const data = {
		'@type': ['ProfessionalService', 'LocalBusiness'],
		'@id': abs('/#organization'),
		name: `Маркетинговое агентство «${site.name}»`,
		alternateName: [site.name, 'Falkov Marketing'],
		description: `Маркетинговое агентство полного цикла ${geo.cityIn}. Ведём проекты под ключ: продвижение сайтов, Яндекс Директ, Telegram Ads, разработка сайтов, CRM и email-рассылки.`,
		url: abs('/'),
		logo: abs('/icon-512.png'),
		image: abs(site.ogImage),
		telephone: site.phoneHref,
		knowsAbout: [
			'Интернет-маркетинг',
			'Продвижение сайтов',
			'Яндекс Директ',
			'Telegram Ads',
			'Разработка сайтов',
			'CRM',
			'Email-маркетинг'
		],
		priceRange: '₽₽',
		areaServed: [{ '@type': 'City', name: geo.city }, { '@type': 'AdministrativeArea', name: 'Ленинградская область' }],
		address: {
			'@type': 'PostalAddress',
			streetAddress: site.address.street,
			addressLocality: site.address.city,
			addressRegion: site.address.region,
			postalCode: site.address.postalCode,
			addressCountry: site.address.country
		},
		geo: { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lon },
		openingHours: 'Mo-Fr 10:00-19:00',
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: site.phoneHref,
			contactType: 'sales',
			areaServed: 'RU',
			availableLanguage: 'ru'
		},
		sameAs: [site.telegram, site.vk].filter(Boolean)
	};
	if (site.rating.value && site.rating.count) {
		data.aggregateRating = {
			'@type': 'AggregateRating',
			ratingValue: site.rating.value,
			reviewCount: site.rating.count
		};
	}
	return data;
}

export function breadcrumbSchema(items) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.title,
			item: abs(item.href)
		}))
	};
}

export function faqSchema(faq) {
	return {
		'@type': 'FAQPage',
		mainEntity: faq.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/** Услуга. Блок offers выводится, только если у услуги есть цена числом.
    path – для страниц направлений, которые лежат не в общем списке посадочных. */
export function serviceSchema(service, path = `/uslugi/${service.slug}/`) {
	const price = String(service.price?.from ?? '').replace(/[^0-9]/g, '');
	const data = {
		'@type': 'Service',
		name: service.h1,
		description: service.description,
		serviceType: service.h1,
		provider: { '@id': abs('/#organization') },
		areaServed: { '@type': 'City', name: geo.city },
		url: abs(path)
	};
	if (price) {
		data.offers = {
			'@type': 'Offer',
			priceCurrency: 'RUB',
			price,
			priceSpecification: { '@type': 'PriceSpecification', minPrice: price, priceCurrency: 'RUB' },
			availability: 'https://schema.org/InStock'
		};
	}
	return data;
}

/** Список страниц раздела: хаб услуг, кейсы, блог. */
export function itemListSchema(name, items) {
	return {
		'@type': 'ItemList',
		name,
		itemListElement: items.map((it, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: it.title,
			url: abs(it.href)
		}))
	};
}

export function articleSchema(post) {
	return {
		'@type': 'Article',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		inLanguage: 'ru-RU',
		image: abs(site.ogImage),
		author: { '@type': 'Person', name: post.author },
		publisher: { '@id': abs('/#organization') },
		mainEntityOfPage: abs(`/blog/${post.slug}/`)
	};
}

/** Собирает единый JSON-LD граф. */
export function graph(...nodes) {
	return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
