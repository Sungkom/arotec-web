/* Arotec page-scoped localization. Catalog text is data, never HTML. */
(() => {
  'use strict';
  if (window.ArotecI18n) return;
  const LANGUAGE_KEY = 'as-site-language';
  const LANGUAGES = { en: 'en', ja: 'ja', 'zh-CN': 'zh-CN', zh: 'zh-Hant', th: 'th' };
  const canonical = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  const localeOf = value => value === 'zh-Hant' ? 'zh' : (Object.hasOwn(LANGUAGES, value) ? value : null);
  const readLocale = () => { try { return localeOf(localStorage.getItem(LANGUAGE_KEY)); } catch (_) { return null; } };
  let locale = readLocale() || localeOf(document.body?.dataset.defaultLanguage) || 'th';
  const script = document.currentScript;
  const base = script?.src ? new URL('../../', script.src).pathname : '/';
  const decode = value => { try { return decodeURIComponent(value); } catch (_) { return value; } };
  let page = decode(location.pathname);
  if (page.startsWith(decode(base))) page = page.slice(decode(base).length);
  page = page.replace(/^\/+/, '');
  if (!page || page.endsWith('/')) page += 'index.html';
  const entries = new Map(), renderers = new Map(), nodeStates = new WeakMap();
  const results = new Map();
  const managedLanguages = new WeakSet();
  const issues = new Map();
  let managed = false, validated = false, scheduled = false, applying = false, nativeEvents = 0, readyResolve;
  let registrations = Promise.resolve();
  const readyPromise = new Promise(resolve => { readyResolve = resolve; });
  const statistics = { passes: 0, bindings: 0, writes: 0 };
  function report(code, id, detail = '') {
    const key = `${code}|${id}|${detail}`;
    if (!issues.has(key) && issues.size < 2000) issues.set(key, { code, id, detail });
  }
  function isOpaque(el) {
    return ['br', 'img', 'svg', 'math', 'hr', 'wbr'].includes(el.localName) ||
      el.matches('[data-arotec-i18n-value],[translate="no"],[data-preserve-content]') ||
      /material-symbols|material-icons|\bph(?:-|\s|$)/.test(String(el.className));
  }
  function snapshot(el, previous, ignoreMarkers = false) {
    const nodes = previous?.nodes || [], ids = previous?.ids || new Map();
    const clonedId = !previous && !ignoreMarkers && el.getAttribute('data-arotec-i18n-bound');
    let valid = true;
    function visit(node, parentIndex = null) {
      if (node.nodeType === 3) return node.nodeValue;
      if (node.nodeType !== 1) return '';
      let index = ids.get(node);
      if (index === undefined) {
        if (previous) { valid = false; return ''; }
        const marker = node.getAttribute('data-arotec-i18n-slot');
        if (clonedId) {
          if (!marker?.startsWith(`${clonedId}:`) || !/^\d+$/.test(marker.slice(clonedId.length + 1))) { valid = false; return ''; }
          index = Number(marker.slice(clonedId.length + 1));
          if (nodes[index]) { valid = false; return ''; }
        } else index = nodes.length;
        ids.set(node, index);
        nodes[index] = { node, parentIndex, void: isOpaque(node), tag: node.localName };
      }
      const item = nodes[index];
      if (item.parentIndex !== parentIndex) valid = false;
      if (item.void) return `<${index}/>`;
      return `<${index}>${Array.from(node.childNodes, child => visit(child, index)).join('')}</${index}>`;
    }
    const source = canonical(Array.from(el.childNodes, child => visit(child)).join(''));
    for (let index = 0; index < nodes.length; index += 1) if (!nodes[index]) valid = false;
    if (!valid && clonedId) return snapshot(el, null, true);
    return { source, nodes, ids, valid };
  }
  // Build a complete validated plan before touching the DOM. Numeric tokens refer
  // to existing elements; unknown HTML-like text remains a literal text node.
  function parse(message, state) {
    const tree = [], stack = [{ id: null, children: tree }], seen = new Set();
    const pattern = /<(\/?)(\d+)(\/?)>/g;
    let offset = 0, match;
    while ((match = pattern.exec(message))) {
      if (match.index > offset) stack.at(-1).children.push(message.slice(offset, match.index));
      const id = Number(match[2]), item = state.nodes[id];
      if (!item) return null;
      if (match[1]) {
        if (match[3] || item.void || stack.length === 1 || stack.at(-1).id !== id) return null;
        stack.pop();
      } else {
        if (seen.has(id) || Boolean(match[3]) !== item.void || item.parentIndex !== stack.at(-1).id) return null;
        seen.add(id);
        const plan = { id, children: [] };
        stack.at(-1).children.push(plan);
        if (!item.void) stack.push(plan);
      }
      offset = pattern.lastIndex;
    }
    if (offset < message.length) stack.at(-1).children.push(message.slice(offset));
    return stack.length === 1 && seen.size === state.nodes.length ? tree : null;
  }
  function interpolate(template, params = {}) {
    return template.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (token, name) => Object.hasOwn(params, name) ? String(params[name]) : token);
  }
  function parameterMatcher(template, names) {
    const seen = new Set(), used = [];
    let cursor = 0, pattern = '^', match;
    const tokens = /\{([A-Za-z][A-Za-z0-9_]*)\}/g;
    const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    while ((match = tokens.exec(template))) {
      const name = match[1];
      if (!names.includes(name)) return null;
      pattern += escape(template.slice(cursor, match.index));
      if (seen.has(name)) pattern += `\\k<${name}>`;
      else { pattern += `(?<${name}>[\\s\\S]*?)`; seen.add(name); used.push(name); }
      cursor = tokens.lastIndex;
    }
    pattern += escape(template.slice(cursor)) + '$';
    if (seen.size !== names.length) return null;
    return new RegExp(pattern);
  }
  function materialize(plan, state) {
    return plan.map(part => {
      if (typeof part === 'string') return document.createTextNode(interpolate(part, state.params));
      const item = state.nodes[part.id];
      if (!item.void) item.node.replaceChildren(...materialize(part.children, state));
      return item.node;
    });
  }
  const forbidden = 'script,style,noscript,textarea,datalist,[contenteditable]:not([contenteditable="false"]),[data-arotec-i18n-ignore],[data-user-content]';
  function safeTarget(el, target) {
    if (!el) return false;
    const attr = target.attribute;
    if (attr) {
      if (el.closest('script,style,noscript,datalist,[data-arotec-i18n-ignore],[data-user-content]')) return false;
      if (['title', 'aria-label', 'aria-description', 'aria-roledescription', 'aria-valuetext', 'placeholder', 'alt', 'label', 'data-diagram-title', 'data-label', 'data-tooltip'].includes(attr)) return attr !== 'label' || el.matches('option,optgroup');
      if (attr === 'textContent') return el.localName === 'title' && el.parentElement?.localName === 'head';
      if (attr === 'content') return el.matches('meta[name="description"],meta[property="og:description"],meta[property="og:title"],meta[name="twitter:description"],meta[name="twitter:title"]');
      return attr === 'value' && el.matches('input[type="button"],input[type="submit"],input[type="reset"]');
    }
    if (el.closest(forbidden)) return false;
    if (el.matches('input,select')) return false;
    return target.textNodeIndex != null || !el.querySelector('input,textarea,select,[contenteditable]');
  }
  function candidates(entry) {
    const targets = entry.targets || [{ selector: entry.selector, attribute: entry.attribute, textNodeIndex: entry.textNodeIndex, scope: entry.scope }];
    const result = [], seen = new Map();
    for (const target of targets) {
      const selector = target.selector || `[data-arotec-i18n="${entry.id}"]`;
      let found;
      try {
        let root = document;
        if (target.scope && target.scope !== 'document') {
          if (!target.scope.startsWith('template:')) { report('invalid-scope', entry.id, target.scope); continue; }
          const template = document.querySelector(target.scope.slice('template:'.length));
          if (!template?.content) continue;
          root = template.content;
        }
        found = root.querySelectorAll(selector);
      } catch (_) { report('invalid-selector', entry.id, selector); continue; }
      for (const el of found) {
        const slot = target.attribute ? `a:${target.attribute}` : target.textNodeIndex != null ? `t:${target.textNodeIndex}` : 'message';
        if (!seen.has(el)) seen.set(el, new Set());
        if (seen.get(el).has(slot)) continue;
        seen.get(el).add(slot);
        result.push({ el, target, slot });
      }
    }
    return result;
  }
  function valueOf(el, target, state) {
    if (target.attribute) return canonical(target.attribute === 'textContent' ? el.textContent : el.getAttribute(target.attribute));
    if (target.textNodeIndex != null) {
      const text = el.childNodes[target.textNodeIndex];
      return text?.nodeType === 3 ? canonical(text.nodeValue) : null;
    }
    const result = snapshot(el, state);
    return result.valid ? result.source : null;
  }
  function matchSource(entry, value) {
    if (value == null) return null;
    if (!entry.parameters?.length) return value === entry.source || entry.known.has(value) ? {} : null;
    for (const matcher of entry.matchers) {
      const result = matcher.exec(value);
      if (result) return { ...result.groups };
    }
    return null;
  }
  function bind(entry, el, target, slot) {
    if (!safeTarget(el, target)) return null;
    let slots = nodeStates.get(el);
    if (!slots) { slots = new Map(); nodeStates.set(el, slots); }
    let state = slots.get(slot);
    if (state && state.id === entry.id) {
      const current = valueOf(el, target, state);
      if (current === state.last) return state;
      // An external renderer owns the new value. Rebind only a complete known
      // source; never translate partial matches or user/API supplied text.
      slots.delete(slot);
      state = null;
    }
    const current = valueOf(el, target);
    const params = matchSource(entry, current);
    if (!params) return null;
    state = { id: entry.id, el, target, params, last: current, ...(!target.attribute && target.textNodeIndex == null ? snapshot(el) : { nodes: [], ids: new Map() }) };
    if (target.textNodeIndex != null) {
      const raw = el.childNodes[target.textNodeIndex].nodeValue;
      state.prefix = raw.match(/^\s*/)[0];
      state.suffix = raw.match(/\s*$/)[0];
    }
    if (!target.attribute && target.textNodeIndex == null && !parse(entry.source, state)) {
      report('source-skeleton-mismatch', entry.id); return null;
    }
    if (el.matches('option') && !el.hasAttribute('value')) el.setAttribute('value', el.value);
    if (!target.attribute) el.setAttribute('data-preserve-case', 'true');
    if (!target.attribute && target.textNodeIndex == null) {
      el.setAttribute('data-arotec-i18n-bound', entry.id);
      state.nodes.forEach((item, index) => item.node.setAttribute('data-arotec-i18n-slot', `${entry.id}:${index}`));
    }
    slots.set(slot, state);
    statistics.bindings += 1;
    return state;
  }
  function update(state, entry) {
    const translated = entry.locales[locale];
    const template = canonical(translated == null ? entry.source : translated);
    const next = canonical(interpolate(template, state.params));
    if (translated == null && locale !== 'en') report('missing-translation', entry.id, locale);
    if (state.last === next) return;
    const { el, target } = state;
    if (target.attribute === 'textContent') el.textContent = next;
    else if (target.attribute) el.setAttribute(target.attribute, next);
    else if (target.textNodeIndex != null) {
      const node = el.childNodes[target.textNodeIndex];
      if (node?.nodeType !== 3) return;
      node.nodeValue = `${state.prefix}${next}${state.suffix}`;
    } else {
      const plan = parse(template, state);
      if (!plan) { report('invalid-placeholders', entry.id, locale); return; }
      el.replaceChildren(...materialize(plan, state));
    }
    state.last = next;
    statistics.writes += 1;
  }
  const observer = new MutationObserver(() => schedule());
  function observe() {
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['title', 'aria-label', 'aria-description', 'aria-roledescription', 'aria-valuetext', 'placeholder', 'alt', 'content', 'label', 'value', 'data-diagram-title', 'data-label', 'data-tooltip'] });
  }
  function apply() {
    scheduled = false;
    if (!managed || !validated || applying) return;
    applying = true;
    observer.disconnect();
    statistics.passes += 1;
    try {
      document.documentElement.lang = LANGUAGES[locale];
      for (const entry of entries.values()) {
        if (entry.targets?.length === 0) {
          results.set(entry.id, { id: entry.id, targets: 0, matched: 0, writes: 0, status: 'programmatic' });
          continue;
        }
        let matches = 0, externallyManaged = 0;
        const writesBefore = statistics.writes;
        const targets = candidates(entry);
        for (const { el, target, slot } of targets) {
          if (target.externalLocalizer) {
            const owner = target.externalLocalizer;
            if (owner.type === 'region' && el instanceof HTMLOptionElement &&
                el.dataset.arotecRegion === owner.code && el.value === owner.value &&
                el.hasAttribute('data-arotec-i18n-ignore')) externallyManaged += 1;
            else report('external-localizer-mismatch', entry.id);
            continue;
          }
          const state = bind(entry, el, target, slot);
          if (state) {
            matches += 1; update(state, entry);
            // Catalog-owned English containers follow the locale; an explicitly
            // foreign passage follows it when its catalog translates the text.
            // Untranslated foreign quotes, preserve-content and data stay intact.
            const translatedPassage = canonical(entry.locales[locale] ?? entry.source) !== entry.source;
            for (let container = el; container && container !== document.documentElement; container = container.parentElement) {
              if (container.matches('[translate="no"],[data-preserve-content],[data-user-content],[data-arotec-i18n-preserve-lang]')) break;
              if (container.hasAttribute('lang') && (managedLanguages.has(container) || container.lang === 'en' || translatedPassage)) {
                managedLanguages.add(container); container.lang = LANGUAGES[locale];
              }
            }
          }
        }
        if (!matches && !externallyManaged) report(targets.length ? 'stale-source' : 'missing-target', entry.id);
        results.set(entry.id, { id: entry.id, targets: targets.length, matched: matches, externallyManaged, writes: statistics.writes - writesBefore,
          status: matches ? 'matched' : externallyManaged ? 'external-localizer' : targets.length ? 'stale-source' : 'missing-target' });
      }
      document.querySelectorAll('#languageSelect,#memberLanguageSelect').forEach(select => {
        if (select instanceof HTMLSelectElement && !Array.from(select.options).some(option => option.value === 'zh-CN')) {
          const option = new Option('简体中文', 'zh-CN');
          const traditional = Array.from(select.options).find(item => item.value === 'zh');
          select.add(option, traditional || null);
        }
        if (Array.from(select.options || []).some(option => option.value === locale)) select.value = locale;
      });
      document.querySelectorAll('[data-lang-chip]').forEach(chip => {
        const selected = localeOf(chip.dataset.langChip) === locale;
        chip.classList.toggle('active', selected);
        chip.setAttribute('aria-pressed', String(selected));
      });
    } finally { applying = false; observe(); }
    const detail = { page, locale };
    readyResolve(detail);
    document.dispatchEvent(new CustomEvent('arotec:i18n-ready', { detail }));
  }
  function schedule() {
    if (!scheduled && managed) { scheduled = true; requestAnimationFrame(apply); }
  }
  function notifyNative() {
    document.dispatchEvent(new CustomEvent('arotec:languagechange', { detail: { lang: locale, source: 'arotec-i18n' } }));
  }
  function renderCanonical() {
    for (const [id, renderer] of renderers) {
      try { renderer.render(locale); } catch (error) { report('renderer-error', id, String(error.message)); }
    }
    notifyNative();
    schedule();
  }
  function setLocale(value, options = {}) {
    const next = localeOf(value);
    if (!next) return false;
    const changed = locale !== next;
    locale = next;
    if (options.persist !== false) { try { localStorage.setItem(LANGUAGE_KEY, locale); } catch (_) {} }
    if (managed && (changed || options.render)) renderCanonical();
    else schedule();
    return true;
  }
  async function sourceValid(id, message) {
    if (!message.sourceHash) return true;
    if (!crypto.subtle) { report('hash-unavailable', id); return false; }
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message.source));
    const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    if (message.sourceHash !== `sha256:${hex}`) { report('source-hash-mismatch', id); return false; }
    return true;
  }
  function register(payload) {
    if (!payload || payload.version !== 1 || decode(payload.page).replace(/^\/+/, '') !== page) {
      report('page-mismatch', payload?.page || '', page); return Promise.resolve(false);
    }
    // Synchronous ownership signal lets a following native script render English
    // while checksum validation and catalog binding finish asynchronously.
    managed = true;
    registrations = registrations.then(async () => {
      await Promise.all(Object.entries(payload.messages || {}).map(async ([id, message]) => {
        if (typeof message.source !== 'string' || canonical(message.source) !== message.source) { report('noncanonical-source', id); return; }
        if (!await sourceValid(id, message)) return;
        const locales = { en: message.source };
        for (const lang of Object.keys(LANGUAGES)) if (typeof payload.locales?.[lang]?.[id] === 'string') locales[lang] = payload.locales[lang][id];
        const aliases = Object.values(message.aliases || {}).flat().filter(value => typeof value === 'string');
        const known = new Set([...aliases, ...Object.values(locales)].map(canonical));
        const parameters = message.parameters || [];
        if (!Array.isArray(parameters) || new Set(parameters).size !== parameters.length || parameters.some(name => !/^[A-Za-z][A-Za-z0-9_]*$/.test(name))) { report('invalid-parameters', id); return; }
        const matchers = [];
        if (parameters.length) {
          if (!/[\p{L}]/u.test(message.source.replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, ''))) { report('unanchored-parameters', id); return; }
          for (const template of new Set([message.source, ...known])) {
            const matcher = parameterMatcher(template, parameters);
            if (!matcher) { report('parameter-parity-mismatch', id); return; }
            matchers.push(matcher);
          }
        }
        entries.set(id, { ...message, id, locales, known, parameters, matchers });
      }));
      validated = true;
      renderCanonical();
      return true;
    });
    return registrations;
  }
  function registerRenderer(renderer) {
    if (!renderer?.id || typeof renderer.render !== 'function') return false;
    renderers.set(renderer.id, renderer);
    if (managed) registrations.then(() => { renderer.render(locale); notifyNative(); schedule(); });
    return true;
  }
  const api = {
    version: 1, page, readyPromise, register, registerRenderer, setLocale, refresh: schedule,
    isPageManaged: () => managed,
    get currentLocale() { return locale; },
    getMessage(id, requestedLocale = locale, params) {
      const entry = entries.get(id);
      if (!entry) return null;
      const template = entry.locales[localeOf(requestedLocale) || locale] ?? entry.source;
      return params ? interpolate(template, params) : template;
    },
    formatMessage(id, params, requestedLocale = locale) { return api.getMessage(id, requestedLocale, params); },
    messageId(key) { return entries.has(key) ? key : Array.from(entries.values()).find(entry => entry.programmaticKey === key)?.id || null; },
    resolveMessage(el, source, attribute = null) {
      if (!(el instanceof Element)) return null;
      const value = canonical(source);
      for (const entry of entries.values()) {
        const params = matchSource(entry, value);
        if (!params) continue;
        if (candidates(entry).some(candidate => candidate.el === el && (candidate.target.attribute || null) === attribute && safeTarget(el, candidate.target))) return { id: entry.id, params };
      }
      return null;
    },
    diagnostics: () => ({ page, locale, managed, messages: entries.size, statistics: { ...statistics }, results: Array.from(results.values()), issues: Array.from(issues.values()) }),
    serialize: el => snapshot(el).source
  };
  window.ArotecI18n = api;
  document.addEventListener('arotec:languagechange', event => {
    nativeEvents += 1;
    const value = typeof event.detail === 'string' ? event.detail : event.detail?.lang || event.detail?.language;
    const next = localeOf(value);
    if (next) { locale = next; try { localStorage.setItem(LANGUAGE_KEY, next); } catch (_) {} schedule(); }
  });
  // Legacy controls do not all emit the shared event. Let native handlers finish,
  // then supply the event only when none was emitted during this interaction.
  function fromControl(event) {
    const control = event.target.closest?.('#languageSelect,#memberLanguageSelect,[data-lang-chip]');
    if (!control || (event.type === 'click' && !control.hasAttribute('data-lang-chip'))) return;
    const next = localeOf(control.dataset.langChip || control.value), count = nativeEvents;
    if (next) queueMicrotask(() => { if (nativeEvents === count) setLocale(next, { render: true }); });
  }
  document.addEventListener('change', fromControl, true);
  document.addEventListener('click', fromControl, true);
  window.addEventListener('storage', event => { if (event.key === LANGUAGE_KEY && localeOf(event.newValue)) setLocale(event.newValue, { persist: false, render: true }); });
  window.addEventListener('pageshow', () => setLocale(readLocale() || locale, { persist: false, render: true }));
  window.addEventListener('popstate', () => setLocale(readLocale() || locale, { persist: false, render: true }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  observe();
  for (const payload of window.AROTEC_I18N_QUEUE || []) register(payload);
  for (const renderer of window.AROTEC_I18N_RENDERERS || []) registerRenderer(renderer);
})();
