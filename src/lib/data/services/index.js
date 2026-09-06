import { osnovnye } from './osnovnye.js';
import { tipySajtov } from './tipy-sajtov.js';
import { cms } from './cms.js';
import { nishi } from './nishi.js';
import { raboty } from './raboty.js';

/** Все 50 посадочных страниц услуг. */
export const services = [...osnovnye, ...tipySajtov, ...cms, ...nishi, ...raboty];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

export const servicesByCategory = (cat) => services.filter((s) => s.cat === cat);

export const featuredServices = services.filter((s) => s.featured);

/** Ссылки на связанные услуги с подстановкой заголовка и описания. */
export const relatedFor = (service) =>
	(service.related || [])
		.map((slug) => serviceBySlug[slug])
		.filter(Boolean)
		.map((s) => ({ slug: s.slug, h1: s.h1, short: s.short, cat: s.cat }));
