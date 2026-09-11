/* ============================================================
   ЕДИНЫЙ КОНФИГ САЙТА.
   Замените значения-заглушки (помечены TODO) на реальные –
   они автоматически подставятся в тайтлы, микроразметку,
   контакты, sitemap и шапку/подвал.
   ============================================================ */

export const site = {
	// Данные взяты из вашего канала @falkov_agency
	name: 'Фальков',
	tagline: 'Маркетинговое агентство в Санкт-Петербурге',

	// TODO: боевой домен без слэша на конце
	url: 'https://falkov-marketing.ru',

	phone: '+7 993 982-32-04',
	phoneHref: '+79939823204',

	telegram: 'https://t.me/falkov_agency',
	telegramLabel: '@falkov_agency',
	telegramChannel: 'https://t.me/falkov_agency',
	// менеджер, на которого вы ведёте заявки из канала
	manager: 'https://t.me/falkov_marketing',
	managerLabel: '@falkov_marketing',
	managerName: 'Роман',

	// Мессенджер MAX – ссылка-приглашение на личный профиль
	max: 'https://max.ru/u/f9LHodD0cOIG4smr9o8DyMktNa2hXIrOl2NdQxp8bTuRZ3l21vfOUwr8syE',

	whatsapp: '',
	vk: '',

	// TODO: адрес обновлён по вашей подсказке (было – Энергетиков, 10 из поста в канале).
	// Проверьте индекс и координаты перед подключением Яндекс Бизнеса.
	address: {
		street: 'пр. Энергетиков, 10',
		city: 'Санкт-Петербург',
		region: 'Санкт-Петербург',
		postalCode: '195027', // TODO: проверить индекс для Энергетиков, 10
		country: 'RU',
		lat: 59.947,
		lon: 30.415 // TODO: уточнить координаты для Яндекс.Бизнеса
	},
	addressNote: 'Просьба написать за день до приезда',

	workHours: 'Пн–Пт, 10:00–19:00',

	// TODO: коды подтверждения прав в вебмастерах
	verification: {
		yandex: '924a68f7156d909c', // аккаунт revomarketing
		google: ''
	},

	// TODO: счётчики. Пустая строка = счётчик не подключается.
	counters: {
		yandexMetrika: '112339205',
		googleAnalytics: ''
	},

	// TODO: заполнять ТОЛЬКО реальными данными с площадок отзывов.
	// Пустой rating = микроразметка AggregateRating не выводится.
	rating: {
		value: '',
		count: ''
	},

	// Куда уходят заявки с формы.
	// 1) telegramBot – бот шлёт заявку в чат менеджера напрямую (без сервера).
	//    token – от @BotFather, chatId – id чата, куда писать (Роман должен нажать Start у бота).
	// 2) formEndpoint – свой обработчик (POST JSON), если появится.
	// Если пусто и то и другое – форма открывает чат с менеджером с готовым текстом.
	telegramBot: { token: '', chatId: '' }, // токен бота только в переменных Yandex Cloud Function
	formEndpoint: 'https://functions.yandexcloud.net/d4eru9jekgkhaalqp0kc', // worker/yc-function → @falkov_leads_bot → Роман
	// Yandex SmartCaptcha: клиентский ключ. Работает только вместе с formEndpoint,
	// секретный ключ живёт в воркере. После включения токен бота отсюда убрать.
	captcha: { sitekey: 'ysc1_TlaMeoeaBrYnXHfzrvV2FvdUCJCzMjjK617ckm2V0e51ca89' }, // Yandex Cloud, капча falkov-site

	ogImage: '/og-default.png' // TODO: заменить на свою картинку 1200×630
};

export const geo = {
	city: 'Санкт-Петербург',
	cityShort: 'СПб',
	cityIn: 'в Санкт-Петербурге',
	cityGen: 'Санкт-Петербурга'
};

/** Цифры агентства. TODO: подставить свои реальные показатели. */
export const stats = [
	{ value: '45+', label: 'кейсов в разных нишах' },
	{ value: '1–2 месяца', label: 'до первых ощутимых результатов' },
	{ value: '180 000', label: 'суммарная частотность запросов в ТОП на одном проекте' },
	{ value: '×10', label: 'окупаемость на контексте' }
];

/** Главное меню. */
export const nav = [
	{
		title: 'Услуги',
		href: '/uslugi/',
		children: [
			{ title: 'SEO-продвижение сайта', href: '/uslugi/seo-prodvizhenie-sajta/' },
			{ title: 'SEO-продвижение', href: '/uslugi/seo/' },
			{ title: 'Яндекс Директ', href: '/uslugi/direkt/' },
			{ title: 'Telegram Ads', href: '/uslugi/telegram-ads/' },
			{ title: 'SEO под ключ', href: '/uslugi/seo-pod-klyuch/' },
			{ title: 'Продвижение интернет-магазина', href: '/uslugi/prodvizhenie-internet-magazina/' },
			{ title: 'Продвижение в Яндексе', href: '/uslugi/prodvizhenie-v-yandex/' },
			{ title: 'Продвижение в Google', href: '/uslugi/prodvizhenie-v-google/' },
			{ title: 'Продвижение в нейросетях (GEO)', href: '/uslugi/prodvizhenie-v-nejrosetyah/' },
			{ title: 'SEO-аудит сайта', href: '/uslugi/seo-audit-sajta/' },
			{ title: 'Все 50 услуг', href: '/uslugi/' }
		]
	},
	{ title: 'Кейсы', href: '/keysy/' },
	{
		title: 'Агентство',
		href: '/o-nas/',
		children: [
			{ title: 'О нас', href: '/o-nas/' },
			{ title: 'Отзывы', href: '/otzyvy/' },
			{ title: 'Контакты', href: '/kontakty/' }
		]
	},
	{ title: 'Контакты', href: '/kontakty/' }
];
