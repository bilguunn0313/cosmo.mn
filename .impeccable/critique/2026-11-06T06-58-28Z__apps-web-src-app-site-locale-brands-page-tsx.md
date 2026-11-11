---
target: Brands page /mn/brands
total_score: 18
max_score: 28
na_heuristics: 5,7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\brands\\page.tsx"
target_fingerprint: "sha256:8b194ed2856223d6ce04daf3319ad06dfd436052aeaed47960b7ef027fdd64d5"
target_path: "C:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\brands\\page.tsx"
timestamp: 2026-11-06T06-58-28Z
slug: apps-web-src-app-site-locale-brands-page-tsx
---
⚠️ DEGRADED: single-context (sub-agents only on explicit user request in this session)

Design Health: 18/28 (64%, Acceptable). n/a: 5, 7, 10.
| # | Heuristic | Score | Key issue |
|1|Visibility|3|nav/hover states clear|
|2|Real world|3|term mismatch «Ахуй бараа» vs «Гэр ахуйн бүтээгдэхүүн»|
|3|Control|3|simple page|
|4|Consistency|2|bordered tiles vs DESIGN.md background rule; uneven logo optical size|
|5|Error prevention|n/a|no inputs|
|6|Recognition|3|no all-brands overview|
|7|Flexibility|n/a|persuade surface|
|8|Aesthetic|2|chapter chrome outweighs brand content; empty columns; stock banner noise|
|9|Error recovery|2|API failure renders banner+CTA only, no message|
|10|Help|n/a|persuade surface|

Visual scores: banner 4/10, chapter intro 7/10, logo tiles 6/10, content completeness 3/10, motion 8/10, overall 6/10.

Specificity: chapter IA + flat shelf illustrations are Cosmo-specific; stock banner and logo tiles are generic. Detector: 0 findings across 7 files. No browser overlay (headless only).

Priority issues:
- [P1] Content incomplete/wrong: 4 test brands published, 5 of 14 real brands present, productTypes empty everywhere, ACE/Dawn logos belong to other companies (detergent, dish soap) shown under Food. Fix: hide test brands, add all 14, correct logos, fill product types. /impeccable harden
- [P1] Chapter intro outweighs brands: first logo ~1300px down on desktop, ~3 screens on mobile; Household shows 1 tile + 3 empty columns. Fix: desktop chapter = left intro (title, text, stat, small illustration) + right tile grid (2–3 cols). /impeccable layout
- [P1] Banner is Unsplash stock showing other companies' cereal brands. Fix: own shelf/warehouse photo, or brand-blue banner with product cut-outs/leaf. /impeccable bolder
- [P2] Logo tiles read as empty outlined boxes; logos optically uneven. Fix: bg-paper tile + mix-blend-multiply, no ring; normalize logo size; trimmed transparent logos in admin. /impeccable polish
- [P2] Terminology and count mismatches («10 гаруй брэнд» vs 2 shown). /impeccable clarify

Personas: first-time buyer sees competitor brands first and no Cosmo logo until ~1300px; stress tester finds detergent logos under Food, 1-card household row, silent empty page on API failure; mobile user scrolls ~3 screens to first brand, jump chips only at top.

Minor: «БРЭНДҮҮД» label repeated 3x; catalog hidden; 16px banner description on busy photo.

Questions: logos in first viewport instead of stock photo? Does a 1–2 brand category need a 500px illustration? What does a supermarket buyer need here (brands, catalog, contact)?
