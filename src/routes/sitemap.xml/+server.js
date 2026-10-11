import { services } from '$lib/data/services/index.js';
import { cases } from '$lib/data/cases.js';
import { posts } from '$lib/data/posts.js';
import { site } from '$lib/config/site.js';

export const prerender = true;

const base = site.url.replace(/\/$/, '');
const today = '2026-10-12';

/** @param {string} loc @param {string} priority @param {string} changefreq @param {string} [lastmod] */
const url = (loc, priority, changefreq, lastmod = today) =>
	`	<url>
		<loc>${base}${loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`;

export function GET() {
	const urls = [
		url('/', '1.0', 'weekly'),
		url('/uslugi/', '0.9', 'weekly'),
		...services.filter((s) => s.cat === 'marketing').map((s) => url(`/uslugi/${s.slug}/`, '0.9', 'weekly')),
		url('/uslugi/seo/', '0.9', 'weekly'),
		url('/uslugi/direkt/', '0.9', 'weekly'),
		url('/uslugi/telegram-ads/', '0.9', 'weekly'),
		url('/keysy/', '0.8', 'weekly'),
		url('/o-nas/', '0.6', 'monthly'),
		url('/otzyvy/', '0.6', 'monthly'),
		url('/kontakty/', '0.7', 'monthly'),
		url('/blog/', '0.7', 'weekly'),
		...posts.map((p) => url(`/blog/${p.slug}/`, '0.6', 'monthly', p.date)),
		...services
			.filter((s) => s.cat !== 'marketing')
			.map((s) => url(`/uslugi/${s.slug}/`, s.featured ? '0.8' : '0.6', 'monthly')),
		...cases.map((c) => url(`/keysy/${c.slug}/`, '0.6', 'monthly'))
		/* Политика конфиденциальности закрыта noindex и в карту не входит. */
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
