# Cosmo: Brands and Media pages (Next.js / TypeScript)

The file paths match `cosmo.mn/apps/web`. Copy each file over the existing file at the same path, then do steps 1–4 below.

## Files
New or replaced:
- `src/app/(site)/[locale]/brands/page.tsx` — cover image → tabs → brand grid → catalog
- `src/components/site/brands/brands-cover.tsx` (new)
- `src/components/site/brands/catalog-book.tsx` (new, client) — open book, page-turn animation, keyboard arrows. Mobile shows one page at a time.
- `src/components/site/brands/category-filter.tsx` — underlined tabs, scroll sideways on mobile
- `src/components/site/brands/brand-card.tsx` — logo card
- `src/lib/catalog.ts` (new) — catalog settings (pages, flipbook link)
- `src/app/(site)/[locale]/media/page.tsx` — featured story, Бүгд/Видео tabs, 3-column grid
- `src/app/(site)/[locale]/media/[slug]/page.tsx` — reading-progress bar, share buttons, related news
- `src/components/site/media/news-card.tsx` — `NewsLeadCard` + `NewsCard`
- `src/components/site/media/news-pagination.tsx` — numbered pages
- `src/components/site/media/reading-progress.tsx` (new, client)
- `src/components/site/media/share-buttons.tsx` (new, client)

### About page (v2)
- `src/app/(site)/[locale]/about/page.tsx` — banner → CEO message → history (awards strip + left/right timeline) → values → partner band
- `src/components/site/page-banner.tsx` (new) — shared photo banner, also use it for HR and Media
- `src/components/site/about/ceo-message.tsx` (new)
- `src/components/site/about/history-timeline.tsx` (new, client) — years slide in from left/right, rail fills with scroll (motion `useScroll`), repeated years merge into "2005-08". Milestone `description` lines (split by newline) become the sub-lines.
- `src/components/site/about/values-list.tsx` (new)
- `src/lib/about.ts` (new) — banner image, CEO text/photo, awards, values

No longer used by About (delete if nothing else imports them): `about-hero`, `about-story`, `about-stats-band`, `history-strip`, `values-grid`. `PartnerBand` stays.

Translations to add: `about.ceoTitle` ("Гүйцэтгэх захирлын мэндчилгээ"), `about.historyTitle` ("Компанийн түүх"), `about.valuesTitle` ("Үнэт зүйл"). Check `nav.careers` exists ("Хүний нөөц"); if your key is different, change it in `about/page.tsx`.

## 1. CSS
Append the contents of `src/app/globals.additions.css` to the end of `src/app/globals.css`.

## 2. Translations (add to `messages/mn.json`, en/zh likewise)
```json
"brands": {
  "count": "{brands} брэнд · {categories} ангилал"
},
"catalog": {
  "title": "Каталог",
  "view": "Каталог үзэх",
  "hint": "Хуудсыг эргүүлж бүх бүтээгдэхүүнийг үзээрэй",
  "prev": "Өмнөх хуудас",
  "next": "Дараах хуудас",
  "fullscreen": "Бүтэн дэлгэцээр"
},
"media": {
  "all": "Бүгд",
  "featured": "Онцлох",
  "read": "Унших",
  "share": "Хуваалцах",
  "copyLink": "Холбоос хуулах",
  "copied": "Хуулсан"
}
```
(Merge these into the existing objects; the other keys stay.)

## 3. `src/lib/public-api.ts`: video filter
```ts
export function fetchNewsPage(
  locale: Locale,
  page: number,
  limit: number,
  opts: { video?: boolean } = {},
) {
  const video = opts.video ? "&video=true" : "";
  return fetchPublic<PublicNewsPage>(
    `/public/news?page=${page}&limit=${limit}${video}`,
    locale,
  ).catch((): PublicNewsPage => ({ items: [], total: 0 }));
}
```
API (`apps/api/src/news/public-news.controller.ts`): if `video=true`, filter with `where: { videoId: { not: null } }`.

## 4. Catalog
Fill `src/lib/catalog.ts` with `pages` (image URLs) and `viewerUrl`. If `pages` is empty, the catalog section and the "Каталог үзэх" button are hidden. Later this can be moved into the admin site settings.

## Responsive
- Brands grid: 2 columns on mobile → 3 at md → 4 at xl.
- News grid: 1 → 2 at sm → 3 at lg.
- Catalog: 1 page (3:4) on mobile → 2 pages (3:2) from md.
- Tabs scroll sideways on mobile.
- Article: share buttons stay pinned beside the text on lg, and sit under the text on smaller screens.
- Pagination: mobile shows "1 / 3"; from sm it shows numbered pages.

## Animation
- Uses the existing `Reveal` (motion) and `tw-animate-css` classes.
- The scroll-linked animations (cover drift, catalog cover opening) run only where the browser supports them, using `@supports (animation-timeline)`.
- All animation is turned off for users who have `prefers-reduced-motion` set.
