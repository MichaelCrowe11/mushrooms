# Handlebars Template Architecture Overview

This document describes the structural layout of all Stencil Handlebars templates for the Southwest Mushrooms storefront and notes customisations on top of Cornerstone/Catalyst lineage.

## High-Level Structure

```
templates/
├── layout/          # Global skeletons (base.html, empty.html)
├── components/      # Reusable partials grouped by domain
│   ├── cart/
│   ├── common/
│   ├── products/
│   ├── category/
│   ├── faceted-search/
│   └── custom/          # Brand-specific additions (newsletter-form…)
└── pages/           # Full-page templates mapped to page_type
    ├── account/
    ├── auth/
    ├── blog/
    ├── brand.html
    ├── gift-certificate/
    └── errors/
```

### 1. `layout/`

* **`base.html`** – Primary document shell. Injects:
  * SEO & social meta tags (customised).
  * Sidebar navigation (glass-morphism UI) & theme toggle.
  * `{{> components/common/header }}` / `body` / `footer` partials.
  * JS entry (`theme-bundle.main.js`) + `stencilBootstrap` bootstrap.
* **`empty.html`** – Minimal wrapper for standalone pages (maintenance, AMP…).

### 2. `components/`

* **`common/`** – Global UI elements (alert, modal, forms).
* **`cart/`** – Mini-cart, checkout buttons, coupon input.
* **`products/`** – Product card, add-to-cart button, option selectors.
* **`custom/`** – Proprietary widgets (`product-card-glass`, `newsletter-form`, `circular-widgets` forthcoming).
* **Foundational overrides** – Many files align with Cornerstone default but include glass-morphism design tokens.

### 3. `pages/`

Pages correspond 1:1 with BigCommerce `page_type` and are routed by `app.js`.

* `pages/product/` delegates most of its sections to `components/products/*`.
* Account & Auth subfolders override Cornerstone with updated forms & a11y improvements.
* `errors/` contains branded 403, 404, and generic error layouts.
* `unavailable/` (hibernation / maintenance) uses `empty.html` base.

## Customisation Highlights

| Area | File | Description |
|------|------|-------------|
| Glass-morphism nav | `layout/base.html` | Fixed sidebar nav injected before `<main>` with SVG icons & theme toggle. |
| Cart celebration | `components/common/cart-celebration.html` + JS | Confetti animation after add-to-cart. |
| Product card (glass) | `components/custom/product-card-glass.html` | Transparent cards with backdrop-filter & hover shine. |

## Template Loading Flow

1. **Stencil Server** renders `layout/base.html` (or other).
2. `<script>` sets `window.stencilBootstrap(page_type,… )`.
3. JS loads matching page module → may request extra Handlebars partials via AJAX (e.g., quick-view modal).

## Opportunities / TODO

1. **Consolidate duplicated partials** in `components/cart/` & `common/`.
2. **Adopt BigDesign React components** (wrapped) for modals & forms.
3. **Add `aria-live` regions** for nav sidebar & theme toggle. 