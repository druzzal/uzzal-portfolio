
## v18.4 — footer copy fix — 18 August 2026

**One-line fix:** the footer's `.foot-sub` line under the name still read "Physician · Public Health" on all 11 pages, missing "Professional" — inconsistent with the nav `.brand-role`, hero eyebrow, page `<title>`, and every other instance of this label sitewide. Now reads "Physician · Public Health Professional" everywhere. No CSS/JS/image/font/header changes; dates not bumped (footer text isn't part of any dateModified-tracked content).

## v18.1 refined — audit pass — 18 August 2026

**Full production audit of the CSP-hardening package.** Verified the hash-based CSP is actually correct (recomputed the SHA-256 of every inline `<script>` block across all 11 pages and confirmed each matches an entry in `_headers`, with no unused entries), then checked links, ids, alt text, JSON-LD validity, canonical/sitemap/og agreement, the Netlify form, self-hosted fonts, and every content-consistency point earlier rounds had flagged (the 15,000 figure, "digital health" vs "telemedicine", the Six-roles/Seven-milestones counts). Two real inconsistencies were found and fixed; everything else checked out clean.

- **`about.html`'s own `AboutPage`/`ProfilePage` JSON-LD `description`** still read "...telemedicine in Bangladesh" — a third near-identical sentence on the same page that the earlier Digital Health sweep missed (it only checked the `<meta name="description">` tag and the `Person` JSON-LD, not this third node). Now reads "...digital health in Bangladesh", matching both.
- **`experience.html`'s GRAUS bullet** read "reaching *over* 15,000 individuals," while every other instance on the site (hero stat, homepage/experience case-figures, `projects.html`) reads "15,000+". Standardized to "15,000+".
- Because the About page's JSON-LD content changed, its inline-script SHA-256 hash changed too — recomputed and swapped into the `script-src` allowlist in `_headers` (`fBxqp+Y...` → `J63o+CB...`). This is exactly the kind of edit the `_headers` comment warns to regenerate a hash for; a text-only fix to a hashed inline block would otherwise get silently blocked by the page's own CSP.
- Confirmed still correct, not changed: "Seven milestones, 2018 to today" (`experience.html`) — this legitimately includes the 2018 MBBS graduation as a milestone, distinct from "Six roles since 2020," which counts professional roles only; the two headings describe different counts on purpose.
- Flagged for the user, not changed: `community.html` still spells the surname "**Tanchangya**" (no 'g') in two places — "the Tanchangya community" and "Bangladesh Tanchangya Students Welfare Forum" — versus "**Tangchangya**" used for Dr. Uzzal everywhere else on the site. This was raised in an earlier audit round and remains unconfirmed; likely correct as the community/organisation's own name rather than an error, but worth a one-line confirmation before assuming either way.

No CSS, JavaScript, image, font, favicon, redirect, manifest, robots, or URL changes. Only `public/about.html`, `public/experience.html` and `public/_headers` differ from the uploaded v18.1-refined package.

## v18.1 refined — 18 August 2026

- Hardened the Netlify Content-Security-Policy by removing `script-src 'unsafe-inline'`.
- Added SHA-256 allowlists for the intentionally inline theme resolver and JSON-LD blocks.
- Preserved the existing render path, favicon setup, caching policy, SEO metadata, and visual UI.

# v18.2 — 2026-08-18

**Consistency audit fixes:** a full cross-page audit found four places where the same fact was stated differently in different places. All four are fixed; nothing else was touched.

