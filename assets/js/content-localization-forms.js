/* Explicit authored form/UI adapters. Values, constraints and API data stay intact. */
(() => {
  'use strict';
  if (window.ArotecForms) return;
  const statusStates = new Map(), validationStates = new Map();
  const engine = () => window.ArotecI18n;
  const idFor = key => engine()?.messageId(key);
  function text(key, params = {}, fallback = '') {
    const id = idFor(key);
    return id ? engine().formatMessage(id, params) : fallback;
  }
  function renderStatus(node, state) {
    const next = text(state.id, state.params, state.fallback);
    if (node.textContent !== next) node.textContent = next;
    state.last = next;
  }
  function authored(node, key, params = {}, fallback = '') {
    if (!node) return;
    const state = { id: key, params: { ...params }, fallback, last: null };
    statusStates.set(node, state);renderStatus(node, state);
  }
  function message(node, source, error = false) {
    if (!node) return;
    const match = engine()?.resolveMessage(node, source);
    if (match) authored(node, match.id, match.params, source);
    else if (error && source && engine()?.isPageManaged()) authored(node, 'validation.unknownError', {}, 'Unable to complete this action. Please try again.');
    else { statusStates.delete(node); node.textContent = source; }
  }
  function nativeValidation(control) {
    if (!control?.willValidate || typeof control.setCustomValidity !== 'function') return null;
    const old = validationStates.get(control);
    if (old && control.validationMessage === old.last) control.setCustomValidity('');
    else if (old) validationStates.delete(control);
    const validity = control.validity;
    if (validity.customError) return null;
    if (validity.valueMissing) return { key: control.type === 'checkbox' ? 'validation.checkbox' : control.localName === 'select' ? 'validation.select' : control.type === 'file' ? 'validation.file' : 'validation.required' };
    if (validity.typeMismatch) return { key: control.type === 'email' ? 'validation.email' : 'validation.url' };
    if (validity.patternMismatch) return { key: 'validation.pattern' };
    if (validity.tooShort) return { key: 'validation.short', params: { minimum: control.minLength } };
    if (validity.tooLong) return { key: 'validation.long', params: { maximum: control.maxLength } };
    if (validity.rangeUnderflow) return { key: 'validation.minimum', params: { minimum: control.min } };
    if (validity.rangeOverflow) return { key: 'validation.maximum', params: { maximum: control.max } };
    if (validity.badInput) return { key: 'validation.number' };
    if (validity.stepMismatch) return { key: 'validation.step' };
    return null;
  }
  function setValidity(control, key, params = {}, fallback = '', custom = true) {
    const localized = text(key, params, fallback);
    if (!localized || typeof control?.setCustomValidity !== 'function') return;
    control.setCustomValidity(localized);
    validationStates.set(control, { key, params: { ...params }, fallback, custom, last: localized, value: control.value, checked: control.checked });
  }
  function validate(control) {
    const custom = validationStates.get(control);
    if (custom?.custom && control.validationMessage === custom.last) {
      setValidity(control, custom.key, custom.params, custom.fallback);
      return;
    }
    const result = nativeValidation(control);
    if (result) setValidity(control, result.key, result.params, '', false);
    else if (validationStates.get(control)?.custom === false) validationStates.delete(control);
  }
  function clearValidity(control) {
    const state = validationStates.get(control);
    if (state && control.validationMessage === state.last) control.setCustomValidity('');
    validationStates.delete(control);
  }
  function refresh() {
    if (typeof Intl.DisplayNames === 'function') {
      const locale = engine()?.currentLocale || 'en';
      const names = new Intl.DisplayNames([locale === 'zh' ? 'zh-Hant' : locale], { type: 'region' });
      document.querySelectorAll('option[data-arotec-region]').forEach(option => {
        const label = names.of(option.dataset.arotecRegion);
        if (label && option.textContent !== label) option.textContent = label;
      });
      const languages = new Intl.DisplayNames([locale === 'zh' ? 'zh-Hant' : locale], { type: 'language' });
      document.querySelectorAll('option[data-arotec-locale-option]').forEach(option => {
        const label = languages.of(option.dataset.arotecLocaleOption);
        if (label && option.textContent !== label) option.textContent = label;
      });
    }
    for (const [node, state] of statusStates) {
      if (!node.isConnected || node.textContent !== state.last) { statusStates.delete(node); continue; }
      renderStatus(node, state);
    }
    for (const [control, state] of validationStates) {
      if (!control.isConnected || control.validationMessage !== state.last) { validationStates.delete(control); continue; }
      if (state.custom) setValidity(control, state.key, state.params, state.fallback);
      else validate(control);
    }
  }
  document.addEventListener('invalid', event => validate(event.target), true);
  for (const name of ['input', 'change']) document.addEventListener(name, event => {
    const state = validationStates.get(event.target);
    // Removing a focused field during shell remount can emit change on blur
    // without an edit. Retain that validation state for the new locale.
    if (state && !state.custom && (event.target.value !== state.value || event.target.checked !== state.checked)) clearValidity(event.target);
  }, true);
  document.addEventListener('arotec:i18n-ready', refresh);
  window.ArotecForms = { text, message, authored, setValidity, clearValidity, refresh,
    confirm: (key, params, fallback) => window.confirm(text(key, params, fallback)),
    diagnostics: () => ({ statuses: statusStates.size, validations: validationStates.size }) };
  engine()?.readyPromise.then(refresh);
})();
