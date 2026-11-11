---
target: Contact page /mn/contact (aesthetics, proportions)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:c:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\contact\\page.tsx"
target_fingerprint: "sha256:811e3781073bbba164cf66d2921acf6d14180e0c49f624961fe93a079fd1160c"
target_path: "c:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\contact\\page.tsx"
timestamp: 2026-11-11T02-41-18Z
slug: apps-web-src-app-site-locale-contact-page-tsx
---
⚠️ DEGRADED: single-context (sub-agents only on explicit user request)

Focus: aesthetics and proportions. Measurements at 1440x900: header 84, gap 40, map 1344x460 (2.9:1, 56% of viewport below header), gap 80, columns 527/737 (5:7) with an 80 gap, h1/h2/body 72/35/17px, bottom gap to footer 248px, first info row at y=863 (below the fold on 1366x768). At 1024px the info column is 373px and the address wraps to 5 lines.

Visual scores: form 8, column ratio 8 (1440) / 5 (1024), map proportion 6, type scale 6, spacing rhythm 6, overall 7/10.
Heuristics 23/32 (72%, Good). n/a: 7, 10. The weakest is consistency (2): two form styles on the site, and the h1 is 72px against the DESIGN.md table's 40px.
Detector: 0 findings across 4 files.

Priority:
- [P1] Phone and address are below the fold on laptops. Fix: map 460→384px, gap 80→56px. /impeccable layout
- [P2] Column tops are misaligned: the breadcrumb pushes the h1 down, so the right h2 lines up with the breadcrumb. Fix: move the breadcrumb above the map. /impeccable layout
- [P2] The 72px h1 is oversized for a utility page (2.1:1 against the h2). Fix: type-section (~52px). /impeccable typeset
- [P2] 248px bottom gap (page pb plus footer mt). Fix: drop the page pb. /impeccable layout
- [P2] Cramped at 1024. Fix: 2 columns only from xl, or stack dt above dd. /impeccable adapt

Personas: a laptop user must scroll to reach the phone; a mobile user reaches the phone at ~850px; the careers form uses a different style.
Minor: Google map colours can't be themed through the embed; the DESIGN.md type table and the BrandTile note are stale.
