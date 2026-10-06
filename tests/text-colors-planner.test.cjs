'use strict';

// A bounded DOM/RAF model tests paint ownership and mutation scheduling only.
// It cannot establish browser cascade, photographic contrast or visual layout.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = path.resolve(process.argv[2] || path.join(__dirname, '../assets/js/text-colors.js'));
const writes = [], mutationRecords = [], frames = new Map(), events = new Map();
let frameId = 0, observerCallback;
const rect = { x: 0, y: 0, left: 0, top: 0, right: 200, bottom: 50, width: 200, height: 50 };
const typography = { fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: '400', fontStyle: 'normal', lineHeight: '24px', letterSpacing: '0.2px' };
class Element {
  constructor(tag, options = {}) {
    this.nodeType = 1; this.localName = tag; this.tagName = tag.toUpperCase();
    this.namespaceURI = options.svg ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml';
    this.className = ''; this.id = ''; this.dataset = {}; this.childNodes = []; this.parentElement = null;
    this.background = options.background || 'rgba(0, 0, 0, 0)'; this.originalColor = options.color || 'rgb(17, 53, 104)';
    this.borderBottomWidth = options.borderWidth || '0px'; this.borderBottomColor = options.borderColor || 'rgba(0,0,0,0)'; this.visible = true;
    this.opacity = options.opacity || '1'; this.gradient = options.gradient || 'none'; this.serialize = false;
    this.pseudoBefore = options.pseudoBefore || null;
    this.rect = options.rect || rect;
    this.values = new Map(); this.priorities = new Map(); this.attributes = new Map();
    this.style = {
      getPropertyValue: key => {
        const value = this.values.get(key) || '';
        if (this.serialize && value === '#113568') return 'rgb(17, 53, 104)';
        if (this.serialize && value === '#ffffff') return 'rgb(255, 255, 255)';
        return value;
      },
      getPropertyPriority: key => this.priorities.get(key) || '',
      removeProperty: key => {
        const previous = this.values.get(key) || '';
        this.values.delete(key); this.priorities.delete(key);
        if (observerCallback) mutationRecords.push({ type: 'attributes', target: this, attributeName: 'style' });
        return previous;
      },
      setProperty: (key, value, priority) => {
        assert.ok(['color', '-webkit-text-fill-color'].includes(key), `Engine changed non-color property ${key}`);
        writes.push({ element: this, key, value, priority }); this.values.set(key, value); this.priorities.set(key, priority);
        if (observerCallback) mutationRecords.push({ type: 'attributes', target: this, attributeName: 'style' });
      }
    };
    if (options.text) this.appendText(options.text);
  }
  appendText(value) { this.childNodes.push({ nodeType: 3, nodeValue: value, textContent: value, parentElement: this }); }
  append(child) { child.parentElement = this; this.childNodes.push(child); return child; }
  get isConnected() { return this === html || Boolean(this.parentElement && this.parentElement.isConnected); }
  getAttribute(key) {
    if (key === 'style') return [...this.values].map(([k, v]) => `${k}:${v}${this.priorities.get(k) ? ' !important' : ''}`).join(';');
    return this.attributes.get(key) || null;
  }
  matches(selector) {
    return selector.split(',').some(s => {
      s = s.trim();
      if (s === '*') return true;
      if (s.includes(' ')) {
        const parts = s.split(/\s+/);
        if (!this.matches(parts.pop())) return false;
        let ancestor = this.parentElement;
        for (const part of parts.reverse()) {
          while (ancestor && !ancestor.matches(part)) ancestor = ancestor.parentElement;
          if (!ancestor) return false;
          ancestor = ancestor.parentElement;
        }
        return true;
      }
      if (s.startsWith('#')) return this.id === s.slice(1);
      if (s.startsWith('.')) return this.className.split(/\s+/).includes(s.slice(1));
      if (s === '[data-text-surface]') return Boolean(this.dataset.textSurface);
      const attribute = /^([a-z]+)?\[([^=\]]+)=["']([^"']*)["']\]$/.exec(s);
      if (attribute) {
        const key = attribute[2].replace(/^data-/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return (!attribute[1] || attribute[1] === this.localName) && (this.getAttribute(attribute[2]) || this.dataset[key]) === attribute[3];
      }
      if (s.startsWith('[')) return false;
      return s === this.localName;
    });
  }
  closest(selector) { for (let p = this; p; p = p.parentElement) if (p.matches(selector)) return p; return null; }
  querySelectorAll(selector) {
    const found = [];
    for (const child of this.childNodes.filter(n => n.nodeType === 1)) {
      if (child.matches(selector)) found.push(child);
      found.push(...child.querySelectorAll(selector));
    }
    return found;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  contains(other) { for (let p = other; p; p = p.parentElement) if (p === this) return true; return false; }
  get children() { return this.childNodes.filter(n => n.nodeType === 1); }
  getBoundingClientRect() { return this.rect; }
  getClientRects() { return this.visible ? [rect] : []; }
}
const html = new Element('html', { background: 'rgb(255, 255, 255)' });
const body = html.append(new Element('body'));
const paper = body.append(new Element('p', { text: 'Product description' }));
const button = body.append(new Element('button', { text: 'Continue', background: 'rgb(17, 53, 104)' }));
const svg = button.append(new Element('svg', { svg: true }));
const svgPath = svg.append(new Element('path', { svg: true }));
function computed(el, pseudo) {
  const inherited = el.namespaceURI.includes('svg') && el.parentElement ? computed(el.parentElement).color : el.originalColor;
  const normal = {
    ...typography, backgroundColor: el.background, backgroundImage: el.gradient, backgroundClip: 'border-box', webkitBackgroundClip: 'border-box',
    opacity: el.opacity, mixBlendMode: 'normal', filter: 'none', colorScheme: 'normal', display: 'block', visibility: 'visible', borderBottomWidth: el.borderBottomWidth, borderBottomColor: el.borderBottomColor,
    color: el.values.get('color') || inherited,
    webkitTextFillColor: el.values.get('-webkit-text-fill-color') || el.originalColor,
    content: pseudo ? 'none' : 'normal', position: 'static', width: '200px', height: '50px'
  };
  return pseudo === '::before' && el.pseudoBefore ? { ...normal, ...el.pseudoBefore } : normal;
}
const doc = { body, documentElement: html, readyState: 'complete', addEventListener: (name, fn) => events.set(`doc:${name}`, fn) };
const host = {
  document: doc, getComputedStyle: computed,
  requestAnimationFrame: fn => { const id = ++frameId; frames.set(id, fn); return id; },
  cancelAnimationFrame: id => frames.delete(id),
  addEventListener: (name, fn) => events.set(`window:${name}`, fn),
  MutationObserver: class { constructor(fn) { observerCallback = fn; } observe() {} }
};
const originalSvgColor = computed(svgPath).color;
const sandbox = { window: host, module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(source, 'utf8'), sandbox, { filename: source, timeout: 2000 });
const engine = host.ArotecTextColors;
assert.ok(engine, 'Browser engine did not initialize');
const cases = [], test = (name, fn) => cases.push({ name, fn });
function runFrame() {
  assert.ok(frames.size <= 1, `Expected bounded scheduling, got ${frames.size} frames`);
  const jobs = [...frames.values()]; frames.clear(); for (const fn of jobs) fn();
}
function deliver(records = mutationRecords.splice(0)) { if (records.length) observerCallback(records); }

test('initial white paper gets navy text and dark button gets white text', () => {
  assert.equal(paper.values.get('color'), '#113568');
  assert.equal(paper.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(button.values.get('-webkit-text-fill-color'), '#ffffff');
});
test('mixed SVG button uses fill only and preserves currentColor artwork', () => {
  assert.equal(button.dataset.arotecTextMode, 'fill-only');
  assert.equal(button.values.has('color'), false);
  assert.equal(computed(svgPath).color, originalSvgColor);
  assert.equal(writes.some(write => write.element === svg || write.element === svgPath), false);
});
test('childList-added text is painted on the next bounded frame', () => {
  const added = body.append(new Element('p', { text: 'New localized paragraph' }));
  deliver([{ type: 'childList', target: body, addedNodes: [added] }]);
  runFrame();
  assert.equal(added.values.get('color'), '#113568');
});
test('an external class/background state change flips the requested text tone', () => {
  paper.className = 'dark-state'; paper.background = 'rgb(17, 53, 104)';
  deliver([{ type: 'attributes', target: paper, attributeName: 'class' }]); runFrame();
  assert.equal(paper.values.get('-webkit-text-fill-color'), '#ffffff');
  paper.background = 'rgb(255, 255, 255)';
  paper.values.set('background-color', paper.background); // external author write
  deliver([{ type: 'attributes', target: paper, attributeName: 'style' }]); runFrame();
  assert.equal(paper.values.get('-webkit-text-fill-color'), '#113568');
});
test('own style mutations are ignored without a self-scheduling loop', () => {
  const count = writes.length, cycles = engine.inspect().cycles;
  deliver();
  assert.equal(frames.size, 0);
  assert.equal(writes.length, count);
  assert.equal(engine.inspect().cycles, cycles);
});
test('painting never changes typography and repeat refresh makes no new paint writes', () => {
  for (const el of [paper, button]) for (const [key, value] of Object.entries(typography)) assert.equal(computed(el)[key], value, key);
  assert.ok(writes.every(write => ['color', '-webkit-text-fill-color'].includes(write.key)));
  const count = writes.length; engine.refresh();
  assert.equal(writes.length, count);
  assert.equal(frames.size, 0);
});
test('interaction hooks re-evaluate text after focus and pointer state changes', () => {
  paper.background = 'rgb(17, 53, 104)';
  events.get('doc:focusin')({ target: paper }); runFrame();
  assert.equal(paper.values.get('-webkit-text-fill-color'), '#ffffff');
  paper.background = 'rgb(255, 255, 255)';
  events.get('doc:pointerout')({ target: paper }); runFrame();
  assert.equal(paper.values.get('color'), '#113568');
});
test('font icon protection applies to span-only CTA hosts independently of own text', () => {
  const cta = body.append(new Element('a'));
  cta.append(new Element('span', { text: 'Read more' }));
  const icon = cta.append(new Element('i', { color: 'rgb(5, 24, 62)' })); icon.className = 'ph ph-arrow-right';
  engine.refresh(cta);
  assert.equal(icon.values.get('-webkit-text-fill-color'), 'rgb(5, 24, 62)');
  assert.equal(icon.values.has('color'), false);
  assert.equal(icon.dataset.arotecIconPaint, 'preserve');
});
test('new SVG artwork restores a previously plain text host CSS color', () => {
  const host = body.append(new Element('p', { text: 'Caption', color: 'rgb(5, 24, 62)' }));
  engine.refresh(host); assert.equal(host.values.get('color'), '#113568');
  const artwork = host.append(new Element('svg', { svg: true }));
  const path = artwork.append(new Element('path', { svg: true }));
  deliver([{ type: 'childList', target: host, addedNodes: [artwork] }]); runFrame();
  assert.equal(host.values.has('color'), false);
  assert.equal(host.dataset.arotecTextMode, 'fill-only');
  assert.equal(computed(path).color, 'rgb(5, 24, 62)');
  assert.equal(host.values.get('-webkit-text-fill-color'), '#113568');
});
test('font painting preserves nontext borders consuming the original currentColor', () => {
  const label = body.append(new Element('h3', { text: 'System response', color: 'rgb(191, 8, 13)', borderWidth: '1px', borderColor: 'rgb(191, 8, 13)' }));
  engine.refresh(label);
  assert.equal(label.values.has('color'), false);
  assert.equal(label.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(computed(label).borderBottomColor, 'rgb(191, 8, 13)');
});
test('newly visible content is painted through content visibility lifecycle hook', () => {
  const paragraph = body.append(new Element('p', { text: 'Lower page copy' })); paragraph.visible = false;
  engine.refresh(paragraph); assert.equal(paragraph.values.has('-webkit-text-fill-color'), false);
  paragraph.visible = true; events.get('doc:contentvisibilityautostatechange')({ target: paragraph, skipped: false }); runFrame();
  assert.equal(paragraph.values.get('-webkit-text-fill-color'), '#113568');
});
test('completed background transitions trigger final tone reclassification', () => {
  const label = body.append(new Element('p', { text: 'Animated state' })); engine.refresh(label);
  label.background = 'rgb(17, 53, 104)';
  events.get('doc:transitionend')({ target: label, propertyName: 'background-color' }); runFrame();
  assert.equal(label.values.get('-webkit-text-fill-color'), '#ffffff');
});
test('browser RGB serialization does not cause duplicate writes for the same hexadecimal ink', () => {
  const label = body.append(new Element('p', { text: 'Stable browser serialization' })); engine.refresh(label);
  label.serialize = true;
  const count = writes.length; engine.refresh(label); engine.refresh(label);
  assert.equal(writes.length, count);
});
test('a nearer light opaque gradient overrides a dark ancestor semantic surface', () => {
  const dark = body.append(new Element('div')); dark.dataset.textSurface = 'dark';
  const light = dark.append(new Element('button', { text: 'Bright gradient button', gradient: 'linear-gradient(rgb(112,200,255),rgb(123,231,212))' }));
  engine.refresh(dark);
  assert.equal(light.values.get('-webkit-text-fill-color'), '#113568');
  assert.ok(light.dataset.arotecTextReview.includes('opaque-gradient-stops-proxy'));
});
test('an opaque child surface does not hide whole-component ancestor opacity from review', () => {
  const fading = body.append(new Element('div', { opacity: '.5' }));
  const child = fading.append(new Element('p', { text: 'Opaque card within fading wrapper', background: 'rgb(255,255,255)' }));
  engine.refresh(fading);
  assert.ok(child.dataset.arotecTextReview.includes('opacity'));
});
test('strong light glass above a photograph chooses navy while keeping the photograph flagged', () => {
  const photo = body.append(new Element('div', { gradient: 'url(scene.jpg)' }));
  const glass = photo.append(new Element('section', { background: 'rgba(255,255,255,.84)' }));
  const label = glass.append(new Element('p', { text: 'Secure access', color: 'rgb(234,240,251)' }));
  engine.refresh(photo);
  assert.equal(label.values.get('-webkit-text-fill-color'), '#113568');
  assert.ok(label.dataset.arotecTextReview.includes('image-or-gradient'));
});
test('an image painted on the same glass box prevents treating its covered color as a known layer', () => {
  const covered = body.append(new Element('p', { text: 'Photo on glass', background: 'rgba(255,255,255,.84)', gradient: 'url(scene.jpg)', color: 'rgb(234,240,251)' }));
  engine.refresh(covered);
  assert.equal(covered.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.ok(covered.dataset.arotecTextReview.includes('visual-review-required'));
});
test('a strong pale descendant surface overrides a dark semantic ancestor safely', () => {
  const dark = body.append(new Element('div', { gradient: 'url(dark-scene.jpg)' })); dark.dataset.textSurface = 'dark';
  const glass = dark.append(new Element('p', { text: 'Pale glass panel', background: 'rgba(255,255,255,.66)', color: 'rgb(234,240,251)' }));
  engine.refresh(dark);
  assert.equal(glass.values.get('-webkit-text-fill-color'), '#113568');
});
test('private-use icon pseudo on ordinary text retains its own source ink without changing host typography', () => {
  const label = body.append(new Element('li', { text: 'Experience value', color: 'rgb(6,19,52)', pseudoBefore: { content: '"\ue080"', fontFamily: 'Phosphor', color: 'rgb(6,19,52)' } }));
  engine.refresh(label);
  assert.equal(label.values.has('color'), false);
  assert.equal(label.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(label.dataset.arotecIconBefore, 'preserve');
  assert.equal(label.dataset.arotecBeforeTone, undefined);
  assert.equal(computed(label,'::before').color, 'rgb(6,19,52)');
  label.pseudoBefore.color = 'rgb(191,8,13)'; events.get('doc:pointerover')({ target: label }); runFrame();
  assert.equal(computed(label,'::before').color, 'rgb(191,8,13)');
  for (const [key,value] of Object.entries(typography)) assert.equal(computed(label)[key], value);
});
test('Kobayashi year-label map is scoped to the authored paper page and preserves unrelated labels', () => {
  const page = body.append(new Element('section', { background: 'rgb(245,245,243)' })); page.className = 'kb-page';
  const years = page.append(new Element('p', { text: '1900\u20132026', color: 'rgb(164,171,176)', pseudoBefore: { content: '""', position: 'absolute', backgroundColor: 'rgba(0,229,255,.12)' } })); years.className = 'kb-years';
  const unrelated = body.append(new Element('p', { text: '1900\u20132026', background: 'rgb(17,53,104)' })); unrelated.className = 'kb-years';
  engine.refresh(page); engine.refresh(unrelated);
  assert.equal(years.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(unrelated.values.get('-webkit-text-fill-color'), '#ffffff');
  for (const [key,value] of Object.entries(typography)) assert.equal(computed(years)[key], value);
});
test('source-owned white form glass stays navy despite covering weak decoration while dark child controls stay white', () => {
  for (const id of ['adminLoginForm', 'memberForm', 'contactForm']) {
    const form = body.append(new Element('form', { background: 'rgba(255,255,255,.84)', pseudoBefore: { content: '""', position: 'absolute', backgroundImage: 'linear-gradient(rgba(255,255,255,.16),transparent)' } })); form.id = id;
    const label = form.append(new Element('p', { text: 'Secure access', color: 'rgb(234,240,251)' }));
    const dark = form.append(new Element('button', { text: 'Dark submit', background: 'rgb(17,53,104)' }));
    engine.refresh(form);
    assert.equal(label.values.get('-webkit-text-fill-color'), '#113568');
    assert.ok(label.dataset.arotecTextReview.includes('source-owned-white-glass-with-weak-decoration'));
    assert.equal(dark.values.get('-webkit-text-fill-color'), '#ffffff');
    for (const [key,value] of Object.entries(typography)) assert.equal(computed(label)[key], value);
  }
});
test('members contact glass and platform hero stat maps respect source body roles and leave other dark cards white', () => {
  const contactBody = html.append(new Element('body')); contactBody.dataset.page = 'contact';
  const contact = contactBody.append(new Element('aside', { background: 'rgba(255,255,255,.84)', pseudoBefore: { content: '""', position: 'absolute', backgroundImage: 'linear-gradient(rgba(255,255,255,.16),transparent)' } })); contact.className = 'contact-card';
  const contactLabel = contact.append(new Element('p', { text: 'Member benefits', color: 'rgb(234,240,251)' }));
  const platformBody = html.append(new Element('body')); platformBody.dataset.page = 'platform';
  const hero = platformBody.append(new Element('section')); hero.className = 'page-hero';
  const stat = hero.append(new Element('div', { background: 'rgba(255,255,255,.84)', pseudoBefore: { content: '""', position: 'absolute', backgroundImage: 'linear-gradient(rgba(255,255,255,.16),transparent)' } })); stat.className = 'stat-card';
  const statLabel = stat.append(new Element('span', { text: 'Profile', color: 'rgb(234,240,251)' }));
  const unrelated = platformBody.append(new Element('aside', { text: 'Dark elsewhere', background: 'rgb(17,53,104)' })); unrelated.className = 'contact-card';
  const feature = platformBody.append(new Element('section', { text: 'Dark feature', background: 'rgb(17,53,104)' })); feature.className = 'feature-panel';
  engine.refresh(contactBody); engine.refresh(platformBody);
  assert.equal(contactLabel.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(statLabel.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(unrelated.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.equal(feature.values.get('-webkit-text-fill-color'), '#ffffff');
});
test('Vagus digits on the actual dark photographic flip tiles use white while a nearer solid light tile still uses navy', () => {
  const launch = body.append(new Element('section', { gradient: 'url(vagus-dark-photographic-scene.webp)' })); launch.className = 'vagus-launch';
  const digits = launch.append(new Element('div')); digits.className = 'vagus-countdown__digits';
  const digit = digits.append(new Element('span', { text: '29', color: 'rgb(17,53,104)' }));
  const lightDigit = digits.append(new Element('span', { text: '01', background: 'rgb(255,255,255)', color: 'rgb(17,53,104)' }));
  engine.refresh(launch);
  assert.equal(digit.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.equal(digit.values.get('color'), '#ffffff');
  assert.ok(digit.dataset.arotecTextReview.includes('vagus-dark-photographic-digit-tiles'));
  assert.equal(lightDigit.values.get('-webkit-text-fill-color'), '#113568');
  for (const [key,value] of Object.entries(typography)) assert.equal(computed(digit)[key], value);
});

test('normal-flow picture beneath absolute diagram labels covers its canvas background', () => {
  const canvas = body.append(new Element('div', { background: 'rgb(255,255,255)' }));
  canvas.dataset.textSurface = 'dark';
  canvas.append(new Element('picture')).append(new Element('img'));
  const label = canvas.append(new Element('p', { text: 'Dark photographic diagram label' }));
  engine.refresh(canvas);
  assert.equal(label.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.ok(label.dataset.arotecTextReview.includes('positioned-image'));
});
test('an opaque light text card above a normal-flow picture keeps navy paint', () => {
  const canvas = body.append(new Element('div', { background: 'rgb(255,255,255)' }));
  canvas.dataset.textSurface = 'dark';
  canvas.append(new Element('picture')).append(new Element('img'));
  const card = canvas.append(new Element('p', { text: 'Light readable explanation', background: 'rgb(255,255,255)', color: 'rgb(255,255,255)' }));
  engine.refresh(canvas);
  assert.equal(card.values.get('-webkit-text-fill-color'), '#113568');
});
test('normal-flow image elsewhere in the canvas does not change unrelated text paint', () => {
  const canvas = body.append(new Element('div', { background: 'rgb(255,255,255)' }));
  canvas.append(new Element('picture')).append(new Element('img', { rect: { x: 0, y: 100, left: 0, top: 100, right: 200, bottom: 150, width: 200, height: 50 } }));
  const label = canvas.append(new Element('p', { text: 'Text above the image', color: 'rgb(255,255,255)' }));
  engine.refresh(canvas);
  assert.equal(label.values.get('-webkit-text-fill-color'), '#113568');
  assert.equal(label.dataset.arotecTextReview, undefined);
});

test('Melacor benefits rail and translucent green callout use white while nearer light cards keep navy', () => {
  const page = body.append(new Element('section')); page.className = 'ml-page';
  const rail = page.append(new Element('aside', { gradient: 'linear-gradient(123deg, #002433 4%, #002e42 56%, #00534f 112%)' })); rail.className = 'ml-benefits-sidebar';
  const title = rail.append(new Element('h2', { text: 'Long-Term Skin Benefits' }));
  const support = rail.append(new Element('div', { gradient: 'linear-gradient(110deg, #00735e, #00765cdd)' }));
  const callout = support.append(new Element('strong', { text: 'Six Benefit Directions' }));
  const light = rail.append(new Element('p', { text: 'White card', background: 'rgb(255,255,255)' }));
  engine.refresh(page);
  assert.equal(title.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.equal(callout.values.get('-webkit-text-fill-color'), '#ffffff');
  assert.equal(light.values.get('-webkit-text-fill-color'), '#113568');
  assert.ok(title.dataset.arotecTextReview.includes('melacor-dark-benefits-sidebar'));
});

let failures = 0;
for (const { name, fn } of cases) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}\n${error.stack || error}`); }
}
console.log(JSON.stringify({ source, tests: cases.length, passed: cases.length - failures, failed: failures, scope: 'Mock DOM paint ownership, mutation scheduling and interaction hooks; no browser rendering' }));
if (failures) process.exitCode = 1;
