/* Reviewed SVG arrow geometry. Do not extend these rules to unclassified SVG art. */
(() => {
  'use strict';
  if (window.ArotecSvgArrows) return;

  const NS = 'http://www.w3.org/2000/svg';
  const NAVY = '#113568';
  const SCALE_VAR = '--arotec-svg-arrow-css-scale';
  const STROKE = `calc(3px / var(${SCALE_VAR}, 1))`;
  const SKIP = '[data-arotec-arrow-owned], [data-arotec-arrow-generated], .exo-health-gap-arrow, .exo-health-feedback-arrows, .exo-ebii-gap-arrow, .exo-impact-gap-arrow';
  const SHAPES = 'path,line,polyline,polygon';
  const markerIds = /^(?:cg-(?:red-)?arrow|flow-arrow-(?:cyan|rose)|ndr-(?:sensory-)?arrow|nor-arrow|s2-(?:purple|green)-head|sn-arrow-(?:navy|grey|green|amber|red|purple)|native-arrow-(?:navy|red|amber)|transition-arrow-(?:navy|green|red)|systems-arrow-(?:grey|red)|outcome-(?:purple|feedback)-arrow|cognitive-(?:navy|teal)-arrow|neuro-navy-arrow|legend-neuro-(?:navy|purple|loop)|sip-adaptation-arrow|arrow-(?:black|red|blue|green|purple|orange)|esf-arrow-(?:red|green)(?:-back)?|nc-arrow-black-front|bd-(?:front-(?:purple|red)|back-purple)|networkArrow(?:Cyan|Red)|outcomeArrow(?:Green|Red)|s[1-6]-(?:blue|purple|green|orange|red|teal|brown|navy)-arrow-(?:normal|small))$/;
  const literalSelectors = [
    '.arotec-page-top > svg path',
    'svg.nst-step-link path', 'svg.nst-flow-arrow path', 'svg.nst-trend-svg path',
    'svg.flow-arrow path[d="M2 9h21M18 4l5 5-5 5"]',
    '.legend-line-stress', '.legend-line-response', '.native-legend-amplifier-line',
    '.native-legend-reciprocal-line',
    '#sn-i-cycle path', '#sf-i-arrow path',
    '.sip-network-leaders > path[d="M836 717V767M829 760L836 767L843 760"]',
    '.sip-mechanisms-leaders path[d="M650 887H729M719 878L729 887L719 896M1320 887H1390M1380 878L1390 887L1380 896"]',
    '.sip-aging-arrows path',
    'svg path[d="M2 13H34M23 2L35 13L23 24"]',
    'svg path[d="M4 14H356M17 2L4 14L17 26M343 2L356 14L343 26"]',
    '.native-transition-arrow-glint',
    '.signal-connection .signal-glow', '.signal-connection .signal-current'
  ].join(',');
  // These formerly closed, filled triangles are heads, not filled chart regions.
  const headPaths = {
    '.legend-arrowhead-stress': 'M43 5L52 11L43 17',
    '.legend-arrowhead-response': 'M19 8L26 0L33 8',
    '.native-legend-amplifier-head': 'M68 6L82 15L68 24',
    '.native-legend-reciprocal-head': 'M13 6L0 15L13 24M69 6L82 15L69 24'
  };
  const polygonHeads = {
    'svg.nst-step-link > polygon': '11,2 16,6 11,10',
    'svg.nst-flow-arrow > polygon': '20,3 28,8 20,13',
    'svg.nst-trend-up > polygon': '3,9 9,1 15,9',
    'svg.nst-trend-down > polygon': '3,23 9,31 15,23'
  };
  const sourceMarkers = new WeakMap();
  const svgStates = new WeakMap();
  const observed = new Set();
  const normalizedStyles = new Map();
  const styleProbe = document.createElementNS(NS, 'path').style;
  let serial = 0;
  let pending = 0;
  let passes = 0;

  function compensateCssScale(svg) {
    // SVG non-scaling-stroke handles viewBox/SVG transforms, but Chrome still
    // scales its paint through a CSS transform on the outer SVG/HTML ancestors.
    let root = svg;
    while (root.ownerSVGElement) root = root.ownerSVGElement;
    let scale = 1;
    let unsupported = false;
    for (let element = root; element; element = element.parentElement) {
      const computed = getComputedStyle(element);
      if (computed.scale && computed.scale !== 'none') {
        const parts = computed.scale.split(/\s+/).map(value => parseFloat(value) / (value.endsWith('%') ? 100 : 1));
        const x = Math.abs(parts[0]), y = Math.abs(parts[1] ?? parts[0]);
        if (!Number.isFinite(x * y) || x * y === 0) unsupported = true;
        else {
          if (Math.abs(x - y) > 0.0001 * Math.max(1, x, y) || (parts.length > 2 && parts[2] !== 1)) unsupported = true;
          scale *= Math.sqrt(x * y);
        }
      }
      const transform = computed.transform;
      if (!transform || transform === 'none') continue;
      // A presentation transform within SVG is already handled by vector-effect.
      if (element === root && root.hasAttribute('transform') && !root.style.transform) continue;
      try {
        const matrix = new DOMMatrixReadOnly(transform);
        const x = Math.hypot(matrix.a, matrix.b), y = Math.hypot(matrix.c, matrix.d);
        const orthogonal = Math.abs(matrix.a * matrix.c + matrix.b * matrix.d) < 0.0001 * Math.max(1, x * y);
        if (!matrix.is2D || !orthogonal || Math.abs(x - y) > 0.0001 * Math.max(1, x, y)) unsupported = true;
        if (x > 0 && y > 0) scale *= Math.sqrt(x * y);
      } catch (_) { unsupported = true; }
    }
    if (!Number.isFinite(scale) || scale < 0.0001) { scale = 1; unsupported = true; }
    const value = String(Math.round(scale * 1000000) / 1000000);
    style(svg, SCALE_VAR, value);
    attr(svg, 'data-arotec-arrow-css-scale', value);
    if (unsupported) attr(svg, 'data-arotec-arrow-css-nonuniform', 'true');
    else if (svg.hasAttribute('data-arotec-arrow-css-nonuniform')) svg.removeAttribute('data-arotec-arrow-css-nonuniform');
  }

  function attr(node, name, value) {
    if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }
  function style(node, name, value) {
    const key = `${name}:${value}`;
    if (!normalizedStyles.has(key)) {
      if (normalizedStyles.size >= 64) normalizedStyles.clear();
      styleProbe.setProperty(name, value);
      normalizedStyles.set(key, styleProbe.getPropertyValue(name));
    }
    const normalized = normalizedStyles.get(key);
    if (node.style.getPropertyValue(name) !== normalized || node.style.getPropertyPriority(name) !== 'important') {
      node.style.setProperty(name, normalized, 'important');
    }
  }
  function eligible(node) {
    return node && !node.closest(SKIP) && !node.closest('marker,clipPath,mask');
  }
  function paint(node, color = window.ArotecArrowContrast?.color(node) || NAVY) {
    if (typeof color !== 'string') color = window.ArotecArrowContrast?.color(node) || NAVY;
    attr(node, 'data-arotec-arrow-svg', 'path');
    attr(node, 'vector-effect', 'non-scaling-stroke');
    style(node, 'vector-effect', 'non-scaling-stroke');
    style(node, 'stroke', color);
    style(node, 'stroke-width', STROKE);
    style(node, 'stroke-linecap', 'round');
    style(node, 'stroke-linejoin', 'round');
    style(node, 'fill', 'none');
    style(node, 'color', color);
    style(node, 'filter', 'none');
  }
  function markerId(value) {
    const match = /url\(["']?[^)]*#([^"')]+)["']?\)/.exec(value || '');
    if (!match) return null;
    if (markerIds.test(match[1])) return match[1];
    // A cloned diagram may already contain our CSS URLs but has no WeakMap state.
    const source = document.getElementById(match[1])?.getAttribute('data-arotec-arrow-source');
    return source && markerIds.test(source) ? source : null;
  }
  function originalMarker(node, position) {
    let saved = sourceMarkers.get(node);
    if (!saved) {
      saved = {};
      sourceMarkers.set(node, saved);
    }
    // Attribute changes from the diagram engines take precedence over our CSS.
    let value = null;
    const ancestry = [];
    for (let parent = node; parent && parent.namespaceURI === NS; parent = parent.parentElement) {
      const inheritedStyle = parent.style.getPropertyValue(position);
      ancestry.push(`${parent.getAttribute('class') || ''}:${parent.getAttribute(position) || ''}:${/#arotec-svg-arrow-/.test(inheritedStyle) ? '' : inheritedStyle}`);
      if (value === null && parent.hasAttribute(position)) value = parent.getAttribute(position);
      if (parent.localName === 'svg') break;
    }
    const signature = ancestry.join('|');
    const inline = node.style.getPropertyValue(position);
    const ours = /#arotec-svg-arrow-/.test(inline);
    if (value === null && ours) {
      if (saved[position] && saved[position].signature === signature) return saved[position].id;
      // Read the native CSS again only after its class/attribute context changes.
      // This also handles an inherited marker being removed after normalization.
      const cloneSource = !saved[position] ? markerId(inline) : null;
      node.style.removeProperty(position);
      value = getComputedStyle(node).getPropertyValue(position);
      if (!markerId(value) && cloneSource) value = `url(#${cloneSource})`;
    }
    if (value === null) value = getComputedStyle(node).getPropertyValue(position);
    const id = markerId(value);
    if (id) saved[position] = { id, signature };
    else {
      if (saved[position] && /#arotec-svg-arrow-/.test(node.style.getPropertyValue(position))) node.style.removeProperty(position);
      delete saved[position];
    }
    return id;
  }
  function stateFor(svg) {
    let state = svgStates.get(svg);
    if (!state) {
      state = { markers: new Map(), defs: null };
      svgStates.set(svg, state);
      // cloneNode copies generated definitions/IDs. Each live SVG gets fresh IDs.
      Array.from(svg.children).filter(child => child.getAttribute('data-arotec-arrow-generated') === 'svg-marker-defs').forEach(child => child.remove());
    }
    if (!state.defs || !state.defs.isConnected || state.defs.parentElement !== svg) {
      state.defs = document.createElementNS(NS, 'defs');
      attr(state.defs, 'data-arotec-arrow-generated', 'svg-marker-defs');
      svg.appendChild(state.defs);
      state.markers.clear();
    }
    return state;
  }
  function screenScale(node) {
    const matrix = node.getScreenCTM();
    if (!matrix) return null;
    const x = Math.hypot(matrix.a, matrix.b);
    const y = Math.hypot(matrix.c, matrix.d);
    return x > 0.0001 && y > 0.0001 ? { x, y } : null;
  }
  function normalizedMarker(svg, node, id, used) {
    const original = document.getElementById(id);
    if (!original || original.localName !== 'marker') return null;
    const scale = screenScale(node);
    if (!scale) return null;
    const state = stateFor(svg);
    // Quantization prevents subpixel rounding noise from growing the definition set.
    const color = window.ArotecArrowContrast?.color(node) || NAVY;
    const key = `${id}:${scale.x.toFixed(4)}:${scale.y.toFixed(4)}:${color}`;
    let marker = state.markers.get(key);
    if (!marker || !marker.isConnected) {
      marker = document.createElementNS(NS, 'marker');
      attr(marker, 'id', `arotec-svg-arrow-${++serial}`);
      attr(marker, 'data-arotec-arrow-generated', 'svg-marker');
      attr(marker, 'data-arotec-arrow-source', id);
      attr(marker, 'markerUnits', 'userSpaceOnUse');
      attr(marker, 'viewBox', '-10 -7 12 14');
      attr(marker, 'refX', '0');
      attr(marker, 'refY', '0');
      attr(marker, 'preserveAspectRatio', 'none');
      // Native amber uses a fixed upright head rather than an auto-oriented one.
      attr(marker, 'orient', id === 'native-arrow-amber' ? '-90' : (original.getAttribute('orient') || 'auto'));
      attr(marker, 'overflow', 'visible');
      const head = document.createElementNS(NS, 'path');
      attr(head, 'd', 'M-8 -5L0 0L-8 5');
      paint(head, color);
      // The shaft's filter already includes its marker paint. Applying another
      // keyline inside the scaled marker viewport would double its white edge.
      style(head, 'filter', 'none');
      marker.appendChild(head);
      state.defs.appendChild(marker);
      state.markers.set(key, marker);
    }
    // CSS-pixel head dimensions do not grow with the shaft stroke or shrink with
    // responsive SVG viewBoxes. Non-scaling stroke also covers nonuniform scaling.
    attr(marker, 'markerWidth', String(12 / scale.x));
    attr(marker, 'markerHeight', String(14 / scale.y));
    used.add(marker.id);
    return marker.id;
  }
  function markerArrows(svg, used) {
    svg.querySelectorAll(SHAPES).forEach(node => {
      if (!eligible(node)) return;
      const references = ['marker-start', 'marker-mid', 'marker-end'].map(position => [position, originalMarker(node, position)]);
      if (!references.some(([, id]) => id)) return;
      paint(node);
      references.forEach(([position, id]) => {
        if (!id) return;
        const normalized = normalizedMarker(svg, node, id, used);
        if (normalized) style(node, position, `url("#${normalized}")`);
      });
    });
  }
  function literalArrows() {
    document.querySelectorAll(literalSelectors).forEach(node => { if (eligible(node)) paint(node); });
    Object.entries(headPaths).forEach(([selector, d]) => {
      document.querySelectorAll(selector).forEach(node => {
        if (!eligible(node)) return;
        attr(node, 'd', d);
        paint(node);
      });
    });
    // A polygon implicitly closes its last edge. Replace only these four known
    // arrowhead polygons with open polylines, preserving class/ARIA/geometry.
    Object.entries(polygonHeads).forEach(([selector, points]) => {
      document.querySelectorAll(selector).forEach(node => {
        if (!eligible(node)) return;
        const line = document.createElementNS(NS, 'polyline');
        Array.from(node.attributes).forEach(attribute => line.setAttribute(attribute.name, attribute.value));
        attr(line, 'points', points);
        attr(line, 'data-arotec-arrow-svg', 'head');
        paint(line);
        node.replaceWith(line);
      });
    });
    document.querySelectorAll('svg.icon-svg').forEach(svg => {
      if (!eligible(svg)) return;
      const paths = Array.from(svg.querySelectorAll(':scope > path'));
      const joined = paths.map(path => path.getAttribute('d')).join('|');
      if (joined === 'M5 12h14|m13 6 6 6-6 6' || joined === 'M19 12H5|m11 6-6 6 6 6') paths.forEach(paint);
    });
  }
  function flush() {
    pending = 0;
    observer.disconnect();
    try {
      observed.forEach(svg => {
        if (!svg.isConnected || svg.closest(SKIP)) {
          resizer.unobserve(svg);
          observed.delete(svg);
        }
      });
      document.querySelectorAll('svg').forEach(svg => { if (!svg.closest(SKIP)) compensateCssScale(svg); });
      literalArrows();
      document.querySelectorAll('svg').forEach(svg => {
        if (svg.closest(SKIP)) return;
        if (resizer && !observed.has(svg)) { observed.add(svg); resizer.observe(svg); }
        const used = new Set();
        markerArrows(svg, used);
        const state = svgStates.get(svg);
        if (state) state.markers.forEach((marker, key) => {
          if (!used.has(marker.id)) { marker.remove(); state.markers.delete(key); }
        });
      });
      passes += 1;
    } finally {
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true,
        attributeFilter: ['d', 'points', 'marker-start', 'marker-mid', 'marker-end', 'viewBox', 'transform', 'class', 'style', 'hidden', 'open'] });
    }
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(flush); }
  function containsSvg(node) {
    return node.nodeType === 1 && !node.closest(SKIP) && (node.namespaceURI === NS || node.querySelector('svg'));
  }
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'childList'
      ? Array.from(record.addedNodes).some(containsSvg) || Array.from(record.removedNodes).some(containsSvg) ||
        (record.target.namespaceURI === NS && !record.target.closest(SKIP))
      : (record.target.namespaceURI === NS && !record.target.closest(SKIP)) ||
        (containsSvg(record.target) && (record.attributeName !== 'style' || /(?:transform|scale)\s*:/.test((record.oldValue || '') + (record.target.getAttribute('style') || '')))))) schedule();
  });
  const resizer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  window.ArotecSvgArrows = {
    version: '20261009-3px-1', refresh: schedule,
    inspect: () => ({ passes, paths: document.querySelectorAll('[data-arotec-arrow-svg]').length,
      markerDefinitions: document.querySelectorAll('[data-arotec-arrow-generated="svg-marker"]').length,
      nonuniformCssTransforms: Array.from(document.querySelectorAll('svg[data-arotec-arrow-css-nonuniform]'))
        .filter(svg => svg.querySelector('[data-arotec-arrow-svg],use[href="#sf-i-arrow"],use[href="#sn-i-cycle"]')).length })
  };
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  document.addEventListener('toggle', schedule, true);
  document.addEventListener('languagechange', schedule);
  document.addEventListener('transitionend', event => { if (['transform', 'scale'].includes(event.propertyName) && containsSvg(event.target)) schedule(); }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();
