# SEO-агентство · сайт под Санкт-Петербург

Статический сайт SEO-агентства на SvelteKit + adapter-static.
81 страница, вся генерация — на этапе сборки, на выходе чистый HTML.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5177
npm run build    # сборка в ./build
npm run preview  # локальный просмотр сборки
```

Папку `build` можно залить на любой хостинг, Netlify, Vercel, GitHub Pages
или обычный nginx — сервер не нужен.

## Что заполнить перед публикацией

Все заглушки помечены `TODO`. Найти их: `grep -rn "TODO" src/`

1. **`src/lib/config/site.js`** — главный файл.
   - `name`, `legalName` — название агентства (сейчас заглушка «ВЫШЕ»);
   - `url` — боевой домен (используется в canonical, OG и sitemap);
   - `phone`, `email`, `telegram`, `vk`, `whatsapp`;
   - `address` — адрес офиса и координаты (нужны для локального SEO);
   - `verification` — коды подтверждения в Яндекс.Вебмастере и Search Console;
   - `counters.yandexMetrika` — номер счётчика (пусто = счётчик не подключается);
   - `rating` — рейтинг и число отзывов. **Заполнять только реальными данными
     с площадок**: выдуманный AggregateRating — повод для санкций;
   - `formEndpoint` — URL обработчика формы. Пока пусто, форма показывает
     контакты вместо отправки;
   - `stats` — цифры агентства на главной.

2. **`static/robots.txt`** — заменить домен в строке `Sitemap:`.

3. **`static/og-default.png`** — картинка 1200×630 для соцсетей.
   Сейчас лежит сгенерированная заглушка без текста.

4. **Данные** в `src/lib/data/`:
   - `cases.js` — кейсы (сейчас 8 демонстрационных, замените на свои);
   - `reviews.js` — отзывы (только с согласия клиентов);
   - `team.js` — команда;
   - `tariffs.js` — тарифы и цены;
   - `posts.js` — блог (6 статей).

5. **`src/routes/politika-konfidencialnosti/+page.svelte`** — шаблон политики,
   проверьте с юристом и подставьте реквизиты.

## Структура

```
src/
  app.css                     дизайн-система: палитра, типографика, сетка
  lib/
    config/site.js            ВСЕ настройки бренда, контактов и гео
    seo.js                    сборка JSON-LD (Organization, Service, FAQ, Breadcrumbs, Article)
    actions.js                появление блоков при скролле
    components/               Header, Footer, Seo, Faq, ContactForm, карточки
    data/
      categories.js           5 направлений (хабы)
      services/               50 посадочных услуг, разбиты по направлениям
      cases.js reviews.js team.js tariffs.js faq.js posts.js
  routes/
    /                         главная
    /uslugi/                  каталог всех услуг
    /uslugi/[slug]/           50 посадочных
    /napravleniya/[slug]/     5 хабов направлений
    /keysy/ /keysy/[slug]/    кейсы
    /blog/ /blog/[slug]/      блог
    /tarify/ /o-nas/ /komanda/ /otzyvy/ /kontakty/
    /sitemap.xml              генерируется из данных
```

## Как добавить новую услугу

1. Открыть нужный файл в `src/lib/data/services/` (по направлению).
2. Скопировать любой объект и заполнить поля: `slug`, `cat`, `h1`, `title`,
   `description`, `short`, `lead`, `intro`, `pains`, `includes`, `stages`,
   `results`, `price`, `faq`, `related`.
3. `npm run build` — страница, sitemap и перелинковка появятся сами.

Проверка целостности данных (дубли slug, битые `related`, длина мета-тегов):

```bash
node -e "import('./src/lib/data/services/index.js').then(m=>{const s=m.services;const set=new Set(s.map(x=>x.slug));console.log('услуг:',s.length,'уникальных slug:',set.size);s.forEach(x=>(x.related||[]).forEach(r=>{if(!set.has(r))console.log('битая ссылка:',x.slug,'->',r)}));s.filter(x=>x.title.length>75).forEach(x=>console.log('длинный title:',x.slug));})"
```

## Что уже сделано под SEO

- Полностью статический HTML: контент в исходнике, без JS-рендера.
- Уникальные `title`, `description`, `H1`, один `H1` на страницу.
- `canonical`, Open Graph, Twitter Card на каждой странице.
- JSON-LD: `ProfessionalService` (с адресом и гео), `Service`, `FAQPage`,
  `BreadcrumbList`, `Article`, `CollectionPage`.
- Хлебные крошки на всех внутренних страницах — визуальные и в разметке.
- Перелинковка: главная → направление → услуга → связанные услуги.
- `sitemap.xml` с приоритетами, `robots.txt` с `Clean-param` для Яндекса
  и явным разрешением для AI-краулеров.
- Трейлинг-слэш на всех URL, ЧПУ на транслите.
- Ленивая анимация через IntersectionObserver, `prefers-reduced-motion` учтён.
- Без веб-шрифтов и внешних запросов — быстрый LCP.
