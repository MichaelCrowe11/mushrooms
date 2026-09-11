# mushrooms

BigCommerce Stencil theme for the Southwest Mushrooms online store, forked from the Cornerstone theme in July 2025.

## Status

archived

Development stopped on 2025-07-08 (last commit on `main`, per `git log`). The code is kept for reference. Southwest Mushrooms was a mushroom farm in Phoenix. The farm closed in February 2025. This theme was built in July 2025, after the farm closed.

## Install and first run

Not maintained. No supported install path.

What was tried on 2026-09-10 with Node v26.5.0 and npm 11.17.0:

```
npm ci --ignore-scripts
# fails: ERESOLVE, eslint-config-airbnb@19 wants eslint 7 or 8, package.json pins eslint ^9

npm ci --ignore-scripts --legacy-peer-deps
# added 1348 packages in 5s

npm run build
# fails: Module not found: Can't resolve 'foundation-sites/js/foundation/foundation'

npm test
# Test Suites: 13 failed, 13 total (SyntaxError: Cannot use import statement outside a module)
```

Nothing builds or passes tests from the checked-in lockfile.

## What runs today

Nothing is maintained.

What the repository holds:

- `templates/` : 211 Handlebars templates (components, layout, pages) for a Stencil storefront.
- `assets/scss/` : 225 SCSS files. `assets/js/` : 97 JavaScript files, including the Cornerstone theme scripts and the added `performance-optimization.js`, `sw.js` service worker and `offline.html`.
- `lang/` : 20 storefront language files.
- `config.json`, `schema.json`, `manifest.json` : theme settings for the BigCommerce theme editor. Theme name in `config.json` is "Southwest Mushrooms - CroweOS Design", version 1.4.0.
- `meta/` : five theme preview screenshots.
- `swm-header.svg` : the store header graphic (1.8 MB).
- About 45 Markdown status reports and checklists from the July 2025 deploy, plus three shell scripts for the Stencil CLI.
- `CHANGELOG.md` : the upstream Cornerstone changelog.

Three pull requests were open on 2026-09-10 (a Dependabot bump, a performance branch, and a compare request). They are left as they were.

## Limits

- This is a storefront theme. It contains no cultivation, food-safety or health guidance and must not be read as any.
- Templates embed a chat iframe from `app.crowelogic.ai`. That host did not resolve on 2026-09-10. The chat code is not part of this repository.
- `secrets.stencil.json` holds a Stencil access token committed in 2025. Treat it as exposed and rotate it in the BigCommerce control panel before using this repository for anything.
- The store URL in `config.stencil.json` still resolves, but the page served there on 2026-09-10 carried none of this theme's BigCommerce asset paths. Do not assume the live site runs this code.

## License and contact

No license file. `package.json` declares MIT but no LICENSE file is present in the repository.

Contact: michael@crowelogic.com