- **The 15,000-person GRAUS/Save the Children figure** was worded four different ways across the site — "15,000+ people reached" (hero stat), "15,000 patients served" with no qualifier (homepage story), "15,000 patients served, nearly" (`projects.html`), and "over 15,000 individuals impacted" (`experience.html`). "Nearly" and "over" directly contradicted each other. All five instances (hero stat, homepage story-fig, `projects.html` case-fig, and two `experience.html` case-figs/bullets) now read **15,000+**, consistently.
- **Homepage "Six roles" timeline undercount.** The Journey section heading reads "Six roles, five organisations, one throughline," but the homepage's own condensed timeline collapsed the BRAC Medical Officer → Senior Medical Officer promotion into a single row, showing only five role-entries beneath the claim. It's now split into two rows (Feb 2023 – Jun 2026, then Jul 2026 – Present) exactly as `experience.html` already did, so the visible count matches the heading.
- **Nav date framing.** Every page's nav dropdown read "Experience: Six roles, 2018 to today" — but 2018 is the MBBS graduation year, not the start of the six professional roles, which actually begin January 2020. Changed to "Six roles since 2020" on all 11 pages.
- **Digital Health repositioning gaps.** v18.1 repositioned the site's framing from "Telemedicine" to "Digital Health" in the Person JSON-LD, but missed two spots: `about.html`'s own `<meta name="description">` / `og:description` / `twitter:description` (used for search snippets and link previews) still read "...telemedicine in Bangladesh," even though the same page's visible JSON-LD description already said "digital health." The homepage's "5+ yrs" impact-stat label also still said "telemedicine" instead of matching the hero lede's "digital health." Both fixed.
- **Generic-sounding experience bullets.** Three bullets under the GRAUS and ICRC roles in `experience.html` read in a different, generic corporate-resume register than the rest of the site and introduced claims that appeared nowhere else (a "20% reduction in workplace hazards through policy enforcement," a "30% increase in joint outreach," a "significantly improved" outcomes claim, and a coincidental second "95%" stat). Rewritten to draw only from facts already established elsewhere on the site — the medicines/instruments and IPC/COVID-19 training already described in the Alikadam case study, the team-leadership language already used in the homepage's featured-story flow, and the Naikhongchhari case-study name already used on `projects.html`.

No CSS, JavaScript, image, favicon, security-header, redirect, form, manifest, robots, or URL architecture changes were made. `dateModified`/sitemap `lastmod` bumped to 2026-08-18 for `experience.html` and `projects.html` only (the two pages with real copy changes not already dated today); `index.html` and `about.html` were already dated 2026-08-18.

# v18.1 — 2026-08-18

**Final positioning refinement:** aligned the broader professional positioning around **Digital Health** while retaining telemedicine as a concrete part of that experience.

- `public/index.html` and `public/about.html` — updated the Person JSON-LD description from “telemedicine experience” to “digital health experience”.
- All HTML pages carrying the Person `knowsAbout` array now use `Digital Health` as the broader topic in place of `Telemedicine`.
- `public/index.html` — revised the homepage hero to say “clinical medicine, digital health, community health, and humanitarian public-health programmes”.
- Specific telemedicine references remain elsewhere where they accurately describe a role, consultation work, or a component of digital health systems.
- No CSS, JavaScript, image, favicon, security-header, redirect, form, manifest, robots, or URL architecture changes were made.

Verification performed after the refinement: all HTML pages retain one H1, JSON-LD remains parseable, the homepage hero/About copy remain coherent, sitemap/canonical URL structure remains unchanged, and the package contains no broken local references.

# v18 — 2026-08-18

**Copy:** rewrote the About profile paragraphs, removed two duplicate tellings of the public-health pivot, and unified one verb sitewide. The homepage hero is unchanged.

## About profile copy
- `public/about.html` and `public/index.html` — the two-paragraph `.lede` block in the About/Profile section was replaced. Both files carried this copy byte-identically and still do.
- Paragraph one is unchanged apart from "more than five years" becoming "over five years".
- Paragraph two now names the digital health systems explicitly (telemedicine, electronic health records, digital prescription platforms), moves "underserved communities" onto the Chittagong Hill Tracts COVID-19 response where it belongs, and splits the previous single long sentence into two.
- The block grows from 717 to 864 characters, about two extra lines. Mid-page, no fold or layout constraint, so nothing else shifts.

## De-duplication
The new paragraph two states the pivot to public health and the MPH. Two other places on the same two pages stated the same beat in near-identical words, so each was rewritten to do something the profile does not.

