/** Появление блока при скролле. Уважает prefers-reduced-motion. */
export function reveal(node, { delay = 0, threshold = 0.12 } = {}) {
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-visible');
		return {};
	}
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) {
		node.classList.add('is-visible');
		return {};
	}
	node.classList.add('reveal');
	if (delay) node.style.transitionDelay = `${delay}ms`;
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					io.unobserve(node);
				}
			}
		},
		{ threshold, rootMargin: '0px 0px -40px 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
