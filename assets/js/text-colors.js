/* Arotec text palette. Backgrounds, artwork, content and typography stay owned
   by their original components. Unknown image pixels are reported, not guessed. */
(function (host) {
  'use strict';
  const NAVY = '#113568', WHITE = '#ffffff';
  const navy = { r: 17, g: 53, b: 104, a: 1 }, white = { r: 255, g: 255, b: 255, a: 1 };
  function parseColor(value) {
    const s = String(value || '').trim().toLowerCase();
    if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const h = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
    if (h) {
      const v = h[1].length < 5 ? Array.from(h[1], c => c + c).join('') : h[1];
      return { r: parseInt(v.slice(0, 2), 16), g: parseInt(v.slice(2, 4), 16), b: parseInt(v.slice(4, 6), 16), a: v.length === 8 ? parseInt(v.slice(6), 16) / 255 : 1 };
    }
    // Chromium can retain color(srgb ...) for computed color-mix surfaces.
    const srgb = /^color\(srgb\s+([^)]+)\)$/.exec(s);
    if (srgb) {
      const values = srgb[1].replace(/\//g, ' ').trim().split(/\s+/);
      if (values.length !== 3 && values.length !== 4) return null;
      const unit = n => n.endsWith('%') ? parseFloat(n) / 100 : Number(n);
      const rgb = values.slice(0, 3).map(unit), a = values[3] === undefined ? 1 : unit(values[3]);
      if (rgb.some(n => !Number.isFinite(n) || n < 0 || n > 1) || !Number.isFinite(a) || a < 0 || a > 1) return null;
      return { r: rgb[0] * 255, g: rgb[1] * 255, b: rgb[2] * 255, a };
    }
    const m = /^rgba?\(([^)]+)\)$/.exec(s);
    if (!m) return null;
    const parts = m[1].replace(/\//g, ' ').replace(/,/g, ' ').trim().split(/\s+/);
    if (parts.length !== 3 && parts.length !== 4) return null;
    const channel = p => p.endsWith('%') ? parseFloat(p) * 2.55 : Number(p);
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : Number(parts[3]);
    const rgb = parts.slice(0, 3).map(channel);
    if (rgb.some(v => !Number.isFinite(v) || v < 0 || v > 255.00001) || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;
    return { r: Math.min(255, rgb[0]), g: Math.min(255, rgb[1]), b: Math.min(255, rgb[2]), a: alpha };
  }
  function composite(top, bottom) {
    if (!top || !bottom) return null;
    const a = top.a + bottom.a * (1 - top.a);
    if (!a) return { r: 0, g: 0, b: 0, a: 0 };
    const c = k => (top[k] * top.a + bottom[k] * bottom.a * (1 - top.a)) / a;
    return { r: c('r'), g: c('g'), b: c('b'), a };
  }
  function luminance(c) {
    if (!c) return NaN;
    const linear = n => { const v = n / 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * linear(c.r) + .7152 * linear(c.g) + .0722 * linear(c.b);
  }
  function contrast(a, b) {
    const la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05);
  }
  function choose(background) {
    if (!background || background.a < .9999) return null;
    const nr = contrast(navy, background), wr = contrast(white, background), dark = wr > nr;
    const ratio = dark ? wr : nr;
    return { tone: dark ? 'white' : 'navy', color: dark ? WHITE : NAVY, ratio, minAA: ratio >= 4.5 };
  }
  function boundedSurface(partial) {
    if (!partial || !Number.isFinite(partial.a) || partial.a <= 0 || partial.a > 1 || ['r', 'g', 'b'].some(k => !Number.isFinite(partial[k]) || partial[k] < 0 || partial[k] > 255)) return null;
    const samples = [];
    for (const r of [0, 255]) for (const g of [0, 255]) for (const b of [0, 255]) samples.push(choose(composite(partial, { r, g, b, a: 1 })));
    const tone = samples[0].tone, ratio = Math.min(...samples.map(s => s.ratio));
    if (!samples.every(s => s.tone === tone) || ratio < 4.5) return null;
    return { tone, color: tone === 'white' ? WHITE : NAVY, ratio, minAA: true, unknownUnderlayBound: true };
  }
  const EXCLUDE = 'svg, math, canvas, [data-text-color-preserve], [data-color-artwork], .brand, .brand-logo';
  const ICON = /(?:^|\s)(?:ph(?:-[\w-]+)?|material-icons|material-symbols(?:-[\w-]+)?|fa(?:[bsrltd])?|fa-[\w-]+|icon-font)(?:\s|$)/;
  const EXCLUDED_TAGS = new Set(['script', 'style', 'template', 'svg', 'math', 'canvas', 'img', 'video', 'audio', 'object', 'embed', 'iframe', 'path', 'use', 'noscript']);
  function eligible(el) {
    if (!el || el.nodeType !== 1 || el.namespaceURI !== 'http://www.w3.org/1999/xhtml') return false;
    const tag = String(el.localName || el.tagName || '').toLowerCase();
    if (EXCLUDED_TAGS.has(tag) || el.closest(EXCLUDE)) return false;
    for (let p = el; p; p = p.parentElement) if (ICON.test(String(p.className || ''))) return false;
    return true;
  }
  function candidate(el) {
    if (!eligible(el)) return false;
    const tag = String(el.localName || el.tagName || '').toLowerCase();
    if (tag === 'input') return !/^(?:checkbox|radio|range|image|hidden|color)$/i.test(el.type || 'text');
    if (['textarea', 'select', 'option', 'button'].includes(tag)) return true;
    return Array.from(el.childNodes || []).some(n => n.nodeType === 3 && /\S/.test(n.nodeValue || ''));
  }
  const utilities = Object.freeze({ parseColor, composite, luminance, contrast, choose, candidate, opaqueGradientTone, boundedSurface });
  if (typeof module !== 'undefined' && module.exports) module.exports = utilities;
  const doc = host && host.document;
  if (!doc || host.ArotecTextColors) return;

  /* These are source-specific painted areas, not an inference that any image
     is uniformly dark. The photograph still requires visual contrast review. */
  const SEMANTIC = Object.freeze([
    { selector: '.vagus-countdown__digits', tone: 'white', reason: 'vagus-dark-photographic-digit-tiles' },
    { selector: '.vagus-launch', tone: 'white', reason: 'vagus-dark-image-area' },
    { selector: '#home-hero .hero-art-labels', tone: 'white', reason: 'home-art-labels-dark-image-area' },
    { selector: '#home-hero .hero-reference-copy, #home-hero .hero-content', tone: 'navy', reason: 'home-copy-light-image-area' },
    { selector: '.nss-hero-copy', tone: 'white', reason: 'nss-dark-hero-image-area' },
    { selector: '.olf-page .olf-sidebar', tone: 'white', reason: 'olfactiva-dark-sidebar-area' },
    { selector: '.shb-hero-copy', tone: 'white', reason: 'sleep-beauty-dark-hero-area' },
    { selector: '.cg-page .cg-rail', tone: 'white', reason: 'chromgen-dark-gradient-rail' },
    { selector: '.tv-page .tv-sidebar', tone: 'white', reason: 'trevion-dark-gradient-sidebar' },
    { selector: 'body.commerce-page main', tone: 'white', reason: 'commerce-dark-gradient-shell' },
    { selector: 'body.shb-page main', tone: 'white', reason: 'sleep-beauty-dark-gradient-main' },
    { selector: '.sf-page .sf-final-cta', tone: 'white', reason: 'synesthetic-flavor-dark-final-cta' },
    { selector: '.kb-page .kb-years', tone: 'navy', reason: 'kobayashi-years-light-paper-with-weak-overlay' },
    { selector: '#adminLoginForm, #memberForm, #contactForm, body[data-page="contact"] .contact-card, body[data-page="platform"] .page-hero .stat-card', tone: 'navy', reason: 'source-owned-white-glass-with-weak-decoration' }
  ]);
  const pending = new Set(), states = new WeakMap(), reviews = new Map();
  let frame = 0, cycle = 0, ownWrites = 0, total = 0;
  let styleCache = new WeakMap(), pseudoCache = new WeakMap(), pseudoBackdropCache = new WeakMap(), imageCache = new WeakMap();
  function css(el, pseudo) {
    if (pseudo) {
      if (!pseudoCache.has(el)) pseudoCache.set(el, new Map());
      const map = pseudoCache.get(el);
      if (!map.has(pseudo)) map.set(pseudo, host.getComputedStyle(el, pseudo));
      return map.get(pseudo);
    }
    if (!styleCache.has(el)) styleCache.set(el, host.getComputedStyle(el));
    return styleCache.get(el);
  }
  function pseudoBackdrop(el) {
    if (pseudoBackdropCache.has(el)) return pseudoBackdropCache.get(el);
    const result = ['::before', '::after'].some(p => {
      const s = css(el, p), bg = parseColor(s.backgroundColor);
      if (s.content === 'none' || s.content === 'normal' || s.display === 'none') return false;
      if (!(bg && bg.a > .01) && (!s.backgroundImage || s.backgroundImage === 'none')) return false;
      if (!/^(absolute|fixed)$/.test(s.position)) return false;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      return /^(absolute|fixed)$/.test(s.position) && parseFloat(s.width) >= rect.width * .5 && parseFloat(s.height) >= rect.height * .5;
    });
    pseudoBackdropCache.set(el, result);
    return result;
  }
  function backdrop(el) {
    const layers = [], reasons = [];
    let opaqueOwner = null, gradientTone = null, gradientOwner = null;
    let partial = { r: 0, g: 0, b: 0, a: 0 }, collectKnownSurface = true;
    for (let p = el; p; p = p.parentElement) {
      const s = css(p), bg = parseColor(s.backgroundColor);
      const imagePaint = s.backgroundImage && s.backgroundImage !== 'none' && s.backgroundClip !== 'text' && s.webkitBackgroundClip !== 'text';
      const pseudoPaint = pseudoBackdrop(p), positionedPaint = positionedImage(p, el);
      // Background images and covering pseudos paint ABOVE their own color.
      // Only fully known descendant solid layers can bound an unknown image.
      if (collectKnownSurface) {
        if (imagePaint || pseudoPaint || positionedPaint || !bg) collectKnownSurface = false;
        else partial = composite(partial, bg);
      }
      if (imagePaint) {
        reasons.push('image-or-gradient');
        if (!gradientTone) {
          gradientTone = opaqueGradientTone(s.backgroundImage);
          if (gradientTone) gradientOwner = p;
        }
      }
      if (Number(s.opacity) < .9999) reasons.push('opacity');
      if (s.mixBlendMode && s.mixBlendMode !== 'normal') reasons.push('blend');
      if (s.filter && s.filter !== 'none') reasons.push('filter');
      if (pseudoPaint) reasons.push('pseudo-backdrop');
      if (positionedPaint) reasons.push('positioned-image');
      if (bg) layers.push(bg); else reasons.push('unparsed-background');
      if (bg && bg.a >= .9999) { opaqueOwner = p; break; }
    }
    // An opaque card blocks backgrounds behind it, but its ancestors can
    // still composite/filter the entire card including its text.
    for (let p = opaqueOwner && opaqueOwner.parentElement; p; p = p.parentElement) {
      const s = css(p);
      if (Number(s.opacity) < .9999) reasons.push('opacity');
      if (s.mixBlendMode && s.mixBlendMode !== 'normal') reasons.push('blend');
      if (s.filter && s.filter !== 'none') reasons.push('filter');
    }
    let result = null;
    for (let i = layers.length - 1; i >= 0; i--) result = result ? composite(layers[i], result) : layers[i];
    // The transparent HTML canvas has an actual UA background. Dark color
    // schemes are ambiguous rather than silently assumed to be white.
    if (result && result.a < .9999 && !String(css(doc.documentElement).colorScheme || '').includes('dark')) result = composite(result, white);
    if (!result || result.a < .9999) reasons.push('unknown-canvas');
    return { color: result, opaqueOwner, gradientTone, gradientOwner, surfaceBound: boundedSurface(partial), reasons: Array.from(new Set(reasons)) };
  }
  function opaqueGradientTone(image) {
    const text = String(image || '');
    if (!/gradient\(/i.test(text) || /url\(|\btransparent\b/i.test(text)) return null;
    const stops = (text.match(/rgba?\([^)]*\)|color\(srgb[^)]*\)|#[0-9a-f]{3,8}\b/gi) || []).map(parseColor);
    if (stops.length < 2 || stops.some(c => !c || c.a < .9999)) return null;
    const tones = stops.map(c => choose(c).tone);
    return tones.every(t => t === tones[0]) ? tones[0] : null;
  }
  function positionedImage(parent, textHost) {
    if (!imageCache.has(parent)) {
      const images = [];
      for (const child of Array.from(parent.children || [])) {
        const image = child.localName === 'img' ? child : child.localName === 'picture' ? child.querySelector('img') : null;
        if (!image) continue;
        const s = css(image);
        if (/^(absolute|fixed)$/.test(s.position) && s.display !== 'none' && s.visibility !== 'hidden') images.push(image.getBoundingClientRect());
      }
      imageCache.set(parent, images);
    }
    const images = imageCache.get(parent);
    if (!images.length) return false;
    const r = textHost.getBoundingClientRect();
    return images.some(i => i.width && i.height && Math.min(r.right, i.right) > Math.max(r.left, i.left) && Math.min(r.bottom, i.bottom) > Math.max(r.top, i.top));
  }
  function semantic(el) {
    const explicit = el.closest('[data-text-surface]');
    if (explicit && ['light', 'dark'].includes(explicit.dataset.textSurface)) return { tone: explicit.dataset.textSurface === 'dark' ? 'white' : 'navy', reason: 'owner-surface', element: explicit };
    for (const map of SEMANTIC) { const element = el.closest(map.selector); if (element) return { ...map, element }; }
    return null;
  }
  function mixedArtwork(el) {
    return Boolean(el.querySelector('svg, canvas, img, video, math, .ph, [class*="ph-"], .material-icons, [class*="material-symbols"], [class*="fa-"]'));
  }
  const CURRENT_COLOR_ART = '.ex-chart-legend li, .stage-group-labels span, .system-card h3, .ex26-chapter-number, .outcome-card__number';
  function currentColorArtwork(el, original) {
    if (el.matches(CURRENT_COLOR_ART)) return true;
    const ink = parseColor(original);
    if (!ink) return false;
    const same = value => {
      const c = parseColor(value);
      return c && Math.abs(c.r - ink.r) < .01 && Math.abs(c.g - ink.g) < .01 && Math.abs(c.b - ink.b) < .01 && Math.abs(c.a - ink.a) < .01;
    };
    const consumesInk = s => {
      if (same(s.backgroundColor)) return true;
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(s['border' + side + 'Width']) > 0 && same(s['border' + side + 'Color'])) return true;
      if (parseFloat(s.outlineWidth) > 0 && same(s.outlineColor)) return true;
      return false;
    };
    if (consumesInk(css(el))) return true;
    for (const pseudo of ['::before', '::after']) {
      const s = css(el, pseudo);
      if (s.content !== 'none' && s.content !== 'normal' && consumesInk(s)) return true;
    }
    return false;
  }
  function textualPseudos(el) {
    return ['::before', '::after'].filter(p => {
      const s = css(el, p), content = String(s.content || '');
      if (s.display === 'none' || s.visibility === 'hidden' || /^(?:none|normal|["']{2})$/.test(content)) return false;
      // Keep icon glyphs and decorative punctuation in their authored palette.
      return !/[\uE000-\uF8FF]/.test(content) && /[A-Za-z0-9\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF]/.test(content);
    });
  }
  function fontIconPseudos(el) {
    return ['::before', '::after'].filter(p => {
      const s = css(el, p), content = String(s.content || '');
      if (s.content === 'none' || s.content === 'normal' || s.display === 'none') return false;
      return /[\uE000-\uF8FF]/.test(content) || /Phosphor|Font Awesome|Material (?:Icons|Symbols)/i.test(String(s.fontFamily || ''));
    });
  }
  function preserveFontIcon(el) {
    const s = css(el), fill = parseColor(s.webkitTextFillColor);
    // Transparent text fill belongs to an authored gradient icon. Leave it
    // in that artwork treatment rather than converting it to a solid glyph.
    if (fill && fill.a === 0) return;
    const ink = s.color;
    if (!parseColor(ink)) return;
    set(el, '-webkit-text-fill-color', ink);
    el.dataset.arotecIconPaint = 'preserve';
    const prev = states.get(el) || {};
    prev.lastStyle = el.getAttribute('style') || '';
    states.set(el, prev);
  }
  function paint(el) {
    // Icon paint protection is independent of a host's own-text eligibility:
    // CTA markup can contain only a label span plus the icon sibling.
    if (el && el.nodeType === 1 && el.namespaceURI === 'http://www.w3.org/1999/xhtml' && ICON.test(String(el.className || ''))) {
      preserveFontIcon(el); return;
    }
    if (!eligible(el)) return;
    const ownText = candidate(el), iconPseudos = fontIconPseudos(el), pseudos = textualPseudos(el).filter(p => !iconPseudos.includes(p)), previous = states.get(el);
    if (!ownText && !pseudos.length && !iconPseudos.length && !(previous?.mode === 'color-and-fill' && mixedArtwork(el))) return;
    const s = css(el);
    if (s.display === 'none' || s.visibility === 'hidden' || !el.getClientRects().length) return;
    const prev = previous || { originalColor: s.color, originalFill: s.webkitTextFillColor, initialStyle: el.getAttribute('style') || '', originalInlineColor: el.style.getPropertyValue('color'), originalInlinePriority: el.style.getPropertyPriority('color'), originalInlineFill: el.style.getPropertyValue('-webkit-text-fill-color'), originalFillPriority: el.style.getPropertyPriority('-webkit-text-fill-color') };
    const b = backdrop(el), known = semantic(el);
    let decision = choose(b.color);
    const reasons = b.reasons.slice();
    const closerSolid = known && b.opaqueOwner && known.element !== b.opaqueOwner && known.element.contains(b.opaqueOwner);
    const closerGradient = known && b.gradientOwner && known.element !== b.gradientOwner && known.element.contains(b.gradientOwner);
    if (b.surfaceBound) {
      decision = { ...b.surfaceBound };
      if (reasons.some(r => ['opacity', 'filter', 'blend'].includes(r))) { decision.ratio = null; decision.minAA = false; reasons.push('surface-bound-before-component-compositing'); }
    } else if (known && !closerSolid && !closerGradient) {
      decision = { tone: known.tone, color: known.tone === 'white' ? WHITE : NAVY, ratio: null, minAA: false };
      reasons.push(known.reason);
    } else if (!decision || reasons.some(r => ['image-or-gradient', 'positioned-image', 'pseudo-backdrop', 'unknown-canvas'].includes(r))) {
      // Original rendered paint is useful for choosing the requested palette,
      // but never evidence of contrast against unknown photograph pixels.
      const originalFill = parseColor(prev.originalFill);
      const original = originalFill && originalFill.a > 0 ? originalFill : parseColor(prev.originalColor);
      const gradientProxy = b.gradientTone && !reasons.includes('positioned-image') && !reasons.includes('pseudo-backdrop');
      const tone = gradientProxy || (original && original.a > 0 && luminance(original) > .4 ? 'white' : 'navy');
      decision = { tone, color: tone === 'white' ? WHITE : NAVY, ratio: null, minAA: false };
      if (gradientProxy) reasons.push('opaque-gradient-stops-proxy');
      reasons.push('visual-review-required');
    }
    const mixed = mixedArtwork(el) || iconPseudos.length > 0 || currentColorArtwork(el, prev.originalColor);
    if (mixed && prev.mode === 'color-and-fill') {
      // A new icon/image/border can enter a previously plain text host. Restore
      // original CSS color before protecting its inherited currentColor art.
      el.dataset.arotecTextMode = 'fill-only';
      if (prev.originalInlineColor) el.style.setProperty('color', prev.originalInlineColor, prev.originalInlinePriority || '');
      else el.style.removeProperty('color');
      styleCache.delete(el);
      if (!ownText || el.querySelector('svg text, svg tspan, math')) {
        delete el.dataset.arotecTextTone;
        if (prev.originalInlineFill) el.style.setProperty('-webkit-text-fill-color', prev.originalInlineFill, prev.originalFillPriority || '');
        else el.style.removeProperty('-webkit-text-fill-color');
      }
    }
    // Color on a mixed host would alter currentColor SVG paths. Painting only
    // the font preserves those paths. SVG text is kept for explicit review.
    if (mixed && el.querySelector('svg text, svg tspan, math')) {
      reviews.set(el, { reason: 'mixed-svg-text', selector: label(el) });
      el.dataset.arotecTextReview = 'mixed-svg-text';
      return;
    }
    if (ownText && !mixed) set(el, 'color', decision.color);
    if (ownText) set(el, '-webkit-text-fill-color', decision.color);
    if (ownText && mixed) {
      // A font icon's paint must continue to follow its own CSS color rather
      // than inherit the host's text-fill. This does not change icon color.
      for (const icon of el.querySelectorAll('i, span')) if (ICON.test(String(icon.className || ''))) preserveFontIcon(icon);
    }
    if (ownText) {
      el.dataset.arotecTextTone = decision.tone;
      el.dataset.arotecTextMode = mixed ? 'fill-only' : 'color-and-fill';
    }
    for (const pseudo of ['::before', '::after']) {
      const toneKey = pseudo === '::before' ? 'arotecBeforeTone' : 'arotecAfterTone';
      const iconKey = pseudo === '::before' ? 'arotecIconBefore' : 'arotecIconAfter';
      if (iconPseudos.includes(pseudo)) { delete el.dataset[toneKey]; el.dataset[iconKey] = 'preserve'; }
      else { delete el.dataset[iconKey]; if (!pseudos.includes(pseudo)) delete el.dataset[toneKey]; }
    }
    for (const pseudo of pseudos) {
      const ps = css(el, pseudo), pb = parseColor(ps.backgroundColor);
      const pc = pb && pb.a > 0 ? choose(composite(pb, b.color)) : null;
      el.dataset[pseudo === '::before' ? 'arotecBeforeTone' : 'arotecAfterTone'] = (pc || decision).tone;
    }
    const large = parseFloat(s.fontSize) >= 24 || parseFloat(s.fontSize) >= 18.6667 && Number(s.fontWeight) >= 700;
    const required = large ? 3 : 4.5;
    if (decision.ratio !== null && decision.ratio < required) reasons.push('palette-below-aa');
    if (reasons.length) {
      el.dataset.arotecTextReview = Array.from(new Set(reasons)).join(',');
      reviews.set(el, { selector: label(el), tone: decision.tone, ratio: decision.ratio, required, reasons: Array.from(new Set(reasons)) });
    } else { delete el.dataset.arotecTextReview; reviews.delete(el); }
    prev.lastStyle = el.getAttribute('style') || '';
    prev.mode = mixed ? 'fill-only' : 'color-and-fill';
    states.set(el, prev); total++;
  }
  function set(el, property, value) {
    const existing = el.style.getPropertyValue(property), a = parseColor(existing), b = parseColor(value);
    const equalPaint = a && b && ['r', 'g', 'b', 'a'].every(k => Math.abs(a[k] - b[k]) < .00001);
    if ((!equalPaint && existing !== value) || el.style.getPropertyPriority(property) !== 'important') {
      el.style.setProperty(property, value, 'important'); ownWrites++;
    }
  }
  function label(el) { return el.localName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''); }
  function elements(root) {
    const all = root.nodeType === 1 ? [root] : [];
    return all.concat(Array.from(root.querySelectorAll ? root.querySelectorAll('*') : []));
  }
  function flush() {
    frame = 0; cycle++; styleCache = new WeakMap(); pseudoCache = new WeakMap(); pseudoBackdropCache = new WeakMap(); imageCache = new WeakMap();
    for (const el of reviews.keys()) if (!el.isConnected) reviews.delete(el);
    const roots = Array.from(pending); pending.clear();
    // A parent pass covers descendants; avoid repeated work from the same
    // localization transaction. The set and bounded frame combine mutations.
    for (const root of roots.filter(r => r.isConnected && !roots.some(p => p !== r && p.contains(r)))) {
      for (const el of elements(root)) paint(el);
    }
  }
  function queue(root) {
    if (!root || root.nodeType !== 1) return;
    pending.add(root);
    if (!frame) frame = host.requestAnimationFrame(flush);
  }
  function refresh(root) { queue(root || doc.body); if (frame) { host.cancelAnimationFrame(frame); flush(); } return inspect(); }
  function inspect() {
    for (const el of reviews.keys()) if (!el.isConnected) reviews.delete(el);
    return { navy: NAVY, white: WHITE, cycles: cycle, writes: ownWrites, visits: total, reviewCount: reviews.size, reviews: Array.from(reviews.values()).slice(0, 1500) };
  }
  function start() {
    refresh(doc.body);
    const observer = new host.MutationObserver(records => {
      for (const record of records) {
        const el = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        if (!el) continue;
        if (record.type === 'attributes' && record.attributeName === 'style' && states.get(el)?.lastStyle === (el.getAttribute('style') || '')) continue;
        if (record.type === 'childList') {
          queue(el);
          for (const node of record.addedNodes) if (node.nodeType === 1) { queue(node); watchSections(node); }
        } else queue(el);
      }
    });
    observer.observe(doc.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'disabled', 'aria-expanded', 'lang', 'data-text-surface'] });
    // Authored content-visibility:auto sections can have rectless text before
    // the browser renders them. Re-evaluate their text when it becomes visible,
    // without rescanning the entire document on every scroll event.
    doc.addEventListener('contentvisibilityautostatechange', e => {
      if (!e.skipped && e.target && e.target.nodeType === 1) queue(e.target);
    }, true);
    let visibilityObserver = null;
    const observedSections = new WeakSet();
    if (typeof host.IntersectionObserver === 'function') {
      visibilityObserver = new host.IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) queue(entry.target);
      }, { rootMargin: '300px 0px' });
    }
    function watchSections(root) {
      if (!visibilityObserver || !root || !root.querySelectorAll) return;
      const sections = root.matches && root.matches('section,article,main') ? [root] : [];
      sections.push(...root.querySelectorAll('section,article,main'));
      for (const section of sections) {
        if (!observedSections.has(section) && host.getComputedStyle(section).contentVisibility === 'auto') {
          observedSections.add(section); visibilityObserver.observe(section);
        }
      }
    }
    watchSections(doc.body);
    let resizeFrame = 0;
    host.addEventListener('resize', () => { if (!resizeFrame) resizeFrame = host.requestAnimationFrame(() => { resizeFrame = 0; queue(doc.body); }); }, { passive: true });
    for (const event of ['pointerover', 'pointerout', 'focusin', 'focusout', 'pointerdown', 'pointerup', 'change']) doc.addEventListener(event, e => {
      const target = e.target && e.target.nodeType === 1 ? e.target : null;
      if (target) queue(target.parentElement || target);
    }, { passive: true });
    doc.addEventListener('arotec:languagechange', () => queue(doc.body));
    doc.addEventListener('transitionend', e => {
      if (/^(?:background(?:-color)?|color|opacity|filter)$/.test(e.propertyName || '') && e.target && e.target.nodeType === 1) queue(e.target);
    }, true);
    host.addEventListener('load', () => queue(doc.body), { once: true });
    host.ArotecTextColors = Object.freeze({ utilities, refresh, inspect, semanticMaps: SEMANTIC });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})(typeof window !== 'undefined' ? window : null);
