# Build / Dev Pipeline Overview

This document summarises how the Southwest Mushrooms Stencil theme is built, linted, and served locally.

## 1. Stencil CLI

| Command | Purpose |
|---------|---------|
| `stencil start -s` | Spins up Browsersync dev server at `localhost:3000` using `config.stencil.json`. Utilises live-reload on `.html`, `.scss`, and `.js` changes. |
| `stencil bundle`   | Builds production bundle (CSS + JS) & package as `.zip` for theme upload. |
| `stencil push`     | Uploads latest bundle to the store (requires token). |

> **Config:** `config.stencil.json` specifies local port, store URL, and an API token (replace in CI with `STENCIL_TOKEN` env var to comply with guard-rail #4).

## 2. Webpack

* Two configs: **`webpack.dev.js`** (source-map, fast refresh) and **`webpack.prod.js`** (minification, tree-shaking).
* Entry points configured in `webpack.common.js` generate:
  * `theme-bundle.main.js` – synced with site load order.
  * `theme-bundle.head_async.js` – critical polyfills & LazySizes config.
* **Code Splitting:** Leveraged via dynamic `import()` in `assets/js/app.js`.
* **Bundle Analysis:** `npm run build && npx webpack-bundle-analyzer dist/stats.json`.

## 3. Grunt Tooling (Legacy)

`load-grunt-config` loads tasks under `grunt/` (not yet mapped):

* `grunt svgstore` – Compiles SVG sprite.  
* `grunt stylelint` – Lints SCSS files.  
* `grunt eslint` – Lints JS files (Airbnb base).  
* `grunt run:lighthouse` – Executes Lighthouse CI (script hook).

## 4. Testing

* **Unit:** Jest with `jest-environment-jsdom`. Specs under `assets/js/test-unit/theme/`.
* **E2E (Planned):** Playwright integration forthcoming.

## 5. Continuous Integration (Proposed)

A future GitHub Actions workflow (not yet committed) should:

1. Check out repo.
2. `npm ci` to install deps.
3. `npm run test && npm run stylelint`.
4. `npm run build` to ensure prod bundle compiles.
5. Deploy via `stencil push` to staging store (using secrets).

---

### Quick Commands

```bash
# Local dev
stencil start -s

# Build prod bundle
npm run build

# Lint all SCSS & auto-fix minor issues
npm run stylelint:fix
```

### Next-Step Enhancements

* Migrate remaining Grunt tasks → NPM scripts to simplify pipeline.
* Integrate **Lighthouse CI** & **axe-core** checks in GitHub Actions.
* Replace plaintext token in `config.stencil.json` with `$STENCIL_TOKEN`. 