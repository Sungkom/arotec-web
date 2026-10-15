/* Local photo-aware contrast for the Bio-Responsive ingredient chapters.
   Samples are cached at thumbnail resolution; source artwork is never changed. */
(() => {
  'use strict';
  if (window.ArotecScentsArrowContrast) return;
  const SCOPE = '#bioactive-compounds,#ingredient-systems,#olfactiva,#trevion,#meraxyl,#cortiva,#melacor,#morphagen,#chromagen';
  const NAVY = '#113568', WHITE = '#ffffff';
  const images = new Map(), measurements = new Map();
  let styles = new WeakMap(), boxes = new WeakMap(), clearQueued = false, refreshQueued = false;
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const scoped = el => document.body?.classList.contains('brs-page') && el?.closest?.(SCOPE);
  function clear() { styles = new WeakMap(); boxes = new WeakMap(); clearQueued = false; }
  function memo() { if (!clearQueued) { clearQueued = true; requestAnimationFrame(clear); } }
  function style(el) { memo(); if (!styles.has(el)) styles.set(el, getComputedStyle(el)); return styles.get(el); }
  function box(el) { memo(); if (!boxes.has(el)) boxes.set(el, el.getBoundingClientRect()); return boxes.get(el); }
  function rgba(value) {
    const match = /^rgba?\(([^)]+)\)$/.exec(value || '');
    if (!match) return [0, 0, 0, 0];
    const n = match[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return [n[0], n[1], n[2], n[3] ?? 1];
  }
  const luminance = rgb => rgb.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const navyLuminance = luminance([17, 53, 104]);
  function split(value) {
    const parts = []; let depth = 0, start = 0, quote = '';
    for (let i = 0; i < value.length; i++) {
      const ch = value[i];
      if (quote) { if (ch === quote && value[i - 1] !== '\\') quote = ''; continue; }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && !depth) { parts.push(value.slice(start, i).trim()); start = i + 1; }
    }
    parts.push(value.slice(start).trim()); return parts;
  }
  function cacheImage(url, existing) {
    if (!url || url.startsWith('data:image/svg+xml')) return null;
    if (images.has(url)) return images.get(url);
    const entry = { ready: false }; images.set(url, entry);
    const img = existing || new Image();
    const read = () => {
      if (!img.naturalWidth) return;
      try {
        const scale = Math.min(1, 256 / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        Object.assign(entry, { ready: true, width: canvas.width, height: canvas.height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, pixels: context.getImageData(0, 0, canvas.width, canvas.height).data });
        schedule();
      } catch { entry.unavailable = true; }
    };
    if (img.complete && img.naturalWidth) read();
    else img.addEventListener('load', read, { once: true });
    if (!existing) img.src = url;
    return entry;
  }
  function pixel(entry, u, v) {
    if (!entry?.ready || u < 0 || u > 1 || v < 0 || v > 1) return null;
    const x = Math.min(entry.width - 1, Math.floor(u * entry.width));
    const y = Math.min(entry.height - 1, Math.floor(v * entry.height));
    const i = (y * entry.width + x) * 4;
    return [entry.pixels[i], entry.pixels[i + 1], entry.pixels[i + 2], entry.pixels[i + 3] / 255];
  }
  function offset(value, freeSpace) {
    if (value === 'center') return freeSpace / 2;
    if (value === 'right' || value === 'bottom') return freeSpace;
    if (value === 'left' || value === 'top') return 0;
    return value?.endsWith('%') ? freeSpace * parseFloat(value) / 100 : parseFloat(value) || 0;
  }
  function imagePixel(img, point) {
    const s = style(img), r = box(img);
    if (s.display === 'none' || !r.width || !r.height) return null;
    const entry = cacheImage(img.currentSrc || img.src, img);
    if (!entry?.ready) return null;
    let w = r.width, h = r.height;
    if (s.objectFit === 'contain' || s.objectFit === 'cover' || s.objectFit === 'scale-down') {
      let factor = (s.objectFit === 'cover' ? Math.max : Math.min)(w / entry.naturalWidth, h / entry.naturalHeight);
      if (s.objectFit === 'scale-down') factor = Math.min(1, factor);
      w = entry.naturalWidth * factor; h = entry.naturalHeight * factor;
    } else if (s.objectFit === 'none') { w = entry.naturalWidth; h = entry.naturalHeight; }
    const position = s.objectPosition.split(' ');
    const c = pixel(entry, (point.x - r.left - offset(position[0], r.width - w)) / w, (point.y - r.top - offset(position[1] || '50%', r.height - h)) / h);
    if (c) c[3] *= Number(s.opacity); return c;
  }
  function backgroundPixel(node, layer, index, point) {
    const s = style(node), r = box(node), match = /^url\(["']?(.*?)["']?\)$/.exec(layer);
    if (!match) return null;
    const entry = cacheImage(match[1]); if (!entry?.ready) return null;
    const sizes = split(s.backgroundSize), positions = split(s.backgroundPosition), repeats = split(s.backgroundRepeat);
    const size = sizes[index % sizes.length], position = positions[index % positions.length].split(' ');
    const repeat = repeats[index % repeats.length];
    let w = entry.naturalWidth, h = entry.naturalHeight;
    if (size === 'cover' || size === 'contain') {
      const scale = (size === 'cover' ? Math.max : Math.min)(r.width / w, r.height / h); w *= scale; h *= scale;
    } else {
      const values = size.split(' '), dimension = (v, available) => v?.endsWith('%') ? parseFloat(v) / 100 * available : parseFloat(v);
      const sw = dimension(values[0], r.width), sh = dimension(values[1], r.height);
      if (Number.isFinite(sw)) { w = sw; h = Number.isFinite(sh) ? sh : sw * entry.naturalHeight / entry.naturalWidth; }
      else if (Number.isFinite(sh)) { h = sh; w = sh * entry.naturalWidth / entry.naturalHeight; }
    }
    let u = (point.x - r.left - offset(position[0], r.width - w)) / w;
    let v = (point.y - r.top - offset(position[1] || '50%', r.height - h)) / h;
    if (repeat === 'repeat' || repeat === 'repeat-x') u = (u % 1 + 1) % 1;
    if (repeat === 'repeat' || repeat === 'repeat-y') v = (v % 1 + 1) % 1;
    return pixel(entry, u, v);
  }
  function gradientPixel(node, layer, point) {
    if (!/^(linear|radial)-gradient\(/.test(layer)) return null;
    const parts = split(layer.slice(layer.indexOf('(') + 1, -1));
    const stops = parts.map(p => { const m = /(rgba?\([^)]+\))(?:\s+(-?[\d.]+)%)/.exec(p) || /(rgba?\([^)]+\))/.exec(p); return m ? { color: rgba(m[1]), at: m[2] === undefined ? null : +m[2] / 100 } : null; }).filter(Boolean);
    if (!stops.length) return null;
    stops.forEach((stop, i) => { if (stop.at === null) stop.at = i / Math.max(1, stops.length - 1); });
    const r = box(node), direction = parts[0]; let t;
    if (layer.startsWith('radial')) t = clamp(Math.hypot((point.x - r.left - r.width / 2) / Math.max(r.width / 2, 1), (point.y - r.top - r.height / 2) / Math.max(r.height / 2, 1)));
    else {
      const degrees = direction.includes('deg') ? parseFloat(direction) : direction.includes('to right') ? 90 : direction.includes('to left') ? 270 : direction.includes('to top') ? 0 : 180;
      const angle = degrees * Math.PI / 180, dx = Math.sin(angle), dy = -Math.cos(angle);
      t = clamp(.5 + ((point.x - r.left - r.width / 2) * dx + (point.y - r.top - r.height / 2) * dy) / Math.max(1, Math.abs(r.width * dx) + Math.abs(r.height * dy)));
    }
    if (t <= stops[0].at) return stops[0].color;
    for (let i = 1; i < stops.length; i++) if (t <= stops[i].at) {
      const a = stops[i - 1], b = stops[i], f = clamp((t - a.at) / Math.max(.0001, b.at - a.at));
      return a.color.map((v, k) => v + (b.color[k] - v) * f);
    }
    return stops[stops.length - 1].color;
  }
  function backdrop(element, point, sourceImage, ignoreSelf) {
    const layers = [];
    if (sourceImage) { const c = imagePixel(sourceImage, point); if (c) layers.push(c); }
    let node = sourceImage ? sourceImage.parentElement : ignoreSelf ? element.parentElement : element;
    while (node instanceof SVGElement) node = node.parentElement;
    let transmission = layers.reduce((v, c) => v * (1 - c[3]), 1);
    for (; node && transmission > .001; node = node.parentElement) {
      const s = style(node);
      // Chromagen places its full photograph behind sibling arrow crops.
      const photograph = node.matches('.cg-poster') ? node.querySelector(':scope > img.cg-backdrop') : null;
      if (photograph) { const c = imagePixel(photograph, point); if (c) { layers.push(c); transmission *= 1 - c[3]; } }
      if (transmission <= .001) break;
      split(s.backgroundImage).forEach((layer, i) => {
        const c = layer.startsWith('url(') ? backgroundPixel(node, layer, i, point) : gradientPixel(node, layer, point);
        if (c) { layers.push(c); transmission *= 1 - c[3]; }
      });
      const base = rgba(s.backgroundColor); layers.push(base); transmission *= 1 - base[3];
    }
    let rgb = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) rgb = rgb.map((v, k) => layers[i][k] * layers[i][3] + v * (1 - layers[i][3]));
    return rgb;
  }
  function measure(element, sourceImage, ignoreSelf = false) {
    if (!scoped(element)) return null;
    const r = box(element); if ((!r.width && !r.height) || !Number.isFinite(r.left + r.top + r.width + r.height)) return null;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    // Nearby samples suppress the colored source arrow itself and JPEG edges.
    const dx = Math.min(12, Math.max(4, r.width / 2 + 2)), dy = Math.min(12, Math.max(4, r.height / 2 + 2));
    const points = [[0, 0], [-dx, -dy], [dx, -dy], [-dx, dy], [dx, dy], [-dx, 0], [dx, 0], [0, -dy], [0, dy]];
    const values = points.map(([a, b]) => luminance(backdrop(element, { x: x + a, y: y + b }, sourceImage, ignoreSelf))).sort((a, b) => a - b);
    const light = values[Math.floor(values.length / 2)];
    const darkContrast = (Math.max(light, navyLuminance) + .05) / (Math.min(light, navyLuminance) + .05);
    const whiteContrast = 1.05 / (light + .05);
    const result = { color: darkContrast >= whiteContrast ? NAVY : WHITE, luminance: light, navyContrast: darkContrast, whiteContrast };
    measurements.set(element, result); return result;
  }
  function color(element, ignoreSelf = false) { return measure(element, null, ignoreSelf)?.color || null; }
  function paintArtwork(svg, sourceImage) {
    if (!scoped(sourceImage) || !svg.isConnected) return;
    for (const path of svg.querySelectorAll('[data-arotec-arrow-line],[data-scents-arrow-line]')) {
      const result = measure(path, sourceImage); if (!result) continue;
      if (path.style.getPropertyValue('--arotec-arrow-color') !== result.color) path.style.setProperty('--arotec-arrow-color', result.color, 'important');
      if (path.hasAttribute('data-scents-arrow-line')) {
        if (path.style.color !== 'var(--arotec-arrow-color)') path.style.color = 'var(--arotec-arrow-color)';
        if (path.hasAttribute('data-scents-arrow-fill') && path.style.fill !== 'var(--arotec-arrow-color)') path.style.setProperty('fill', 'var(--arotec-arrow-color)', 'important');
      }
    }
  }
  function refresh() {
    refreshQueued = false; clear();
    for (const el of measurements.keys()) if (!el.isConnected) measurements.delete(el);
    window.ArotecArrowContrast?.refresh();
    window.ArotecScentsArtworkArrowsA?.refresh();
    window.ArotecScentsArtworkArrowsB?.refresh();
  }
  function schedule() { if (!refreshQueued) { refreshQueued = true; requestAnimationFrame(refresh); } }
  window.ArotecScentsArrowContrast = Object.freeze({ color, paintArtwork, refresh: schedule, inspect: () => [...measurements].filter(([el]) => el.isConnected && (box(el).width || box(el).height)).map(([el, result]) => ({ panel: el.closest(SCOPE)?.id, tag: el.tagName, class: el.getAttribute('class'), ...result })) });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('hashchange', schedule);
  document.addEventListener('load', event => { if (event.target instanceof HTMLImageElement && scoped(event.target)) schedule(); }, true);
  document.addEventListener('scroll', event => { if (scoped(event.target)) schedule(); }, { capture: true, passive: true });
  document.fonts?.ready.then(schedule);
  schedule();
})();
