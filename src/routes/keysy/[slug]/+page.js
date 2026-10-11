import { error } from '@sveltejs/kit';
import { cases, caseBySlug } from '$lib/data/cases.js';
import { serviceBySlug } from '$lib/data/services/index.js';
import { otherCases, postsForCase, servicesForCase } from '$lib/data/links.js';

export const prerender = true;

export function entries() {
	return cases.map((c) => ({ slug: c.slug }));
}

export function load({ params }) {
	const item = caseBySlug[params.slug];
	if (!item) throw error(404, 'Кейс не найден');
	return {
		item,
		service: serviceBySlug[item.service] ?? null,
		others: otherCases(params.slug),
		services: servicesForCase(params.slug),
		posts: postsForCase(params.slug)
	};
}
