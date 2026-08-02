# The Hot Method

Standalone Eleventy graduation roster for The Hot Method — Strong Hot Pilates.
The site supports multiple equal-weight batches and links to eboonad for program
information, upcoming workshops, and Nadya Rudianto.

## Local development

```sh
npm install
npm start
```

The local site is served at <http://localhost:4180/>.

## Validation

```sh
npm test
```

`npm test` builds the site and runs structural, content, accessibility, and
local-asset checks.

## Project shape

- `src/_data/` — canonical site, batch, graduate, and source-mapped copy data
- `src/_includes/` — layouts and reusable markup
- `src/public/media/` — local, attributable media
- `docs/` — product decisions and source provenance
- `test/` — generated-site checks
- `_site/` — generated output; never edit directly

Eleven graduate portraits come from the labelled Bentang Bahagia x Ashta
proposal. Noor Anugrahandina's portrait comes from the owner-provided Google
Photos file `IMG_4650.jpg`, identified by the owner on 2 Aug 2026.

## GitHub Pages review

The review build is published at <https://pjgeutjens.github.io/hotmethod/> and
is marked `noindex, nofollow`. Its project-path asset URLs are generated with:

```sh
npm run build:pages
```

After an authorized source push, publish the generated `gh-pages` branch with:

```sh
npm run deploy:pages
```

## Production

The canonical, indexable site is <https://hotmethod.eboonad.com/>. It is served
as static files by Caddy on the shared eboonad VPS. After an authorized release:

```sh
deploy/vps.sh pgs@91.107.203.134
```

The one-time Caddy setup and complete verification checklist are documented in
[`docs/deploy/VPS-SETUP.md`](docs/deploy/VPS-SETUP.md).
