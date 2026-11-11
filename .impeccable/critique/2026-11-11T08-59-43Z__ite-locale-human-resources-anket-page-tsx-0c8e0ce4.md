---
target: anket
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:C:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\human-resources\\anket\\page.tsx"
target_fingerprint: "sha256:bd5563a2d0a038650800b3e2a24040e7b06fcc1fd779c54c54dd4921f31eb726"
target_path: "C:\\Users\\User\\Desktop\\cosmo.mn\\apps\\web\\src\\app\\(site)\\[locale]\\human-resources\\anket\\page.tsx"
timestamp: 2026-11-11T08-59-43Z
slug: ite-locale-human-resources-anket-page-tsx-0c8e0ce4
---
Method: dual-agent (A: design review agent · B: detector + browser agent)

# Ажлын анкет — шүүмж

Target: /mn/human-resources/anket (anket/page.tsx, application-form.tsx, photo-field.tsx, form-fields.tsx). Checked at 1440 and 390, empty-submit error state, thank-you state, en/zh.

## Design Health Score: 23/40 (Acceptable)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | Job not shown; no sending state; success panel says received but nothing is sent |
| 2 | Match system / real world | 3 | Local conventions right; misleading copy («Өөр ажлын байр нэмэх», «Тохирох ажлын байр гарвал…») |
| 3 | User control and freedom | 2 | No draft saving; language switch / reload wipes form; breadcrumb loses the job |
| 4 | Consistency and standards | 2 | Single-select chips look like multi-select; CTA styles differ between job detail and form |
| 5 | Error prevention | 2 | No autocomplete, phone not type=tel, free-text years, WebP/HEIC rejected |
| 6 | Recognition rather than recall | 3 | Labels visible; user must remember the job |
| 7 | Flexibility and efficiency | 2 | Good progressive disclosure, but autofill doesn't work |
| 8 | Aesthetic and minimalist design | 3 | Calm; optional sections weigh the same as required; right 40% empty at 1440 |
| 9 | Error recovery | 3 | Specific inline errors + focus to first invalid; age out-of-range message vague |
| 10 | Help and documentation | 1 | No privacy note, photo guidance, next steps or HR contact |
| Total | | 23/40 | Acceptable |

## Design specificity verdict

LLM: data model is locally authored (Овог/Нэр, UB districts + Орон нутаг, 8-digit phone, 1С/ERP, 3:4 photo), but the experience is template-generic: no job, no company voice, no next steps.

Deterministic scan: source files 0 findings. URL scan 1 finding: overused-font (Roboto 91% of text) on body — false positive, brand book mandates IBM Plex Sans + Roboto. Overlay injected only in headless Chrome (1 banner, same finding); no user-visible [Human] overlay.

Measured (not caught by detector): input underline border-ink/25 = 1.64:1, photo dashed border 1.85:1, chip focus ring 1.58:1 (WCAG 1.4.11 needs 3:1). Design review independently estimated the underline ≈1.6:1.

## What's working
1. Small required set (6, all at top) with solid error flow: focus to first invalid, specific messages, errors clear live.
2. Photo auto-shrinks to JPEG ≤1MB client-side with 3:4 preview and «Солих».
3. Consistent with site form system: 17px inputs (no iOS zoom), 44px chips, no horizontal overflow at 390; error text 6.5:1, labels 7.9:1.

## Priority issues

[P0] Job context dropped — anket/page.tsx ignores ?job=; title only «Ажлын анкет»; breadcrumb has no job; /human-resources/anket in sitemap → general applications possible. Fix: read ?job, fetchJob, show job title (eyebrow «Ажлын анкет» + title = job), closed/missing/DECIDED → "Энэ ажлын байранд анкет авахгүй байна" + link to list; job in breadcrumb; remove anket from sitemap. Command: harden.

[P1] Ending promises what doesn't happen — success says «хүлээн авлаа» while nothing is sent; no sending/failed state; talent-pool copy «Тохирох ажлын байр гарвал»; only action «Шинэ анкет». P0 if shipped before Resend. Fix: don't ship until sending works; pending + retry/failure with HR phone; thank-you names the job and next step; «Бусад ажлын байр». Commands: harden + clarify.

[P1] Mobile friction and data loss — no autocomplete (family-name, given-name, tel), phone not type=tel; underline 1.64:1; no draft saving (Android reload after gallery picker, language switch). Fix: autocomplete + type=tel; underline ink/25 → ink/50; sessionStorage draft keyed by job. Command: adapt.

[P1] No reassurance at personal-data moments — photo/age/gender first with no who/why, no optional-section signal, no HR contact. User removed intro text; suggest a small sticky job card in the empty right column instead (job, deadline, «* тэмдэгтэйг л заавал бөглөнө», «Анкетыг зөвхөн хүний нөөцийн алба үзнэ», HR phone); compact above section 1 on mobile. Command: onboard.

[P2] Screen reader / keyboard — gender chips are aria-pressed toggles (no radiogroup, no aria-required/invalid); chip focus ring 1.58:1; no aria-live anywhere; focus lost after submit; hover turns invalid photo border blue. Fix: radiogroup + aria-required/invalid; 2px brand focus ring on chips; role=status on success + focus heading. Commands: audit → harden.

## Persona red flags
Jordan: no job in title; * unexplained; doesn't know sections 2–4 optional; «(шинээр төгсөгч)» excludes older people without formal jobs; «Өөр ажлын байр нэмэх» ambiguous; thank-you reads like rejection.
Sam: gender = "toggle button, not pressed", required not announced; photo input name only «Цээж зураг», no status; no error count; focus lost after submit.
Casey: ~4,300px page; no autofill; faint underlines outdoors; reload after gallery wipes form; WebP rejected though convertible; checkbox target ~22px.

## Minor observations
- District «Сонгох» looks like a filled value.
- Age out-of-range message should say 15–80.
- No «Одоо ажиллаж байгаа»; years unconstrained; end ≥ start not checked.
- Gender can't be unselected, start date can.
- «Орон нутаг» should switch «Хороо» to «Аймаг, сум».
- AutoCAD/Photoshop irrelevant; driving licence class missing.
- Blue thank-you panel stacks against blue footer.

## Questions to consider
- Why does a driver fill the same anket as a brand manager? Per-job extra fields from admin?
- Before adding ERP-style repeatable rows: what does HR read before the first call?
- Is the empty right column serving the applicant or only the look?
