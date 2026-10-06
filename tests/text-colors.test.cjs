'use strict';

// Run without a browser: node unit-text-colors.cjs [path/to/text-colors.js]
// These fixtures verify color decisions and element eligibility, not the paint
// planner's browser-dependent sampling or CSS cascade.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const sourcePath = path.resolve(process.argv[2] || path.join(__dirname, '../assets/js/text-colors.js'));
const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), sandbox, { filename: sourcePath, timeout: 2000 });
const utilities = sandbox.module.exports.utilities || sandbox.module.exports;
for (const name of ['parseColor', 'composite', 'luminance', 'contrast', 'choose', 'candidate']) {
  assert.equal(typeof utilities[name], 'function', `Missing utility: ${name}`);
}
const { parseColor, composite, luminance, contrast, choose, candidate } = utilities;
const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const near = (actual, expected, tolerance = 1e-8) => {
  assert.ok(Number.isFinite(actual), `Expected finite number, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} near ${expected}`);
};
const color = (r, g, b, a = 1) => ({ r, g, b, a });
const plain = value => JSON.parse(JSON.stringify(value));
const navy = color(17, 53, 104);
const white = color(255, 255, 255);
const black = color(0, 0, 0);

test('rgb brand navy parses without changing channel values', () => {
  assert.deepEqual(plain(parseColor('rgb(17, 53, 104)')), navy);
});
test('rgba preserves fractional alpha', () => {
  assert.deepEqual(plain(parseColor('rgba(255, 255, 255, 0.25)')), color(255, 255, 255, .25));
});
test('browser color-mix computed srgb surfaces retain channels and alpha', () => {
  assert.deepEqual(plain(parseColor('color(srgb 1 1 1 / 25%)')), color(255, 255, 255, .25));
  assert.deepEqual(plain(parseColor('color(srgb 0 0 0)')), black);
  assert.equal(parseColor('color(srgb 1.2 0 0)'), null);
});
test('uniform opaque gradient stops provide a tone proxy for dark and light surfaces', () => {
  assert.equal(utilities.opaqueGradientTone('linear-gradient(rgb(1, 4, 13), rgb(2, 9, 26))'), 'white');
  assert.equal(utilities.opaqueGradientTone('radial-gradient(rgb(255, 255, 255), rgb(234, 240, 247))'), 'navy');
});
test('photographs, transparent and mixed-tone gradients remain unresolved by the stop proxy', () => {
  for (const value of ['url(scene.png),linear-gradient(rgb(1,4,13),rgb(2,9,26))','linear-gradient(rgba(0,0,0,.2),rgb(0,0,0))','linear-gradient(rgb(0,0,0),rgb(255,255,255))']) assert.equal(utilities.opaqueGradientTone(value), null);
});
test('strong white glass bounds navy contrast against every unknown RGB underlay corner', () => {
  const result = utilities.boundedSurface(color(255,255,255,.84));
  assert.equal(result.tone, 'navy'); near(result.ratio, 8.35397377068616); assert.ok(result.ratio >= 4.5); assert.equal(result.unknownUnderlayBound, true);
});
test('strong black glass bounds white contrast against every unknown RGB underlay corner', () => {
  const result = utilities.boundedSurface(color(0,0,0,.84));
  assert.equal(result.tone, 'white'); assert.ok(result.ratio > 14);
});
test('pale white 66 percent glass remains safely navy even on a black unknown underlay', () => {
  const result = utilities.boundedSurface(color(255,255,255,.66));
  assert.equal(result.tone, 'navy'); assert.ok(result.ratio > 5);
});
test('weak and transparent glass cannot invent a uniformly safe underlay decision', () => {
  for (const partial of [null,color(255,255,255,0),color(255,255,255,.4),color(128,128,128,.84)]) assert.equal(utilities.boundedSurface(partial), null);
});
test('transparent is an unresolved transparent color, not white', () => {
  assert.deepEqual(plain(parseColor('transparent')), color(0, 0, 0, 0));
});
test('unsupported gradients and malformed input return null', () => {
  for (const value of ['linear-gradient(#fff, #000)', 'not-a-color', '', null]) {
    assert.equal(parseColor(value), null, String(value));
  }
});
test('transparent foreground preserves known background', () => {
  assert.deepEqual(plain(composite(color(255, 0, 255, 0), navy)), navy);
});
test('opaque foreground replaces background', () => {
  assert.deepEqual(plain(composite(white, navy)), white);
});
test('translucent white composites over dark navy before deciding contrast', () => {
  const result = composite(color(255, 255, 255, .25), navy);
  near(result.r, 76.5, 1);
  near(result.g, 103.5, 1);
  near(result.b, 141.75, 1);
  near(result.a, 1);
  assert.equal(choose(result).tone, 'white');
});
test('WCAG reference black and white luminance is exact', () => {
  near(luminance(black), 0);
  near(luminance(white), 1);
});
test('WCAG black/white contrast is 21:1 and symmetric', () => {
  near(contrast(black, white), 21);
  near(contrast(white, black), 21);
});
test('identical foreground and background report 1:1 contrast', () => {
  near(contrast(navy, navy), 1);
});
test('brand navy has independently calculated 12.1179206263:1 on white', () => {
  near(luminance(navy), 0.03664852926326306);
  near(contrast(navy, white), 12.117920626324759);
});
test('white and pale solid surfaces choose navy with normal-text AA', () => {
  for (const background of [white, color(244, 248, 255), color(225, 255, 244)]) {
    const result = choose(background);
    assert.equal(result.tone, 'navy');
    assert.equal(result.color.toLowerCase(), '#113568');
    assert.equal(result.minAA, true);
    assert.ok(result.ratio >= 4.5);
  }
});
test('dark navy and near-black Vagus surfaces choose white with normal-text AA', () => {
  for (const background of [navy, color(5, 19, 28), black]) {
    const result = choose(background);
    assert.equal(result.tone, 'white');
    assert.equal(result.color.toLowerCase(), '#ffffff');
    assert.equal(result.minAA, true);
    assert.ok(result.ratio >= 4.5);
  }
});
test('middle gray reports the best available tone without claiming AA', () => {
  const result = choose(color(128, 128, 128));
  assert.equal(result.tone, 'white');
  assert.equal(result.minAA, false);
  assert.ok(result.ratio < 4.5);
  near(result.ratio, 3.9494396480491156);
});
test('unknown or nonopaque backgrounds are not assigned an invented tone', () => {
  for (const background of [null, color(0, 0, 0, 0), color(255, 255, 255, .5)]) {
    assert.equal(choose(background), null);
  }
});

