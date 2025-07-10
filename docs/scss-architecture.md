# SCSS Architecture Overview

This document maps the current SCSS structure of the Southwest Mushrooms storefront (Crowe Stencil Savant stack) and highlights key dependencies, naming conventions, and build-order considerations.

## Directory Topology

```
assets/scss/
├── _glass-ui.scss              # Theme-level design system overrides
├── _palette.scss               # Centralized color & token map
├── checkout.scss               # Stand-alone entry for BC optimised checkout
├── tools/                      # Utility mixins/functions (image, list, string…)
├── settings/                   # Variable declarations & 3rd-party design tokens
│   ├── citadel/                # BC Citadel overrides
│   ├── foundation/             # Foundation framework variable map
│   ├── global/                 # Generic variables (z-index, breakpoints…)
│   ├── layouts/                # Grid & spacing vars
│   ├── normalize/              # Normalisation tweaks
│   ├── stencil/                # Stencil-specific settings (fonts, icons…)
│   └── vendor/                 # Vendor-specific tokens
├── utilities/                  # Generated helper classes (text-align-center…)
├── components/                 # Component styles grouped by domain
│   ├── _animated-header.scss
│   ├── _animated-loader.scss
│   ├── _cart-celebration.scss
│   ├── _circular-widgets.scss   # <–– recently modified
│   ├── citadel/                # Citadel component overrides
│   ├── foundation/             # Foundation components (accordion, alerts…)
│   ├── stencil/                # Stencil components (login, wishlist…)
│   └── vendor/                 # 3rd-party widgets (jstree…)
├── layouts/                    # Page-level and structural layout rules
└── vendor/                     # Raw vendor CSS (rarely touched)
```

## Import Graph (`theme.scss`)

The build entry-point `theme.scss` orchestrates the following high-level order:

1. **Tools** – mixins/functions from Citadel then local `tools/`.
2. **Settings** – Global > Citadel > Normalise > Foundation > BigCommerce > Local overrides.
3. **Utilities** – Auto-generated helper classes.
4. **Components** – Normalise reset, Citadel components, Stencil common, local components.
5. **Layouts** – Structural rules.
6. **Theme Extensions** – Glassmorphism design system + custom widgets.

> ⚠️  **Note:** Citadel & Foundation layers are compiled twice (node_modules & local overrides). Ensure variable collisions are intentional and namespaced.

## Citadel / Foundation Integration

* Citadel **v1.7** is pulled from NPM (`@bigcommerce/citadel`).
* Foundation **5.5.3** vendor CSS is included through Citadel as well as local overrides.
* Custom overrides live under `assets/scss/components/citadel/` and `assets/scss/components/foundation/`.

## Naming Conventions

* Files prefixed with an underscore (`_`) compile into a single bundle via `theme.scss`.
* BEM-style selectors dominate local components; Citadel follows SUIT.
* Tokens (colors, spacing, breakpoints) are defined in `settings/*` and referenced via SCSS variables—never hard-coded in component files.

## Build Pipeline Notes

* **Stencil CLI** concatenates and minifies the entire graph; source maps enabled by default.
* Critical CSS subset is extracted via Citadel’s toolkit (TODO: confirm task in build pipeline inspection).
* `checkout.scss` builds independently to meet BigCommerce Optimized Checkout constraints.

## Next Steps / Opportunities

1. **Δ Audit:** Check for duplicate variable declarations between local & Citadel layers, especially color tokens.
2. **Performance Budget:** Extract critical CSS ≤ 200 KB; current bundle size needs measuring (task_audit).
3. **Dark / Light Theme Tokens:** Move toward CSS Custom Properties for runtime toggling. 