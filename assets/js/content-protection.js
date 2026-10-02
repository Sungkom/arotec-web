/* Arotec ordinary copy deterrence. No dependencies or network requests.
 * Load with content-protection.css. This cannot prevent screenshots or extraction.
 */
(function () {
  'use strict';

  var KEY = '__arotecCopyDeterrence';
  var CLASS_NAME = 'arotec-copy-protected';
  if (window[KEY]) return;

  function element(node) {
    return node && (node.nodeType === 1 ? node : node.parentElement);
  }

  function target(event) {
    var path = typeof event.composedPath === 'function' ? event.composedPath() : null;
    return element(path && path.length ? path[0] : event.target);
  }

  function nativeField(node) {
    var el = element(node);
    return el && el.closest ? el.closest('input, textarea, select') : null;
  }

  function allowedRegion(node) {
    for (var el = element(node); el; el = el.parentElement) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.hasAttribute('data-allow-copy')) return el;
      var editable = el.getAttribute('contenteditable');
      if (editable === null) continue;
      editable = editable.toLowerCase();
      // A locked island within an editor remains protected. A nested editor can
      // establish its own exception because the closest explicit boundary wins.
      if (editable === 'false') return null;
      if (editable === '' || editable === 'true' || editable === 'plaintext-only') return el;
    }
    return null;
  }

  function rangeAllowed(range) {
    if (range.collapsed) return true;
    var root = range.commonAncestorContainer;
    if (!allowedRegion(root)) return false;
    // Checking endpoints alone would miss protected islands inside an editor.
    // Only inspect nodes actually intersected by this user-created selection.
    var walker = document.createTreeWalker(root, 5); // SHOW_ELEMENT | SHOW_TEXT
    var node = walker.nextNode();
    while (node) {
      if (range.intersectsNode(node) && !allowedRegion(node)) return false;
      node = walker.nextNode();
    }
    return true;
  }

  function canCopy(event) {
    var el = target(event);
    var field = nativeField(el);
    // Native text controls own their selection separately from document ranges.
    // A selected input value must still copy even if the page has an old range.
    if (field && typeof field.selectionStart === 'number' &&
        typeof field.selectionEnd === 'number' && field.selectionStart !== field.selectionEnd) return true;
    try {
      var selection = typeof window.getSelection === 'function' ? window.getSelection() : null;
      if (selection && !selection.isCollapsed) {
        if (!selection.rangeCount) return false;
        for (var i = 0; i < selection.rangeCount; i += 1) {
          if (!rangeAllowed(selection.getRangeAt(i))) return false;
        }
        return true;
      }
    } catch (error) {
      // If the browser cannot inspect a document selection, do not grant an
      // exception just because an editor happened to receive the event.
      return false;
    }
    return !!allowedRegion(el);
  }

  function cancel(event) {
    if (event.cancelable) event.preventDefault();
  }

  function protectTarget(event) {
    if (!allowedRegion(target(event))) cancel(event);
  }

  function protectClipboard(event) {
    if (!canCopy(event)) cancel(event);
  }

  function protectKeys(event) {
    if (event.isComposing || event.altKey) return;
    var key = String(event.key || '').toLowerCase();
    var copyOrCut = ((event.ctrlKey || event.metaKey) && !event.shiftKey && (key === 'c' || key === 'x')) ||
      (event.ctrlKey && key === 'insert') ||
      (event.shiftKey && !event.ctrlKey && !event.metaKey && key === 'delete');
    if (copyOrCut && !canCopy(event)) cancel(event);
  }

  var handlers = {
    contextmenu: protectTarget,
    selectstart: protectTarget,
    dragstart: protectTarget,
    copy: protectClipboard,
    cut: protectClipboard,
    keydown: protectKeys
  };
  var active = false;

  function enable() {
    if (active) return;
    active = true;
    document.documentElement.classList.add(CLASS_NAME);
    Object.keys(handlers).forEach(function (name) {
      document.addEventListener(name, handlers[name], true);
    });
  }

  function disable() {
    if (!active) return;
    active = false;
    document.documentElement.classList.remove(CLASS_NAME);
    Object.keys(handlers).forEach(function (name) {
      document.removeEventListener(name, handlers[name], true);
    });
  }

  window[KEY] = { version: '1.0.0', enable: enable, disable: disable };
  enable();
})();
