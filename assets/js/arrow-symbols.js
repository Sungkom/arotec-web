/* Consistent arrow artwork; original text, icon boxes, labels and controls stay put. */
(() => {
  'use strict';
  if (window.ArotecArrowSymbols) return;
  const NS = 'http://www.w3.org/2000/svg';
  const textStates = new WeakMap();
  const textRuns = new WeakMap();
  const iconStates = new WeakMap();
  const entries = new Set();
  const resizeTargets = new Map();
  const shapes = {
    right: 'M2 12H22M15 5L22 12L15 19',
    left: 'M22 12H2M9 5L2 12L9 19',
    up: 'M12 22V2M5 9L12 2L19 9',
    down: 'M12 2V22M5 15L12 22L19 15',
    'up-right': 'M3 21L21 3M9 3H21V15',
    'up-left': 'M21 21L3 3M3 15V3H15',
    'down-right': 'M3 3L21 21M9 21H21V9',
    'down-left': 'M21 3L3 21M3 9V21H15',
    'left-right': 'M2 12H22M8 6L2 12L8 18M16 6L22 12L16 18',
    'down-up': 'M7 2V22M2 17L7 22L12 17M17 22V2M12 7L17 2L22 7',
    'caret-down': 'M2 2L12 22L22 2',
    'caret-up': 'M2 22L12 2L22 22',
    'caret-right': 'M2 2L22 12L2 22',
    'caret-left': 'M22 2L2 12L22 22',
    'caret-double-right': 'M2 4L10 12L2 20M13 4L21 12L13 20',
    clockwise: 'M21 10A9 9 0 1 0 20 17M15 9L21 10L22 4',
    counterclockwise: 'M3 10A9 9 0 1 1 4 17M9 9L3 10L2 4',
    'cycles-clockwise': 'M3 9A9 9 0 0 1 20 7M15 6L21 8L22 2M21 15A9 9 0 0 1 4 17M9 18L3 16L2 22',
    'cycles-counterclockwise': 'M21 9A9 9 0 0 0 4 7M9 6L3 8L2 2M3 15A9 9 0 0 0 20 17M15 18L21 16L22 22',
    out: 'M9 9L2 2M2 8V2H8M15 9L22 2M16 2H22V8M9 15L2 22M2 16V22H8M15 15L22 22M16 22H22V16',
    'u-up-left': 'M21 21V12A6 6 0 0 0 15 6H2M8 1L2 6L8 11',
    'circle-right': 'M22 12A10 10 0 1 1 2 12A10 10 0 1 1 22 12M7 12H17M12 7L17 12L12 17',
    'box-up': 'M4 10V22H20V10M12 16V2M6 8L12 2L18 8',
    'trend-up': 'M2 20L9 12L14 16L22 4M14 4H22V12',
    'trend-down': 'M2 4L9 12L14 8L22 20M14 20H22V12',
    'chart-line-up': 'M2 2V22H22M6 16L11 11L15 14L22 5M16 5H22V11'
  };
  const icons = {
    'ph-arrow-right': 'right', 'ph-arrow-left': 'left',
    'ph-arrow-up': 'up', 'ph-arrow-down': 'down',
    'ph-arrow-fat-up': 'up', 'ph-arrow-fat-down': 'down',
    'ph-arrow-up-right': 'up-right', 'ph-arrow-up-left': 'up-left',
    'ph-arrow-down-right': 'down-right', 'ph-arrow-down-left': 'down-left',
    'ph-arrows-left-right': 'left-right', 'ph-arrows-down-up': 'down-up',
    'ph-arrow-clockwise': 'clockwise', 'ph-arrow-counter-clockwise': 'counterclockwise',
    'ph-arrows-clockwise': 'cycles-clockwise', 'ph-arrows-counter-clockwise': 'cycles-counterclockwise',
    'ph-arrows-out': 'out', 'ph-arrow-u-up-left': 'u-up-left',
    'ph-arrow-circle-right': 'circle-right', 'ph-box-arrow-up': 'box-up',
    'ph-caret-down': 'caret-down', 'ph-caret-up': 'caret-up',
    'ph-caret-right': 'caret-right', 'ph-caret-left': 'caret-left',
    'ph-caret-double-right': 'caret-double-right',
    'ph-trend-up': 'trend-up', 'ph-trend-down': 'trend-down',
    'ph-chart-line-up': 'chart-line-up'
  };
  const symbols = {
    '→': 'right', '←': 'left', '↑': 'up', '↓': 'down', '↔': 'left-right',
    '↗': 'up-right', '↘': 'down-right', '↙': 'down-left', '↖': 'up-left',
    '↻': 'clockwise', '↺': 'counterclockwise', '›': 'caret-right', '‹': 'caret-left'
  };
  const textPattern = /[→←↑↓↔↗↘↙↖↻↺›‹]/g;
  const iconSelector = Object.keys(icons).map(name => `.${name}`).join(',');
  const measuredArrows = '.bri-journey-arrow,.bri-step-arrow,.brs-v5-flow-arrow,.exo-health-flow .exo-flow-arrow,.exo-ebii-convergence > .exo-ebii-arrow,.exo-ebii-mobile-arrow,.exo-impact-level > .ph-arrow-right';
  const skip = `script,style,noscript,textarea,input,select,option,code,pre,kbd,samp,svg,math,[contenteditable]:not([contenteditable="false"]),[data-user-content],[data-arotec-arrow-owned],[data-arotec-arrow-generated],${measuredArrows}`;
  let observer, resizeObserver, frame = 0, scanRequested = false;

  function setAttribute(node, name, value) {
    value = String(value);
    if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }
  function makeSVG(shape) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('data-arotec-arrow-owned', 'symbols');
    svg.setAttribute('data-arotec-arrow-shape', shape);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.width = '0px';
    svg.style.height = '0px';
    svg.setAttribute('viewBox', '0 0 32 32');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', shapes[shape]);
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(path);
    return svg;
  }
  function observe() {
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });
  }
  function track(state) {
    entries.add(state);
  }
  function resizeTarget(state, target) {
    if (target === state.resizeTarget) return;
    const previous = state.resizeTarget;
    if (previous) {
      const count = resizeTargets.get(previous) - 1;
      if (count > 0) resizeTargets.set(previous, count);
      else { resizeTargets.delete(previous); resizeObserver?.unobserve(previous); }
    }
    state.resizeTarget = target;
    if (target) {
      resizeTargets.set(target, (resizeTargets.get(target) || 0) + 1);
      resizeObserver?.observe(target);
    }
  }
  function transformMatrix(element, cache) {
    if (!element || element.namespaceURI !== 'http://www.w3.org/1999/xhtml') return new DOMMatrix();
    if (cache.has(element)) return cache.get(element);
    const parent = transformMatrix(element.parentElement, cache), style = getComputedStyle(element);
    let local = style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform);
    if (style.scale && style.scale !== 'none') {
      const parts = style.scale.split(/\s+/).map(Number);
      if (parts.every(Number.isFinite)) local = new DOMMatrix().scale(parts[0], parts[1] ?? parts[0]).multiply(local);
    }
    const matrix = parent.multiply(local);
    cache.set(element, matrix);
    return matrix;
  }
  function cssScale(element, cache) {
    const matrix = transformMatrix(element, cache);
    const x = Math.hypot(matrix.a, matrix.b), y = Math.hypot(matrix.c, matrix.d);
    const perpendicular = Math.abs(matrix.a * matrix.c + matrix.b * matrix.d) < .0001 * Math.max(1, x * y);
    const uniform = matrix.is2D && perpendicular && Math.abs(x - y) <= .001 * Math.max(1, x, y);
    return { value: uniform && x > .0001 ? x : 1, x, y, uniform };
  }
  function originalText(host) {
    const originalRun = textRuns.get(host);
    if (originalRun != null) return originalRun;
    if (host?.localName === 'arotec-arrow-run' && host.matches('.arotec-arrow-run[data-arotec-arrow-owned="symbols"]')) {
      let original = '', hasArrow = false;
      for (const child of host.childNodes) {
        if (child.nodeType === 3) original += child.nodeValue;
        else {
          const text = originalText(child);
          if (text == null || child.localName !== 'arotec-arrow-text') return null;
          original += text; hasArrow = true;
        }
      }
      if (!hasArrow) return null;
      textRuns.set(host, original);
      return original;
    }
    let state = textStates.get(host);
    if (state) { track(state); return state.original; }
    // cloneNode is used by page dialogs. Accept only the exact structure emitted
    // here, so a cloned trusted wrapper is transparent before its next refresh.
    if (host?.localName !== 'arotec-arrow-text' || !host.matches('.arotec-arrow-text[data-arotec-arrow-owned="symbols"]')) return null;
    const children = host.childNodes;
    const text = children[0]?.nodeType === 3 ? children[0].nodeValue : '';
    const svg = children[1];
    if (children.length !== 2 || !Object.hasOwn(symbols, text) || svg?.namespaceURI !== NS ||
        svg.getAttribute('data-arotec-arrow-owned') !== 'symbols' ||
        svg.childElementCount !== 1 || svg.firstElementChild.localName !== 'path' ||
        svg.firstElementChild.getAttribute('d') !== shapes[symbols[text]]) return null;
    state = { host, type: 'text', original: text, svg };
    textStates.set(host, state);
    track(state);
    return text;
  }
  function prepareIcon(host) {
    if (host.closest(`${measuredArrows},[data-arotec-arrow-owned],[data-arotec-arrow-generated]`)) return;
    const name = Object.keys(icons).find(key => host.classList.contains(key));
    if (!name) return;
    let state = iconStates.get(host);
    if (!state) {
      const position = getComputedStyle(host).position;
      const clonedSVG = host.querySelector(':scope > svg[data-arotec-arrow-owned="symbols"]');
      state = { host, type: 'icon', name, svg: clonedSVG || makeSVG(icons[name]), position: host.style.position, positioned: position === 'static' };
      if (state.positioned) host.style.position = 'relative';
      host.classList.add('arotec-arrow-symbol-host');
      setAttribute(state.svg, 'data-arotec-arrow-shape', icons[name]);
      setAttribute(state.svg.firstElementChild, 'd', shapes[icons[name]]);
      host.append(state.svg);
      iconStates.set(host, state);
      track(state);
    } else {
      track(state);
      state.name = name;
      setAttribute(state.svg, 'data-arotec-arrow-shape', icons[name]);
      setAttribute(state.svg.firstElementChild, 'd', shapes[icons[name]]);
      if (state.svg.parentNode !== host) host.append(state.svg);
    }
  }
  function prepareText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.parentElement || node.parentElement.closest(skip)) return NodeFilter.FILTER_REJECT;
        textPattern.lastIndex = 0;
        return textPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue;
      textPattern.lastIndex = 0;
      let match, previous = 0;
      const fragment = document.createDocumentFragment();
      while ((match = textPattern.exec(text))) {
        if (match.index > previous) fragment.append(document.createTextNode(text.slice(previous, match.index)));
        // A dedicated tag cannot shift existing span:nth-of-type localization
        // targets or inherit a page's decorative span-only layout rules.
        const host = document.createElement('arotec-arrow-text');
        host.className = 'arotec-arrow-text';
        host.setAttribute('data-arotec-arrow-owned', 'symbols');
        host.setAttribute('data-text-color-preserve', '');
        host.append(document.createTextNode(match[0]));
        const state = { host, type: 'text', original: match[0], svg: makeSVG(symbols[match[0]]) };
        host.append(state.svg);
        textStates.set(host, state);
        track(state);
        fragment.append(host);
        previous = match.index + match[0].length;
      }
      if (previous < text.length) fragment.append(document.createTextNode(text.slice(previous)));
      // Preserve one layout item for the original whole text node. Grid/flex
      // parents must not turn the symbol and following words into extra cells.
      const run = document.createElement('arotec-arrow-run');
      run.className = 'arotec-arrow-run';
      run.setAttribute('data-arotec-arrow-owned', 'symbols');
      run.append(fragment);
      textRuns.set(run, text);
      node.replaceWith(run);
    }
  }
  function layout() {
    const transforms = new Map();
    for (const state of entries) {
      const { host, svg } = state;
      if (!host.isConnected) {
        entries.delete(state);
        resizeTarget(state, null);
        continue;
      }
      if (state.type === 'icon' && !Object.keys(icons).some(name => host.classList.contains(name))) {
        host.classList.remove('arotec-arrow-symbol-host');
        if (state.positioned && host.style.position === 'relative') host.style.position = state.position;
        svg.remove();
        iconStates.delete(host);
        entries.delete(state);
        resizeTarget(state, null);
        continue;
      }
      const style = getComputedStyle(host);
      const rect = host.getBoundingClientRect();
      let container = host;
      // ResizeObserver does not report non-replaced inline boxes. Watch the
      // enclosing layout box instead, with shared reference counts.
      if (state.type === 'text') {
        container = host.parentElement;
        while (container && ['inline', 'contents'].includes(getComputedStyle(container).display)) container = container.parentElement;
      }
      resizeTarget(state, container);
      const scale = cssScale(host, transforms);
      state.scale = scale;
      setAttribute(svg, 'data-arotec-arrow-css-scale', scale.value.toFixed(5));
      setAttribute(svg, 'data-arotec-arrow-uniform-scale', scale.uniform);
      const stroke = `${(3 / scale.value).toFixed(5)}px`;
      if (svg.style.getPropertyValue('--arotec-symbol-stroke') !== stroke) svg.style.setProperty('--arotec-symbol-stroke', stroke);
      const color = window.ArotecArrowContrast?.color(host) || '#113568';
      if (svg.style.getPropertyValue('--arotec-arrow-color') !== color) svg.style.setProperty('--arotec-arrow-color', color);
      // Use the existing box, never widen the text or enlarge its font.
      const fontSize = parseFloat(state.type === 'icon' ? getComputedStyle(host, '::before').fontSize : style.fontSize) || 16;
      let width = parseFloat(style.width) || host.clientWidth || rect.width / scale.value;
      let height = Math.min(fontSize, parseFloat(style.height) || host.clientHeight || rect.height / scale.value);
      if (state.type === 'icon') width = Math.min(width, fontSize);
      // Breadcrumb already provides 8–10px gaps. A wider drawing remains within
      // those gaps while the original text slot and row wrapping stay unchanged.
      // Narrow scientific up/down glyphs similarly retain their original slot;
      // only the artwork gains enough head width to remain recognizable at 3px.
      if (state.type === 'text' && (host.closest('.arotec-breadcrumb-separator') || ['↑', '↓'].includes(state.original))) width = Math.max(width, 12 / scale.value);
      if (!(width > 0 && height > 0)) continue;
      width = Math.round(width * 1000) / 1000;
      height = Math.round(height * 1000) / 1000;
      if (svg.style.width !== `${width}px`) svg.style.width = `${width}px`;
      if (svg.style.height !== `${height}px`) svg.style.height = `${height}px`;
      setAttribute(svg, 'width', width);
      setAttribute(svg, 'height', height);
      setAttribute(svg, 'viewBox', `0 0 ${width} ${height}`);
      const innerWidth = Math.max(1, width - 6 / scale.value), innerHeight = Math.max(1, height - 6 / scale.value);
      const x = (width - innerWidth) / 2, y = (height - innerHeight) / 2;
      setAttribute(svg.firstElementChild, 'transform', `translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${(innerWidth / 24).toFixed(5)} ${(innerHeight / 24).toFixed(5)})`);
    }
  }
  function run() {
    frame = 0;
    if (!document.body) return;
    // Keep the original glyphs untouched if the drawing stylesheet is delayed
    // or unavailable. The shared loader refreshes once that sheet has loaded.
    if (getComputedStyle(document.documentElement).getPropertyValue('--arotec-arrow-symbols-ready').trim() !== '1') return;
    observer?.disconnect();
    try {
      if (scanRequested) {
        scanRequested = false;
        document.querySelectorAll('.arotec-arrow-run[data-arotec-arrow-owned="symbols"],.arotec-arrow-text[data-arotec-arrow-owned="symbols"]').forEach(originalText);
        document.querySelectorAll(iconSelector).forEach(prepareIcon);
        prepareText(document.body);
      }
      layout();
    } finally { observe(); }
  }
  function schedule(scan = true) {
    scanRequested = scanRequested || scan;
    if (!frame) frame = requestAnimationFrame(run);
  }
  window.ArotecArrowSymbols = Object.freeze({
    version: '1.0.1',
    refresh: () => schedule(true),
    originalText,
    inspect: () => {
      const connected = [...entries].filter(state => state.host.isConnected);
      return {
        version: '1.0.1',
        iconCount: connected.filter(state => state.type === 'icon').length,
        textCount: connected.filter(state => state.type === 'text').length,
        symbols: connected.map(state => {
          const path = state.svg.firstElementChild, style = getComputedStyle(path);
          const rect = state.svg.getBoundingClientRect();
          return {
            type: state.type, original: state.original || state.name,
            shape: state.svg.getAttribute('data-arotec-arrow-shape'),
            width: rect.width, height: rect.height,
            stroke: style.stroke, strokeWidth: style.strokeWidth,
            effectiveStroke: parseFloat(style.strokeWidth) * (state.scale?.value || 1),
            cssScale: state.scale?.value || 1, uniformScale: state.scale?.uniform ?? true,
            transformScaleX: state.scale?.x || 1, transformScaleY: state.scale?.y || 1,
            vectorEffect: style.vectorEffect,
            visible: rect.width > 0 && rect.height > 0 && getComputedStyle(state.host).visibility !== 'hidden'
          };
        })
      };
    }
  });
  function start() {
    if (!document.body || observer) return;
    observer = new MutationObserver(records => {
      const external = records.filter(record => !record.target.parentElement?.closest('[data-arotec-arrow-owned]') &&
        !(record.target.nodeType === 1 && record.target.matches('[data-arotec-arrow-owned]')));
      if (external.length) schedule(external.some(record => record.type !== 'attributes' || record.attributeName !== 'style'));
    });
    if ('ResizeObserver' in window) resizeObserver = new ResizeObserver(() => schedule(false));
    observe();
    schedule(true);
    window.addEventListener('resize', () => schedule(false), { passive: true });
    window.addEventListener('pageshow', () => schedule(true));
    document.addEventListener('arotec:i18n-ready', () => schedule(true));
    document.addEventListener('arotec:languagechange', () => schedule(true));
    document.addEventListener('transitionend', event => {
      if (['transform', 'scale', 'font-size'].includes(event.propertyName)) schedule(false);
    }, true);
    document.fonts?.ready.then(() => schedule(false));
    document.fonts?.addEventListener('loadingdone', () => schedule(false));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