- `public/about.html`, "Where it leads" section — previously restated the origin ("Field experience raised questions clinical medicine alone could not answer... led to formal training..."). Now points forward at the subject areas the training serves, and sets up the research page it links to. The `<h2>` is unchanged. Subject areas named are exactly those already listed as research interests on `research.html`; no new claim was introduced.
- `public/index.html`, featured-story step 05 ("Public-health motivation") — sat directly above the About preview and ended by announcing the MPH, which the About preview then announced again a few hundred pixels lower. It now closes on the motivation and leaves the MPH to be stated once, below.

## Wording
- "reading for an MPH" became "pursuing an MPH" in all thirteen remaining places: the Person JSON-LD `description` on all eleven pages, and prose on `research.html`. This follows the phrasing in the newly supplied About copy. Zero occurrences of the old form remain.

## Dates
- `dateModified` and the matching sitemap `lastmod` were bumped to 2026-08-18 for `index.html`, `about.html` and `research.html` only — the three pages with real copy changes. The other eight pages changed by one word inside embedded metadata; bumping their `lastmod` would overstate the change to crawlers, so it was left alone.

Deliberately NOT changed: the homepage hero `.lede` (an earlier draft replacement was reverted, so the hero is byte-identical to v17); every `<h2>`; the Areas of focus chips, meta lists and Education sections; the meta `description`, `og:` and `twitter:` tags on every page; CSS, JavaScript, images, fonts, headers, redirects, manifest, robots.txt and the Netlify form. `main.css`, `main.js` and `animations.js` are byte-identical to v17.

Verified: markup parses on all eleven pages, one `<h1>` each, zero inline `style=` attributes, all JSON-LD valid, sitemap `lastmod` agrees with each page's `dateModified`, no dead internal links, the About `.lede` block still byte-identical across the two files that carry it, and `tools/verify-fonts.py` passes with 0 failures.

# v17 — 2026-08-17

**Branding / favicon documentation:** aligned the repository documentation with the current v3 logo and favicon package.

- The site now uses the **v3 logo family** for the visible mark and favicon/PWA artwork.
- Added the explicit `192×192` PNG favicon declaration: `/assets/images/favicon-v3-192.png`.
- Documented the current v3 icon set: 180px Apple Touch Icon, 192px PNG icon, 512px PWA icon and 512px maskable PWA icon.
- Kept `/favicon.ico` as the stable root favicon URL; it remains the authoritative fallback and uses the current v3 mark.
- Updated `README.md` so its favicon/branding section matches the deployed package rather than the pre-v3 documentation.

This documentation-only correction does not change the deployed HTML, CSS, JavaScript, manifest or image assets.

# v15.4 — 2026-08-16

**Refinement:** final cleanup and deployment hygiene after the v15.3 favicon correction.

- Kept `/favicon.ico` as the single authoritative browser favicon URL on every HTML page. The ICO remains the current multi-size favicon and continues to revalidate at the root path.
- Removed unused legacy browser-favicon artifacts from `public/assets/images/`: `favicon-v2.ico`, `favicon-v2.svg`, and the unused 16/32/48/96 PNG variants.
- Preserved the 180px Apple Touch Icon plus the 192px, 512px and 512px maskable PWA icons because `site.webmanifest` still references them.
- Kept the existing JSON-LD graph, canonical URLs, sitemap, robots.txt, Netlify rewrites, security headers, form configuration, CSS, JavaScript and image assets unchanged. No redesign or content changes.
- Updated the README to document the single authoritative favicon strategy and cache policy.

Verification performed on the final package: no HTML references the removed favicon files; every indexable HTML page contains the same `/favicon.ico` declaration; manifest icon paths resolve; sitemap and canonical URL sets remain aligned; no dead favicon references remain.

# Changelog

Repository-root file. Not deployed — only `public/` is published.

## v15 — 16 Aug 2026

