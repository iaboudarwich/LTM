# Liberia Traffic Management — Website

The official website for **Liberia Traffic Management (LTM)**, the only entity authorized by the Government of Liberia to provide vehicle registration, driver licensing, vehicle inspection, license plate, and traffic violation services.

The site tells a citizen everything they need before walking into the LTM service center on SKD Boulevard, Monrovia: the full price list, FAQs, a road-signs reference, a 45-question driver's license practice test, per-service detail pages, and contact details.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Static export** (`output: "export"`): `npm run build` writes plain HTML/CSS/JS to `out/`. There is no server, no serverless functions, and no runtime to patch.
- **Tailwind CSS 3** with LTM design tokens, **shadcn/ui** primitives (Radix), **lucide-react** icons
- **Public Sans** via `next/font/google` — downloaded at build time and self-hosted, so the site makes no third-party requests
- Animations are CSS-only and switched off under `prefers-reduced-motion`
- Hosted on **Netlify**. Headers (CSP, HSTS, etc.) and cache rules live in `netlify.toml`.
- Node **22** (see `.nvmrc`; Netlify uses `NODE_VERSION = "22"`)

## Local development

```bash
nvm use          # Node 22
npm install
npm run dev      # http://localhost:3000
```

## Checks and build

```bash
npm run lint         # ESLint 9 (flat config: eslint.config.mjs)
npx tsc --noEmit     # type check
npm run build        # static export → out/
npm run analyze      # bundle analyzer report
```

To preview the production build locally, serve `out/` with any static server, e.g. `npx serve out`.

## Editing content

All content lives in typed data files under `src/data/`. Edit the file, run `npm run build` to confirm it still compiles, and open a PR — Netlify builds a deploy preview for every PR.

| File | What it controls |
| --- | --- |
| `src/data/pricing.ts` | Every fee shown on the site (USD). Fees are set by the Government of Liberia — only change them with written LTM confirmation. |
| `src/data/services.ts` | The four services (titles, summaries, links). |
| `src/data/faqs.ts` | Questions & Answers, grouped by category. |
| `src/data/road-signs.ts` | Road signs reference. Instructions for adding a sign are at the top of the file. |
| `src/data/practice-test.ts` | The 45 practice test questions and explanations. |
| `src/data/service-centers.ts` | Service center address, hours, phone numbers, email, directions link. |
| `src/data/photos.ts` | Hero, gallery, and service page photos. |
| `src/data/navigation.ts` | Header, footer, and mobile navigation links. |
| `src/data/site-meta.ts` | `SITE_URL`, the "last updated" dates (also used by the sitemap), and service time estimates. |

When you change pricing, FAQs, road signs, or services, bump the matching date in `lastUpdated` in `src/data/site-meta.ts`.

### Images

- Road sign images: `public/signs/*.webp`. Convert a PNG with `npx sharp -i my-sign.png -o public/signs/ -f webp -q 80`.
- Photos: `public/images/` (see `docs/images-README.md`).
- Logo: `public/logo/` (see `docs/logo-README.md`). App icons (`public/icon-*.png`, `public/apple-touch-icon.png`) are rendered from `public/logo/ltm-logo.svg`.
- Keep `public/` for files the site actually serves. Notes and unused source assets go in `docs/`.

## Project structure

```
src/
├── app/            # routes (App Router), layout + metadata, robots.ts, sitemap.ts, globals.css
├── components/     # layout (Header, Footer, MobileBottomNav…), ui/ (shadcn), page components
├── data/           # all editable content (see table above)
├── hooks/
└── lib/
public/             # served as-is: images, signs, logo, icons, manifest.json
docs/               # README notes for each asset folder + unused source assets
netlify.toml        # build settings, security headers, cache rules
```

## Domain cutover (ltmgov.netlify.app → www.liberiatraffic.com)

The site currently runs on the staging domain and is kept out of search engines. When moving to the real domain:

1. In `src/data/site-meta.ts`, change `SITE_URL` to `https://www.liberiatraffic.com`. This updates metadata, Open Graph, canonical URLs, `sitemap.xml`, `robots.txt`, and all JSON-LD in one go.
2. In `netlify.toml`, delete the `X-Robots-Tag = "noindex"` line (marked `REMOVE AT DOMAIN CUTOVER`).
3. In Netlify, add `www.liberiatraffic.com` (and the apex) as custom domains, set `www` as primary, and confirm HTTPS is issued.
4. Merge, let Netlify deploy, then check `https://www.liberiatraffic.com/robots.txt` and `/sitemap.xml` show the new domain.
5. Re-run the deployed site through [securityheaders.com](https://securityheaders.com) and [MDN Observatory](https://developer.mozilla.org/observatory), and submit the sitemap in Google Search Console.
