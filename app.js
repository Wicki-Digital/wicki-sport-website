'use strict';

document.documentElement.classList.add('js');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#main-nav');
const header = document.querySelector('.site-header');
if (menu && nav) {
  menu.hidden = false;
  const setMenu = open => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (header && !header.contains(event.target)) setMenu(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 1100) setMenu(false); });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const copyButton = document.querySelector('#copy-code');
if (copyButton) copyButton.addEventListener('click', async () => {
  const status = document.querySelector('#code-status');
  if (!status) return;
  try {
    await navigator.clipboard.writeText('#wicki15');
    status.textContent = 'Kopiert.';
  } catch {
    status.textContent = 'Bitte den Code #wicki15 manuell kopieren.';
  }
});

// Preserve incoming links to sections of the former one-page website.
const oldSections = {
  '#philosophie': '/philosophie/', '#matthias': '/ueber-mich/',
  '#coaching': '/coaching/', '#wissen': '/wissen/',
  '#training': '/coaching/#training', '#ernaehrung': '/coaching/#ernaehrung'
};
function followOldSection() {
  if (document.body.dataset.page === 'start' && oldSections[window.location.hash]) {
    window.location.replace(oldSections[window.location.hash]);
  }
}
followOldSection();
window.addEventListener('hashchange', followOldSection);

function normaliseRecipeSearch(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('de-CH').trim();
}
const searchForm = document.querySelector('[data-recipe-search]');
if (searchForm) {
  const input = searchForm.querySelector('input');
  const cards = [...document.querySelectorAll('[data-recipe-card]')];
  const empty = document.querySelector('[data-search-empty]');
  const count = document.querySelector('[data-recipe-count]');
  if (input && empty && count) {
    searchForm.hidden = false;
    const texts = cards.map(card => normaliseRecipeSearch(card.dataset.search || ''));
    const applySearch = () => {
      const words = normaliseRecipeSearch(input.value).split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach((card, index) => {
        const matches = words.every(word => texts[index].includes(word));
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = String(visible) + (visible === 1 ? ' Rezept' : ' Rezepte');
      empty.hidden = visible > 0;
    };
    input.addEventListener('input', applySearch);
    searchForm.addEventListener('submit', event => { event.preventDefault(); applySearch(); });
    searchForm.addEventListener('reset', event => {
      event.preventDefault();
      input.value = '';
      applySearch();
      input.focus();
    });
    applySearch();
  }
}
document.querySelectorAll('[data-print]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => window.print());
});
