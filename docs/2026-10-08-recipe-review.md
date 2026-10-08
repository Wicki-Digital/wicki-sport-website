# Neue Rezepte und Filmabend-Beitrag – Prüfung vom 8. Oktober 2026

## Umfang

- `/rezepte/mediterrane-rindhack-bowl/`: neues Rezept in der bestehenden Kategorie `low-carb` (Anzeigename weiterhin «Low Carb»).
- `/rezepte/low-carb-erdbeer-vanille-cheesecake/`: neues Rezept in `snacks`.
- `/rezepte/low-carb-snacks-filmabend/`: ein gemeinsamer Beitrag in `snacks`, mit sechs Snack-Ideen und dem zusätzlichen vollständigen Snackteller. Keine separaten Snack-Detailseiten.
- `snacks` war im Ausgangsprojekt noch nicht vorhanden. Genau diese ausdrücklich gewünschte Kategorie wurde in die bestehende Verwaltung aufgenommen. Keine zweite Rezeptverwaltung.
- Bestehende CSS-Dateien, Schriften, Vorlagen, Navigation, Startseite, Rezeptquellen und bisherige Rezeptdetailseiten bleiben unverändert. Die Rezeptübersichten erhalten nur die notwendigen neuen Karten und Kategorieverweise.
- Neue Rezepte erhalten die vorhandenen `Recipe`-Daten. Der Sammelbeitrag erhält `Article`-Daten ohne erfundene Gesamtportion oder Gesamtnährwerte.
- Änderungen sind zur Freigabe im PR vorgesehen; keine direkte Veröffentlichung oder Änderung einer Vorschau-Deployment-Version.

## Bildzuordnung

Alle Bilder stammen aus dem Auftrag. WebP-Varianten wurden ohne Motivänderung und ohne künstliche Neuerzeugung erzeugt. Je Motiv gibt es eine grosse Variante und eine kleinere Variante mit maximal 640 Pixeln Kantenlänge. Die tatsächliche Breite steht im `srcset`, auch bei Hochformaten mit 631 Pixeln Breite. Texttragende Bilder werden vollständig mit `object-fit: contain` dargestellt.

| Upload | Verwendung | Asset-Basisname |
| --- | --- | --- |
| `169480AC-1C63-403C-896E-371EA5AD656D(1).jpeg` | Rindhack-Bowl, Karte und Detail | `mediterrane-rindhack-bowl` |
| `922E8C29-9058-4307-B6E5-7217FEAA0C99.jpeg` | Cheesecake, Karte und Detail | `erdbeer-vanille-cheesecake` |
| `IMG_0024(1).jpeg` | Parmesan-Chips | `parmesan-chips` |
| `IMG_0025(1).jpeg` | Schoko-Erdbeeren | `schoko-erdbeeren` |
| `IMG_0026(1).jpeg` | Paprika-Mandeln | `paprika-mandeln` |
| `IMG_0027(1).jpeg` | Gemüse-Sticks mit Kräuterdip | `gemuese-sticks-kraeuterdip` |
| `IMG_0028(1).jpeg` | Protein-Bällchen, als Serviervorschlag gekennzeichnet | `vanille-protein-baellchen` |
| `IMG_0029(1).jpeg` | Popcorn | `selbstgemachtes-popcorn` |
| `444D5790-2C3D-4E9A-A935-4CF0678E9DF9.jpeg` | Filmabend-Karte, Beitragsbild und zusätzlicher Snackteller | `filmabend-snackteller` |

Die Protein-Bällchen im Foto haben einen Schokoladenüberzug und gehackte Nüsse. Beides gehört nicht zum angegebenen Grundrezept. Direkt am Foto steht deshalb ein Hinweis; diese Dekoration ist nicht in die Nährwerte eingerechnet. Auch die Gemüse-Sticks sind als Serviervorschlag mit zusätzlichem Gemüse gekennzeichnet. Keine bisherigen Bilddateien wurden ersetzt.

## Nährwert-Plausibilisierung

Die Werte sind gerundete Beispielrechnungen, keine Laboranalyse und keine verifizierten Angaben für die tatsächlich verwendeten Produkte. Auf den Seiten wird diese Einschränkung sichtbar erklärt. Kohlenhydrate sind hier die auf Schweizer/europäischen Etiketten üblichen verwertbaren Kohlenhydrate; Ballaststoffe werden nicht nochmals davon abgezogen.

