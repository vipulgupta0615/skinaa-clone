# Performance and accessibility review

The homepage production build reports about 115 kB first-load JavaScript. This is build output, not a Lighthouse score or a network timing measurement. Product photography uses actual local WebP assets totalling approximately 35.7 kB, explicit dimensions, lazy loading and asynchronous decoding. The retired 1.6 MB hero image is not referenced by the active frontend.

The product visualization is CSS geometry: no model downloads, textures, WebGL engine or animation library. Hero pointer movement updates only the visual transform rather than React state for the entire homepage. Product auto-rotation is opt-in, limited to roughly 30 updates per second, suspended offscreen and stopped when the document is hidden.

Reduced-motion, Save-Data, and exposed low-memory/core-count signals select lighter effects. Optional hardware signals are progressive enhancements; unsupported browsers still get reduced-motion support. Lighter mode disables ambient animation, particles and expensive backdrop filters; manual rotation and product information remain available. Hidden tabs pause CSS animation. Missing IntersectionObserver leaves content visible.

Accessibility provisions include a skip link, semantic headings, labelled range and form controls, pressed/expanded states, keyboard rotation, visible focus, 44px navigation touch targets, and Escape/outside-click dismissal for header panels. Focus entering a reveal section makes its content visible. Blocked local storage produces a useful save failure instead of breaking the homepage. This is not a WCAG certification; screen-reader, contrast and physical-device audits remain separate validation work.

No third-party scripts are included in the active frontend. Checkout has been removed for the assignment.

## Shopify compatibility boundary

Next.js can serve a custom Shopify storefront through the Storefront API: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api . The current assignment uses a local catalogue and a local demo bag; it is not connected to Shopify and compatibility with live theme apps, accounts, inventory, discounts or checkout has not been verified.

A future integration would replace catalogue reads with Storefront API product/variant mappings and replace the local bag with Shopify Cart API state. Private tokens belong on the backend. Preserve the UI components and motion controls independently of that data adapter. Store-specific configuration and validation are required; do not embed the original store URL or add checkout to this assignment.