// A small native-element model is enough to test the candidate boundary. It
// deliberately does not emulate layout, computed CSS or browser contrast.
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const SVG_NS = 'http://www.w3.org/2000/svg';
class Element {
  constructor(tag = 'span', options = {}) {
    this.nodeType = 1;
    this.localName = tag.toLowerCase();
    this.tagName = tag.toUpperCase();
    this.namespaceURI = options.namespace || HTML_NS;
    this.parentElement = options.parent || null;
    this.className = options.className || '';
    this.dataset = options.dataset || {};
    this.value = options.value || '';
    this.childNodes = [];
    this.attributes = { ...options.attributes };
    if (options.text !== undefined) this.childNodes.push({ nodeType: 3, textContent: options.text, nodeValue: options.text, parentElement: this });
    if (options.children) for (const child of options.children) { child.parentElement = this; this.childNodes.push(child); }
  }
  get textContent() { return this.childNodes.map(node => node.textContent || '').join(''); }
  get classList() { return { contains: name => this.className.split(/\s+/).includes(name) }; }
  getAttribute(name) { return name === 'class' ? this.className : this.attributes[name] ?? null; }
  hasAttribute(name) { return name in this.attributes || (name.startsWith('data-') && name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()) in this.dataset); }
  matches(selectors) {
    return selectors.split(',').some(selector => {
      const item = selector.trim();
      if (item.startsWith('.')) return this.className.split(/\s+/).includes(item.slice(1));
      if (/^\[[\w-]+\]$/.test(item)) return this.hasAttribute(item.slice(1, -1));
      return this.localName === item.toLowerCase();
    });
  }
  closest(selectors) { for (let node = this; node; node = node.parentElement) if (node.matches(selectors)) return node; return null; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}
test('direct visible text is eligible but a container with only descendant text is not', () => {
  assert.equal(candidate(new Element('p', { text: 'Product details' })), true);
  assert.equal(candidate(new Element('div', { children: [new Element('span', { text: 'Product details' })] })), false);
  assert.equal(candidate(new Element('div', { text: ' \n\t ' })), false);
});
test('native editable and selectable controls are eligible', () => {
  for (const tag of ['input', 'textarea', 'select', 'option', 'button']) {
    assert.equal(candidate(new Element(tag, { value: 'User text' })), true, tag);
  }
});
test('embedded artwork and execution containers are excluded', () => {
  for (const tag of ['script', 'style', 'template', 'svg', 'math', 'canvas', 'img', 'video', 'audio', 'object', 'embed', 'iframe', 'path', 'use']) {
    assert.equal(candidate(new Element(tag, { text: 'Artwork label' })), false, tag);
  }
  assert.equal(candidate(new Element('text', { namespace: SVG_NS, text: 'SVG label' })), false);
});
test('explicit preserve and artwork wrappers protect descendants', () => {
  for (const attribute of ['data-text-color-preserve', 'data-color-artwork']) {
    const parent = new Element('div', { attributes: { [attribute]: '' } });
    assert.equal(candidate(new Element('span', { parent, text: 'Artwork label' })), false, attribute);
  }
  for (const className of ['brand', 'brand-logo']) {
    const parent = new Element('a', { className });
    assert.equal(candidate(new Element('span', { parent, text: 'Arotec' })), false, className);
  }
});
test('SVG and canvas ancestors cannot admit HTML text into the paint scope', () => {
  for (const tag of ['svg', 'math', 'canvas']) {
    const parent = new Element(tag);
    assert.equal(candidate(new Element('span', { parent, text: 'Foreign artwork' })), false, tag);
  }
});
test('font icon families are excluded including inherited icon wrappers', () => {
  for (const className of ['ph', 'ph-arrow-right', 'material-icons', 'material-symbols-outlined', 'fa', 'fas', 'fa-arrow-right', 'icon-font']) {
    const parent = new Element('span', { className });
    assert.equal(candidate(new Element('i', { parent, text: '\ue001' })), false, className);
  }
  assert.equal(candidate(new Element('p', { className: 'iconic-story', text: 'Regular paragraph' })), true);
});
test('mixed text and SVG host stays eligible without admitting the SVG child', () => {
  const svg = new Element('svg', { namespace: SVG_NS });
  const host = new Element('button', { text: 'Open menu', children: [svg] });
  assert.equal(candidate(host), true);
  assert.equal(candidate(svg), false);
});

let failures = 0;
for (const { name, fn } of tests) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}\n${error.stack || error}`); }
}
console.log(JSON.stringify({ source: sourcePath, tests: tests.length, passed: tests.length - failures, failed: failures }));
if (failures) process.exitCode = 1;