Für alle Berechnungen wurden die Zutatenmengen mit den Werten pro 100 g multipliziert. Öl wurde mit 9 kcal/g angesetzt. Nicht bezifferte Kräuter und Gewürze sowie optionale Zutaten wurden nicht separat eingerechnet. Die Bowl wurde inklusive kleiner Würzzugaben auf ca. 835 kcal gerundet. Mandelmilch wird für diese Näherung mit 1 g/ml behandelt.

| Gericht / gesamte angegebene Menge | kcal | Protein | Fett | Kohlenhydrate |
| --- | ---: | ---: | ---: | ---: |
| Rindhack-Bowl | ca. 835 | ca. 64 g | ca. 58 g | ca. 12 g |
| Cheesecake, 1 Glas | ca. 355 | ca. 34 g | ca. 18 g | ca. 11 g |
| Parmesan-Chips | ca. 160 | ca. 13 g | ca. 12 g | unter 1 g |
| Schoko-Erdbeeren | ca. 120 | ca. 3 g | ca. 7 g | ca. 9 g |
| Paprika-Mandeln | ca. 205 | ca. 7 g | ca. 18 g | ca. 2 g |
| Gemüse-Sticks mit Dip | ca. 150 | ca. 4 g | ca. 10 g | ca. 8 g |
| Protein-Bällchen, gesamte Masse | ca. 220 | ca. 26 g | ca. 11 g | ca. 3 g |
| Popcorn | ca. 115 | ca. 2 g | ca. 6 g | ca. 12 g |
| Kombinierter Snackteller | ca. 360 | ca. 16 g | ca. 27 g | ca. 9 g |

Wichtige Abweichungen vom Auftrag: Beim Cheesecake ergeben die angegebenen Zutaten mit der unten genannten Joghurtbasis eher 355 als 320 kcal. Beim Dip ist besonders der Proteingehalt vom Joghurt abhängig; das 10-%-Beispielprodukt enthält nur 3 g Protein pro 100 g. Die Mandel-Portion berücksichtigt zusätzlich ca. 2 g Öl. Beim Snackteller wurden die kleineren Mengen erneut berechnet, nicht die Nährwerte der drei grösseren Einzel-Snacks addiert. Die Bilder wurden nicht verändert; allfällige eingebettete Zahlen werden durch die ausdrücklich als Näherung gekennzeichneten Textangaben erläutert.

### Nachvollziehbare Produktwerte und Annahmen

Reihenfolge der Zahlen: kcal / Protein / Fett / Kohlenhydrate pro 100 g.

