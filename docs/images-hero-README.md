# Hero images (homepage slideshow)

Put homepage hero/banner photos in this folder.

## How to use a photo here

1. Drop your image file in this folder, for example:
   `public/images/hero/main-facility.jpg`
2. Open `src/data/photos.ts`.
3. In the `heroPhotos` list, add or edit an entry and set:
   ```ts
   url: "/images/hero/main-facility.jpg"
   ```
   (Note: the path starts at `/images/...`, not `/public/...`.)
4. Fill in a short, factual `alt` description and the real `width`/`height`.

To remove a slide, delete its entry in `heroPhotos`.
To reorder slides, move the entries up or down in that list.

Recommended: wide landscape photos (about 1600×900 or larger), good lighting.
Local files in this folder need no extra configuration.
