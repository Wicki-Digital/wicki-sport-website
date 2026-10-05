# Wicki Sport

Mehrseitige Website von Matthias Wicki. Live-Adresse: https://wickisport.ch  
Domain und E-Mail: Infomaniak. Website: GitHub Pages.

## Seiten

| Seite | Adresse |
| --- | --- |
| Startseite | `/` |
| Philosophie | `/philosophie/` |
| Über mich | `/ueber-mich/` |
| Coaching und Kontakt | `/coaching/` und `/coaching/#kontakt` |
| Wissen | `/wissen/` |
| Alle Rezepte | `/rezepte/` |
| Low Carb | `/rezepte/low-carb/` |
| Ketogen | `/rezepte/ketogen/` |
| Allgemeine Diätrezepte | `/rezepte/allgemeine-diaetrezepte/` |
| Impressum / Datenschutz | `/impressum/` und `/datenschutz/` |

Die Rezeptkategorien sind vorbereitet. Zu Beginn sind noch keine Rezepte veröffentlicht. Die Sammlung zeigt bewusst einen verständlichen Leerzustand.

## Änderungen mit Codex

- Seiteninhalte in `content/pages/` bearbeiten.
- Gemeinsame Navigation, Footer und Metadaten-Vorlage: `templates/layout.html`.
- Seitentitel, Beschreibungen und Rezeptdarstellung: `scripts/build.mjs`.
- Bestehendes Erscheinungsbild: `style.css`; Ergänzungen: `pages.css`.
- Interaktionen: `app.js`.
- Nach Änderungen immer `node scripts/build.mjs` ausführen und die erzeugten HTML-Dateien, Sitemap und `scripts/generated-files.json` mit übernehmen.
- Die erzeugten `index.html`-Dateien nicht direkt bearbeiten: Der nächste Build würde solche Änderungen überschreiben.

Keine npm-Pakete oder neue Hostingdienste sind erforderlich. Die fertigen HTML-Dateien werden im Repository gespeichert und vom bestehenden GitHub-Pages-Deployment ausgeliefert. `CNAME` und die Domain bleiben erhalten. Der Generator wird vor dem Commit lokal oder in Codex ausgeführt, nicht automatisch durch GitHub Pages.

## Ein Rezept ergänzen – Schritt für Schritt

1. `templates/recipe.example.json` nach `content/recipes/rezeptname.json` kopieren.
2. `slug` setzen, zum Beispiel `vanillecreme`. Der Slug bildet die Adresse `/rezepte/vanillecreme/`. Nur Kleinbuchstaben, Zahlen und Bindestriche; Kategorienamen sind reserviert.
3. Titel, Beschreibung, Portionen, Vorbereitungs-, Koch-/Back- und Ruhe-/Kühlzeit ausfüllen. Zeiten in ganzen Minuten. Die Gesamtzeit enthält alle drei Zeitangaben.
4. Zutaten mit Mengen und die Zubereitung als einzelne Schritte erfassen.
5. Eine oder mehrere Kategorien wählen: `low-carb`, `ketogen`, `allgemeine-diaetrezepte`. Die Einordnung anhand der tatsächlichen Zutaten und Portionen prüfen. Der Generator bewertet die Ernährung nicht selbst.
6. Optional ein eigenes Foto unter `assets/recipes/` speichern. Im Rezept den Pfad ab `/assets/`, einen sachlichen Alternativtext und die tatsächliche Breite/Höhe eintragen. Ohne Foto erscheint eine neutrale Markenfläche.
7. Optionale Hinweise unter `notes` ergänzen. Nährwerte nur mit nachvollziehbarer Berechnung eintragen.
8. Bis zur Freigabe `status: "draft"` belassen. Für die Veröffentlichung `status: "published"` und das tatsächliche `datePublished` im Format `JJJJ-MM-TT` setzen.
9. `node scripts/build.mjs` ausführen. Rezeptseite, Übersichten, Kategorien und Sitemap werden gemeinsam aktualisiert.
10. Prüfen, als Pull Request bereitstellen und nach der Kontrolle zusammenführen.

**Wichtig:** Entwürfe erscheinen nicht als Website-Rezept. Dateien in diesem öffentlichen GitHub-Repository sind trotzdem öffentlich lesbar und eignen sich nicht für vertrauliche Inhalte.

Ein möglicher Auftrag für die nächste Ergänzung:

> Ergänze dieses Rezept in Wicki Sport. Nutze die bestehende JSON-Vorlage, übernimm nur bestätigte Zutaten, Mengen und Angaben, ordne die passenden Kategorien zu und erzeuge die Website neu. Bereite die Änderung als Pull Request vor.

### Optionale Nährwerte

Ohne Berechnung bleibt `nutritionPerServing` auf `null`. Andernfalls ist folgendes Format vorgesehen; die Zahlen hier zeigen nur das Datenformat und sind keine Rezeptwerte:

```json
{
  "kcal": 250,
  "protein": 20,
  "carbs": 8,
  "fat": 15,
  "note": "Berechnungsgrundlage und verwendete Produkte hier konkret angeben."
}
```

Alle Werte beziehen sich auf **eine Portion**, Kohlenhydrate nach den verwendeten Produktangaben. Ballaststoffe nicht nochmals pauschal abziehen. Die Website kennzeichnet Nährwerte als Näherungswerte.

### Fotos und Suchmaschinen

Jedes veröffentlichte Rezept erhält eine eigene Adresse und Metadaten. Rezeptdaten werden als `Recipe`-JSON-LD ausgegeben. Ein tatsächliches Foto des fertigen Gerichts ist laut [Google-Dokumentation](https://developers.google.com/search/docs/appearance/structured-data/recipe) für die dort beschriebenen Rezept-Sucherweiterungen erforderlich. Ohne Foto bleibt das Rezept nutzbar; es wird dafür kein fremdes Gericht als Ersatz ausgegeben. Eine besondere Darstellung in Suchergebnissen ist nicht garantiert.

## Prüfen

```sh
node scripts/build.mjs
node --check app.js
node --test tests/*.test.mjs
python3 scripts/check-links.py
```

Der Linkcheck prüft die erzeugten Seiten, Anker, Bilder, Canonical-URLs und Sitemap anhand der lokal vorhandenen Dateien. Er benötigt einen vollständigen Checkout mit `assets/`.

Vor dem Zusammenführen zusätzlich im Browser kontrollieren: Desktop und Mobilgerät, Navigation, Kontakt, Kategorieauswahl, ein neues Rezept, Suche und Druckansicht. Diese visuelle Kontrolle wird durch die automatischen Prüfungen nicht ersetzt.

## Bestehende Inhalte

- Die Texte, Fotos, Fonts und Anbieterangaben stammen aus dem bisherigen Onepager.
- Wissen verweist weiterhin auf bestehende Instagram-Themen; es werden keine Fachartikel vorgetäuscht.
- Impressum und Datenschutz sind eigene, ohne JavaScript erreichbare Seiten. Ihr Inhalt wurde aus den bestehenden Dialogen übernommen.
- Alte Abschnittslinks wie `/#matthias` werden mit JavaScript auf die neue Seite weitergeleitet. `/#kontakt` bleibt auf der Startseite vorhanden.
