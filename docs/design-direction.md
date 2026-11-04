# SKINAA — Skin in motion

The homepage pairs botanical green and ivory with editorial typography and dimensional skincare forms. Official product photography is used in shopping cards; the interactive cylinder is explicitly identified as a packaging concept.

## Shopping journey

- Hero offers immediate shopping and concern-led discovery.
- Essentials appear immediately after the trust strip, with Protect / Cleanse / Hydrate filters.
- Concern choices update the story, ingredient cue and destination.
- A CSS 3D cylinder supports full rotation through a keyboard-accessible range control. Ingredient buttons explain the formula.
- AM/PM routines adjust the available steps, update totals, persist locally and expose individual product links. PM excludes sunscreen.
- A mobile shopping bar keeps discovery accessible. Product discovery remains within this application. Product detail routes are local; purchasing is outside the assignment scope.

## Motion and performance

CSS transforms supply depth without a WebGL dependency. IntersectionObserver reveals sections once. A reduced-motion preference disables animations and transitions, and disables pointer tracking. Official WebP product images are stored locally, sized explicitly and lazy loaded. The old full-screen raster hero is no longer requested. The production build reports 110 kB first-load JavaScript, compared with 109 kB previously.

## Verification

Production build passed. Browser checks at 1440px desktop and 390px mobile verified product filtering, concern updates, PM steps and total (₹679 for cleanser + moisturizer), full rotation with the End key, loaded images and absence of horizontal overflow on mobile. These are viewport checks, not physical-device or Lighthouse measurements.

## Conversion measurement

Expected benefits are easier product discovery, shorter paths to product pages, and better understanding of routines. Conversion improvements have not been measured. Evaluate hero-to-product click-through, filter usage, routine saves and bag additions against the previous design before claiming uplift.

## Creative UI/UX refinement

The ivory and botanical palette, editorial type, dimensional packaging and ingredient storytelling provide a consistent identity across the homepage and local product pages. Tablet hero sizing and wrapping are explicitly tuned between 761px and 1100px. Navigation/search controls and product filters have 44px minimum touch targets; keyboard Escape dismisses an open panel and returns focus to its trigger. Menu and search are mutually exclusive, and tapping outside closes either panel.

Verified the production build at viewport widths 320, 390, 768, 820, 1024 and 1440 pixels with no horizontal overflow. Verified tablet menu opening, search replacing the menu, Escape dismissal and restored search-button focus. These are browser viewport checks rather than physical-device compatibility certification. This assignment does not process purchases, so the current frictionless path covers discovery, product details and routine planning.
