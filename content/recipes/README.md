# Rezepte ergänzen

Hier liegt pro Rezept eine JSON-Datei. Eine Vorlage und die Schritt-für-Schritt-Anleitung findest du in `templates/recipe.example.json` und in der README im Hauptordner.

Nur Einträge mit `status: "published"` erzeugen öffentliche Rezeptseiten. Entwürfe gehören in einem öffentlichen Repository ebenfalls nicht mit vertraulichen Informationen in diese Dateien.

Die bestehenden Kategorien sind `low-carb`, `ketogen`, `allgemeine-diaetrezepte` und `snacks`. Kategorie-URLs und Filter werden weiterhin zentral in `scripts/build.mjs` erzeugt.

Redaktionelle Sammlungen verwenden dieselbe Verwaltung mit `type: "article"`. Die Datei `low-carb-snacks-filmabend.json` zeigt das Format: eine Karte, eine Detailseite und `sections` mit eindeutigen Ankern, Zutaten, Schritten, Bildern und Nährwerttext. Die Abschnitte erzeugen keine eigenen Seiten. Solche Sammlungen erhalten `Article`- statt irreführender gemeinsamer `Recipe`-Daten.

Neue Bilder können `imageSmall` und die tatsächliche Pixelbreite `imageSmallWidth` ergänzen. Der Generator erzeugt daraus ein responsives `srcset`. `imageFit: "contain"` erhält das vollständige Motiv, insbesondere bei Bildern mit eingebettetem Text. Bestehende Bilder ohne diese Felder bleiben unverändert.

Die Herkunft und Zuordnung der Ergänzungen vom 8. Oktober 2026 sowie die Nährwertannahmen stehen in `docs/2026-10-08-recipe-review.md`.
