import { error } from '@sveltejs/kit';
import { posts, postBySlug } from '$lib/data/posts.js';

export const prerender = true;

export function entries() {
	return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = postBySlug[params.slug];
	if (!post) throw error(404, 'Статья не найдена');
	const others = posts.filter((p) => p.slug !== params.slug).slice(0, 3);
	return { post, others };
}
