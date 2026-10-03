# Road sign images

This folder holds the road sign images shown on the **Road Signs** page.

The page is driven by one data file: `src/data/road-signs.ts`.

## How to add or change a sign image

1. Put the image in `public/signs/` as a WebP, for example: `public/signs/my-sign.webp` (convert a PNG with `npx sharp -i my-sign.png -o public/signs/ -f webp -q 80`)
2. Open `src/data/road-signs.ts`.
3. Add or edit an entry in the `roadSigns` array and set:
   ```ts
   imageUrl: "/signs/my-sign.webp"
   ```
   (The path starts at `/signs/...`, not `/public/...`.)

If a sign has no image, leave `imageUrl: ""` and a labeled placeholder is shown.

File names are kebab-case and match each sign's `id` where possible
(e.g. `do-not-enter.webp`, `speed-limit.webp`).
