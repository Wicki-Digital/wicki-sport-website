import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const data = slug => JSON.parse(read(`content/recipes/${slug}.json`));
const article = data('low-carb-snacks-filmabend');
const schema = html => JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);

test('New entries use the intended categories without replacing the two keto recipes', () => {
  const expected = {
    '': ['mediterrane-rindhack-bowl', 'low-carb-erdbeer-vanille-cheesecake', article.slug, 'keto-lachs-zucchini-spaghetti', 'keto-vanille-protein-cups'],
    'low-carb/': ['mediterrane-rindhack-bowl'],
    'snacks/': ['low-carb-erdbeer-vanille-cheesecake', article.slug],
    'ketogen/': ['keto-lachs-zucchini-spaghetti', 'keto-vanille-protein-cups'],
    'allgemeine-diaetrezepte/': []
  };
  for (const [category, slugs] of Object.entries(expected)) {
    const html = read(`rezepte/${category}index.html`);
    const cards = [...html.matchAll(/<article class="recipe-card".*?<\/article>/gs)].map(x => x[0]);
    assert.equal(cards.length, slugs.length, category);
    for (const slug of slugs) assert.equal(cards.filter(x => x.includes(`href="/rezepte/${slug}/"`)).length, 1);
    const nav = html.match(/<nav class="recipe-categories".*?<\/nav>/s)[0];
    assert.equal((nav.match(/href="\/rezepte\/snacks\/"/g) || []).length, 1);
    assert.ok(!/NaN|undefined/.test(html));
  }
});

test('Filmabend is one Article with six snacks, one bonus and working anchor targets', () => {
  const html = read(`rezepte/${article.slug}/index.html`);
  assert.equal(schema(html)['@type'], 'Article');
  assert.equal('nutrition' in schema(html), false);
  assert.equal(article.sections.filter(x => !x.bonus).length, 6);
  assert.equal(article.sections.filter(x => x.bonus).length, 1);
  for (const section of article.sections) {
    assert.ok(html.includes(`href="#${section.id}"`));
    assert.equal((html.match(new RegExp(`id="${section.id}"`, 'g')) || []).length, 1);
    assert.ok(html.includes(section.nutritionText));
    assert.equal(existsSync(resolve(root, `rezepte/${section.id}/index.html`)), false);
  }
  const overview = read('rezepte/snacks/index.html');
  assert.ok(overview.includes('BEITRAG ANSEHEN'));
  assert.ok(overview.includes('Popcornmais'), 'Article ingredients must remain searchable.');
  assert.ok(html.includes('ohne diesen Überzug'));
  assert.ok(html.includes('nicht als ketogener Snack'));
});

test('New image variants, SEO and Recipe schema are wired into existing templates', () => {
  const recipes = [data('mediterrane-rindhack-bowl'), data('low-carb-erdbeer-vanille-cheesecake')];
  for (const r of [...recipes, article, ...article.sections]) {
    for (const field of ['image', 'imageSmall']) {
      const bytes = readFileSync(resolve(root, r[field].slice(1)));
      assert.ok(bytes.length > 1000, `${r[field]} must not be empty or truncated.`);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.equal(bytes.readUInt32LE(4) + 8, bytes.length);
    }
    assert.ok(r.imageAlt.length > 10);
    assert.equal(r.imageFit, 'contain');
    assert.ok(r.imageSmallWidth < r.imageWidth);
  }
  for (const r of recipes) {
    const html = read(`rezepte/${r.slug}/index.html`);
    const structured = schema(html);
    assert.equal(structured['@type'], 'Recipe');
    assert.deepEqual(structured.recipeIngredient, r.ingredients);
    assert.equal(structured.recipeInstructions.length, r.steps.length);
    assert.equal(structured.nutrition.calories, `${r.nutritionPerServing.kcal} kcal`);
    assert.ok(html.includes('srcset="'));
    assert.ok(html.includes(r.imageSmall));
    assert.ok(html.includes('object-fit:contain'));
  }
  const css = read('pages.css');
  assert.match(css, /\.recipe-card-media\{[^}]*padding-top:75%/);
  assert.match(css, /@media\(max-width:520px\)\{\s*\.recipe-grid\{grid-template-columns:1fr\}/);
});

test('Article validation rejects duplicate anchors and missing responsive image files', () => {
  const temporary = mkdtempSync(resolve(tmpdir(), 'wicki-snacks-'));
  const copy = resolve(temporary, 'site');
  try {
    cpSync(root, copy, { recursive: true, filter: path => !path.split('/').includes('.git') });
    const path = resolve(copy, 'content/recipes/low-carb-snacks-filmabend.json');
    const candidate = structuredClone(article);
    const build = () => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: copy, encoding: 'utf8' });
    candidate.sections[1].id = candidate.sections[0].id;
    writeFileSync(path, JSON.stringify(candidate));
    assert.notEqual(build().status, 0);
    candidate.sections[1].id = article.sections[1].id;
    candidate.sections[1].imageSmall = '/assets/missing.webp';
    writeFileSync(path, JSON.stringify(candidate));
    assert.notEqual(build().status, 0);
    writeFileSync(path, JSON.stringify(article));
    const result = build();
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