An editorial-accuracy and URL-canonicalisation pass over v14. No redesign: no
colour, type, spacing, animation, photograph or layout was changed. The only
CSS delta is one new modifier class and the removal of the rules it replaces.

### Fixed — the years figure contradicted itself

The homepage carried three different accounts of the same career: a hero stat
reading `3+ yrs`, a lede saying "over three years", and a section heading two
scrolls below saying "Six years, five organisations". The timeline on the same
page runs from January 2020, and the worked months across the five
organisations come to roughly five and a half years, so the most prominent
number was also the most wrong — and it understated the record.

- hero stat: `data-count="3"` → `data-count="5"`, label unchanged
- homepage lede and About preview: "more than three years" → "more than five years"
- `about.html` page lede: "Three years of clinical practice" → "More than five
  years of clinical practice"
- journey heading: "Six years, five organisations" → "**Six roles**, five
  organisations". Six roles across five organisations is the count the nav
  dropdown, the experience `h1` and "what those six roles added up to" already
  use; "six years" was a stray. If a role is ever added or merged, all four
  of those strings move together.

### Fixed — every page had two live URLs and pointed at the wrong one

`/research` and `/research.html` both returned 200 with identical content.
Every internal link used the extensionless form while `rel=canonical`,
`og:url`, the JSON-LD `@id`/`url`/breadcrumb values and `sitemap.xml` all
pointed at `.html` — so the site's own links and its own canonical signal
disagreed on nine pages.

The extensionless form is now canonical everywhere: canonical tags, `og:url`,
`twitter` URLs, JSON-LD `WebPage.@id` / `WebPage.url` / breadcrumb tail,
`sitemap.xml` locs, and all internal `href`s (`/index.html` → `/`). The 200
rewrites in `_redirects` are unchanged, so `.html` paths still resolve for old
inbound links and the pair consolidates on the canonical.

**Deliberately not done:** a forced `301` from `.html` to the pretty form. A
forced redirect on a path that is also a rewrite target can loop on Netlify,
and it cannot be verified from this environment. Canonical consolidation
already solves the signal-splitting; add the 301 later from a deploy preview
if you want the duplicate gone entirely.

Side effect, benign: `isInternal()` in `main.js` compares `a.pathname` to
`location.pathname` to suppress the page-transition veil on same-page anchors.
Because links were `.html` and the served path was not, in-page jumps like
`/projects#covid-response` used to trigger a full page transition. They now
match and correctly skip it.

### Fixed — the homepage told the Alikadam story three times

The programme appeared as the impact stat band, as the Featured Story with its
five-step breakdown, and again as a "Featured project" card carrying the same
three figures. `15,000` appeared four times before the footer; `95%` twice.

- the Featured Project section now carries the **second** case study — ICRC,
  Naikhongchhari — using the same markup, the same `.case-hero` / `.case-figures`
  components and the same section rhythm. Its figures come from the ICRC role
  as already stated on `experience.html`. It deep-links to
  `/projects#icrc-programme`.
- Featured Story step 04 no longer restates the patient count; it now matches
  the wording of "05 · Community" on `projects.html`.
- `15,000` now appears twice on the homepage, `95%` once.

### Fixed — the research page displayed an empty form

The `.rnote` block paired a "coming soon" note with four dashed placeholder
boxes reading *Research title / Role · institution · year / Abstract /
Publication · DOI · link*. Rendering the empty frame drew more attention to the
gap than omitting it. The scaffold is gone; the note now states what is
actually under way (the MPH in Epidemiology at BUP) and what will appear here.

`.rnote` keeps its two-column grid for any future use; the single-column case
is a new `.rnote--solo` modifier. The now-unused `.rnote-fields` /
`.rnote-field` rules were removed.

### Fixed — smaller things

- **"Upazilla" → "Upazila"** (24 occurrences across 11 files): nav dropdown
  labels, page copy, `h2`s, meta descriptions and JSON-LD descriptions. One `l`
  is the standard English transliteration.
