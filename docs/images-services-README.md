# Service page header images

Put banner photos for the service pages (Driver License, Vehicle Registration,
Vehicle Inspection, License Plates) in this folder.

## How to use a photo here

1. Drop your image file in this folder, for example:
   `public/images/services/inspection-bay.jpg`
2. Open `src/data/photos.ts`.
3. Add it as an `LtmPhoto` (or reuse one already listed), then point the
   `servicePhotos` map at it. Each line in `servicePhotos` controls one
   service page banner.
4. Use the local path form `url: "/images/services/inspection-bay.jpg"`.

Recommended: wide landscape photos (about 1600×900 or larger).
