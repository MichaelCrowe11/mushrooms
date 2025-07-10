# JavaScript Architecture Overview

This document outlines the client-side architecture for the Southwest Mushrooms storefront, focusing on module organisation, lazy-loading strategy, and framework usage.

## Toolchain Snapshot

* **Bundler:** Webpack (configured by BigCommerce Stencil CLI)
* **Transpile Target:** Babel preset-env → evergreen browsers (ES2022)
* **Global Path Alias:** `assets/js/` (relative imports)
* **JS Frameworks:** Vanilla ES Modules + jQuery (legacy), Alpine.js (widgets) *(React planned for isolated widgets)*

## Directory Layout

```
assets/js/
├── app.js                       # Webpack bootstrap & dynamic router
├── polyfills.js                 # Legacy browser support
├── performance-monitor.js       # RUM & CLS tracker
├── custom/                      # One-off fixes / experiments
│   └── cart-fix.js
└── theme/                       # Main feature modules grouped by domain
    ├── global/                  # Site-wide behaviours (modal, dropdown…)
    ├── common/                  # Reusable utilities & components
    │   ├── utils/               # Helper functions (currency utils, forms…)
    │   ├── carousel/            # Slick carousel wrappers
    │   ├── models/              # JS data models (ProductOption…)
    │   └── aria/                # Accessibility helpers
    ├── cart/                    # Cart page specific (shipping estimator…)
    ├── product/                 # PDP widgets (image gallery, reviews…)
    ├── account.js               # Account section loader (lazy)
    ├── auth.js                  # Auth pages loader
    ├── brand.js                 # Brand listing logic
    ├── category.js              # Category page controller
    ├── compare.js               # Compare products table
    └── search.js                # Search results logic
```

## Entry-Point: `app.js`

* Exposes `window.stencilBootstrap(pageType, contextJSON, loadGlobal)`.
* Dynamically imports a page-level module based on `pageType` **(code splitting)**.
* Optional `customClasses` allows overridden loaders for bespoke templates.
* Each imported module must export a default object with a `load(context)` method.

```js
// Example (simplified)
export default {
  load(ctx) {
    // page-specific logic here
  },
};
```

## Lazy-Loading Strategy

* **Page-Level Code-Splitting:** Webpack creates separate chunks per page.
* **Conditional Imports:** Only executed when navigating to relevant templates, shrinking JS payload.
* **Async Widgets:** Carousels, image zoom, etc. are further split when possible.

## Alpine.js Widgets

* Found under `assets/js/custom/` and upcoming `widgets/` directories.
* Used for lightweight interactive components (e.g., circular-widgets, meditation timers).
* Mounted declaratively via `x-data` in Handlebars templates.

## Testing Suite

* **Jest + @testing-library:** Located at `assets/js/test-unit/theme/…` with >15 specs covering cart & carousel logic.
* **Playwright (todo):** Visual regression test placeholder.

## Opportunities / TODO

1. **Migrate jQuery dependencies → vanilla or Alpine to reduce bundle size.**
2. **Introduce Webpack chunk naming** for easier monitoring in MPAs.
3. **Adopt React + Storefront GraphQL** for cart drawer (future ticket).
4. **Enable Tree-Shaking** for lodash utilities (verify babel-plugin-lodash). 