- **Hero monogram `UT` → `UCT`**, matching the logo mark set adopted in v11.
- `_redirects` header comment rewritten — it still claimed `.html` was the
  canonical form.
- `dateModified` and sitemap `lastmod` moved to `2026-08-16T00:00:00+06:00`,
  still in step with each other.

### Deliberately NOT changed

- **The 95% programme satisfaction figure.** It needs a denominator and an
  instrument, not an edit — a public-health reader will ask how it was measured
  and over what n. Left exactly as written pending that detail.
- **The contact form.** `action="/contact-success.html"`, the Netlify
  attributes and the honeypot are untouched.
- **Images.** No re-encoding, no renaming; `/assets/images/*` is still served
  immutable for a year.
- **JavaScript.** Not one byte. `main.js` and `animations.js` are identical to
  v14.
- **Voice on the rest of the site.** Only the one first-person string
  ("Organisations I have worked with", in the marquee eyebrow and its
  `aria-label`) was moved to third person to match every other page.
- **The homepage timeline's single BRAC entry.** It names both titles and the
  promotion date; splitting it would lengthen the section for no gain, and
  `experience.html` carries the split version.

## v14 — 15 Aug 2026

A correctness and accessibility pass over v13. No redesign: no colour, type,
spacing, animation, photograph or copy was changed. Ten of the eleven pages
differ only by a single date string.

### Fixed — keyboard accessibility (the one real bug)

`.menu-sub.is-open` set `visibility:visible`. The mobile menu is hidden with
`visibility:hidden` on `.menu`, and because pages ship their own nav group
pre-expanded in the markup (`<div class="menu-sub is-open">`), that rule
**overrode the inherited hidden state** and re-exposed those links while the
menu was shut.

Effect, confirmed with a real `Tab` walk in Chromium: on **7 pages** a keyboard
user tabbing off the burger button landed on **3–6 invisible off-screen links**
before reaching page content. The links also sat inside `aria-hidden="true"`,
so they were simultaneously announced-as-absent and focusable — a WCAG 2.4.3
(Focus Order) and 4.1.2 (Name, Role, Value) failure.

Fix — one word:

```css
.menu-sub.is-open{visibility:inherit;max-height:340px}
```

`inherit` resolves to hidden while `.menu` is closed and to visible the moment
`.menu.is-open` sets `visibility:visible`. Rendering is byte-for-byte
identical in both states; only the focus behaviour changes.

### Fixed — photo-strip labelling

The two `.fstrip` marquees on `projects.html` and `community.html` carried
`tabindex="0"` on the scroll container but `role="region"` / `aria-label` on
its parent. Focusing a strip therefore announced the concatenation of every
caption instead of the label. Role, label and `tabindex` now sit on the same
element, matching how `.orgs-track` was already built, and the label carries
the pause hint.

### SEO / metadata

- `dateModified` bumped to `2026-08-15T00:00:00+06:00` on all 10 JSON-LD
  pages, and every `<lastmod>` in `sitemap.xml` set to the same value. Both
  are full ISO-8601 with an explicit `+06:00` offset — they already were, and
  they still match each other exactly.
- Dropped the stale "Generated for the v11 build" comment from `sitemap.xml`.

### Headers

- Removed the stale v11 narrative from the CSP comment in `_headers`; it now
  describes the policy as it stands rather than the migration that produced it.
- Added explicit `Cache-Control` rules for the nine extensionless pretty URLs
  and `/`. These are rewrites, so a request for `/about` never matches the
  `/*.html` rule above it. Netlify's default for HTML happens to be the same
  policy, so nothing was broken — but the rule is now asserted rather than
  inherited.

### Removed

- `public/assets/images/og-card-v2.jpg` (56 KB) — superseded by
  `og-portrait-card.jpg` and referenced by nothing.
- Dead CSS: the `.form-note` rules, `.wrap--narrow`, and the `--maxw-narrow`
  custom property orphaned by removing the latter.

`/favicon.ico` also scans as unreferenced. It is deliberate — browsers request
it at the root path without being told to — and stays.

