# Site images — where everything lives

A quick map of every image on the site and the one data file that controls it.
You only ever edit a plain data file in `src/data/` — no code changes needed.

| What | Image folder | Data file to edit |
| --- | --- | --- |
| Homepage hero slideshow | `public/images/hero/` | `src/data/photos.ts` → `heroPhotos` |
| Service page banners | `public/images/services/` | `src/data/photos.ts` → `servicePhotos` |
| Road sign images | `public/signs/` | `src/data/road-signs.ts` → `roadSigns` |
| Logos / emblem | `public/logo/` | referenced in Header/Footer |
| Liberia coat of arms | `public/coat-of-arms.svg` | referenced in pages |

## Rules of thumb

- Reference images by web path, starting at the folder name:
  `/images/hero/photo.jpg`, `/signs/stop.webp`, `/logo/ltm-logo.svg`.
  (Do **not** include `/public` in the path.)
- Local files in these folders work with no extra setup.
- A full `https://` link also works, but its domain must be listed in
  `next.config.mjs` under `images.remotePatterns`.
- Each folder has its own README in `docs/` (`images-README.md`, `images-hero-README.md`, `images-services-README.md`, `logo-README.md`, `signs-README.md`).

Road sign images stay in `public/signs/` (their long-standing home) so the
90+ existing files and their data references keep working unchanged.
