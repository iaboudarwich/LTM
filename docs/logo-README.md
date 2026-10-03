# Logos and emblems

This folder holds the LTM brand logos.

- `ltm-logo.svg` — full-color emblem (used in the header and footer).
- `ltm-logo-mono.svg` — single-color version for dark or light backgrounds. Not used by the site, so it lives in `docs/assets/`; copy it into `public/logo/` if a page needs it.

The Republic of Liberia coat of arms lives at `public/coat-of-arms.svg`.

## How to change a logo

Replace the file here, keeping the same file name, and the site picks it up
automatically. If you add a new file name, update the references in:

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

Logos are referenced by path, e.g. `/logo/ltm-logo.svg`.