### Deliberately not changed

- **Images.** Re-encoding was tested and rejected. The AVIF/WebP derivatives
  are already near-optimal; re-compressing them gains roughly 5 % with
  generational quality loss, and `/assets/images/*` is served `immutable` for a
  year, so any re-encode would force renaming all 230 files. Worth revisiting
  only with the original camera files.
- **`console.warn` in `main.js`.** It fires only when a form POST fails, and
  distinguishing a real failure from a false success is exactly the diagnostic
  this site has needed. Not debug residue.
- **`script-src 'unsafe-inline'`.** Still required by the inline theme resolver
  and the JSON-LD blocks, as documented in `_headers`.
- **`you@example.com`** as the email placeholder — RFC 2606 reserved.

### Verification

Two suites were run against the built `public/` folder, both clean:

- **Static** — 246 internal references resolve exact-case; no duplicate IDs or
  dead anchors; canonical/`og:url`/`twitter:*` agree with `<title>` and the
  meta description on every page; JSON-LD parses and every date is ISO-8601
  with a timezone; sitemap covers exactly the indexable set and its `lastmod`
  values match each page's `dateModified`; no secrets, no `TODO`, no
  `debugger`.
- **Headless Chromium**, all 11 pages at 320 / 390 / 768 / 1280 / 1600 px —
  zero JavaScript errors, zero console errors, zero horizontal overflow. Real
  `Tab` walks reach no hidden element on any page. Mobile menu (open, Escape,
  focus move, scroll lock, restore), the accordion, the desktop dropdown, the
  skills tablist and contact-form validation were each driven and asserted.
  Contrast sampled in both themes.

## v15.1 — 2026-08-16

