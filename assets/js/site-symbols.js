(() => {
  'use strict';
  if (window.ArotecSiteSymbols) { window.ArotecSiteSymbols.refresh(); return; }
  const NS = 'http://www.w3.org/2000/svg';
  const PREFIX = 'data-arotec-operator-';
  const SYMBOL = /[+=\u00d7\u2715\u2716\u2a2f]/u;
  const states = new Set(), tracked = new WeakMap(), layers = new WeakSet(), resizeTargets = new Map();
  let observer, rootObserver, headObserver, resizeObserver, frame = 0, scanNeeded = true, runs = 0;
  const context = document.createElement('canvas').getContext('2d');
  const reviewedInlineSelectors = /* Source-reviewed inline owners; symbols only, never ordinary x. */ [
  "#direct-skin-impact > div.nss-shell.nss-direct-canvas > ol.nss-direct-cards > li.nss-direct-card:nth-of-type(2) > p > sup",
  "#movement > div.exb-intro:nth-of-type(2) > p.exb-eyebrow:nth-of-type(1)",
  "#dose-recovery > div.exb-recovery-bottom:nth-of-type(2) > div.exb-recovery-grid:nth-of-type(1) > article:nth-of-type(2) > p",
  "#context > div.esh-reference-frame > div.esh-context-scene > header.esh-reference-copy > div.esh-reference-eyebrow",
  "html > body > p > a",
  "#strategy-to-life > div.as-service-grid:nth-of-type(2) > article:nth-of-type(4) > div.as-service-copy > ul > li:nth-of-type(5)",
  "#autonomic-overview > aside.an-callout > p.an-footnote",
  "#scientific-principles > aside.an-callout > p.an-footnote",
  "#regulation-cycle > aside.an-callout > p.an-footnote",
  "#why-bio-responsive > div.bri-container.bri-container--wide:nth-of-type(2) > div.bri-comparison:nth-of-type(1) > article.bri-comparison-card:nth-of-type(1) > div.bri-equation > p > span",
  "#why-bio-responsive > div.bri-container.bri-container--wide:nth-of-type(2) > div.bri-comparison:nth-of-type(1) > article.bri-comparison-card.bri-comparison-card--responsive:nth-of-type(2) > div.bri-equation > p > span",
  "#pathway > div.ml-frame > article.ml-panel.ml-modulation-panel:nth-of-type(2) > div.ml-modulation-body:nth-of-type(1) > div.ml-branches:nth-of-type(4) > div:nth-of-type(1) > p",
  "#bio-responsive-modulation > div.mx-panel.mx-modulation-panel:nth-of-type(2) > div.mx-signal-diagram:nth-of-type(1) > div.mx-calcium:nth-of-type(4) > span.mx-node:nth-of-type(3) > sup",
  "#ingredient-systems > div.bri-frame > header.bri-header > p.bri-kicker:nth-of-type(1)",
  "#olfactiva-interface > div.ols-panel-label:nth-of-type(1) > small",
  "#olfactiva-pathway > div.ols-panel-label:nth-of-type(1) > small",
  "#travion-ingredients > div.tvs-frame > aside.tvs-rail > p.tvs-eyebrow.tvs-chapter-number:nth-of-type(1) > span",
  "#travion-mechanisms > div.tvs-frame > aside.tvs-rail > p.tvs-eyebrow.tvs-chapter-number:nth-of-type(1) > span",
  "#travion-barrier > div.tvs-frame > aside.tvs-rail > p.tvs-eyebrow.tvs-chapter-number:nth-of-type(1) > span",
  "#travion-benefits > div.tvs-frame > aside.tvs-rail > p.tvs-eyebrow.tvs-chapter-number:nth-of-type(1) > span",
  "#meraxyl-mechanism > div.mxs-frame > div.mxs-content > section.mxs-panel.mxs-mechanism:nth-of-type(1) > div.mxs-pathways:nth-of-type(2) > section.mxs-pathway:nth-of-type(1) > div.mxs-pathway-body > figure.mxs-channel-figure > figcaption > span > sup:nth-of-type(1)",
  "#meraxyl-mechanism > div.mxs-frame > div.mxs-content > section.mxs-panel.mxs-mechanism:nth-of-type(1) > div.mxs-pathways:nth-of-type(2) > section.mxs-pathway:nth-of-type(1) > div.mxs-pathway-body > ul.mxs-results > li:nth-of-type(1) > span > sup:nth-of-type(1)",
  "#meraxyl-mechanism > div.mxs-frame > div.mxs-content > section.mxs-panel.mxs-mechanism:nth-of-type(1) > div.mxs-pathways:nth-of-type(2) > section.mxs-pathway:nth-of-type(2) > div.mxs-pathway-body > figure.mxs-channel-figure > figcaption > span > sup",
  "#meraxyl-mechanism > div.mxs-frame > div.mxs-content > section.mxs-panel.mxs-mechanism:nth-of-type(1) > div.mxs-pathways:nth-of-type(2) > section.mxs-pathway:nth-of-type(2) > div.mxs-pathway-body > ul.mxs-results.mxs-results--three > li:nth-of-type(2) > span > sup",
  "#meraxyl-response > div.mxs-frame > div.mxs-content > section.mxs-panel.mxs-modulation:nth-of-type(2) > div.mxs-panel-inner:nth-of-type(2) > div.mxs-modulation-flow:nth-of-type(1) > div.mxs-calcium:nth-of-type(3) > span.mxs-signal:nth-of-type(2) > sup",
  "#cortiva-ingredients > div.cv-frame > div.cv-content > div.cv-section-heading > p.cv-eyebrow.cv-tagline:nth-of-type(2)",
  "#cortiva-modulation > div.cv-frame > div.cv-content > div.cv-section-heading > p.cv-eyebrow.cv-tagline:nth-of-type(2)",
  "#cortiva-benefits > div.cv-frame > div.cv-content > div.cv-section-heading:nth-of-type(1) > p.cv-eyebrow.cv-tagline",
  "#melacor-ingredients > div.ml-frame > div.ml-content > p.ml-section-kicker.ml-eyebrow:nth-of-type(1) > span",
  "#morphagen-ingredients > div.mgs-frame > aside.mgs-rail > div.mgs-rail-footer > p.mgs-eyebrow:nth-of-type(1)",
  "#morphagen-pathways > div.mgs-frame > aside.mgs-rail > div.mgs-rail-footer > p.mgs-eyebrow:nth-of-type(1)",
  "#morphagen-signaling > div.mgs-frame > aside.mgs-rail > div.mgs-rail-footer > p.mgs-eyebrow:nth-of-type(1)",
  "#morphagen-benefits > div.mgs-frame > aside.mgs-rail > div.mgs-rail-footer > p.mgs-eyebrow:nth-of-type(1)",
  "#hydration-recovery > div.sp-container > div.sp-split:nth-of-type(1) > div.dswb-copy.dswb-study-copy:nth-of-type(1) > ul > li:nth-of-type(1)",
  "#metabolism-composition > div.sp-container > div.sp-split.ss-reverse:nth-of-type(1) > div.dswb-copy.dswb-study-copy:nth-of-type(1) > ul > li:nth-of-type(1)",
  "#metabolism-composition > div.sp-container > div.dswb-study-evidence:nth-of-type(2) > figure.dswb-result > figcaption",
  "#skin-research > div.sp-container > div.sp-split.ss-reverse:nth-of-type(1) > div.dswb-copy.dswb-study-copy:nth-of-type(1) > ul > li:nth-of-type(1)",
  "#skin-research > div.sp-container > div.dswb-study-evidence:nth-of-type(2) > figure.dswb-result > figcaption",
  "#global-expert-network > div.sfc-shell.wwa-grid > div.wwa-copy > p.wwa-body:nth-of-type(2)",
  "#global-expert-network > div.sfc-shell.wwa-grid > ul.gcp-facts:nth-of-type(2) > li:nth-of-type(1)",
  "#beyond-supply > div.hwcv-supply-content:nth-of-type(2) > div.hwcv-supply-copy > ul.hwcv-supply-facts:nth-of-type(2) > li:nth-of-type(1)",
  "#direct-skin-impact > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s3 > div.direct-main-grid > div.direct-right-stack:nth-of-type(2) > article.neuro-card.signaling-card:nth-of-type(1) > div.signaling-list > span:nth-of-type(6) > sup",
  "#ebii-sadi > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s5 > div.sadi-main-flow:nth-of-type(1) > article.neuro-card.ebii-card:nth-of-type(1) > div.mini-formula",
  "#ebii-sadi > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s5 > div.sadi-main-flow:nth-of-type(1) > article.neuro-card.dshs-card:nth-of-type(3) > div.vertical-formula > b",
  "#ebii-sadi > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s5 > div.sadi-main-flow:nth-of-type(1) > article.neuro-card.dshs-card:nth-of-type(3) > p:nth-of-type(3)",
  "#ebii-sadi > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s5 > div.sadi-main-flow:nth-of-type(1) > article.neuro-card.sadi-card:nth-of-type(5) > div.vertical-formula > b",
  "#ebii-sadi > div.infographic-scroll:nth-of-type(2) > div.infographic-stage.stage-s5 > div.sadi-main-flow:nth-of-type(1) > article.neuro-card.sadi-card:nth-of-type(5) > div.vertical-formula > span.fraction > i:nth-of-type(1)",
  "#mechanisms > div.np26-mechanisms-stage > div.np26-mechanisms-grid:nth-of-type(2) > div.np26-mechanisms-core > article.np26-signaling:nth-of-type(1) > ol.np26-molecular-sequence > li:nth-of-type(1) > span.np26-molecule > sup",
  "#main > section.sakae-section.sakae-history:nth-of-type(3) > div.sakae-container.sakae-split.sakae-split--history > div.sakae-copy > p.sakae-eyebrow:nth-of-type(1)",
  "#multisensory-title-2",
  "#multisensory-title-3",
  "#multisensory-title-4",
  "#multisensory-title-5",
  "#sl-brand-touchpoints > div.sv-content > ol.sv-cards.sv-flow > li.sv-card:nth-of-type(5) > h3",
  "#sl-bringing-it-to-life-cards > li.sv-card:nth-of-type(4) > ul.sv-offers > li:nth-of-type(5) > span",
  "#sl-online-offline-title",
  "#how-we-measure > div.ss-canvas > ol.ss-protocol > li:nth-of-type(1) > p",
  "#readings-to-indices > div.ss-canvas > div.ss-copy:nth-of-type(1) > div.ss-delta > div.ss-formula:nth-of-type(1) > strong",
  "#readings-to-indices > div.ss-canvas > div.ss-copy:nth-of-type(1) > div.ss-delta > div.ss-formula:nth-of-type(1) > span.ss-fraction:nth-of-type(1) > span:nth-of-type(2)",
  "#readings-to-indices > div.ss-canvas > div.ss-copy:nth-of-type(1) > div.ss-delta > div.ss-formula:nth-of-type(1) > span:nth-of-type(2)",
  "#readings-to-indices > div.ss-canvas > div.ss-copy:nth-of-type(1) > div.ss-delta > div.ss-formula.ss-control-correction:nth-of-type(2) > span",
  "#readings-to-indices > div.ss-canvas > div.ss-equation.ss-equation-lfi:nth-of-type(2) > div.ss-formula > strong",
  "#readings-to-indices > div.ss-canvas > div.ss-equation.ss-equation-lfi:nth-of-type(2) > div.ss-formula > span:nth-of-type(1)",
  "#readings-to-indices > div.ss-canvas > div.ss-equation.ss-equation-pgi:nth-of-type(3) > div.ss-formula.ss-prediction:nth-of-type(1) > span",
  "#readings-to-indices > div.ss-canvas > div.ss-equation.ss-equation-pgi:nth-of-type(3) > div.ss-formula:nth-of-type(2) > strong",
  "#readings-to-indices > div.ss-canvas > div.ss-equation.ss-equation-pgi:nth-of-type(3) > div.ss-formula:nth-of-type(2) > span:nth-of-type(1)",
  "#sleep-beauty > div.insights-hero-copy > p.insights-eyebrow:nth-of-type(1)",
  "#sleep-health > div.sh-scene > header.sh-intro.sh-intro-left > p.sh-eyebrow:nth-of-type(1)",
  "#two-forces > div.sh-scene:nth-of-type(1) > header.sh-intro.sh-intro-left > p.sh-subtitle:nth-of-type(1)",
  "#burden-mobile-diagram > figcaption.shm-mobile-diagram-actions > div.shm-mobile-diagram-text.shm-burden-text > div > div:nth-of-type(3) > div:nth-of-type(2) > p:nth-of-type(2)",
  "#biological-burden > div.sh-scene > div.sh-burden-detail:nth-of-type(3) > div.sh-load-copy:nth-of-type(2) > p.sh-equation:nth-of-type(2)",
  "#dementia-multisensory-content > section.sip-dementia-chapter:nth-of-type(3) > div.sip-dementia-clinical:nth-of-type(1) > section.sip-dementia-evidence > div.sip-dementia-table-wrap > table.sip-dementia-table > tbody > tr:nth-of-type(4) > td:nth-of-type(1)",
  "#dementia-multisensory-content > section.sip-dementia-chapter:nth-of-type(3) > div.sip-dementia-clinical:nth-of-type(1) > section.sip-dementia-evidence > div.sip-dementia-table-wrap > table.sip-dementia-table > tbody > tr:nth-of-type(4) > td:nth-of-type(2)",
  "#dementia-multisensory-content > section.sip-dementia-chapter:nth-of-type(3) > div.sip-dementia-clinical:nth-of-type(1) > section.sip-dementia-evidence > div.sip-dementia-table-wrap > table.sip-dementia-table > tbody > tr.sip-dementia-outcome-uncertain:nth-of-type(5) > td:nth-of-type(2)",
  "#dementia-multisensory-content > section.sip-dementia-chapter:nth-of-type(3) > div.sip-dementia-clinical:nth-of-type(1) > section.sip-dementia-evidence > p.sip-dementia-table-note",
  "#main > section.cf-scene.cf-science:nth-of-type(3) > div.cf-stage:nth-of-type(1) > div.cf-stage-copy > p.cf-lead",
  "#delicious > div.he-equation:nth-of-type(2) > p:nth-of-type(1)",
  "#delicious > div.he-equation:nth-of-type(2) > p.he-equation-result:nth-of-type(2)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > thead > tr > th:nth-of-type(2)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(1) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(3) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(4) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(5) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(6) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(7) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-panel.wa-lineup-standard:nth-of-type(1) > div.wa-product-grid.wa-lineup-standard-grid:nth-of-type(2) > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(8) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > thead > tr > th:nth-of-type(2)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(1) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(3) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(4) > td:nth-of-type(1)",
  "#product-lineup > div.sp-container > article.wa-lineup-sem:nth-of-type(2) > div.wa-lineup-sem-content > div.wa-table-wrap:nth-of-type(2) > table > tbody > tr:nth-of-type(5) > td:nth-of-type(1)",
  "#what-defines-us > div.wwd-facts:nth-of-type(2) > article.wwd-fact:nth-of-type(1) > h3"
];
  const textSelectors = [
    '.arotec-storage__close', '[data-ingredient-plus]', '[data-cart-inc]', '[data-close-checkout]',
    '.explore-dialog .dialog-close > span', '.sadi-formula-card .formula > span',
    '.native-neuro-plus', '#neurodegeneration .neuro-flow > .plus', '.sf-formula__row > b', '.mxs-channel-figure sup', '.mxs-results sup',
    '.nav-sublink', '.mobile-nav-sublink', '.cart-item > div > p',
    ...reviewedInlineSelectors
  ];
  const iconSelector = [
    '#ca-close-dialog > .ph-x', '#ct-close > .ph-x', '.ju-dialog-close > .ph-x', '.partner-close > .ph-x',
    '#outcomes .exo-equation > .ph-x', '#outcomes .exo-equation > .ph-equals',
    '.sn-neuro-contributors .ph-plus.sn-neuro-connector', '.sm-formula > .ph-x', '.sm-formula > .ph-equals',
    '.sip-dementia-result--unestablished .ph-x-circle', '#cosmetics .dswa-research .ph-plus-circle'
  ].join(',');
  const closeSelector = '#menuClose > .icon-svg,#searchClose > .icon-svg,[data-static-menu-close] > .icon-svg,[data-close-cart] > svg';
  const mathSelector = '#ebii-details .exo-model-math math mo,#adi-model .hla-adi-equation math mo';
  const set = (el, name, value) => { value = String(value); if (el.getAttribute(name) !== value) el.setAttribute(name, value); };
  const style = (el, name, value, priority = '') => { if (el.style.getPropertyValue(name) !== value || el.style.getPropertyPriority(name) !== priority) el.style.setProperty(name, value, priority); };
  const shape = value => value === '+' ? 'plus' : value === '=' ? 'equals' : 'cross';
  function owned(el) { return el?.nodeType === 1 && (el.hasAttribute(PREFIX + 'layer') || el.localName?.startsWith('arotec-operator-')); }
  function observe() { observer?.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-expanded'] }); }
  function schedule(scan = true) { scanNeeded ||= scan; if (!frame) frame = requestAnimationFrame(run); }
  function cssScale(el) {
    let x = 1, y = 1, rotation = false;
    for (let p = el; p; p = p.parentElement) {
      const s = getComputedStyle(p), zoom = parseFloat(s.zoom) || 1;
      x *= zoom; y *= zoom;
      if (s.transform && s.transform !== 'none') {
        try { const m = new DOMMatrixReadOnly(s.transform); x *= Math.hypot(m.a, m.b); y *= Math.hypot(m.c, m.d); rotation ||= Math.abs(m.b) > .0001 || Math.abs(m.c) > .0001; } catch (_) {}
      }
      if (s.scale && s.scale !== 'none') { const v = s.scale.split(/\s+/).map(Number); x *= Math.abs(v[0]) || 1; y *= Math.abs(v[1] ?? v[0]) || 1; }
    }
    return { x, y, value: Math.max(.0001, (x + y) / 2), uniform: Math.abs(x - y) < .002 && !rotation };
  }
  function svgLayer(kind) {
    const svg = document.createElementNS(NS, 'svg');
    set(svg, PREFIX + 'layer', kind); set(svg, 'aria-hidden', 'true'); set(svg, 'focusable', 'false');
    style(svg, 'left', '0px', 'important'); style(svg, 'top', '0px', 'important'); layers.add(svg); return svg;
  }
  function positionHost(state, host) {
    if (getComputedStyle(host).position === 'static') { state.positioned = host; state.oldPosition = host.style.position; style(host, 'position', 'relative'); }
  }
  function resizeTarget(state, target) {
    while (target && (getComputedStyle(target).display.startsWith('inline') || getComputedStyle(target).display === 'contents')) target = target.parentElement;
    if (state.resizeTarget === target) return;
    if (state.resizeTarget) { const count = resizeTargets.get(state.resizeTarget) - 1; if (count > 0) resizeTargets.set(state.resizeTarget, count); else { resizeObserver?.unobserve(state.resizeTarget); resizeTargets.delete(state.resizeTarget); } }
    state.resizeTarget = target;
    if (target) { const count = resizeTargets.get(target) || 0; if (!count) resizeObserver?.observe(target); resizeTargets.set(target, count + 1); }
  }
  function register(host, original, kind, container = host) {
    if (tracked.has(host)) {
      const state = tracked.get(host); state.original = original; state.kind = kind;
      set(host, PREFIX + 'kind', kind);
      if (state.container !== container) { state.container = container; container.append(state.svg); positionHost(state, container); resizeTarget(state, container); }
      return state;
    }
    const svg = svgLayer(kind), state = { host, original, kind, container, svg, active: false, reason: 'unmeasured' };
    if (kind !== 'math' && kind !== 'medical') positionHost(state, host); else positionHost(state, container);
    container.append(svg); set(host, PREFIX + 'kind', kind); tracked.set(host, state); states.add(state);
    resizeTarget(state, container);
    return state;
  }
  function prepareToken(host) {
    const source = host.querySelector(':scope > arotec-operator-source');
    if (!source || source.children.length || !/^[+=\u00d7\u2715\u2716\u2a2f]$/u.test(source.textContent)) { if (tracked.has(host)) remove(tracked.get(host)); else { host.removeAttribute(PREFIX + 'active'); host.removeAttribute(PREFIX + 'kind'); } return; }
    const existing = tracked.get(host); if (existing) existing.original = source.textContent; else register(host, source.textContent, 'text');
  }
  function prepareText(root) {
    if (!root || root.closest('script,style,textarea,input,select,[contenteditable="true"],svg,math,[data-arotec-operator-layer]')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) {
      if (!SYMBOL.test(node.data) || node.parentElement.closest('arotec-operator-text,script,style,textarea,input,select,[contenteditable="true"],svg,math')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
    for (const node of texts) {
      const run = document.createElement('arotec-operator-run'); set(run, PREFIX + 'owned', 'symbols');
      let plain = '';
      for (const char of node.data) {
        if (!SYMBOL.test(char)) { plain += char; continue; }
        if (plain) { run.append(document.createTextNode(plain)); plain = ''; }
        const token = document.createElement('arotec-operator-text'), source = document.createElement('arotec-operator-source');
        set(token, PREFIX + 'owned', 'symbols'); source.textContent = char; token.append(source); run.append(token);
      }
      if (plain) run.append(document.createTextNode(plain)); node.replaceWith(run);
      run.querySelectorAll('arotec-operator-text').forEach(prepareToken);
    }
  }
  function scan() {
    document.querySelectorAll('[' + PREFIX + 'kind]').forEach(host => {
      if (!tracked.has(host) && host.localName !== 'arotec-operator-text' && !host.matches(iconSelector + ',' + mathSelector + ',' + closeSelector)) {
        host.removeAttribute(PREFIX + 'active'); host.removeAttribute(PREFIX + 'kind');
        host.querySelectorAll('path[' + PREFIX + 'authored-style]').forEach(p => restoreClose({ paths: [p], saved: [authoredCloseStyle(p)] }, true));
      }
    });
    // A cloned source keeps its original text; copied decorative layers are discarded and rebuilt once.
    document.querySelectorAll('svg[' + PREFIX + 'layer]').forEach(svg => { if (!layers.has(svg)) svg.remove(); });
    document.querySelectorAll('arotec-operator-text').forEach(prepareToken);
    document.querySelectorAll(textSelectors.join(',')).forEach(prepareText);
    document.querySelectorAll(iconSelector).forEach(host => register(host, host.classList.contains('ph-equals') ? '=' : host.classList.contains('ph-plus') || host.classList.contains('ph-plus-circle') ? '+' : '\u00d7', host.classList.contains('ph-x-circle') || host.classList.contains('ph-plus-circle') ? 'ring' : 'icon'));
    document.querySelectorAll(mathSelector).forEach(host => { if (/^[+=\u00d7]$/u.test(host.textContent.trim())) register(host, host.textContent.trim(), 'math', host.closest('math').parentElement); });
    document.querySelectorAll(closeSelector).forEach(host => {
      if (!tracked.has(host)) { const paths = [...host.querySelectorAll(':scope > path')]; if (paths.length) { const state = { host, kind: 'svg-close', original: '\u00d7', paths, saved: paths.map(authoredCloseStyle), active: true }; states.add(state); tracked.set(host, state); set(host, PREFIX + 'kind', 'svg-close'); } }
    });
    document.querySelectorAll('use[href="#sn-i-cross"],use[xlink\\:href="#sn-i-cross"]').forEach(use => {
      const host = use.ownerSVGElement; if (!host || tracked.has(host)) return;
      const state = register(host, '+', 'medical', host.parentElement); state.symbolSource = document.querySelector('#sn-i-cross > path:nth-of-type(2)'); state.symbolOpacity = state.symbolSource?.style.opacity || '';
    });
  }
  function authoredCloseStyle(p) {
    const names = ['fill', 'stroke', 'stroke-width', 'vector-effect', 'filter'];
    let saved;
    try { saved = JSON.parse(p.getAttribute(PREFIX + 'authored-style')); } catch (_) {}
    if (!saved || !names.every(k => Array.isArray(saved[k]) && saved[k].length === 2 && saved[k].every(v => typeof v === 'string'))) saved = Object.fromEntries(names.map(k => [k, [p.style.getPropertyValue(k), p.style.getPropertyPriority(k)]]));
    const safe = Object.fromEntries(names.map(k => [k, saved[k]])); set(p, PREFIX + 'authored-style', JSON.stringify(safe)); return safe;
  }
  function restoreClose(state, forget = false) {
    state.paths.forEach((p, i) => {
      Object.entries(state.saved[i]).forEach(([name, [value, priority]]) => { if (value) style(p, name, value, priority); else if (p.style.getPropertyValue(name)) p.style.removeProperty(name); });
      if (forget) p.removeAttribute(PREFIX + 'authored-style');
    });
  }
  function deactivate(state, reason) {
    state.active = false; state.reason = reason; if (state.slotSignature) { state.host.style.removeProperty('padding-right'); state.host.style.removeProperty('padding-left'); state.slotSignature = ''; state.slotWidth = 0; state.slotAdjustment = 0; } state.host.removeAttribute(PREFIX + 'active');
    if (state.kind === 'svg-close') restoreClose(state);
    if (state.svg) style(state.svg, 'display', 'none', 'important');
    if (state.symbolSource) style(state.symbolSource, 'opacity', state.symbolOpacity);
  }
  function remove(state) {
    deactivate(state, 'removed');
    if (state.kind === 'svg-close') restoreClose(state, true);
    state.svg?.remove(); state.host.removeAttribute(PREFIX + 'active'); state.host.removeAttribute(PREFIX + 'kind');
    if (state.positioned?.style.position === 'relative') state.positioned.style.position = state.oldPosition;
    resizeTarget(state, null); states.delete(state); tracked.delete(state.host);
  }
  function minimumSuperscriptSlot(state, scale) {
    const host = state.host;
    if (state.kind !== 'text') return;
    // These two reviewed compact formula/table owners use the same measured
    // minimum slot; any line wrap or containing-box resize keeps source paint.
    const compactFormula = state.original === '\u00d7' && host.closest('#ebii-sadi .mini-formula');
    const compactInline = compactFormula || (state.original === '+' && host.closest('.sip-dementia-table'));
    if (!host.closest('sup') && !compactInline) {
      if (state.slotSignature) { host.style.removeProperty('padding-right'); host.style.removeProperty('padding-left'); state.slotSignature = ''; state.slotWidth = 0; }
      return;
    }
    let block = host.parentElement;
    while (block && (getComputedStyle(block).display.startsWith('inline') || getComputedStyle(block).display === 'contents' || ['SUP', 'SUB'].includes(block.tagName))) block = block.parentElement;
    block = host.closest('figcaption,li,p,td,th,button') || block;
    if (!block) return;
    const font = getComputedStyle(host).font;
    const signature = [font, scale.value.toFixed(5), block.clientWidth, innerWidth, state.original, block.textContent].join('|');
    if (state.slotSignature === signature) return;
    state.slotSignature = signature; state.slotWidth = 0; state.slotAdjustment = 0; host.style.removeProperty('padding-right'); host.style.removeProperty('padding-left');
    const source = host.querySelector(':scope > arotec-operator-source'); if (!source) return;
    const range = document.createRange(); range.selectNodeContents(source); const original = range.getBoundingClientRect();
    if (original.height < 7.95 || original.width <= 0 || !scale.uniform) return;
    const availablePaint = compactInline ? metricBox(state, scale).width * scale.value : original.width;
    if (compactInline && availablePaint >= (compactFormula ? 7.85 : 7.95)) return;
    const extra = Math.max(0, 8 - availablePaint);
    const rect = block.getBoundingClientRect(), scrollWidth = block.scrollWidth;
    const textBaselines = () => {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('svg,script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
      const points = []; let node;
      while ((node = walker.nextNode())) for (let i = 0; i < node.length; i++) {
        if (/\s/.test(node.data[i])) continue;
        const part = document.createRange(); part.setStart(node, i); part.setEnd(node, i + 1); const b = part.getBoundingClientRect(); points.push([b.y, b.height]);
      }
      return points;
    };
    const before = textBaselines();
    const leftClearance = compactInline ? 0 : 1.5;
    if (leftClearance) style(host, 'padding-left', `${leftClearance / scale.value}px`);
    if (extra) style(host, 'padding-right', `${extra / scale.value}px`);
    const after = textBaselines(), next = block.getBoundingClientRect();
    state.slotDiagnostic = { owner: block.localName + '.' + block.className, sourceWidth: original.width, sourceHeight: original.height, before: [rect.width, rect.height, scrollWidth], after: [next.width, next.height, block.scrollWidth], changedBaselines: before.filter((b, i) => !after[i] || Math.abs(b[0] - after[i][0]) >= .05 || Math.abs(b[1] - after[i][1]) >= .05).length };
    const safe = Math.abs(next.width - rect.width) < .05 && Math.abs(next.height - rect.height) < .05 && block.scrollWidth <= scrollWidth && before.length === after.length && before.every((b, i) => Math.abs(b[0] - after[i][0]) < .05 && Math.abs(b[1] - after[i][1]) < .05);
    if (!safe) { host.style.removeProperty('padding-right'); host.style.removeProperty('padding-left'); state.slotReason = 'minimum-slot-would-wrap-or-resize-containing-line'; return; }
    state.slotWidth = (compactInline ? original.width + extra : 8) / scale.value; state.slotAdjustment = extra + leftClearance; state.slotReason = 'minimum-slot-preserves-font-baselines-and-containing-line';
  }
  function metricBox(state, scale) {
    const host = state.host, s = getComputedStyle(host), rect = host.getBoundingClientRect();
    let box = { x: 0, y: 0, width: rect.width / scale.value, height: rect.height / scale.value };
    const fontSize = parseFloat(s.fontSize) || 16;
    if (state.kind === 'text' || state.kind === 'math') {
      const source = state.kind === 'text' ? host.querySelector(':scope > arotec-operator-source') : host;
      if (!source || source.textContent !== state.original) return null;
      const range = document.createRange(); range.selectNodeContents(source); const r = range.getBoundingClientRect();
      context.font = `${s.fontStyle} ${s.fontWeight} ${fontSize}px ${s.fontFamily}`;
      const m = context.measureText(state.original), asc = m.fontBoundingBoxAscent || fontSize * .8, desc = m.fontBoundingBoxDescent || fontSize * .2;
      const inkW = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), inkH = (m.actualBoundingBoxAscent || fontSize * .55) + (m.actualBoundingBoxDescent || 0);
      const centerY = (r.y - rect.y) / scale.value + (r.height / scale.value - asc - desc) / 2 + asc - ((m.actualBoundingBoxAscent || fontSize * .55) - (m.actualBoundingBoxDescent || 0)) / 2;
      // The existing whitespace around an inline operator can hold a clearer symbol
      // without changing advances, line breaks or any neighbouring glyph.
      const space = (node, end) => {
        if (state.kind !== 'text' || node?.nodeType !== Node.TEXT_NODE) return 0;
        const match = node.data.match(end ? /\s+$/ : /^\s+/); if (!match) return 0;
        const part = document.createRange(), count = match[0].length;
        part.setStart(node, end ? node.length - count : 0); part.setEnd(node, end ? node.length : count);
        const gap = part.getBoundingClientRect();
        return Math.abs(gap.y - r.y) < r.height * .4 ? Math.max(0, gap.width / scale.value - 1 / scale.value) : 0;
      };
      const leftSpace = space(host.previousSibling, true), rightSpace = space(host.nextSibling, false);
      const advance = Math.max(r.width / scale.value, state.slotWidth || 0);
      const width = Math.min(advance + leftSpace + rightSpace, Math.max(inkW, 8 / scale.value));
      const extra = Math.max(0, width - advance), leftExtra = Math.min(leftSpace, Math.max(extra / 2, extra - rightSpace));
      const height = Math.min(r.height / scale.value, Math.max(inkH, 8 / scale.value));
      box = { x: (r.x - rect.x) / scale.value + (width > advance ? -leftExtra : (advance - width) / 2), y: centerY - height / 2, width, height, availableWidth: (advance + leftSpace + rightSpace) * scale.value, inkWidth: inkW * scale.value, inkHeight: inkH * scale.value };
      // Superscripts may use less than 8px of real space. Never let the enlarged paint invade a neighbouring charge/digit.
      if (host.closest('sup') && !state.slotWidth && (inkW * scale.value < 8 || inkH * scale.value < 8)) box.tooSmall = true;
    } else if (state.kind === 'icon' || state.kind === 'ring') {
      const size = parseFloat(getComputedStyle(host, '::before').fontSize) || fontSize;
      const extent = Math.min(box.width, size) * (state.kind === 'ring' ? .5 : .72);
      const height = state.original === '=' ? Math.min(box.height, Math.max(8 / scale.value, extent * .45)) : extent;
      box = { x: (box.width - extent) / 2, y: (box.height - height) / 2, width: extent, height };
    } else if (state.kind === 'medical') {
      const extent = Math.min(box.width, box.height) * 28 / 64;
      box = { x: (box.width - extent) / 2, y: (box.height - extent) / 2, width: extent, height: extent };
    }
    return { ...box, rect, fontSize, style: s };
  }
  function draw(state, box, scale) {
    const svg = state.svg; style(svg, 'display', 'block', 'important');
    const value = scale.value, w = box.width, h = box.height;
    const channels = box.style.color.match(/[\d.]+/g)?.map(Number) || [0, 0, 0];
    const dark = (channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722) / 255 > .75;
    const pad = 1.5 / value, keyline = dark;
    const x1 = pad, x2 = w - pad, y1 = pad, y2 = h - pad;
    const d = state.original === '+' ? `M${w / 2} 0V${h}M0 ${h / 2}H${w}` : state.original === '=' ? `M0 ${pad}H${w}M0 ${h - pad}H${w}` : `M${x1} ${y1}L${x2} ${y2}M${x2} ${y1}L${x1} ${y2}`;
    const paintCount = keyline ? 2 : 1;
    if (svg.children.length !== paintCount) {
      svg.replaceChildren();
      if (keyline) { const p = document.createElementNS(NS, 'path'); set(p, PREFIX + 'keyline', 'true'); svg.append(p); }
      svg.append(document.createElementNS(NS, 'path'));
    }
    for (const p of svg.children) {
      set(p, 'd', d);
      const halo = p.hasAttribute(PREFIX + 'keyline');
      style(p, 'stroke', halo ? '#ffffff' : '#113568', 'important');
      style(p, 'stroke-width', `${(halo ? 5 : 3) / value}px`, 'important');
      style(p, 'fill', 'none', 'important'); style(p, 'vector-effect', 'non-scaling-stroke', 'important');
      style(p, 'stroke-linecap', state.original === '+' || state.original === '=' ? 'butt' : 'round', 'important');
    }
    set(svg, PREFIX + 'shape', shape(state.original)); set(svg, 'viewBox', `0 0 ${w} ${h}`);
    set(svg, 'width', w); set(svg, 'height', h);
    style(svg, '--arotec-operator-stroke', `${3 / value}px`); style(svg, '--arotec-operator-keyline-stroke', `${5 / value}px`);
    style(svg, 'width', `${w}px`, 'important'); style(svg, 'height', `${h}px`, 'important');
    // Inline containing blocks do not necessarily start at their DOMRect's top.
    // Align the actual decorative box to the measured glyph box, without touching text layout.
    const painted = svg.getBoundingClientRect();
    const dx = (box.rect.x + box.x * value - painted.x) / value;
    const dy = (box.rect.y + box.y * value - painted.y) / value;
    if (Math.abs(dx) > .025 / value) style(svg, 'left', `${((parseFloat(svg.style.left) || 0) + dx).toFixed(5)}px`, 'important');
    if (Math.abs(dy) > .025 / value) style(svg, 'top', `${((parseFloat(svg.style.top) || 0) + dy).toFixed(5)}px`, 'important');
    style(svg, 'visibility', 'visible'); state.keyline = keyline;
  }
  function layout() {
    for (const state of states) {
      const host = state.host;
      if (!host.isConnected) { remove(state); continue; }
      const scale = cssScale(host); state.scale = scale;
      if (state.kind === 'svg-close') {
        if (!host.matches(closeSelector)) { remove(state); continue; }
        if (!scale.uniform) { deactivate(state, 'non-uniform-transform'); continue; }
        const rect = host.getBoundingClientRect(); state.active = rect.width > 0 && rect.height > 0 && scale.uniform;
        for (const p of state.paths) { style(p, 'fill', 'none', 'important'); style(p, 'stroke', '#113568', 'important'); style(p, 'stroke-width', `${3 / scale.value}px`, 'important'); style(p, 'vector-effect', 'non-scaling-stroke', 'important'); style(p, 'filter', 'drop-shadow(0 0 1px white)', 'important'); }
        state.reason = state.active ? '' : 'not-rendered'; continue;
      }
      if ((state.kind === 'icon' || state.kind === 'ring') && !host.matches(iconSelector)) { remove(state); continue; }
      if (state.kind === 'math' && (!host.matches(mathSelector) || !/^[+=\u00d7]$/u.test(host.textContent.trim()))) { remove(state); continue; }
      minimumSuperscriptSlot(state, scale);
      const box = metricBox(state, scale); state.box = box;
      const visible = box && box.rect.width > 0 && box.rect.height > 0 && box.style.visibility !== 'hidden';
      const minimumWidth = state.kind === 'text' && state.original === '\u00d7' && host.closest('#ebii-sadi .mini-formula') ? 7.85 : 7.95;
      const fit = visible && scale.uniform && !box.tooSmall && box.width * scale.value >= minimumWidth && box.height * scale.value >= 7.95;
      state.active = !!fit; state.reason = fit ? '' : !visible ? 'not-rendered' : !scale.uniform ? 'non-uniform-transform' : 'insufficient-space-for-clear-3px-symbol';
      set(host, PREFIX + 'active', !!fit);
      if (state.symbolSource) style(state.symbolSource, 'opacity', fit ? '0' : state.symbolOpacity);
      if (fit) draw(state, box, scale); else style(state.svg, 'display', 'none', 'important');
    }
  }
  function run() {
    frame = 0;
    if (!document.body) return;
    observer?.disconnect();
    try {
      if (getComputedStyle(document.documentElement).getPropertyValue('--arotec-site-symbols-ready').trim() !== '1') { for (const state of states) deactivate(state, 'stylesheet-unavailable'); document.querySelectorAll('svg[' + PREFIX + 'layer]').forEach(svg => style(svg, 'display', 'none', 'important')); return; }
      if (scanNeeded) { scanNeeded = false; scan(); } layout(); runs++; } finally { observe(); }
  }
  // Localization sees the retained source text, never decorative SVG message slots.
  // Also accept an exact mixed arrow run produced when both renderers decorate one text node.
  function originalText(host) {
    if (!host || host.nodeType !== 1) return null;
    if (host.namespaceURI === NS && host.hasAttribute(PREFIX + 'layer') && host.getAttribute('aria-hidden') === 'true' && [...host.children].every(c => c.localName === 'path')) return '';
    if (host.localName === 'arotec-operator-text' && host.getAttribute(PREFIX + 'owned') === 'symbols') {
      const children = [...host.childNodes], source = children[0];
      if (source?.localName !== 'arotec-operator-source' || source.children.length || !/^[+=\u00d7\u2715\u2716\u2a2f]$/u.test(source.textContent) || children.length > 2 || (children[1] && originalText(children[1]) !== '')) return null;
      return source.textContent;
    }
    const operatorRun = host.localName === 'arotec-operator-run' && host.getAttribute(PREFIX + 'owned') === 'symbols';
    const mixedArrowRun = host.localName === 'arotec-arrow-run' && host.getAttribute('data-arotec-arrow-owned') === 'symbols' && host.querySelector('arotec-operator-run[' + PREFIX + 'owned="symbols"]');
    if (!operatorRun && !mixedArrowRun) return null;
    let result = '', hasOwned = false;
    for (const child of host.childNodes) {
      if (child.nodeType === 3) { result += child.nodeValue; continue; }
      let value = originalText(child);
      if (value == null) value = window.ArotecArrowSymbols?.originalText(child);
      if (value == null) return null;
      result += value; hasOwned = true;
    }
    return hasOwned ? result : null;
  }
  function inspect() {
    return { version: '1.0.0', runs, locale: document.documentElement.lang, symbols: [...states].filter(s => s.host.isConnected).map(s => {
      const r = s.host.getBoundingClientRect(), p = s.kind === 'svg-close' ? s.paths[0] : s.svg.lastElementChild, cs = p ? getComputedStyle(p) : null;
      return { kind: s.kind, original: s.original, active: s.active, reason: s.reason, selector: s.host.id ? '#' + s.host.id : s.host.localName + (s.host.className && typeof s.host.className === 'string' ? '.' + s.host.className.trim().replace(/\s+/g, '.') : ''), context: s.host.parentElement?.textContent.trim().slice(0, 160), host: { x: r.x, y: r.y, width: r.width, height: r.height }, paint: s.box && { width: s.box.width * s.scale.value, height: s.box.height * s.scale.value, availableWidth: s.box.availableWidth, inkWidth: s.box.inkWidth, inkHeight: s.box.inkHeight }, effectiveStroke: cs ? parseFloat(cs.strokeWidth) * s.scale.value : null, stroke: cs?.stroke, keyline: !!s.keyline, slotAdjustment: s.slotAdjustment || 0, slotReason: s.slotReason || '', slotDiagnostic: s.slotDiagnostic, cssScale: s.scale?.value, uniformScale: s.scale?.uniform };
    }) };
  }
  window.ArotecSiteSymbols = Object.freeze({ version: '1.0.0', refresh: () => schedule(true), inspect, originalText });
  function start() {
    if (!document.body || observer) return;
    observer = new MutationObserver(records => {
      const relevant = records.filter(r => !owned(r.target) && !r.target.parentElement?.closest('svg[' + PREFIX + 'layer]'));
      if (relevant.length) schedule(relevant.some(r => r.type !== 'attributes' || r.attributeName !== 'style'));
    });
    headObserver = new MutationObserver(() => schedule(false)); headObserver.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'media', 'href'] });
    rootObserver = new MutationObserver(() => schedule(true)); rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir', 'class', 'style'] });
    if ('ResizeObserver' in window) resizeObserver = new ResizeObserver(() => schedule(false));
    observe(); schedule(true);
    window.addEventListener('resize', () => schedule(false), { passive: true });
    window.addEventListener('pageshow', () => schedule(true));
    document.addEventListener('arotec:i18n-ready', () => schedule(true)); document.addEventListener('arotec:languagechange', () => schedule(true));
    document.addEventListener('toggle', () => schedule(true), true);
    document.addEventListener('transitionend', () => schedule(false), true);
    document.fonts?.ready.then(() => schedule(false)); document.fonts?.addEventListener('loadingdone', () => schedule(false));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
