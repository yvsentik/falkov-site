import { site, geo } from './config/site.js';

export const abs = (path = '/') => site.url.replace(/\/$/, '') + path;

/** Организация – выводится на каждой странице. */
export function orgSchema() {
	const data = {
		'@type': 'ProfessionalService',
		'@id': abs('/#organization'),
		name: site.name,
		description: `Маркетинговое агентство ${geo.cityIn}. Ведём проекты под ключ: поиск, контекст, Telegram, разработка и аналитика.`,
		url: abs('/'),
		telephone: site.phone,
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

export function serviceSchema(service) {
	return {
		'@type': 'Service',
		name: service.h1,
		description: service.description,
		serviceType: service.h1,
		provider: { '@id': abs('/#organization') },
		areaServed: { '@type': 'City', name: geo.city },
		url: abs(`/uslugi/${service.slug}/`),
		offers: {
			'@type': 'Offer',
			priceCurrency: 'RUB',
			price: String(service.price.from).replace(/[^0-9]/g, ''),
			priceSpecification: {
				'@type': 'PriceSpecification',
				minPrice: String(service.price.from).replace(/[^0-9]/g, ''),
				priceCurrency: 'RUB'
			},
			availability: 'https://schema.org/InStock'
		}
	};
}

export function articleSchema(post) {
	return {
		'@type': 'Article',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		author: { '@type': 'Person', name: post.author },
		publisher: { '@id': abs('/#organization') },
		mainEntityOfPage: abs(`/blog/${post.slug}/`)
	};
}

/** Собирает единый JSON-LD граф. */
export function graph(...nodes) {
	return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