**Fix:** `public/about.html` — the Education list rendered the MPH row twice
("Current — Master of Public Health (MPH) in Epidemiology, Bangladesh University
of Professionals, Dhaka"). The two `.meta-row` blocks were byte-identical
copy-paste duplicates; one was removed.

Nothing else changed: one file, one line. No CSS, JS, image, header, redirect,
sitemap or JSON-LD edits. `dateModified` / `lastmod` were already 2026-08-16, so
no date bump was needed.

Checked while in there: no other adjacent duplicate lines on any page, no
duplicate `id` attributes, no other repeated `.meta-row` blocks, container tags
balanced.

## v15.2 — 2026-08-16 — mobile performance pass (delivery only)

Mobile PageSpeed was 89. This round changes **how assets are requested**, not
what they are. `assets/css/main.css`, `assets/js/main.js` and
`assets/js/animations.js` are **byte-identical to v15** — verified by diff — so
every animation, transition, keyframe and reduced-motion rule is untouched by
construction. No image was re-encoded, no markup restructured, no copy edited.

### 1. Google Fonts: six font files down to three

The `css2` request listed Inter as four discrete weights (`350;400;450;500`)
and JetBrains Mono as two (`400;500`). Google serves **a separate static file
per discrete value**, so the page was pulling six font files. Both are now
variable ranges:

    Inter:wght@350..500          (was 350;400;450;500)
    JetBrains+Mono:wght@400..500 (was 400;500)

One variable file each. Fraunces was already a range (`opsz@9..144`) and is
unchanged, italic included.

Rendering is identical: the stylesheet only ever asks for 350, 400, 450 and
500, all inside the new ranges, and the discrete files Google was serving were
themselves instances of these same variable fonts. There is no `<strong>` or
`<b>` anywhere in the markup, so nothing requests a weight above 500.
`display=swap` is retained on both the preload and the `<noscript>` fallback.

Changed on all 11 pages, in both the preload link and the noscript link.

### 2. Image preload priority rebalanced (index.html, about.html)

Both pages preloaded their portrait in three media-query variants, all at
`fetchpriority="high"`, and repeated `fetchpriority="high"` on the `<img>`
itself — which applies at *every* width.

But below 900px the stylesheet stacks `.hero-figure` / `.about-figure` under
the copy (`grid-column: 1 / span 12`). On a phone the portrait sits far down
the page and is **not** the LCP element — the `h1` is. Those high-priority
image bytes were competing with the CSS and font that actually gate the
heading's paint.

Now `fetchpriority="high"` appears on exactly one preload per page: the
`(min-width:900px)` variant, the only width at which the portrait sits beside
the copy and genuinely is the LCP. The 560–899px and ≤559px variants are still
preloaded — so they are still fetched early and the mask reveal never opens on
an undecoded image — just not boosted ahead of the heading's dependencies.
Removed from the `<img>` too, since the ≥900px preload already carries it for
the desktop case.

### Already in place — checked, nothing to do

- The custom cursor, the `[data-magnet]` buttons and the `[data-tilt]` portrait
  are all already gated behind `matchMedia('(hover:hover) and (pointer:fine)')`
  in `main.js` / `animations.js`, so a touch device never binds those listeners
  or runs their rAF loops. (v12 work.)
- No analytics, tag manager or third-party script anywhere on the site. Google
  Fonts is the only external origin.
- Dead-CSS sweep found nothing removable: 295 class tokens in `main.css`, all
  but `.sr-only` in use (and that is a deliberately kept a11y utility).
  Earlier rounds had already cleaned this.

### Deliberately NOT changed

- **Critical-CSS inlining.** Splitting above-the-fold CSS into an inline
  `<style>` and loading `main.css` asynchronously would shave the
  render-blocking round trip — but the reveal system's starting states
  (`.js [data-reveal]{opacity:0}`, the `[data-mask]` clip-path) live in that
  stylesheet. If it arrives after the observer has run, elements flash visible
  and then animate, which is a visible change to the animation. Ruled out
  under the "don't change the animation" constraint. It would also need a
  per-page `sha256-` hash in `style-src` to keep `'unsafe-inline'` out.
- **Self-hosting the fonts.** This is the single largest remaining LCP win —
  it removes two third-party round trips (`googleapis` CSS → parse → `gstatic`
  font) from the critical path. Not done here because it needs the `.woff2`
  files downloaded and subset, which this environment cannot do (no network).
  Fraunces, Inter and JetBrains Mono are all OFL-licensed, so self-hosting is
  permitted. Worth its own round.
- **Fingerprinted CSS/JS filenames.** `max-age=0, must-revalidate` costs a
  revalidation round trip on every internal navigation. Content-hashed names
  served `immutable` would fix that, but this repo has no build step —
  `netlify.toml` only publishes `public/`. Hashed names without an automated
  rewrite is a footgun: edit the file, forget to rename, and every returning
  visitor is pinned to the old version forever. Needs a build script first.
- **The `body::before` paper-grain overlay.** A fixed, full-viewport
  `mix-blend-mode: multiply` layer is the largest paint cost while scrolling on
  a mid-range Android, but it is a design element and PageSpeed does not
  measure it.
- Images, markup, copy, `_headers`, `_redirects`, `sitemap.xml`,
  `site.webmanifest`, and all dates (`dateModified` / `lastmod` were already
  2026-08-16).

### Verification

`qa152.py` — 11 pages, 0 failures. Covers: font-url form and `display=swap` on
every page, every CSS `font-weight` inside the requested range, exactly one
high-priority image preload per page and that it is the ≥900px one, every
preload and `imagesrcset` target present on disk, no `fetchpriority` left on an
`<img>`; plus the standing invariants — reveal/mask/marquee/cue keyframes and
the reduced-motion block still present, `parkOffscreen` and the hover gate
still in the JS, no `animationPlayState='running'`, `.menu-sub.is-open` still
`visibility:inherit`, zero inline `style=` attributes, CSP `style-src` still
without `'unsafe-inline'` and still allowing both font origins, one `h1` per
page, alt on every image, no duplicate ids, no broken internal links or
fragments, canonical = `og:url` and extensionless, sitemap agreement,
valid JSON-LD, Netlify form intact, and the banned stale strings.
