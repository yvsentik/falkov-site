import { error } from '@sveltejs/kit';
import { services, serviceBySlug, relatedFor } from '$lib/data/services/index.js';
import { categoryBySlug } from '$lib/data/categories.js';
import { casesForService, postsForService } from '$lib/data/links.js';

export const prerender = true;

export function entries() {
	return services.map((s) => ({ slug: s.slug }));
}

export function load({ params }) {
	const service = serviceBySlug[params.slug];
	if (!service) throw error(404, 'Услуга не найдена');
	return {
		service,
		category: categoryBySlug[service.cat],
		related: relatedFor(service),
		cases: casesForService(`/uslugi/${service.slug}/`),
		posts: postsForService(`/uslugi/${service.slug}/`)
	};
}
