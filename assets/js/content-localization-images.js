/* Exact, approved raster variants. Original artwork and layout remain authoritative. */
(() => {
  'use strict';
  const scriptURL = document.currentScript?.src;
  if (!scriptURL || window.ArotecImages) return;
  const root = new URL('../../', scriptURL), attributes = new WeakMap(), declarations = new WeakMap(), inline = new WeakMap();
  const probes = new Map(), issues = new Map(), supported = new Set(['en', 'ja', 'zh-CN', 'zh', 'th']);
  let lookup = new Map(), manifest = null, scheduled = false, passes = 0, writes = 0;
  const canonical = (value, base) => {
    try { const url = new URL(value, base); url.search = ''; url.hash = ''; return url.href; } catch { return null; }
  };
  const currentLocale = () => {
    const value = window.ArotecI18n?.currentLocale || localStorage.getItem('as-site-language') || 'en';
    return supported.has(value) ? value : value === 'zh-Hant' ? 'zh' : 'en';
  };
  function issue(code, index, locale, url) {
    const key = `${code}:${index}:${locale}`;
    if (!issues.has(key)) issues.set(key, { code, index, locale, url });
  }
  function ingest() {
    const next = window.ArotecImageManifest;
    if (next === manifest) return;
    if (!next || next.version !== 1 || !Array.isArray(next.images)) return;
    const entries = new Map();
    for (const entry of next.images) {
      if (entry.enabled === false) continue;
      const source = canonical(entry.source, root);
      if (!source || new URL(source).origin !== root.origin || entries.has(source)) {
        issue('invalid-manifest-entry', entry.index, '', source); continue;
      }
      entries.set(source, entry);
    }
    lookup = entries; manifest = next;
  }
  function variant(raw, base, locale) {
    const entry = lookup.get(canonical(raw, base));
    if (!entry) return { matched: false, url: raw };
    if (locale === 'en') return { matched: true, url: raw };
    const target = entry.variants?.[locale];
    if (!target) { issue('missing-manifest-variant', entry.index, locale, ''); return { matched: true, url: raw }; }
    const url = new URL(target, root).href;
    if (new URL(url).origin !== root.origin) { issue('invalid-variant-origin', entry.index, locale, url); return { matched: true, url: raw }; }
    let probe = probes.get(url);
    if (!probe) {
      probe = { status: 'loading', index: entry.index, locale, url }; probes.set(url, probe);
      const image = new Image(); probe.image = image;
      image.onload = () => {
        probe.status = image.naturalWidth > 0 && image.naturalHeight > 0 ? 'ready' : 'failed';
        probe.width = image.naturalWidth; probe.height = image.naturalHeight; delete probe.image;
        if (probe.status === 'failed') issue('variant-load-failed', entry.index, locale, url);
        queue();
      };
      image.onerror = () => { probe.status = 'failed'; delete probe.image; issue('variant-load-failed', entry.index, locale, url); queue(); };
      image.src = url;
    }
    return { matched: true, url: probe.status === 'ready' ? url : raw };
  }
  const cssUnescape = value => value.replace(/\\([0-9a-fA-F]{1,6})\s?|\\([^\r\n])/g, (_, hex, char) => hex ? String.fromCodePoint(parseInt(hex, 16) || 0xfffd) : char);
  // Scan actual url() tokens, skipping quoted literal content and escaped characters.
  function cssURLs(value, base, locale) {
    let result = '', start = 0, i = 0, matched = false;
    while (i < value.length) {
      if (value[i] === '"' || value[i] === "'") {
        const quote = value[i++]; while (i < value.length && value[i] !== quote) i += value[i] === '\\' ? 2 : 1; i++; continue;
      }
      const token = value.slice(i).match(/^url\(\s*/i);
      if (!token || (i && /[\w-]/.test(value[i - 1]))) { i++; continue; }
      let p = i + token[0].length, end, text;
      if (value[p] === '"' || value[p] === "'") {
        const quote = value[p++], from = p; while (p < value.length && value[p] !== quote) p += value[p] === '\\' ? 2 : 1;
        if (p >= value.length) break; text = value.slice(from, p++); while (/\s/.test(value[p] || '') && p < value.length) p++;
        if (value[p] !== ')') { i = p; continue; } end = p + 1;
      } else {
        const from = p; while (p < value.length && value[p] !== ')') p += value[p] === '\\' ? 2 : 1;
        if (p >= value.length) break; text = value.slice(from, p).trim(); end = p + 1;
      }
      const replacement = variant(cssUnescape(text), base, locale); matched ||= replacement.matched;
      if (replacement.url !== cssUnescape(text)) { result += value.slice(start, i) + 'url(' + JSON.stringify(replacement.url) + ')'; start = end; }
      i = end;
    }
    return { matched, value: result + value.slice(start) };
  }
  // Preserve srcset descriptors and separators; URL tokens may contain commas (data URLs).
  function srcset(value, base, locale) {
    let result = '', start = 0, i = 0, matched = false;
    while (i < value.length) {
      while (i < value.length && /[\s,]/.test(value[i])) i++;
      const from = i; while (i < value.length && !/\s/.test(value[i])) i++;
      let end = i; while (end > from && value[end - 1] === ',') end--;
      if (end === from) continue;
      const replacement = variant(value.slice(from, end), base, locale); matched ||= replacement.matched;
      if (replacement.url !== value.slice(from, end)) { result += value.slice(start, from) + replacement.url; start = end; }
      if (end < i) continue;
      let depth = 0;
      while (i < value.length) { const char = value[i++]; if (char === '(') depth++; else if (char === ')') depth--; else if (char === ',' && depth === 0) break; }
    }
    return { matched, value: result + value.slice(start) };
  }
  function attribute(element, name, locale) {
    const value = element.getAttribute(name);
    let states = attributes.get(element), state = states?.get(name);
    if (value === null) { states?.delete(name); return; }
    if (state && value !== state.applied) state.original = value;
    const original = state ? state.original : value;
    const replacement = name === 'srcset' ? srcset(original, element.baseURI, locale) : variant(original, element.baseURI, locale);
    const next = name === 'srcset' ? replacement.value : replacement.url;
    if (!state && !replacement.matched) return;
    if (!states) { states = new Map(); attributes.set(element, states); }
    if (!state) { state = { original, applied: value }; states.set(name, state); }
    if (value !== next) { element.setAttribute(name, next); writes++; }
    state.applied = next;
  }
  // Custom properties can carry the same approved url() into backgrounds or
  // pseudo content. The token scanner still requires an exact manifest source.
  const imageProperty = name => ['background', 'background-image', 'content'].includes(name) || name.startsWith('--');
  function style(style, base, locale) {
    let states = declarations.get(style), changed = false;
    const properties = new Set([...Array.from(style), ...Array.from(states?.keys() || [])]);
    for (const name of properties) {
      if (!imageProperty(name)) continue;
      const value = style.getPropertyValue(name), priority = style.getPropertyPriority(name);
      let state = states?.get(name);
      if (state && (value !== state.applied || priority !== state.appliedPriority)) { state.original = value; state.priority = priority; }
      const original = state ? state.original : value, replacement = cssURLs(original, base, locale);
      if (!state && !replacement.matched) continue;
      if (!states) { states = new Map(); declarations.set(style, states); }
      if (!state) { state = { original, priority, applied: value, appliedPriority: priority }; states.set(name, state); }
      if (value !== replacement.value || priority !== state.priority) {
        if (replacement.value) style.setProperty(name, replacement.value, state.priority); else style.removeProperty(name);
        writes++; changed = true;
      }
      state.applied = style.getPropertyValue(name); state.appliedPriority = style.getPropertyPriority(name);
    }
    return changed;
  }
  function inlineStyle(element, locale) {
    const raw = element.getAttribute('style'); let state = inline.get(element);
    if (state && raw !== state.applied) state.original = null;
    if (locale === 'en' && state?.original !== null && state?.original !== undefined && raw === state.applied) {
      if (raw !== state.original) { element.setAttribute('style', state.original); writes++; }
      // Reset declaration state after restoring the entire unchanged authored attribute.
      declarations.delete(element.style); inline.delete(element); return;
    }
    const changed = style(element.style, element.baseURI, locale);
    if (changed) {
      if (!state) { state = { original: raw, applied: raw }; inline.set(element, state); }
      state.applied = element.getAttribute('style');
    }
  }
  function stylesheet(sheet, locale, seen) {
    if (!sheet || seen.has(sheet)) return; seen.add(sheet);
    const base = sheet.href || sheet.ownerNode?.baseURI || document.baseURI;
    try { if (new URL(base).origin !== location.origin) return; } catch { return; }
    let rules; try { rules = sheet.cssRules; } catch { return; }
    function visit(list) {
      for (const rule of list) {
        if (rule.style) style(rule.style, base, locale);
        if (rule.styleSheet) stylesheet(rule.styleSheet, locale, seen);
        if (rule.cssRules) visit(rule.cssRules);
      }
    }
    visit(rules);
  }
  function refresh() {
    scheduled = false; ingest(); if (!lookup.size) return;
    const locale = currentLocale(); passes++;
    for (const element of document.querySelectorAll('img, picture source')) {
      if (element.localName === 'img') attribute(element, 'src', locale);
      attribute(element, 'srcset', locale);
    }
    for (const element of document.querySelectorAll('[style]')) inlineStyle(element, locale);
    const seen = new Set(); for (const sheet of [...document.styleSheets, ...(document.adoptedStyleSheets || [])]) stylesheet(sheet, locale, seen);
    document.dispatchEvent(new CustomEvent('arotec:images-updated', { detail: { locale } }));
  }
  function queue() { if (!scheduled) { scheduled = true; setTimeout(refresh, 0); } }
  function changedImageStyle(element) {
    // Animation transforms/colors do not require a full document image refresh.
    const states = declarations.get(element.style);
    const properties = new Set([...Array.from(element.style), ...Array.from(states?.keys() || [])]);
    for (const name of properties) {
      if (!imageProperty(name)) continue;
      const state = states?.get(name), value = element.style.getPropertyValue(name);
      if (state) {
        if (value !== state.applied || element.style.getPropertyPriority(name) !== state.appliedPriority) return true;
      } else if (/url\(/i.test(value) && cssURLs(value, element.baseURI, currentLocale()).matched) return true;
    }
    return false;
  }
  window.ArotecImages = Object.freeze({
    refresh: queue,
    retryMissing() { for (const [url, probe] of probes) if (probe.status === 'failed') probes.delete(url); for (const [key, row] of issues) if (row.code === 'variant-load-failed') issues.delete(key); queue(); },
    diagnostics: () => ({ locale: currentLocale(), root: root.href, approvedAssets: lookup.size, heldAssets: (manifest?.images || []).filter(entry => entry.enabled === false).map(({ index, source, reviewStatus }) => ({ index, source, reviewStatus })), passes, writes, issues: Array.from(issues.values(), row => ({ ...row })), variants: Array.from(probes.values(), ({ image, ...state }) => ({ ...state })) })
  });
  for (const event of ['arotec:i18n-ready', 'arotec:languagechange', 'arotec:image-manifest-ready', 'pageshow']) window.addEventListener(event, queue);
  // Native locale events may be dispatched on document without bubbling.
  for (const event of ['arotec:i18n-ready', 'arotec:languagechange', 'arotec:image-manifest-ready']) document.addEventListener(event, queue);
  document.addEventListener('load', event => { if (event.target?.matches?.('link[rel~="stylesheet"]')) queue(); }, true);
  new MutationObserver(records => {
    if (records.some(record => {
      if (record.type === 'childList' || record.type === 'characterData') return true;
      if (record.attributeName === 'style') return changedImageStyle(record.target);
      if (['src', 'srcset'].includes(record.attributeName)) return attributes.get(record.target)?.get(record.attributeName)?.applied !== record.target.getAttribute(record.attributeName);
      return ['href', 'rel'].includes(record.attributeName);
    })) queue();
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['src', 'srcset', 'style', 'href', 'rel'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queue, { once: true });
  queue();
})();
