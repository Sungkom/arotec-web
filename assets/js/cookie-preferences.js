/* Arotec pilot: optional language memory. No analytics or cookie operations. */
(() => {
  'use strict';
  if (window.ArotecStorage) return;

  const KEY = 'arotec-storage-preferences-v1';
  const VERSION = 1;
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const supported = ['th', 'en', 'ja', 'zh-Hans', 'zh-Hant'];
  const deniedText = {
    en: 'This browser cannot save preferences. Language memory is off for this page; an earlier saved preference may return after reload. You can still use every language link.',
    th: 'เบราว์เซอร์นี้ไม่สามารถบันทึกการตั้งค่าได้ การจดจำภาษาปิดอยู่สำหรับหน้านี้ การตั้งค่าที่เคยบันทึกไว้อาจกลับมาหลังโหลดหน้าใหม่ แต่คุณยังใช้ลิงก์ทุกภาษาได้ตามปกติ',
    ja: 'このブラウザでは設定を保存できません。このページでは言語の記憶をオフにしていますが、以前の保存済み設定が再読み込み後に戻る場合があります。すべての言語リンクを引き続き利用できます。',
    'zh-Hans': '此浏览器无法保存偏好设置。此页面已关闭语言记忆，但先前保存的偏好可能在重新加载后恢复。您仍可正常使用所有语言链接。',
    'zh-Hant': '此瀏覽器無法儲存偏好設定。此頁面已關閉語言記憶，但先前儲存的偏好可能在重新載入後恢復。您仍可正常使用所有語言連結。'
  };
  const withdrawalUnconfirmedText = {
    en: 'Language memory is off for this page, but this browser prevented us from confirming that the saved preference was cleared. It may return after reload or on a later visit.',
    th: 'การจดจำภาษาปิดอยู่สำหรับหน้านี้ แต่เบราว์เซอร์ไม่อนุญาตให้ยืนยันว่าล้างการตั้งค่าที่บันทึกไว้แล้ว การตั้งค่าเดิมอาจกลับมาหลังโหลดหน้าใหม่หรือเข้าเว็บไซต์ครั้งถัดไป',
    ja: 'このページでは言語の記憶をオフにしていますが、ブラウザの制限により保存済み設定の削除を確認できませんでした。再読み込みや次回の訪問時に元の設定が戻る可能性があります。',
    'zh-Hans': '此页面已关闭语言记忆，但由于浏览器限制，我们无法确认已清除保存的偏好。重新加载或下次访问时，原偏好可能恢复。',
    'zh-Hant': '此頁面已關閉語言記憶，但由於瀏覽器限制，我們無法確認已清除儲存的偏好。重新載入或下次造訪時，原偏好可能恢復。'
  };
  const defaults = {
    storageSettings: 'Storage settings',
    storageSettingsDescription: 'Choose whether this browser remembers your language. Changes apply only to this browser.',
    rememberThisLanguage: 'Remember this language for 180 days',
    useWithoutRemembering: 'Use without remembering',
    savePreferences: 'Save preferences',
    clearRememberedLanguage: 'Clear remembered language',
    languageStorageExplanation: 'If you choose to remember your language, this browser stores that choice for up to 180 days. You can clear it at any time.',
    closeStorageSettings: 'Close storage settings',
    rememberedStatus: 'Your language preference is saved in this browser.',
    notRememberedStatus: 'Your language preference is not saved in this browser.',
    languageClearedStatus: 'The remembered language has been cleared.',
    cookiePolicy: 'Cookie and browser-storage policy'
  };
  let config = {};
  try {
    config = JSON.parse(document.getElementById('arotec-storage-config')?.textContent || '{}');
  } catch (_) { /* A malformed config never enables optional storage. */ }
  if (!config || typeof config !== 'object' || Array.isArray(config)) config = {};
  const configuredLocales = config.locales && typeof config.locales === 'object'
    ? (Array.isArray(config.locales) ? config.locales : Object.keys(config.locales)) : [];
  const locales = supported.filter(locale => configuredLocales.includes(locale));
  const locale = locales.includes(config.locale) ? config.locale : null;
  const supplied = config.strings && typeof config.strings === 'object'
    ? (config.strings[locale] && typeof config.strings[locale] === 'object' ? config.strings[locale] : config.strings) : {};
  const text = name => typeof supplied[name] === 'string' && supplied[name].trim()
    ? supplied[name] : defaults[name] || '';
  const storageDenied = () => {
    if (withdrawalUnconfirmed) return typeof supplied.withdrawalUnconfirmedMessage === 'string' && supplied.withdrawalUnconfirmedMessage.trim()
      ? supplied.withdrawalUnconfirmedMessage : withdrawalUnconfirmedText[locale] || withdrawalUnconfirmedText.en;
    if (confirmedRemoval) return text('notRememberedStatus');
    return typeof supplied.storageDeniedMessage === 'string' && supplied.storageDeniedMessage.trim()
      ? supplied.storageDeniedMessage : deniedText[locale] || deniedText.en;
  };
  let panel, checkbox, withdrawButton, status, returnFocus;
  let sessionStorageDenied = false;
  let withdrawalUnconfirmed = false;
  let confirmedRemoval = false;

  function inactive(reason, storageAvailable = true) {
    return {
      version: VERSION, rememberLanguage: false, locale: null,
      savedAt: null, expiresAt: null, valid: false, status: reason, storageAvailable
    };
  }
  function removeInvalid(reason) {
    try { window.localStorage.removeItem(KEY); return inactive(reason); }
    catch (_) { sessionStorageDenied = true; return inactive(reason, false); }
  }
  function read() {
    if (!locale) return inactive('configuration-unavailable');
    if (withdrawalUnconfirmed) return {
      ...inactive('withdrawal-unconfirmed', false), offPersistenceConfirmed: false, mayReturnAfterReload: true
    };
    if (sessionStorageDenied) return {
      ...inactive('storage-denied', false), offPersistenceConfirmed: confirmedRemoval, mayReturnAfterReload: !confirmedRemoval
    };
    let raw;
    try { raw = window.localStorage.getItem(KEY); }
    catch (_) { sessionStorageDenied = true; return inactive('storage-denied', false); }
    if (raw === null) return inactive('missing');
    if (raw.length > 2048) return removeInvalid('invalid');
    let value;
    try { value = JSON.parse(raw); }
    catch (_) { return removeInvalid('invalid'); }
    const now = Date.now();
    const valid = value && typeof value === 'object' && !Array.isArray(value) &&
      value.version === VERSION && typeof value.rememberLanguage === 'boolean' &&
      Number.isSafeInteger(value.savedAt) && value.savedAt > 0 && value.savedAt <= now + 60000 &&
      Number.isSafeInteger(value.expiresAt) && value.expiresAt > value.savedAt &&
      value.expiresAt <= value.savedAt + MAX_AGE &&
      (value.rememberLanguage ? locales.includes(value.locale) : value.locale === null);
    if (!valid) return removeInvalid('invalid');
    if (now >= value.expiresAt) return removeInvalid('expired');
    return {
      version: VERSION, rememberLanguage: value.rememberLanguage, locale: value.locale,
      savedAt: value.savedAt, expiresAt: value.expiresAt,
      valid: true, status: value.rememberLanguage ? 'remembered' : 'declined', storageAvailable: true
    };
  }
  function failedWrite(rememberLanguage) {
    sessionStorageDenied = true;
    withdrawalUnconfirmed = false;
    confirmedRemoval = false;
    if (!rememberLanguage) {
      // A failed off record must not leave an earlier opt-in silently active.
      // Both removal and confirmation are restricted to this component's key.
      try { window.localStorage.removeItem(KEY); } catch (_) { /* Verify below even if removal threw. */ }
      try {
        if (window.localStorage.getItem(KEY) === null) {
          confirmedRemoval = true;
          return true;
        }
      } catch (_) { /* Current-page memory stays off; future state is unknown. */ }
      withdrawalUnconfirmed = true;
    }
    return false;
  }
  function write(rememberLanguage, nextLocale = locale) {
    if (rememberLanguage && !locales.includes(nextLocale)) return false;
    const savedAt = Date.now();
    const value = {
      version: VERSION, rememberLanguage: Boolean(rememberLanguage),
      locale: rememberLanguage ? nextLocale : null, savedAt, expiresAt: savedAt + MAX_AGE
    };
    try { window.localStorage.setItem(KEY, JSON.stringify(value)); }
    catch (_) { return failedWrite(rememberLanguage); }
    sessionStorageDenied = false;
    withdrawalUnconfirmed = false;
    confirmedRemoval = false;
    const saved = read();
    const matched = saved.valid && saved.rememberLanguage === value.rememberLanguage &&
      saved.locale === value.locale && saved.savedAt === value.savedAt && saved.expiresAt === value.expiresAt;
    return matched || failedWrite(rememberLanguage);
  }
  function localHref(value) {
    if (typeof value !== 'string' || !value.trim() || /^[a-z][a-z\d+.-]*:|^\/\//i.test(value) || /[\u0000-\u0020\\]/.test(value)) return null;
    try {
      const url = new URL(value, window.location.href);
      return url.origin === window.location.origin && /^https?:$/.test(url.protocol) ? value : null;
    } catch (_) { return null; }
  }
  function message(value) {
    if (!status) return;
    status.hidden = false;
    status.textContent = value;
  }
  function sync(state = read()) {
    if (!checkbox) return;
    checkbox.checked = state.rememberLanguage;
    checkbox.disabled = !locale || !state.storageAvailable;
    withdrawButton.hidden = !state.rememberLanguage;
    if (!state.storageAvailable) message(storageDenied());
  }
  function close() {
    if (!panel) return;
    panel.hidden = true;
    const target = returnFocus?.isConnected && !panel.contains(returnFocus)
      ? returnFocus : document.querySelector('[data-arotec-storage-open]');
    returnFocus = null;
    target?.focus({ preventScroll: true });
  }
  function open() {
    if (!panel) return;
    if (!panel.contains(document.activeElement)) returnFocus = document.activeElement;
    sync();
    panel.hidden = false;
    panel.scrollIntoView({ block: 'nearest' });
    panel.querySelector('.arotec-storage__heading').focus({ preventScroll: true });
  }
  function choose(rememberLanguage, cleared = false) {
    if (!write(rememberLanguage)) {
      if (checkbox) { checkbox.checked = false; checkbox.disabled = true; }
      if (withdrawButton) withdrawButton.hidden = true;
      message(storageDenied());
      return;
    }
    sync();
    message(text(cleared ? 'languageClearedStatus' : rememberLanguage ? 'rememberedStatus' : 'notRememberedStatus'));
    if (!cleared) close();
  }
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function button(className, content, action) {
    const node = element('button', className, content);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }
  function init() {
    if (panel || !locale) return;
    panel = element('aside', 'arotec-storage');
    panel.id = 'arotec-storage-preferences';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'arotec-storage-heading');
    panel.setAttribute('aria-describedby', 'arotec-storage-explanation');
    panel.hidden = true;
    const heading = element('h2', 'arotec-storage__heading', text('storageSettings'));
    heading.id = 'arotec-storage-heading';
    heading.tabIndex = -1;
    const header = element('div', 'arotec-storage__header');
    const closeButton = button('arotec-storage__close', '×', close);
    closeButton.setAttribute('aria-label', text('closeStorageSettings'));
    closeButton.title = text('closeStorageSettings');
    header.append(heading, closeButton);
    const description = element('p', 'arotec-storage__description', text('storageSettingsDescription'));
    const explanation = element('p', 'arotec-storage__explanation', text('languageStorageExplanation'));
    explanation.id = 'arotec-storage-explanation';
    const label = element('label', 'arotec-storage__choice');
    checkbox = element('input', 'arotec-storage__checkbox');
    checkbox.type = 'checkbox';
    checkbox.id = 'arotec-storage-remember-language';
    checkbox.checked = false;
    checkbox.setAttribute('aria-describedby', explanation.id);
    label.append(checkbox, element('span', '', text('rememberThisLanguage')));
    const actions = element('div', 'arotec-storage__actions');
    actions.append(
      button('arotec-storage__button arotec-storage__save', text('savePreferences'), () => choose(checkbox.checked)),
      button('arotec-storage__button arotec-storage__decline', text('useWithoutRemembering'), () => choose(false))
    );
    withdrawButton = button('arotec-storage__withdraw', text('clearRememberedLanguage'), () => choose(false, true));
    const links = element('div', 'arotec-storage__links');
    const policyHref = localHref(config.policyHref);
    if (policyHref) {
      const policyLink = element('a', 'arotec-storage__policy', text('cookiePolicy'));
      policyLink.href = policyHref;
      links.append(policyLink);
    }
    links.append(withdrawButton);
    status = element('p', 'arotec-storage__status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    panel.append(header, description, explanation, label, actions, links, status);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
    });
    (document.querySelector('[data-arotec-storage-mount]') || document.body).append(panel);
    for (const control of document.querySelectorAll('[data-arotec-storage-open]')) {
      control.setAttribute('aria-controls', panel.id);
      control.addEventListener('click', event => { event.preventDefault(); open(); });
    }
    for (const control of document.querySelectorAll('[data-arotec-storage-withdraw]')) {
      control.addEventListener('click', event => { event.preventDefault(); open(); choose(false, true); });
    }
    const state = read();
    sync(state);
    if (!state.valid) panel.hidden = false;
    const homeHref = state.rememberLanguage && config.landing === true
      ? localHref(config.localeHomeHrefs?.[state.locale]) : null;
    if (homeHref) window.location.replace(homeHref);
    for (const anchor of document.querySelectorAll('a[data-pilot-locale]')) {
      anchor.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || anchor.hasAttribute('download')) return;
        const nextLocale = anchor.getAttribute('data-pilot-locale');
        if (!locales.includes(nextLocale) || !localHref(anchor.getAttribute('href'))) return;
        if (read().rememberLanguage && !write(true, nextLocale)) {
          sync(inactive('storage-denied', false));
          message(storageDenied());
        }
      });
    }
  }
  window.ArotecStorage = Object.freeze({ read, open, key: KEY });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
