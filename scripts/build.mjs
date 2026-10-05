import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// No dependencies or server required. Commit the generated HTML with the sources.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://wickisport.ch';
const read = path => readFileSync(resolve(root, path), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const categories = [
  { slug: 'low-carb', name: 'Low Carb', kicker: 'WENIGER KOHLENHYDRATE', text: 'Ideen für Mahlzeiten mit reduziertem Kohlenhydratanteil.' },
  { slug: 'ketogen', name: 'Ketogen', kicker: 'BEWUSST ZUSAMMENSTELLEN', text: 'Rezepte mit sehr wenig Kohlenhydraten für eine ketogene Ernährung.' },
  { slug: 'allgemeine-diaetrezepte', name: 'Allgemeine Diätrezepte', kicker: 'ABWECHSLUNG IM ALLTAG', text: 'Vielseitige Rezeptideen für eine bewusste, planbare Ernährung.' }
];
const navigation = [
  ['start', '/', 'Startseite'], ['philosophie', '/philosophie/', 'Philosophie'],
  ['ueber-mich', '/ueber-mich/', 'Über mich'], ['coaching', '/coaching/', 'Coaching'],
  ['wissen', '/wissen/', 'Wissen'], ['rezepte', '/rezepte/', 'Rezepte']
];
const pages = [
  { key: 'start', path: '/', title: 'Wicki Sport | Training, Ernährung & Lifestyle Schweiz', description: 'Persönliches Coaching mit Matthias Wicki: Training, Ernährung und Gewohnheiten, die in deinen Alltag passen. Entdecke Wicki Sport.' },
  { key: 'philosophie', path: '/philosophie/', title: 'Meine Philosophie | Wicki Sport', heading: 'LANGFRISTIG DENKEN.<br><em>KONSEQUENT HANDELN.</em>', intro: 'Training, Ernährung und Lifestyle gehören zusammen. Ein guter Plan berücksichtigt alle drei.', description: 'Die Philosophie von Wicki Sport: individuelles Training, alltagstaugliche Ernährung und Routinen für langfristige Entwicklung.' },
  { key: 'ueber-mich', path: '/ueber-mich/', title: 'Über Matthias Wicki | Wicki Sport', heading: 'TRAINING GEHÖRT<br><em>ZU MEINEM LEBEN.</em>', intro: 'Lerne den Menschen hinter Wicki Sport und meinen Blick auf Training und Alltag kennen.', description: 'Matthias Wicki stellt sich vor: 16 Jahre Trainingserfahrung, Alltag als Polizist und der persönliche Ansatz hinter Wicki Sport.' },
  { key: 'coaching', path: '/coaching/', title: 'Coaching für Training, Ernährung & Lifestyle | Wicki Sport', heading: 'DEIN ZIEL.<br><em>GEMEINSAM PLANEN.</em>', intro: 'Persönliche Begleitung beginnt mit deiner Ausgangslage, deinen Möglichkeiten und deinem Alltag.', description: 'Individuelle Trainingsplanung, Ernährungsstruktur und Lifestylecoaching mit Matthias Wicki. Finde das passende Angebot und nimm Kontakt auf.' },
  { key: 'wissen', path: '/wissen/', title: 'Wissen zu Training, Ernährung & Regeneration | Wicki Sport', heading: 'VERSTEHEN,<br><em>WAS DU TUST.</em>', intro: 'Entdecke meine Themen und die weiterführenden Beiträge auf Instagram.', description: 'Themen rund um Muskelaufbau, Ernährung und Regeneration. Entdecke die Wissensbeiträge von Matthias Wicki auf Instagram.' },
  { key: 'impressum', path: '/impressum/', title: 'Impressum | Wicki Sport', heading: 'IMPRESSUM', description: 'Anbieterangaben und Kontakt zu Matthias Wicki, Wicki Sport, Bodenacker 24, 5619 Uezwil, Schweiz.' },
  { key: 'datenschutz', path: '/datenschutz/', title: 'Datenschutz | Wicki Sport', heading: 'DATENSCHUTZ', description: 'Informationen zur Bearbeitung von Personendaten auf wickisport.ch und Kontakt zum Verantwortlichen Matthias Wicki.' }
];
const template = read('templates/layout.html');
const output = new Map();
const urls = [];
function heading(label, title, intro = '', parent = null) {
  return `<section class="page-intro"><nav class="breadcrumbs" aria-label="Brotkrumennavigation"><a href="/">Startseite</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent.path}">${escape(parent.name)}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${escape(label)}</span></nav><p class="eyebrow">WICKI SPORT / ${escape(label.toUpperCase())}</p><h1>${title}</h1>${intro ? `<p class="page-intro-text">${escape(intro)}</p>` : ''}</section>`;
}
function categoryCards() {
  return `<div class="category-grid">${categories.map((c, i) => `<a class="category-card category-${c.slug}" href="/rezepte/${c.slug}/"><span class="category-index" aria-hidden="true">0${i + 1}</span><div><p class="eyebrow">${c.kicker}</p><h3>${c.name}</h3><p>${c.text}</p><span class="text-link">KATEGORIE ENTDECKEN ↗</span></div></a>`).join('')}</div>`;
}
function render(page, main, schema = null) {
  const links = navigation.map(([key, path, label]) => `<a href="${path}"${page.key === key ? ` aria-current="${page.path === path ? 'page' : 'true'}"` : ''}>${label}</a>`);
  const values = {
    TITLE: escape(page.title), DESCRIPTION: escape(page.description), URL: site + page.path,
    OG_TYPE: page.recipe ? 'article' : 'website',
    IMAGE_URL: site + (page.image || '/assets/wicki-stage.jpeg'),
    IMAGE_ALT: escape(page.imageAlt || 'Matthias Wicki bei einer Bodybuilding-Pose auf der Bühne'),
    PAGE_KEY: page.key, NAVIGATION: links.join(''), FOOTER_NAVIGATION: links.join(''),
    MAIN: main.replace('{{CATEGORY_CARDS}}', categoryCards()),
    STRUCTURED_DATA: schema ? `<script type="application/ld+json">${json(schema)}</script>` : ''
  };
  const result = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unbekannter Platzhalter: ${key}`);
    return values[key];
  });
  output.set(page.path.slice(1) + 'index.html', result);
  urls.push(site + page.path);
}
for (const page of pages) {
  const label = navigation.find(([key]) => key === page.key)?.[2] || (page.key === 'impressum' ? 'Impressum' : 'Datenschutz');
  render(page, (page.heading ? heading(label, page.heading, page.intro) : '') + read(`content/pages/${page.key}.html`));
}

const reserved = new Set(categories.map(c => c.slug));
function required(condition, message) { if (!condition) throw new Error(message); }
function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }
function validateRecipe(recipe, filename) {
  const check = (condition, message) => required(condition, `${filename}: ${message}`);
  check(['draft', 'published'].includes(recipe.status), 'status muss draft oder published sein.');
  check(typeof recipe.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.slug) && !reserved.has(recipe.slug), 'Einen eindeutigen, gültigen slug verwenden.');
  if (recipe.status === 'draft') return;
  for (const key of ['title', 'description']) check(nonempty(recipe[key]), `${key} fehlt.`);
  check(Array.isArray(recipe.categories) && recipe.categories.length > 0 && recipe.categories.every(x => reserved.has(x)), 'Mindestens eine bekannte Kategorie wählen.');
  check(new Set(recipe.categories).size === recipe.categories.length, 'Kategorien nicht doppelt vergeben.');
  check(/^\d{4}-\d{2}-\d{2}$/.test(recipe.datePublished) && !Number.isNaN(Date.parse(recipe.datePublished)) && new Date(recipe.datePublished).toISOString().slice(0, 10) === recipe.datePublished, 'Gültiges Veröffentlichungsdatum als JJJJ-MM-TT ergänzen.');
  check(recipe.datePublished <= new Date().toISOString().slice(0, 10), 'Das Veröffentlichungsdatum liegt in der Zukunft.');
  check(Number.isInteger(recipe.servings) && recipe.servings > 0, 'Portionen als positive ganze Zahl angeben.');
  for (const key of ['prepMinutes', 'cookMinutes', 'restMinutes']) check(Number.isInteger(recipe[key]) && recipe[key] >= 0, `${key} muss eine nicht negative ganze Zahl sein.`);
  check(recipe.prepMinutes + recipe.cookMinutes + recipe.restMinutes > 0, 'Gesamtzeit muss grösser als null sein.');
  for (const key of ['ingredients', 'steps']) check(Array.isArray(recipe[key]) && recipe[key].length > 0 && recipe[key].every(nonempty), `${key} als nicht leere Textliste angeben.`);
  if (recipe.image) {
    check(/^\/assets\/[a-zA-Z0-9_./-]+\.(?:webp|jpe?g|png)$/i.test(recipe.image) && !recipe.image.includes('..'), 'Bild muss eine lokale Datei unter /assets/ sein.');
    check(existsSync(resolve(root, recipe.image.slice(1))), 'Bilddatei fehlt.');
    check(nonempty(recipe.imageAlt), 'Alternativtext für das Bild fehlt.');
    check(Number.isInteger(recipe.imageWidth) && recipe.imageWidth > 0 && Number.isInteger(recipe.imageHeight) && recipe.imageHeight > 0, 'Bildabmessungen ergänzen.');
  }
  if (recipe.notes !== undefined) check(typeof recipe.notes === 'string', 'notes muss Text sein.');
  if (recipe.nutritionPerServing != null) {
    const n = recipe.nutritionPerServing;
    for (const key of ['kcal', 'protein', 'carbs', 'fat']) check(typeof n[key] === 'number' && Number.isFinite(n[key]) && n[key] >= 0, `Nährwert ${key} pro Portion fehlt oder ist ungültig.`);
    check(nonempty(n.note), 'Berechnungsgrundlage der Nährwerte unter nutritionPerServing.note erklären.');
  }
}
const allRecipes = readdirSync(resolve(root, 'content/recipes')).filter(x => x.endsWith('.json')).sort().map(filename => {
  const recipe = JSON.parse(read(`content/recipes/${filename}`));
  validateRecipe(recipe, filename);
  return recipe;
});
required(new Set(allRecipes.map(r => r.slug)).size === allRecipes.length, 'Rezept-Slugs müssen eindeutig sein.');
const recipes = allRecipes.filter(r => r.status === 'published').sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.title.localeCompare(b.title, 'de-CH'));
const totalMinutes = r => r.prepMinutes + r.cookMinutes + r.restMinutes;
const categoryName = slug => categories.find(c => c.slug === slug).name;
const formatNumber = number => new Intl.NumberFormat('de-CH', { maximumFractionDigits: 1 }).format(number);
function recipeImage(r, hero = false) {
  return r.image ? `<img src="${escape(r.image)}" width="${r.imageWidth}" height="${r.imageHeight}" alt="${escape(r.imageAlt)}" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'}>` : `<div class="recipe-without-photo" aria-hidden="true"><span>W.</span><small>WICKI SPORT / REZEPTE</small></div>`;
}
function recipeCard(r) {
  const search = [r.title, r.description, ...r.ingredients, ...r.categories.map(categoryName)].join(' ');
  return `<article class="recipe-card" data-recipe-card data-search="${escape(search)}"><a href="/rezepte/${r.slug}/" class="recipe-card-link">${recipeImage(r)}<div class="recipe-card-body"><p class="recipe-category">${r.categories.map(categoryName).map(escape).join(' · ')}</p><h3>${escape(r.title)}</h3><p>${escape(r.description)}</p><p class="recipe-meta">${totalMinutes(r)} Min. gesamt <span aria-hidden="true">·</span> ${r.servings} ${r.servings === 1 ? 'Portion' : 'Portionen'}</p><span class="text-link">REZEPT ANSEHEN ↗</span></div></a></article>`;
}
function categoryNavigation(selected) {
  const links = [{ slug: '', name: 'Alle Rezepte' }, ...categories];
  return `<nav class="recipe-categories" aria-label="Rezeptkategorien">${links.map(c => `<a href="/rezepte/${c.slug ? c.slug + '/' : ''}"${c.slug === selected ? ' aria-current="page"' : ''}>${escape(c.name)}</a>`).join('')}</nav>`;
}
function recipeIndex(category = null) {
  const list = category ? recipes.filter(r => r.categories.includes(category.slug)) : recipes;
  const title = category ? category.name : 'Rezepte';
  const intro = category ? category.text : 'Low Carb, ketogene Gerichte und allgemeine Diätrezepte. Eine Sammlung, die Schritt für Schritt wächst.';
  const main = heading(title, category ? escape(category.name.toUpperCase()) : 'DEINE KÜCHE.<br><em>DEINE REZEPTE.</em>', intro, category ? { path: '/rezepte/', name: 'Rezepte' } : null)
    + `<section class="section recipe-collection" aria-labelledby="collection-title">${categoryNavigation(category?.slug || '')}<div class="collection-heading"><h2 id="collection-title">${category ? 'REZEPTE IN DIESER KATEGORIE' : 'DIE REZEPTSAMMLUNG'}</h2><p class="recipe-count" data-recipe-count role="status" aria-live="polite">${list.length} ${list.length === 1 ? 'Rezept' : 'Rezepte'}</p></div>`
    + (list.length ? `<form class="recipe-search" role="search" data-recipe-search hidden><label for="recipe-query">Rezepte oder Zutaten suchen${category ? ' – in dieser Kategorie' : ''}</label><div><input id="recipe-query" name="q" type="search" autocomplete="off" placeholder="Zum Beispiel: Poulet, Eier, Vanille" aria-controls="recipe-grid"><button type="reset" class="button button-outline">Zurücksetzen</button></div></form><div class="recipe-grid" id="recipe-grid">${list.map(recipeCard).join('')}</div><p class="search-empty" data-search-empty hidden>Kein passendes Rezept gefunden. Versuche einen anderen Suchbegriff${category ? ' oder wähle «Alle Rezepte»' : ''}.</p>`
      : `<div class="collection-empty"><span class="empty-mark" aria-hidden="true">W.</span><div><p class="eyebrow">SCHRITT FÜR SCHRITT</p><h3>${category ? 'DAS ERSTE REZEPT FOLGT.' : 'HIER ENTSTEHT ETWAS GUTES.'}</h3><p>${category ? `Die Sammlung für ${escape(category.name)} wächst nach und nach. Sobald ein Rezept veröffentlicht ist, findest du es hier mit Zutaten und Zubereitung.` : 'Diese Sammlung wächst mit neuen Rezepten aus meiner Küche. Du findest hier künftig Zutaten, Zubereitung und praktische Hinweise für deinen Alltag.'}</p><a class="text-link" href="${category ? '/rezepte/' : '/coaching/#kontakt'}">${category ? 'ALLE KATEGORIEN ANSEHEN' : 'FRAGEN ZUR ERNÄHRUNG? SCHREIB MIR'} ↗</a></div></div>`)
    + `</section>${category ? '' : `<section class="section category-overview" aria-labelledby="category-title"><p class="eyebrow">DEIN EINSTIEG</p><h2 id="category-title">DREI KATEGORIEN.<br><em>DEINE AUSWAHL.</em></h2>${categoryCards()}</section>`}`;
  render({ key: 'rezepte', path: `/rezepte/${category ? category.slug + '/' : ''}`, title: `${title} | Wicki Sport`, description: intro }, main);
}
recipeIndex();
categories.forEach(recipeIndex);

for (const r of recipes) {
  const n = r.nutritionPerServing;
  const nutrition = n ? `<aside class="recipe-nutrition" aria-labelledby="nutrition-title"><h2 id="nutrition-title">NÄHRWERTE PRO PORTION</h2><p>Berechnete Näherungswerte für ${r.servings} ${r.servings === 1 ? 'Portion' : 'Portionen'} pro Rezept. Produkte und Portionsgrössen können die Werte verändern.</p><dl>${[['Energie', n.kcal, 'kcal'], ['Protein', n.protein, 'g'], ['Kohlenhydrate', n.carbs, 'g'], ['Fett', n.fat, 'g']].map(([label, value, unit]) => `<div><dt>${label}</dt><dd>${formatNumber(value)} ${unit}</dd></div>`).join('')}</dl><p class="nutrition-note">${escape(n.note)}</p></aside>` : '';
  const main = `<article class="recipe-detail">${heading(r.title, escape(r.title.toUpperCase()), r.description, { path: '/rezepte/', name: 'Rezepte' })}<div class="section recipe-body"><div class="recipe-detail-top"><div class="recipe-cover">${recipeImage(r, true)}</div><div class="recipe-facts"><p class="eyebrow">AUS DER WICKI-SPORT-KÜCHE</p><div class="recipe-categories">${r.categories.map(c => `<a href="/rezepte/${c}/">${categoryName(c)}</a>`).join('')}</div><dl><div><dt>Portionen</dt><dd>${r.servings}</dd></div><div><dt>Vorbereitung</dt><dd>${r.prepMinutes} Min.</dd></div><div><dt>Koch-/Backzeit</dt><dd>${r.cookMinutes} Min.</dd></div>${r.restMinutes ? `<div><dt>Ruhe-/Kühlzeit</dt><dd>${r.restMinutes} Min.</dd></div>` : ''}<div><dt>Gesamtzeit</dt><dd>${totalMinutes(r)} Min.</dd></div></dl><p>Von Matthias Wicki · <time datetime="${r.datePublished}">${new Intl.DateTimeFormat('de-CH', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(r.datePublished))}</time></p><button class="button button-outline" type="button" data-print hidden>REZEPT DRUCKEN</button></div></div><div class="recipe-instructions"><section aria-labelledby="ingredients-title"><p class="eyebrow">DAS BRAUCHST DU</p><h2 id="ingredients-title">ZUTATEN</h2><ul class="ingredient-list">${r.ingredients.map(i => `<li>${escape(i)}</li>`).join('')}</ul></section><section aria-labelledby="steps-title"><p class="eyebrow">SCHRITT FÜR SCHRITT</p><h2 id="steps-title">ZUBEREITUNG</h2><ol class="recipe-steps">${r.steps.map(s => `<li>${escape(s)}</li>`).join('')}</ol></section></div>${r.notes ? `<aside class="recipe-notes"><h2>GUT ZU WISSEN</h2><p>${escape(r.notes)}</p></aside>` : ''}${nutrition}<a class="text-link" href="/rezepte/">← ZURÜCK ZU DEN REZEPTEN</a></div></article>`;
  // Use only supplied recipe facts. No ratings, medical claims or invented nutrition.
  const schema = {
    '@context': 'https://schema.org', '@type': 'Recipe', name: r.title, description: r.description,
    author: { '@type': 'Person', name: 'Matthias Wicki' }, datePublished: r.datePublished,
    url: `${site}/rezepte/${r.slug}/`, recipeYield: `${r.servings} Portion${r.servings === 1 ? '' : 'en'}`,
    prepTime: `PT${r.prepMinutes}M`, cookTime: `PT${r.cookMinutes}M`, totalTime: `PT${totalMinutes(r)}M`,
    recipeIngredient: r.ingredients, recipeInstructions: r.steps.map(text => ({ '@type': 'HowToStep', text })),
    keywords: r.categories.map(categoryName).join(', ')
  };
  if (r.image) schema.image = site + r.image;
  if (n) schema.nutrition = { '@type': 'NutritionInformation', servingSize: '1 Portion', calories: `${n.kcal} kcal`, proteinContent: `${n.protein} g`, carbohydrateContent: `${n.carbs} g`, fatContent: `${n.fat} g` };
  render({ key: 'rezepte', path: `/rezepte/${r.slug}/`, title: `${r.title} | Wicki Sport`, description: r.description, image: r.image, imageAlt: r.imageAlt, recipe: true }, main, schema);
}

output.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
const generatedManifest = resolve(root, 'scripts/generated-files.json');
const previous = existsSync(generatedManifest) ? JSON.parse(readFileSync(generatedManifest, 'utf8')) : [];
for (const path of previous) {
  // Only remove tracked generator output, never source files or arbitrary paths.
  required(typeof path === 'string' && !path.includes('..') && !path.startsWith('/') && (path === 'index.html' || path === 'sitemap.xml' || /^(?:philosophie|ueber-mich|coaching|wissen|rezepte|impressum|datenschutz)\/(?:[a-z0-9-]+\/)?index\.html$/.test(path)), 'Ungültiger Pfad im Ausgabeverzeichnis.');
  if (!output.has(path) && existsSync(resolve(root, path))) unlinkSync(resolve(root, path));
}
for (const [path, text] of output) {
  const target = resolve(root, path);
  required(!relative(root, target).startsWith('..' + sep), 'Ausgabe ausserhalb des Projekts.');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text.endsWith('\n') ? text : text + '\n');
}
writeFileSync(generatedManifest, JSON.stringify([...output.keys()].sort(), null, 2) + '\n');
console.log(`${urls.length} Seiten erstellt; ${recipes.length} veröffentlichte Rezepte, ${allRecipes.length - recipes.length} Entwürfe.`);
