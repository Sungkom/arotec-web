/* Localized labels for authored CSS and curved diagram text. Artwork stays intact. */
(() => {
  'use strict';
  const originals = new WeakMap();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  function cssLabel(key, property) {
    const engine = window.ArotecI18n;
    const id = engine?.messageId(key);
    const value = id && engine.getMessage(id);
    if (value) document.documentElement.style.setProperty(property, JSON.stringify(value));
  }
  function curvedLabel(node, locale) {
    const container = node.querySelector(':scope > span');
    if (!container) return;
    if (!originals.has(node)) originals.set(node, { fragment: container.cloneNode(true), label: null });
    const state = originals.get(node);
    const label = node.getAttribute('aria-label') || '';
    if (state.label === locale + ':' + label) return;
    state.label = locale + ':' + label;
    if (locale === 'en') {
      container.replaceChildren(...Array.from(state.fragment.childNodes).map(child => child.cloneNode(true)));
      return;
    }
    // Grapheme clusters retain Thai combining marks and CJK glyphs as whole units.
    const graphemes = typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter(locale === 'zh' ? 'zh-Hant' : locale, { granularity: 'grapheme' }).segment(label), item => item.segment)
      : Array.from(label);
    const reference = container.querySelector('span') || state.fragment.querySelector('span');
    if (!reference || !context) return;
    const style = getComputedStyle(reference);
    const fontSize = parseFloat(style.fontSize) || 12;
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const bounds = container.getBoundingClientRect();
    // Preserve the existing font and arc anchors; extend spacing along the same curve
    // when a locale needs more room, instead of shrinking its letters.
    const length = Math.max(bounds.height * .14323607, fontSize);
    const widths = graphemes.map(character => context.measureText(character).width + fontSize * .2);
    const total = widths.reduce((sum, width) => sum + width, 0);
    const scale = Math.max(1, total / length);
    let offset = 0;
    const fragment = document.createDocumentFragment();
    graphemes.forEach((character, index) => {
      const position = total ? offset / total * scale : 0;
      const span = document.createElement('span');
      span.textContent = character;
      span.style.left = `${21.339779 + 2.35616 * position * position}%`;
      span.style.top = `${53.580902 + 14.323607 * position}%`;
      span.style.transform = `rotate(${88 - 24 * position}deg)`;
      fragment.append(span);
      offset += widths[index];
    });
    container.replaceChildren(fragment);
  }
  function refresh() {
    const engine = window.ArotecI18n;
    if (!engine?.isPageManaged()) return;
    cssLabel('visual.science', '--arotec-label-science');
    cssLabel('visual.skinAxis', '--arotec-label-skin-axis');
    cssLabel('visual.skin', '--arotec-label-skin');
    document.querySelectorAll('.biology-feedback[aria-label]').forEach(node => curvedLabel(node, engine.currentLocale));
  }
  document.addEventListener('arotec:i18n-ready', refresh);
  window.addEventListener('resize', () => {
    document.querySelectorAll('.biology-feedback').forEach(node => { const state = originals.get(node); if (state) state.label = null; });
    refresh();
  });
  refresh();
})();
