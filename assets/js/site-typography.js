/* Title Case for the two role-marked rules in site-typography.css.
   Updating text nodes (not innerHTML) preserves links, emphasis, line breaks,
   scientific symbols and the event handlers of dynamically rendered content. */
(() => {
  'use strict';

  const minorWords = new Set('a an and as at but by for from in nor of on or per the to via vs with yet'.split(' '));
  const protectedNames = [
    'Piper longum', 'A&S', 'R&D', 'DM Sans', 'dsm-firmenich',
    'AQUAVORTEX', 'NURO', 'EBII', 'EBI', 'ADI', 'PNI', 'TEWL', 'WVTR',
    'SEM', 'dSHS', 'SHS', 'SAF', 'SADI', 'DNA', 'RNA', 'mRNA', 'ATP',
    'NAD', 'NADH', 'NADPH', 'ROS', 'HPA', 'HPT', 'HPG', 'HPO', 'BDNF',
    'GABA', 'CNS', 'ANS', 'ENS', 'BBB', 'CRH', 'DHA', 'EEG', 'CBD',
    'LPS', 'MCT', 'NMF', 'NST', 'OBSI', 'UV', 'UVA', 'UVB', 'SPF', 'B2B',
    'AI', 'OEM', 'ODM', 'DSW', 'ISO', 'RTD', 'TRPV1', 'TRPA1', 'TRPM8',
    'TLR', 'pH', 'mTOR', 'IGF', 'IL', 'TNF'
  ];
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = new Map(protectedNames.map(name => [name.toLowerCase(), name]));
  const protectedPattern = new RegExp(`\\b(?:${protectedNames.map(escape).join('|')})\\b`, 'gi');

  function titleCase(text) {
    const protectedRanges = [];
    const canonical = text.replace(protectedPattern, (word, offset) => {
      protectedRanges.push([offset, offset + word.length]);
      return names.get(word.toLowerCase());
    });
    const words = [...canonical.matchAll(/[A-Za-z][A-Za-z0-9]*(?:['’][A-Za-z]+)?/g)];
    let index = 0;
    return canonical.replace(/[A-Za-z][A-Za-z0-9]*(?:['’][A-Za-z]+)?/g, (word, offset) => {
      const position = index++;
      if (protectedRanges.some(([start, end]) => offset >= start && offset < end)) return word;
      // Preserve chemical identifiers and intentionally mixed-case names.
      if (/\d/.test(word) || (word !== word.toUpperCase() && /[A-Z]/.test(word.slice(1)))) return word;
      const lower = word.toLowerCase();
      const previous = words[position - 1];
      const between = previous ? canonical.slice(previous.index + previous[0].length, offset) : '';
      const boundary = position === 0 || position === words.length - 1 || /[.!?:]\s*$/.test(between);
      return !boundary && minorWords.has(lower) ? lower : lower[0].toUpperCase() + lower.slice(1);
    });
  }

  let started = false;
  function start() {
    if (started || !document.body) return;
    const selectors = [];
    const inspect = rules => {
      for (const rule of rules) {
        if (rule.selectorText && rule.style?.getPropertyValue('--arotec-title-role')) selectors.push(rule.selectorText);
        if (rule.cssRules) inspect(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      try { inspect(sheet.cssRules); } catch { /* Cross-origin and file:// sheets may hide CSSOM rules. */ }
    }
    const selector = selectors.join(',');
    // file:// permits rendering linked CSS but blocks access to cssRules.
    // Discover role owners from computed custom properties in that case.
    // A descendant inherits its owner's role, so only a role change marks
    // another independent target (including supporting copy inside a title).
    if (!selector && !getComputedStyle(document.documentElement).getPropertyValue('--arotec-display-weight').trim()) return;
    const roleOf = element => element ? getComputedStyle(element).getPropertyValue('--arotec-title-role').trim() : '';
    const isTarget = element => {
      if (selector) return element.matches(selector);
      const role = roleOf(element);
      return (role === 'display' || role === 'supporting') && role !== roleOf(element.parentElement);
    };
    const closestTarget = element => {
      if (selector) return element.closest(selector);
      for (let current = element; current; current = current.parentElement) if (isTarget(current)) return current;
      return null;
    };
    const findTargets = element => [...element.querySelectorAll(selector || '*')].filter(isTarget);
    started = true;
    // Inactive slides are still real copy and must be normalized before they
    // become visible. Only decorative aria-hidden descendants are skipped.
    const excluded = 'script,style,svg,math,sup,sub,[contenteditable]:not([contenteditable="false"]),[data-preserve-case]';

    function normalize(element) {
      if (element.closest(excluded)) return;
      let source = '';
      const segments = [];
      function collect(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          segments.push({node, start: source.length, length: node.data.length});
          source += node.data;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(excluded) || (node !== element && (isTarget(node) || node.matches('[aria-hidden="true"]')))) {
            source += ' ';
          } else if (node.tagName === 'BR') {
            source += ' ';
          } else {
            for (const child of node.childNodes) collect(child);
          }
        }
      }
      collect(element);
      const result = titleCase(source);
      for (const {node, start, length} of segments) {
        const value = result.slice(start, start + length);
        if (node.data !== value) node.data = value;
      }
    }

    const pending = new Set();
    function enqueue(node) {
      const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      if (!element || element.closest(excluded)) return;
      const owner = closestTarget(element);
      if (owner) pending.add(owner);
      for (const match of findTargets(element)) pending.add(match);
    }
    const config = {subtree: true, childList: true, characterData: true};
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') enqueue(record.target);
        else {
          const owner = record.target.nodeType === Node.ELEMENT_NODE && closestTarget(record.target);
          if (owner) pending.add(owner);
          for (const node of record.addedNodes) enqueue(node);
        }
      }
      // Disconnect while changing our own text to avoid mutation feedback loops.
      observer.disconnect();
      for (const element of pending) if (element.isConnected) normalize(element);
      pending.clear();
      observer.observe(document.body, config);
    });
    for (const element of findTargets(document.body)) normalize(element);
    observer.observe(document.body, config);
  }

  for (const link of document.querySelectorAll('link[href*="site-typography.css"]')) link.addEventListener('load', start, {once: true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
