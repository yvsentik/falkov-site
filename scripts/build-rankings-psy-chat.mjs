import fs from 'node:fs';

const files = [
	{ path: '/Users/konstantin/Downloads/psy-chat.ru.яндекс_москва.csv', engine: 'Яндекс', city: 'Москва' },
	{ path: '/Users/konstantin/Downloads/psy-chat.ru.organic.гугл_москва.csv', engine: 'Google', city: 'Москва' }
];

/* Брендовые и мусорные запросы: как доказательство они бесполезны.
   «Бесплатно» у psy-chat не мусор — бесплатная сессия и есть их оффер. */
const BRAND = /(пси\s?чат|псичат|psy\s?chat|psychat|личный кабинет|мохова)/i;
const JUNK = /(отзыв|ваканс|работ[аы]|обучени|курс|профессия|кто так|что так|как стать|форум|скачать|песня|фильм|книг|мем|прикол|значени|википеди|зарплат|аниме|игра|сонник)/i;

const STOP = new Set(['в', 'на', 'с', 'и', 'для', 'по', 'у', 'от', 'о', 'об']);
const key = (q) =>
	q
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => !STOP.has(w))
		.map((w) => (w.length > 4 ? w.replace(/[аеёиоуыэюяьйы]$/, '') : w))
		.sort()
		.join(' ');

function parse(path) {
	const raw = fs.readFileSync(path, 'utf8').replace(/^﻿/, '');
	const lines = raw.split(/\r?\n/).filter(Boolean);
	const head = lines[0].split(';');
	const [iQ, iPos, iEx] = ['Запрос', 'Позиция', 'Точная частотность'].map((h) => head.indexOf(h));
	const rows = [];
	for (const line of lines.slice(1)) {
		const c = line.match(/("(?:[^"]*)"|[^;]*)/g).filter((_, i) => i % 2 === 0).map((v) => v.replace(/^"|"$/g, '').trim());
		const pos = Number(c[iPos]);
		const freq = Number(c[iEx]);
		if (!c[iQ] || !(pos >= 1 && pos <= 10)) continue;
		rows.push({ q: c[iQ], pos, freq: Number.isFinite(freq) ? freq : 0 });
	}
	return rows;
}

const sets = [];
for (const f of files) {
	const rows = parse(f.path);
	const set = {
		engine: f.engine,
		city: f.city,
		tracked: rows.length,
		top3: rows.filter((r) => r.pos <= 3).length,
		top5: rows.filter((r) => r.pos <= 5).length,
		top10: rows.length,
		exactSum: rows.reduce((a, r) => a + r.freq, 0),
		queries: []
	};

	const seen = new Set();
	const pool = rows
		.filter((r) => r.pos <= 5 && !BRAND.test(r.q) && !JUNK.test(r.q))
		.sort((a, b) => a.pos - b.pos || b.freq - a.freq);
	/* Сначала берём заметные по частотности, потом добираем слабее — но не мельче 25. */
	for (const min of [100, 38]) {
		for (const r of pool) {
			if (r.freq < min || seen.has(key(r.q))) continue;
			seen.add(key(r.q));
			set.queries.push(r);
			if (set.queries.length === 9) break;
		}
		if (set.queries.length === 9) break;
	}
	set.queries.sort((a, b) => a.pos - b.pos || b.freq - a.freq);
	sets.push(set);
	console.log(`\n## ${f.engine} ${f.city}: tracked ${set.tracked} | ТОП-3 ${set.top3} | ТОП-5 ${set.top5} | частотность ${set.exactSum}`);
	set.queries.forEach((q) => console.log(`   ${q.pos}  ${String(q.freq).padStart(6)}  ${q.q}`));
}
fs.writeFileSync('/tmp/psy_sets.json', JSON.stringify(sets, null, '\t'));
