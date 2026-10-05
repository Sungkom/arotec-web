# Arotec static language pilot — local, unpublished

This additive pilot contains four content pages in five languages, five factual
draft storage-policy pages, and a neutral language chooser. Original documents,
translation catalogs, fonts, styles and the pending circle repair are preserved.
The pilot deliberately omits the old shell/i18n renderer after freezing its
reviewed rendered content, so language URLs and metadata remain authoritative.

Configuration: `seo/localized-seo.json` controls current canonical base, routes,
localized metadata and UI labels. `seo/cookie-policies.json` controls factual
policy content. `seo/source-snapshots/` contains rendered content from the existing
catalogs, not newly invented scientific claims. `seo/source-input-hashes.json`
binds those snapshots to their reviewed source inputs; rebuild refuses changed
source or manually edited generated files. Original input files are never written.

Rebuild reviewed inputs: `python tools/build-multilingual-seo.py`.
For source/catalog changes, run a read-only local server, then
`node tools/capture-multilingual-seo.cjs http://127.0.0.1:PORT/ SNAPSHOT_DIR` with
Playwright available. `AROTEC_PLAYWRIGHT_MODULE` and `AROTEC_CHROME_PATH` can point
to the installed runtime. The capture blocks API calls and Render requests.
Review the new snapshots, metadata, typography and source fingerprints before
replacing the approved input set; this is an intentional content-review gate.

`seo/generated-manifest.json` owns only generated output. The generator checks
every existing owned file before regenerating, preserving manual edits instead
of silently replacing them. Additive JS/CSS and these input/tool files remain
separate from that output manifest.

All current canonical/hreflang/sitemap URLs use
https://sungkom.github.io/arotec-web/ . A later authorized domain migration should
change the single canonicalBase and regenerate, then verify URLs/redirects and
deployment independently. This work creates no CNAME, DNS change, provider setting,
tracking account, root-host robots file or production deployment. The project
subdirectory sitemap can be submitted later; `/arotec-web/robots.txt` is not the
host-root robots file and is intentionally not created.

Preview entry: `languages.html`, or `th/index.html`, `en/index.html`, `ja/index.html`,
`zh-Hans/index.html`, `zh-Hant/index.html`. Language links are real anchors and
content is present with JavaScript disabled. Explicit locale URLs always win;
only the neutral chooser can use a remembered preference. Storage is optional,
off by default and saved only after a deliberate choice. Its 180-day expiry is
enforced by the application; localStorage itself has no automatic expiry.

The contact/newsletter controls do not submit in this static pilot. Existing
source-confirmed email links remain usable; no inquiry or delivery test was sent.
Policy drafts identify Google Fonts requests and exclude unrelated legacy/admin
features from their scope. Owner/legal decisions are listed separately.
