import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('Recipe lifecycle: draft, publish, multiple categories, safe text, nutrition, unpublish', () => {
  const temporary = mkdtempSync(resolve(tmpdir(), 'wicki-recipes-'));
  const root = resolve(temporary, 'site');
  try {
    cpSync(project, root, { recursive: true, filter: path => !path.split('/').includes('.git') });
    const read = path => readFileSync(resolve(root, path), 'utf8');
    const save = recipe => writeFileSync(resolve(root, 'content/recipes/test-recipe.json'), JSON.stringify(recipe));
    const build = () => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, encoding: 'utf8' });
    const recipe = {
      status: 'draft', slug: 'test-recipe', title: 'Vanille <script>alert(1)</script>',
      description: 'Test mit Hüttenkäse & Vanille', categories: ['low-carb', 'ketogen'],
      datePublished: '2026-01-02', servings: 2, prepMinutes: 10, cookMinutes: 0, restMinutes: 60,
      image: '', imageAlt: '', ingredients: ['100 g Hüttenkäse', '1 TL Vanille'],
      steps: ['Alles mischen.', 'Kühlen.'], notes: '', nutritionPerServing: null
    };
    save(recipe);
    assert.equal(build().status, 0);
    assert.equal(existsSync(resolve(root, 'rezepte/test-recipe/index.html')), false);
    assert.ok(!read('rezepte/index.html').includes('test-recipe'));
    recipe.status = 'published';
    save(recipe);
    let result = build();
    assert.equal(result.status, 0, result.stderr);
    const detail = read('rezepte/test-recipe/index.html');
    assert.ok(detail.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(!detail.includes('<script>alert(1)</script>'));
    assert.ok(detail.includes('70 Min.'));
    for (const path of ['rezepte/index.html', 'rezepte/low-carb/index.html', 'rezepte/ketogen/index.html', 'sitemap.xml']) assert.ok(read(path).includes('/rezepte/test-recipe/'));
    assert.ok(!read('rezepte/allgemeine-diaetrezepte/index.html').includes('/rezepte/test-recipe/'));
    const schema = JSON.parse(detail.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema.totalTime, 'PT70M');
    assert.equal(schema.recipeInstructions.length, 2);
    assert.equal('nutrition' in schema, false);
    assert.equal('image' in schema, false);
    recipe.nutritionPerServing = { kcal: 100, protein: 10, carbs: 5, fat: 4, note: 'Testberechnung.' };
    save(recipe);
    assert.equal(build().status, 0);
    assert.ok(read('rezepte/test-recipe/index.html').includes('NÄHRWERTE PRO PORTION'));
    recipe.categories = ['unknown'];
    save(recipe);
    assert.notEqual(build().status, 0, 'Unknown category must block output.');
    recipe.categories = ['low-carb'];
    recipe.servings = 0;
    save(recipe);
    assert.notEqual(build().status, 0, 'Zero servings must block output.');
    recipe.servings = 2;
    recipe.status = 'draft';
    save(recipe);
    assert.equal(build().status, 0);
    assert.equal(existsSync(resolve(root, 'rezepte/test-recipe/index.html')), false);
    assert.ok(!read('sitemap.xml').includes('/rezepte/test-recipe/'));
    assert.ok(!read('rezepte/index.html').includes('data-recipe-card'));
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
