import { error } from '@sveltejs/kit';
import { posts, postBySlug } from '$lib/data/posts.js';
import { linksForPost, otherPosts } from '$lib/data/links.js';

export const prerender = true;

export function entries() {
	return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = postBySlug[params.slug];
	if (!post) throw error(404, 'Статья не найдена');
	return { post, others: otherPosts(params.slug), links: linksForPost(params.slug) };
}
