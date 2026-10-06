'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const file = path.resolve(__dirname, '../assets/css/text-colors.css');
const source = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = Array.from(source.matchAll(/([^{}]+)\{([^{}]*)\}/g), m => ({ selector: m[1].trim(), body: m[2] }));
const tests = [];
function test(name, fn) { try { fn(); tests.push({ name, passed: true }); } catch (error) { tests.push({ name, passed: false, error: error.message }); } }
test('SVG label fill stays scoped to text and tspan in the authored stress chart', () => {
  const paints = blocks.filter(b => /(?:^|;)\s*fill\s*:/.test(b.body));
  assert.equal(paints.length, 1);
  assert.equal(paints[0].selector, 'body.stress-page .native-graph-copy :is(text,tspan)');
  assert.match(paints[0].body, /fill:\s*var\(--arotec-text-navy\)\s*!important/);
  assert.doesNotMatch(paints[0].selector, /\b(?:path|g|marker|rect|image|svg)\b/);
});
test('Opacity repair is confined to placeholder text, never its form control or artwork', () => {
  const opacity = blocks.filter(b => /(?:^|;)\s*opacity\s*:/.test(b.body));
  assert.equal(opacity.length, 1);
  assert.ok(opacity[0].selector.split(',').every(s => s.trim().endsWith('::placeholder')));
  assert.match(opacity[0].body, /opacity:\s*1\s*;/);
});
test('Color layer does not declare typography or layout changes', () => {
  for (const block of blocks) for (const declaration of block.body.split(';')) {
    const property = declaration.trim().split(':')[0];
    if (!property) continue;
    assert.ok(['--arotec-text-navy', '--arotec-text-white', 'color', '-webkit-text-fill-color', 'fill', 'opacity'].includes(property), property);
  }
  assert.doesNotMatch(source, /(?:^|,)\s*\*\s*\{/m);
});
const report = { file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), tests, passed: tests.filter(t => t.passed).length, failed: tests.filter(t => !t.passed).length };
fs.writeFileSync(path.join(__dirname, 'unit-text-colors-css-report.json'), JSON.stringify(report, null, 2));
for (const t of tests) console.log((t.passed ? 'PASS ' : 'FAIL ') + t.name + (t.error ? ': ' + t.error : ''));
process.exitCode = report.failed ? 1 : 0;
