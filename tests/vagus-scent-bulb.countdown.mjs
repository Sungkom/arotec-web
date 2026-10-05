import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../pages/vagus-scent-bulb.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../assets/js/vagus-scent-bulb.js', import.meta.url), 'utf8');
const campaignStart = html.match(/data-countdown-start="([^"]+)"/)?.[1];
const campaignDays = html.match(/data-countdown-days="([^"]+)"/)?.[1];
const initialDigits = [...html.matchAll(/<span data-countdown-digit[^>]*>(\d)<\/span>/g)].map(match => match[1]);
const locales = ['en', 'ja', 'zh-CN', 'zh', 'th'];

function readCatalog(pagePath) {
  const pageUrl = new URL(pagePath, import.meta.url);
  const pageHtml = readFileSync(pageUrl, 'utf8');
  const catalogPath = pageHtml.match(/<script[^>]*data-arotec-localization="catalog"[^>]*src="([^"?]+)/)?.[1];
  assert.ok(catalogPath, `${pagePath} must load a page translation catalog`);
  const catalogSource = readFileSync(new URL(catalogPath, pageUrl), 'utf8');
  const browserPageUrl = new URL(pagePath.replace(/^\.\.\//, ''), 'https://arotec.test/preview/');
  const context = {
    window: {},
    document: { currentScript: { src: new URL(catalogPath, browserPageUrl).href } },
    location: browserPageUrl,
    URL,
  };
  vm.runInNewContext(catalogSource, context, { filename: catalogPath });
  assert.equal(context.window.AROTEC_I18N_QUEUE?.length, 1);
  return JSON.parse(JSON.stringify(context.window.AROTEC_I18N_QUEUE[0]));
}

function translated(catalog, id, locale, days) {
  const entry = catalog.messages[id];
  assert.ok(entry, `Missing countdown message: ${id}`);
  const template = locale === 'en' ? entry.source : catalog.locales[locale]?.[id];
  assert.equal(typeof template, 'string', `Missing ${locale} translation: ${id}`);
  return template.replace(/\{days\}/g, String(days));
}

function mount(time, { locale = 'en', catalog = null, catalogPending = false } = {}) {
  let now = Date.parse(time);
  let catalogAvailable = !catalogPending;
  const intervals = new Map();
  const documentEvents = new Map();
  const windowEvents = new Map();
  const renderers = new Map();
  const digits = initialDigits.map(textContent => ({ textContent }));
  const timer = {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
  };
  const unit = { textContent: 'DAYS' };
  const message = { textContent: 'Almost there. Stay curious.' };
  const countdown = {
    dataset: { countdownStart: campaignStart, countdownDays: campaignDays },
    querySelectorAll(selector) {
      assert.equal(selector, '[data-countdown-digit]');
      return digits;
    },
    querySelector(selector) {
      const elements = { '[role="timer"]': timer, '[data-countdown-unit]': unit, '[data-countdown-message]': message };
      assert.ok(selector in elements, `Unexpected countdown selector: ${selector}`);
      return elements[selector];
    },
  };
  const document = {
    hidden: false,
    querySelector(selector) {
      assert.equal(selector, '[data-vagus-countdown]');
      return countdown;
    },
    addEventListener(name, listener) { documentEvents.set(name, listener); },
  };
  let nextInterval = 0;
  class FakeDate extends Date {
    static now() { return now; }
  }
  const window = { addEventListener(name, listener) { windowEvents.set(name, listener); } };
  if (catalog) {
    window.ArotecI18n = {
      currentLocale: locale,
      getMessage(id, requestedLocale, params) {
        if (!catalogAvailable || !catalog.messages[id]) return null;
        return translated(catalog, id, requestedLocale, params?.days);
      },
      registerRenderer(renderer) {
        assert.equal(typeof renderer.render, 'function');
        renderers.set(renderer.id, renderer.render);
      },
    };
  }
  vm.runInNewContext(source, {
    document,
    window,
    Date: FakeDate,
    setInterval(callback, delay) {
      assert.equal(delay, 1000);
      intervals.set(++nextInterval, callback);
      return nextInterval;
    },
    clearInterval(id) { intervals.delete(id); },
  }, { filename: 'vagus-scent-bulb.js' });
  return {
    get state() {
      return {
        digits: digits.map(digit => digit.textContent).join(''),
        label: timer.attributes['aria-label'],
        unit: unit.textContent,
        message: message.textContent,
        activeIntervals: intervals.size,
      };
    },
    setTime(time) { now = Date.parse(time); },
    tick() { [...intervals.values()].forEach(callback => callback()); },
    visibility(hidden) {
      document.hidden = hidden;
      assert.ok(documentEvents.has('visibilitychange'));
      documentEvents.get('visibilitychange')();
    },
    pageshow() {
      assert.ok(windowEvents.has('pageshow'));
      windowEvents.get('pageshow')();
    },
    switchLocale(nextLocale) {
      window.ArotecI18n.currentLocale = nextLocale;
      assert.ok(documentEvents.has('arotec:languagechange'));
      documentEvents.get('arotec:languagechange')({ detail: { language: nextLocale } });
    },
    renderCatalog() {
      assert.ok(renderers.has('vagus-scent-bulb-countdown'));
      catalogAvailable = true;
      renderers.get('vagus-scent-bulb-countdown')(window.ArotecI18n.currentLocale);
    },
  };
}

function assertLocalizedState(page, catalog, locale, days) {
  assert.deepEqual(page.state, {
    digits: String(days).padStart(initialDigits.length, '0'),
    label: translated(catalog, days === 1 ? 'vagus.remainingOne' : 'vagus.remaining', locale, days),
    unit: translated(catalog, days === 1 ? 'vagus.day' : 'vagus.days', locale, days),
    message: translated(catalog, days === 0 ? 'vagus.ended' : 'vagus.message', locale, days),
    activeIntervals: days === 0 ? 0 : 1,
  });
  assert.doesNotMatch(page.state.label, /\{days\}/);
}

test('page defines a shared 120-day Bangkok campaign and matching fallback deadline', () => {
  assert.equal(campaignStart, '2026-10-05T00:00:00+07:00');
  assert.equal(campaignDays, '120');
  assert.equal(initialDigits.join(''), '120');
  assert.match(html, /<time datetime="2027-02-02T00:00:00\+07:00">2 February 2027<\/time>/);
  assert.equal(Date.parse('2027-02-02T00:00:00+07:00') - Date.parse(campaignStart), 120 * 86_400_000);
  assert.match(html, /role="timer" aria-live="off" aria-label="120 days remaining"/);
  assert.match(html, /data-nav-active="products"/);
});

test('campaign starts at 120 and decrements after a full Bangkok calendar day', () => {
  const page = mount('2026-10-05T00:00:00+07:00');
  assert.equal(page.state.digits, '120');
  assert.equal(page.state.label, '120 days remaining');
  assert.equal(page.state.activeIntervals, 1);
  page.setTime('2026-10-05T23:59:59.999+07:00');
  page.tick();
  assert.equal(page.state.digits, '120');
  page.setTime('2026-10-06T00:00:00+07:00');
  page.tick();
  assert.equal(page.state.digits, '119');
  assert.equal(page.state.label, '119 days remaining');
});

test('100 to 99 updates all three digits and retains the leading zero', () => {
  const page = mount('2026-10-25T00:00:00+07:00');
  assert.equal(page.state.digits, '100');
  page.setTime('2026-10-26T00:00:00+07:00');
  page.tick();
  assert.equal(page.state.digits, '099');
  assert.equal(page.state.label, '99 days remaining');
});

test('last day uses singular copy and counts down through the last millisecond', () => {
  const page = mount('2027-02-01T00:00:00+07:00');
  assert.equal(page.state.digits, '001');
  assert.equal(page.state.label, '1 day remaining');
  assert.equal(page.state.unit, 'DAY');
  assert.equal(page.state.message, 'Almost there. Stay curious.');
  page.setTime('2027-02-01T23:59:59.999+07:00');
  page.tick();
  assert.equal(page.state.digits, '001');
});

test('deadline and later visits show zero and stop polling', () => {
  const page = mount('2027-02-01T23:59:59+07:00');
  page.setTime('2027-02-02T00:00:00+07:00');
  page.tick();
  assert.deepEqual(page.state, {
    digits: '000', label: '0 days remaining', unit: 'DAYS',
    message: 'The wait is over. Stay tuned!', activeIntervals: 0,
  });
  const laterVisit = mount('2027-03-01T12:00:00+07:00');
  assert.deepEqual(laterVisit.state, page.state);
});

test('fresh visits and reloads share the campaign deadline without resetting it', () => {
  const page = mount('2026-10-05T00:00:00+07:00');
  page.setTime('2026-10-26T12:00:00+07:00');
  page.tick();
  assert.equal(page.state.digits, '099');
  assert.deepEqual(mount('2026-10-26T12:00:00+07:00').state, page.state);
});

test('visibility and pageshow resynchronize after background suspension', () => {
  const page = mount('2026-10-05T00:00:00+07:00');
  page.visibility(true);
  page.setTime('2026-10-06T12:00:00+07:00');
  page.visibility(true);
  assert.equal(page.state.digits, '120');
  page.visibility(false);
  assert.equal(page.state.digits, '119');
  page.setTime('2026-10-26T12:00:00+07:00');
  page.pageshow();
  assert.equal(page.state.digits, '099');
  page.setTime('2027-02-02T00:00:00+07:00');
  page.pageshow();
  assert.equal(page.state.digits, '000');
  assert.equal(page.state.activeIntervals, 0);
});

test('visits before campaign start never exceed the promised 120 days', () => {
  assert.equal(mount('2026-10-04T12:00:00+07:00').state.digits, '120');
});

test('both page entry points have complete, matching catalogs for every supported language', () => {
  const nested = readCatalog('../pages/vagus-scent-bulb.html');
  const root = readCatalog('../vagus-scent-bulb.html');
  assert.equal(nested.page, 'pages/vagus-scent-bulb.html');
  assert.equal(root.page, 'vagus-scent-bulb.html');
  assert.deepEqual(root.messages, nested.messages);
  assert.deepEqual(root.locales, nested.locales);
  assert.equal(nested.version, 1);
  assert.ok(Object.keys(nested.messages).length > 6, 'Catalog must translate the page beyond its dynamic countdown');
  for (const [id, message] of Object.entries(nested.messages)) {
    assert.equal(typeof message.source, 'string', `${id} must have an English source`);
    assert.ok(message.source.trim(), `${id} must have nonempty source text`);
    if (message.sourceHash) {
      assert.equal(message.sourceHash, `sha256:${createHash('sha256').update(message.source).digest('hex')}`, `${id} source hash`);
    }
    const sourceParameters = [...message.source.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match => match[1]).sort();
    if (sourceParameters.length) assert.deepEqual(message.parameters?.slice().sort(), sourceParameters, `${id} declares its parameters`);
    for (const locale of locales.filter(locale => locale !== 'en')) {
      const translation = nested.locales[locale]?.[id];
      assert.equal(typeof translation, 'string', `${id} has a ${locale} translation`);
      assert.ok(translation.trim(), `${id} has nonempty ${locale} text`);
      const targetParameters = [...translation.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(targetParameters, sourceParameters, `${id} keeps its ${locale} parameters`);
    }
  }
  for (const id of ['vagus.days', 'vagus.day', 'vagus.remaining', 'vagus.remainingOne', 'vagus.message', 'vagus.ended']) {
    assert.deepEqual(nested.messages[id]?.targets, [], `${id} is owned by the countdown renderer`);
    for (const locale of locales.filter(locale => locale !== 'en')) {
      assert.notEqual(nested.locales[locale][id], nested.messages[id].source, `${id} is translated into ${locale}`);
    }
  }
});

test('switching every language on the same day updates copy without resetting the countdown', () => {
  const catalog = readCatalog('../pages/vagus-scent-bulb.html');
  const page = mount('2026-10-26T12:00:00+07:00', { catalog });
  assertLocalizedState(page, catalog, 'en', 99);
  for (const locale of [...locales.slice(1), 'en']) {
    page.switchLocale(locale);
    assertLocalizedState(page, catalog, locale, 99);
    page.renderCatalog();
    assertLocalizedState(page, catalog, locale, 99);
    page.tick();
    assertLocalizedState(page, catalog, locale, 99);
  }
  page.setTime('2026-10-27T00:00:00+07:00');
  page.tick();
  assertLocalizedState(page, catalog, 'en', 98);
});

for (const locale of locales) {
  test(`${locale} retains its language across day transitions, reloads and expiry`, () => {
    const catalog = readCatalog('../pages/vagus-scent-bulb.html');
    const page = mount('2027-01-31T23:59:59.999+07:00', { catalog, locale });
    assertLocalizedState(page, catalog, locale, 2);
    page.renderCatalog();
    assertLocalizedState(page, catalog, locale, 2);
    page.setTime('2027-02-01T00:00:00+07:00');
    page.tick();
    assertLocalizedState(page, catalog, locale, 1);
    assert.deepEqual(mount('2027-02-01T00:00:00+07:00', { catalog, locale }).state, page.state);
    page.setTime('2027-02-02T00:00:00+07:00');
    page.tick();
    assertLocalizedState(page, catalog, locale, 0);
    assert.deepEqual(mount('2027-03-01T12:00:00+07:00', { catalog, locale }).state, page.state);
  });
}

test('expired countdown still translates when polling has stopped', () => {
  const catalog = readCatalog('../pages/vagus-scent-bulb.html');
  const page = mount('2027-02-02T00:00:00+07:00', { catalog });
  for (const locale of [...locales.slice(1), 'en']) {
    page.switchLocale(locale);
    assertLocalizedState(page, catalog, locale, 0);
    page.renderCatalog();
    assertLocalizedState(page, catalog, locale, 0);
  }
});

test('delayed catalog validation translates the initial render without a day or locale change', () => {
  const catalog = readCatalog('../pages/vagus-scent-bulb.html');
  for (const [time, days] of [['2026-10-26T12:00:00+07:00', 99], ['2027-02-02T00:00:00+07:00', 0]]) {
    const page = mount(time, { catalog, locale: 'th', catalogPending: true });
    assertLocalizedState(page, catalog, 'en', days);
    page.renderCatalog();
    assertLocalizedState(page, catalog, 'th', days);
  }
});
