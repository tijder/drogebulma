---
title: "Het thema gebruiken"
date: 2026-06-30
tags: ["project", "handleiding"]
description: "Een beknopte handleiding voor het opzetten en configureren van het DrogeBulma-thema."
games: ["shadow realm", "pixel quest"]
---

DrogeBulma is een **Hugo-thema** op basis van [Bulma](https://bulma.io/) en
[Iconoir](https://iconoir.com/) — geen losse website. Je gebruikt het door het als
thema te koppelen aan je eigen Hugo-site. Deze pagina vat samen hoe je dat doet.

## Installeren

Voeg het thema toe aan je site en zet het in `themes/drogebulma`. De eenvoudigste
manier is een Hugo-module of een git-submodule:

```bash
git submodule add https://github.com/tijder/drogebulma.git themes/drogebulma
```

Stel het thema daarna in je siteconfiguratie in:

```toml
theme = "drogebulma"
```

Bulma en Iconoir zijn **meegeleverd** als bestanden in `assets/css/` — er is geen
npm-afhankelijkheid. Wil je Bulma bijwerken, vervang dan `assets/css/bulma.css` door
een nieuwere release.

## Lokaal draaien

- `hugo server -D` — ontwikkelserver met drafts. Assets zijn dan onverkleind en
  zonder fingerprint, met JS-sourcemaps.
- `hugo` — productiebuild: CSS wordt verkleind en gefingerprint met SRI-hashes, JS
  wordt gebouwd via `js.Build`.

Wil je het thema testen zonder eigen site? Draai dan de meegeleverde demo:

```bash
cd exampleSite && hugo server
```

## Configuratie

Het thema leest een aantal optionele parameters uit de siteconfiguratie:

| Param | Doel |
|-------|------|
| `params.description` | Standaard meta-/OG-omschrijving |
| `params.image` | Standaard deelafbeelding |
| `params.twitter` | `twitter:site`-handle |
| `params.themeColor` | `<meta name="theme-color">` |
| `params.author.{name,handle,avatar}` | Auteursidentiteit voor shorts |
| `copyright` | Footertekst |

Vertaalbare UI-teksten staan in `i18n/nl.toml`, `i18n/en.toml` en `i18n/fr.toml`.
Voeg nieuwe tekst altijd toe als i18n-sleutel in **elke** taal, nooit inline.

## Inhoud indelen

De homepage rendert drie contentssecties, elk met een eigen weergave:

- **`shorts`** — een kaartraster (sociale-postjes met optionele foto).
- **`posts`** — volle-breedte rijen ("Nieuws").
- **`projects`** — een kaartraster ("Projecten") — zoals deze pagina.

Voeg content toe met front matter zoals hierboven: een `title`, `date`, `tags` en een
optionele `description`. Leg je een afbeelding in de bundel (bijv. `cover.jpg`), dan
verschijnt die automatisch als kaartafbeelding.

## Extra's, live voorbeeld

Het thema biedt diverse statische, no-JS bouwstenen. Hieronder staat van elk een
**werkend** voorbeeld op deze pagina zelf.

### Afbeeldingen

Afbeeldingen in de tekst gebruik je met gewone Markdown. Ze worden automatisch in een
**lightbox** gewikkeld — klik om te vergroten, klik nogmaals (of op de achtergrond) om
te sluiten. Pure CSS, geen JS:

![Een voorbeeldafbeelding](voorbeeld.jpg "Klik om te vergroten")

Alle opties:

- **Alt-tekst** — de tekst tussen de blokhaken: `![beschrijving](voorbeeld.jpg)`.
  Belangrijk voor toegankelijkheid en SEO.
- **Titel** — de optionele tekst tussen aanhalingstekens:
  `![…](voorbeeld.jpg "titel")`; dient als alt-tekst wanneer de blokhaken leeg zijn.
- **Bundel-resource of externe URL** — wijst `src` naar een bestand in de paginabundel,
  dan leest het thema de intrinsieke breedte/hoogte uit (voorkomt layout shift); anders
  wordt de URL ongewijzigd gebruikt.

Net als video's koppel je een afbeelding **aan een game**: geef de afbeelding in de
front matter een `params.game` (de matchKey). De screenshot verschijnt dan — samen met
getagde video's — in het **"Galerij"-blok** op de game-pagina, met een link terug naar
dit artikel. Een `title` op de resource wordt het onderschrift in die galerij:

```toml
[[resources]]
  src = "screenshot.jpg"
  title = "Eindbaas verslagen"   # onderschrift in de galerij
  [resources.params]
    game = "shadow realm"
```

### Routekaarten

`{{</* route "track.gpx" */>}}` tekent een GPX-track uit de paginabundel als inline-SVG
met OpenStreetMap-tegels, met een regel voor afstand, hoogtemeters en duur:

{{< route "track.gpx" >}}

### Video's

`{{</* video */>}}` plaatst een browser-afspeelbare video (meestal een `.mp4`) uit de
paginabundel als native HTML5-speler — geen JS, geen externe player:

{{< video src="voorbeeld.mp4" caption="Een MP4 uit de paginabundel" >}}

Alle opties (allemaal **named**: Hugo staat geen mix van positionele en named
parameters toe):

- `src` — bestandsnaam van de video-resource in de paginabundel, of een externe URL.
  **Verplicht.**
- `poster` — stilstaand beeld dat vóór het afspelen wordt getoond (resource of URL).
  Valt terug op de `params.poster` van de resource.
- `caption` — onderschrift onder de speler (`<figcaption>`). Valt terug op de `title`
  van de resource — dezelfde titel die de galerij gebruikt — zodat je hem maar één keer
  in de front matter hoeft te zetten.
- `loop` — speelt in een lus af (standaard `false`).
- `autoplay` — speelt automatisch af; impliceert `muted` (browsers blokkeren autoplay
  mét geluid).
- `muted` — start gedempt (standaard `false`).

Een volledig voorbeeld:

```text
{{</* video src="intro.mp4" poster="cover.jpg" caption="Speeltrailer"
          loop=true autoplay=true muted=true */>}}
```

Net als afbeeldingen zijn video's **aan een game te koppelen**: geef een
video-resource een `params.game` (de matchKey) in de front matter, en de clip
verschijnt — samen met getagde screenshots — automatisch in het **"Galerij"-blok** op
de bijbehorende game-pagina, met een link terug naar dit artikel. Optioneel wijst
`params.poster` naar een stilstaand beeld in dezelfde bundel:

```toml
[[resources]]
  src = "boss-kill.mp4"
  [resources.params]
    game = "shadow realm"
    poster = "boss-kill.jpg"
```

### Games koppelen

Verwijs naar een game uit de trofeeëndata met `{{</* game "shadow realm" */>}}`:

{{< game "shadow realm" >}}

Meerdere games belanden in een raster — `{{</* game "shadow realm" "pixel quest" */>}}`:

{{< game "shadow realm" "pixel quest" >}}

### Een trofee tonen

`{{</* trophy "shadow realm" "Master of Shadows" */>}}` toont één trofeekaart, gelinkt
aan zijn anker op de game-pagina:

{{< trophy "shadow realm" "Master of Shadows" >}}

### Bidirectioneel koppelen

Deze pagina heeft `games = ["shadow realm", "pixel quest"]` in de front matter. Daardoor
verschijnt onderaan automatisch een blok **"Gerelateerde games"**, en op elke
game-pagina staat deze handleiding vermeld onder **"Genoemd in"** — zonder dat je beide
kanten handmatig hoeft te onderhouden.

### CV

Tot slot rendert het thema een volledig **data-gedreven, statische cv-pagina** op
[`/cv`](/cv/). Het thema levert alleen de weergave; jouw site levert de gegevens en wat
front matter. Een cv bestaat uit deze blokken, elk weggelaten als de bron ontbreekt:

- een **kop** met foto, naam, functietitel, contactgegevens en profiel­links;
- een **profiel/"over mij"**-blok (de tekst van de contentpagina zelf);
- gecategoriseerde **vaardigheden** met niveau, gesproken **talen**, **werkervaring**,
  **opleiding & cursussen**, en **diploma's/certificaten**.

Je vult het cv via twee plekken:

1. **Databestanden** onder `data/cv/` — in deze demo:
   `skills.toml`, `languages.toml`, `experience.toml`, `education.toml` en
   `certificates.toml`. Hugo-data is niet per taal, dus vertaalbare velden zijn
   **taalmaps** (`{nl=…, en=…, fr=…}`) die per taal worden opgelost; niet-vertaalbare
   velden (vaardigheidsnamen, bedrijf, datums) blijven gewone strings.
2. **De contentpagina** `content/cv.md` (+ `cv.en.md`, `cv.fr.md`) — met
   `type = "cv"`, de kop-`[params]` (`name`/`jobTitle`/`location`/`email`/`photo`/links)
   en een body die het profielblok wordt. Eén bestand per taal vertaalt kop en profiel.

De pagina krijgt in de zijbalk een **ankermenu** naar de aanwezige blokken, en de knop
**"Downloaden als PDF"** roept `window.print()` aan — een `@media print`-blok in
`main.css` verbergt dan de navigatie, voettekst en zijbalk, zodat alleen het cv wordt
afgedrukt. Bekijk hem op [`/cv`](/cv/).

## Meer weten

De volledige documentatie staat in `CLAUDE.md` in de hoofdmap van het thema. Daar lees
je per onderdeel hoe de templates, partials en shortcodes samenwerken.
