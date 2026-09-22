# rasoulsamei.com

Static personal site. Plain HTML, CSS and JS. No build step.

## Files

- `index.html` — the whole site, one page
- `styles.css` — design tokens, layout, dark mode, motion
- `main.js` — scroll reveal, header state, progress bar, counters, parallax
- `assets/` — headshot (avif / webp / jpg) and the social preview image
- `cv.pdf` — the CV linked from the site
- `_headers` — security and cache headers for Cloudflare Pages
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.svg`

## Before going live

Search the code for `TODO` and replace:

1. `assets/headshot.*` — currently a grey placeholder. Drop in a real photo, 800×1000 or any 4:5 crop.
   To make the three formats from one JPG (if you have ImageMagick): `magick headshot.jpg headshot.webp` and `magick headshot.jpg headshot.avif`. Or just keep the JPG and delete the two `<source>` lines in `index.html`.
2. `cv.pdf` — replace with the real CV.
3. Email address in the Contact section (`hello@rasoulsamei.com` is a placeholder).
4. LinkedIn, GitHub, Google Scholar, ORCID links (Contact section and the JSON-LD block in `<head>`).
5. ICSEM 2025 paper: exact title and DOI in the Research section.
6. If the domain is not `rasoulsamei.com`, update it in `index.html` (canonical, og:url, og:image), `robots.txt` and `sitemap.xml`.

## Deploy on Cloudflare Pages

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework preset: None. Build command: leave empty. Build output directory: `/`.
4. Deploy, then Custom domains → add the domain.

Every push to `main` redeploys. Pull requests get their own preview URL.

## Fonts

Loaded from Google Fonts (Instrument Serif + Inter). To self-host instead, download the WOFF2 files into `fonts/`, add `@font-face` rules at the top of `styles.css`, and remove the three `fonts.googleapis.com` / `fonts.gstatic.com` lines from `index.html`.