- [Fage Total 5 % bei Coop](https://www.coop.ch/de/lebensmittel/milchprodukte-eier/joghurt/joghurt-nature/fage-total-griechischer-joghurt-5-fett/p/6973898): 93 / 9 / 5 / 3. Für Bowl und Cheesecake.
- [Naturaplan Joghurt à la grecque bei Coop](https://www.coop.ch/de/lebensmittel/milchprodukte-eier/joghurt/joghurt-nature/naturaplan-bio-joghurt-a-la-grecque-natur/p/7044678): 116 / 3 / 10 / 3,4. Für den Dip.
- [Mandeln bei Coop](https://www.coop.ch/de/lebensmittel/vorraete/backzutaten/klassische-backzutaten/nuesse/mandeln-ganz/p/6439331): 624 / 22 / 54 / 5,4.
- [Parmigiano Reggiano bei Coop](https://www.coop.ch/de/lebensmittel/milchprodukte-eier/abgepackter-kaese/hartkaese-halbhartkaese/sbrinz-parmesan-gruyere/slow-food-presidio-parmigiano-reggiano-da-latte-di-vacca-bianca-keil-ca/p/6524128): 403 / 32 / 30 / 0.
- [Erdbeeren bei Coop](https://www.coop.ch/de/lebensmittel/fruechte-gemuese/fruechte/beeren/erdbeeren/p/7107925): 32 / 0,82 / 0,4 / 5,51.
- [Lindt Excellence 85 %](https://www.lindt.ch/de/excellence-dunkel-85-cacao-tafelschokolade-100g): 584 / 12,5 / 46 / 22. Nur als Näherung für die nicht näher bezeichnete 87-%-Schokolade, nicht als identisches Produkt behandelt.
- [nu3 Mandelmus bei Coop](https://www.coop.ch/de/lebensmittel/vorraete/brotaufstrich/andere-suesse-brotaufstriche/nu3-mandelmus/p/5905704): 615 / 23 / 51 / 10.
- [Popcornmais bei Coop](https://www.coop.ch/de/lebensmittel/suesses-snacks/chips-snacks/chips-popcorn/popcorn-mais/p/6231492): 337 / 9,3 / 4,2 / 59.
- [Zucchini bei Coop](https://www.coop.ch/de/lebensmittel/fruechte-gemuese/weiteres-gemuese/zucchetti-kuerbis-aubergine/zucchetti-ca/p/3844219): 19 / 1,8 / 0,2 / 2.
- [Avocado bei Coop](https://www.coop.ch/de/lebensmittel/fruechte-gemuese/fruechte/exotische-fruechte/avocados/naturaplan-bio-avocado-1-stueck/p/3465933): 144 / 1,8 / 14,2 / 0,8.
- [Feta bei Coop](https://www.coop.ch/de/lebensmittel/milchprodukte-eier/abgepackter-kaese/hirtenkaese-feta-ziger/feta-halloumi/prix-garantie-feta/p/5946400): 266 / 17 / 22 / 0.
- [Cherrytomaten bei Coop](https://www.coop.ch/de/lebensmittel/fruechte-gemuese/salatgemuese/tomaten/cherry-rispentomaten/p/3090581): 21 / 0,8 / 0,3 / 3,2.
- Rindhack: Rechenannahme 10 % Fett, 20 g Protein, 0 g Kohlenhydrate und 170 kcal pro 100 g. Kein konkretes Produktetikett lag vor. 5-%-Hack ergibt entsprechend weniger Fett und Energie.
- Whey: Rechenannahme für Vanille-Isolat 370 / 84 / 2 / 4. Die [ZNT-Produktseite](https://www.znt-nutrition.shop/collections/nutrition/products/izolate-pro-znt-nutrition) nennt bis zu 25,1 g Protein je Portion; eine vollständige sortenspezifische Tabelle konnte nicht verifiziert werden. Die Annahme ist keine bestätigte Nährwertdeklaration dieses Produkts.
- Ungesüsste Mandelmilch: Rechenannahme 13 / 0,4 / 1,1 / 0. Cheesecake mit 15 ml, Bällchen mit 10 ml berechnet.
- Gemüse-Dip: je 75 g Gurke und Peperoni; angenommene Werte 12 / 0,6 / 0,2 / 1,8 bzw. 30 / 1 / 0,3 / 4,7.

Vor einer gewünschten produktexakten Angabe sind insbesondere die Etiketten von Whey, 87-%-Schokolade, Joghurt und Rindhack abzugleichen. Es gibt keine Erfolgs-, Heilungs- oder Gewichtsversprechen. Popcorn wird ausdrücklich nicht als ketogener Snack bezeichnet.

## Redaktionelle Präzisierungen

- Für die bereits in der Bowl-Zubereitung genannten Kräuter wurde 1 EL als Zutat ergänzt.
- Cheesecake: 10 Minuten Vorbereitung plus 15–30 Minuten Kühlung; Karte zeigt 25–40 Minuten. Maschinenlesbare Dauer verwendet die Mindestkühlzeit.
- Snackteller: 20 Minuten sind aktive Vorbereitung; Backen und Abkühlen kommen hinzu. Bei zwei Ofentemperaturen und Kühlung wäre «20 Minuten Gesamtzeit» missverständlich.

## Prüfungen und Freigabe

- Generator, automatische Tests und interner Link-/SEO-Check ausführen: `node scripts/build.mjs`, `node --test tests/*.test.mjs`, `python3 scripts/check-links.py`.
- Kategorien, Karten, Anker, Suchdaten, Bildvarianten und passende Schema-Typen sind durch Regressionstests abgedeckt.
- Ergebnis: 8 automatische Tests erfolgreich; 17 Seiten und 526 interne Verweise im Link-/SEO-Check ohne Fehler. Alle 20 neuen Bildverwendungen wurden tatsächlich dekodiert und ihre Abmessungen überprüft (18 neue Dateien, Snackteller zweimal verwendet).
- Responsive Darstellung verwendet unverändert die vorhandenen Desktop-/Mobilregeln, einschliesslich des zuvor korrigierten 4:3-Kartencontainers. Bildabmessungen und responsive Varianten werden zusätzlich geprüft.
- Eine echte visuelle Desktop-/iPhone-Browserkontrolle bleibt offen: Im Ausführungssystem fehlt ein Browser, und der Download des Testbrowsers schlug fehl. Eine reine Codeprüfung ist kein Ersatz für diesen Sichttest.
- Vor dem Merge bitte die Bildabweichung bei den Protein-Bällchen und die geänderten Nährwertschätzungen prüfen. Kein automatischer Merge und keine direkte Veröffentlichung.
