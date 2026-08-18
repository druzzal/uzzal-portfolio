# druzzal.com

Portfolio site for Dr. Uzzal Chandra Tangchangya — physician and public-health
professional, Dhaka, Bangladesh.

Static HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Brand, logo and favicon

The current brand assets are the **v3 logo family**. The same v3 mark is used by the site logo and favicon/PWA artwork.

Favicon delivery uses two browser-facing declarations:

- `/favicon.ico` is the authoritative fallback/favicon URL and contains the current multi-size v3 mark.
- `/assets/images/favicon-v3-192.png` is the explicit 192×192 PNG icon for browsers and services that prefer a PNG favicon.

The mobile/PWA icon set is also current v3:

- `/assets/images/favicon-v3-180.png` — 180×180 Apple Touch Icon
- `/assets/images/favicon-v3-192.png` — 192×192 PNG icon
- `/assets/images/favicon-v3-512.png` — 512×512 PWA icon
- `/assets/images/favicon-maskable-v3-512.png` — 512×512 maskable PWA icon

The web manifest references the 192px, 512px and 512px maskable v3 PNGs. `/favicon.ico` remains the stable root favicon URL and is served with `Cache-Control: public, max-age=0, must-revalidate` so a future replacement can revalidate without changing the URL.

## Layout

```
netlify.toml        Netlify build settings (publish = "public")
CHANGELOG.md        What changed in each revision, and what was deliberately left alone
.gitignore          OS/editor debris and secrets -- see note below
tools/              Pre-deploy checks. Never deployed; run them by hand.
  verify-fonts.py   Fonts are self-hosted and no Google Fonts URL crept back in
  verify-csp.py     Every inline script still matches its CSP hash
public/             Everything that gets served. Nothing outside it is deployed.
  *.html            10 pages + a 404
  _headers          Security headers, CSP, cache policy
  _redirects        Pretty URLs (/about -> /about.html, status 200 rewrite)
  robots.txt
  sitemap.xml
  site.webmanifest
  assets/
    css/main.css    One shared stylesheet for every page
    js/main.js      Nav, menu, theme, page transitions, contact form
    js/animations.js Scroll reveals, marquees, parallax, counters
    images/
    documents/
```

Files in `public/` are the deployed site. Anything added at the repository
root — this README included — stays private.

### URL policy

The **extensionless form is canonical**. `/about` is served as a status-200
rewrite of `about.html`, and `rel=canonical`, `og:url`, the JSON-LD
`@id`/`url`/breadcrumb values, `sitemap.xml` and every internal `href` all use
`/about`. The `.html` path still resolves so old inbound links keep working;
Google consolidates the pair on the canonical.

Do **not** add a forced 301 from `/about.html` to `/about` without testing it
on a deploy preview first — a forced redirect combined with the existing
rewrite can loop. The contact form's `action` deliberately stays
`/contact-success.html`; leave it alone.

## Before every deploy

Two checks, both instant, both exit non-zero on failure:

```bash
python3 tools/verify-fonts.py
python3 tools/verify-csp.py
```

`verify-csp.py` is the one that catches a silent breakage. Inline scripts — the
no-flash theme resolver and each page's JSON-LD — are permitted by SHA-256 hash
rather than `'unsafe-inline'`, so **changing a single character inside one of
those blocks changes its hash and the browser stops running it.** The deploy
still succeeds and the page still looks right to whoever made the edit; what
actually happens is a flash of the wrong colour scheme, or structured data
vanishing from Google's view. Run the check, and if it fails, paste the hash it
prints into the `script-src` allowlist in `public/_headers`.

## Deploying from GitHub

1. Create an empty repository on GitHub and push this folder to it:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```

2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the
   repository and authorise access.

3. Netlify reads `netlify.toml`, so the build settings should already be filled
   in. Confirm they read:

   - Build command: *(empty)*
   - Publish directory: `public`

4. Deploy. Every push to `main` redeploys automatically; pull requests get
   their own preview URL.

### After the first deploy

- **Custom domain.** Netlify → Domain management → add `druzzal.com`. HTTPS is
  provisioned automatically. The `Strict-Transport-Security` header in
  `_headers` is preloadable, so serve over HTTPS only.
- **Contact form.** `public/contact.html` uses Netlify Forms. The form is
  detected at deploy time from the static HTML, so it registers on the first
  Git deploy without any extra configuration. Check Netlify → Forms for a form
  named `contact`, and add a notification email. The JavaScript deliberately
  treats a 404 or 405 response as a failure rather than reporting a false
  success, so a missing form registration will surface immediately in the UI.
- **Verify the headers** landed, since they only apply once deployed:

  ```bash
  curl -sI https://druzzal.com | grep -i 'content-security-policy\|strict-transport'
  ```

## Editing

`assets/css/main.css` and the two JavaScript files are not fingerprinted, and
`_headers` serves them `max-age=0, must-revalidate`. A redeploy therefore
reaches everyone immediately — filenames never need version bumps.

Images are the exception: `/assets/images/*` is served
`immutable` for one year, so **replacing an image requires a new filename**.
Overwriting one in place will not reach anyone who has already visited.

## Accessibility and motion

Every animation is gated behind `prefers-reduced-motion`. With reduced motion
requested, reveals resolve instantly, marquees become static wrapped lists, the
custom cursor and the page-transition veil are removed, and the photo strips
turn into normal horizontally scrollable regions. With JavaScript disabled
entirely, all content renders — the reveal start states are scoped behind a
`js` class set by an inline script in each `<head>`.
