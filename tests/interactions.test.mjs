import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
function element(extra = {}) {
  const listeners = {}, attributes = {};
  const classes = new Set();
  return { hidden: false, dataset: {}, value: '', listeners, attributes,
    addEventListener: (event, action) => { listeners[event] = action; },
    setAttribute: (key, value) => { attributes[key] = value; },
    getAttribute: key => attributes[key],
    classList: { add: key => classes.add(key), toggle: (key, state) => state ? classes.add(key) : classes.delete(key) },
    focus() { this.focused = true; }, querySelectorAll: () => [], ...extra };
}
function start(selectors = {}, groups = {}, page = 'rezepte', hash = '') {
  const document = element({ documentElement: element(), body: { dataset: { page } }, querySelector: selector => selectors[selector] || null, querySelectorAll: selector => groups[selector] || [] });
  const window = element({ innerWidth: 390, location: { hash, replace(url) { this.destination = url; } } });
  runInNewContext(script, { document, window, navigator: {}, Date });
  return { document, window };
}
test('Search handles accents, multiple words, no results and reset', () => {
  const input = element();
  const form = element({ hidden: true, querySelector: () => input });
  const cards = [element({ dataset: { search: 'Hüttenkäse Vanille Creme' } }), element({ dataset: { search: 'Poulet mit Gemüse' } })];
  const empty = element(), count = element();
  start({ '[data-recipe-search]': form, '[data-search-empty]': empty, '[data-recipe-count]': count }, { '[data-recipe-card]': cards });
  assert.equal(form.hidden, false);
  input.value = 'HUTTENKASE vanille';
  input.listeners.input();
  assert.deepEqual(cards.map(x => x.hidden), [false, true]);
  assert.equal(count.textContent, '1 Rezept');
  input.value = 'unbekannt';
  input.listeners.input();
  assert.equal(empty.hidden, false);
  assert.equal(count.textContent, '0 Rezepte');
  form.listeners.reset({ preventDefault() {} });
  assert.equal(input.value, '');
  assert.deepEqual(cards.map(x => x.hidden), [false, false]);
  assert.equal(input.focused, true);
});
test('Menu opens, closes with Escape and restores focus; legacy sections redirect', () => {
  const menu = element(), nav = element(), header = element({ contains: () => true });
  menu.setAttribute('aria-expanded', 'false');
  const { document, window } = start({ '.menu': menu, '#main-nav': nav, '.site-header': header }, {}, 'start', '#matthias');
  menu.listeners.click();
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  document.listeners.keydown({ key: 'Escape' });
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  assert.equal(menu.focused, true);
  assert.equal(window.location.destination, '/ueber-mich/');
});
test('Pages without recipe controls or partner code initialise without exceptions', () => {
  assert.doesNotThrow(() => start({}, {}, 'datenschutz'));
});
