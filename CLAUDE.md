# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**DrogeBulma** is a Hugo theme (not a standalone site) built on [Bulma](https://bulma.io/) CSS and [Iconoir](https://iconoir.com/) icons. The UI is in Dutch. It is consumed by a parent Hugo site that mounts this directory as its theme; commands below assume you run Hugo from that parent site, with this folder at `themes/drogebulma`.

## Commands

- `hugo server -D` — local dev server with drafts. Sets `hugo.IsDevelopment`, which switches the asset pipeline to unminified, non-fingerprinted output with JS sourcemaps (see `layouts/_partials/head/css.html` and `head/js.html`).
- `hugo` — production build: CSS is minified + fingerprinted with SRI integrity hashes; JS is built/minified via `js.Build`.
- Bulma and Iconoir are **vendored** as committed files in `assets/css/` (`bulma.css`, `iconoir.css`); there is no npm dependency. To upgrade Bulma, replace `assets/css/bulma.css` with a newer release.

- `cd exampleSite && hugo server` — runs the bundled demo site (`exampleSite/`) against the theme. This works because `exampleSite/themes/drogebulma` is a committed symlink to the repo root (`../..`), so Hugo resolves `theme = "drogebulma"` to this repo. (Equivalent without the symlink: `hugo server --themesDir ../..`.) Use this to preview/verify theme changes without a separate parent site.

There are no tests, linters, or build scripts in this theme.

## exampleSite

`exampleSite/` is a minimal, runnable demo (multilingual nl/en config, posts/projects/shorts content, sample images in `static/`). It doubles as the manual test harness — build it after template changes and confirm the output. When adding a configurable param or content section, add a representative example here too.

## Layout architecture

Uses Hugo's modern (v0.146+) layout convention: templates live flat under `layouts/` (e.g. `baseof.html`, `page.html`, `section.html`) with partials in `layouts/_partials/` — there is **no `_default/` directory**. Minimum Hugo: **v0.158+** — the theme uses `.Language.Lang`/`.Direction`/`.Label` (the pre-0.158 `LanguageCode`/`LanguageDirection`/`LanguageName` accessors are deprecated).

- `baseof.html` is the shell. It defines the two-column Bulma layout (`aside.menu` + `main`), renders a skip-to-content link, and auto-renders a table of contents in the sidebar whenever the page has headings (`.Fragments.Headings`); it emits Hugo's `.TableOfContents` directly (do **not** re-wrap it in `<ul>` — that produces invalid nesting). Page templates fill the `{{ block "main" }}`.
- `head.html` pulls in `seo.html` (per-page, **not** cached) plus `head/css.html` + `head/js.html` (both `partialCached`). `seo.html` renders description, canonical, generator, hreflang alternates, RSS link, and Open Graph / Twitter Card tags — Hugo's deprecated `_internal/opengraph.html` etc. are intentionally **not** used. Edit asset loading/fingerprinting in `head/css.html` / `head/js.html`, not in individual templates.

### Section-driven homepage

`home.html` is hardcoded to three content sections by name and renders each with a different partial:

| Section    | Partial            | Layout                |
|------------|--------------------|-----------------------|
| `shorts`   | `short.html`       | card grid (max 3 on home) |
| `posts`    | `row-card.html`    | full-width rows ("Nieuws") |
| `projects` | `card.html`        | card grid ("Projecten") |

When adding content sections or renaming these, update `home.html` accordingly. `layouts/shorts/section.html` overrides the default section list view for the `shorts` section to use the card-grid + `short.html` layout instead of `row-card.html`.

### Card partials

`card.html` and `row-card.html` both check for a page image (`GetMatch "*.{jpg,jpeg,png,webp}"`, falling back to `.Params.image`) to decide whether to render the image block, then delegate the actual `<img>` to **`page-image.html`**, the date/reading-time/tags line to **`card-meta.html`**, and the teaser text to **`card-summary.html`**. Keep card changes in those shared partials rather than duplicating them.

- `page-image.html` (`dict "page" . "fill" "600x400" "sizes" ...`) processes a bundled image resource through Hugo's pipeline (cropped via `Fill`, converted to WebP, 1x/2x `srcset`, intrinsic `width`/`height` to avoid CLS, `loading="lazy"`). It falls back to the `.Params.image` URL (rendered as-is) and outputs nothing when neither exists.
- `card-meta.html` renders date, reading time (`i18n "readingTime"`), and `tags`.
- `card-summary.html` renders the card teaser: the page `Description` when set, else a `plainify`d + truncated `.Summary`. Plainifying deliberately keeps rich shortcode/embed HTML (game embeds, trophy cards) out of overview cards so they stay compact.

## Conventions

- **UI strings are translated via `i18n`** — keys live in `i18n/nl.toml`, `i18n/en.toml` and `i18n/fr.toml` (`tableOfContents`, `shortsTitle`, `newsTitle`, `projectsTitle`, `readingTime`, `previous`/`next`, `pagination`, `languages`, `allRightsReserved`, `skipToContent`, `mainNavigation`). Add new UI text as an i18n key in **every** language file, never inline. Menu entry labels are translatable via `T .Identifier` (see `_partials/menu.html`); the demo gives each `[[menus.main]]` entry an `identifier` (`menu_shorts`/`menu_news`/`menu_projects`/`menu_trophies`) with a matching key per language. The header renders a language switcher from `.AllTranslations`, shown only when `.IsTranslated`.
- Pagination uses the shared `_partials/pagination.html` (Bulma component, translated labels, disabled end states, `rel="prev"/"next"`) — used by `section.html` and `shorts/section.html`.
- Tags/taxonomy terms render as Bulma buttons/tags; `_partials/terms.html` is the reusable renderer (`{{ partial "terms.html" (dict "taxonomy" "tags" "page" .) }}`).
- `assets/css/main.css` is empty by default — custom styling goes here, and is loaded **after** `bulma.css`/`iconoir.css` so it can override them.
- The navbar burger toggle lives in `assets/js/main.js` (no inline `<script>` in templates).
- Cards use the **stretched-link** pattern: only the title is an `<a class="stretched-link">`, and a CSS `::after` in `main.css` makes the whole card clickable — keeps the accessible link text short while preserving whole-card click UX.
- `menu.html` sets `is-active`/`aria-current` from `IsMenuCurrent`/`HasMenuCurrent`, not hardcoded. The header is a **light** navbar (`.main-navbar`, bulma.io-style): each `[[menus.main]]` entry may set `[menus.main.params]` `icon` (an Iconoir class) and `color` (a Bulma colour: `primary`/`link`/`danger`/`warning`/…); `menu.html` then renders a coloured `icon-text` label and an `--item-accent` custom property that `main.css` uses for the active/hover underline (desktop). Entries without `icon` fall back to a plain text label. The demo colours each item to match its homepage section accent (shorts=primary, news=link, projects=danger, trophies=warning).
- `seo.html` also emits JSON-LD (`Article` on single pages, `WebSite` elsewhere).
- `404.html` and `layouts/robots.txt` exist. The robots template only renders when the parent site sets `enableRobotsTXT = true`; it disallows everything in non-production builds and links the sitemap.
- `page.html` shows a cover image (via `page-image.html`), reading time, and previous/next-in-section links.
- The TOC `aside` is only rendered when the page has headings; `main` widens to `is-12` otherwise.
- `archetypes/shorts.md` scaffolds the per-page author override fields.

### Lightbox (no-JS image/map zoom)

`_partials/lightbox.html` wraps already-rendered media (an `<img>` or inline `<svg>`)
in a **pure-CSS, no-JS** zoom-to-fullscreen overlay using the `:target` pseudo-class:
the wrapper's `id` becomes the URL fragment, so clicking the media (`<a href="#id">`)
makes `.lightbox:target` cover the viewport; the backdrop close link points at
`#lightbox-closed` (an id that matches no element) so the overlay un-targets **without
scrolling** the page. Any click while open closes it (the focusable backdrop link sits
on top). There is no Escape-to-close (that needs JS). CSS lives in `main.css`
(`.lightbox`, `.lightbox-open`, `.lightbox-backdrop`, `.lightbox-route`); i18n keys
(nl/en/fr): `enlargeImage`, `closeImage`. Pass `dict "id" <unique-per-page> "inner"
<rendered media HTML> "class" <opt> "label" <aria>`. Wired into: **body images** via the
markdown render hook `layouts/_markup/render-image.html` (id `lb-<Ordinal>`; resolves
bundle resources for intrinsic `width`/`height`), the **cover image** in `page.html` (id
`lb-cover`), the **short photo** in `short.html` (id `lb-short-<anchorized RelPermalink>`),
the **route map** SVG in `route/map.html` (id `lb-route-<anchorized src>`), and
**gallery screenshots** in `trophy/gallery.html` (id `lb-gallery-<anchorized resource
permalink>`). Card
thumbnails are intentionally **not** wrapped — clicking a card navigates to the page.

The wrapper is `display:inline-block` by default (good for inline prose images). Media
that sits in a full-width `<figure>` (cover, short photo, route map) must pass
`"class" "lightbox-block"` (or carry `.lightbox-route`) so the wrapper goes
`display:block` and fills the figure — otherwise a shrink-to-fit inline-block lets the
figure background bleed around it. The route **`<svg>` carries explicit `width`/`height`
attributes** (not just `viewBox`) so it has intrinsic dimensions; the overlay scales it
with `width:auto` like a raster image (a viewBox-only SVG would collapse to nothing in
the overlay). Demo: the `welkom` post body image + cover, the `foto-van-vandaag` short,
and the `rondje-amsterdam` route map.

### Configurable site params

The theme reads these (all optional) from the parent site's config:

| Param | Used by | Purpose |
|-------|---------|---------|
| `params.description` | `seo.html` | Fallback meta/OG description |
| `params.image` | `seo.html` | Fallback social-share image |
| `params.twitter` | `seo.html` | `twitter:site` handle |
| `params.themeColor` | `head.html` | `<meta name="theme-color">` |
| `params.author.{name,handle,avatar}` | `short.html` | Author identity for shorts |
| `copyright` (site-level) | `footer.html` | Footer text (markdownified); falls back to `© <year> <Title>. <allRightsReserved>` |

`short.html` author fields can be overridden per page via `authorName`/`authorHandle`/`authorAvatar` front matter; the avatar block is hidden when no avatar is set. When a short is a **leaf bundle** with an image resource (or sets `.Params.image`), `short.html` renders it via `page-image.html` (`fill "640x360"`) as a photo between the text and the date — like a social post with an attached image; text-only shorts are unaffected.

## Video ({{< video >}})

`{{< video src="clip.mp4" >}}` embeds a browser-playable video (typically an `.mp4`)
from the current page bundle as a **native, no-JS HTML5 `<video>` player** (the video
counterpart of body images). `_shortcodes/video.html` resolves the bundle resource via
`src=` (so the file goes through Hugo and gets a permalink), reading its `MediaType.Type`
for the `<source type>`; it falls back to using `src` verbatim as a URL when no resource
matches (external/remote MP4), and `warnf`s when `src` is missing. Optional named params:
`poster` (a still image — resource or URL — shown before playback), `caption`
(`<figcaption>`), and the booleans `loop`, `autoplay` (implies `muted`) and `muted`.
When `src` is a bundle resource, `caption` and `poster` **default to the resource's
front-matter `title` and `params.poster`** — the same fields `trophy/gallery.html` reads —
so a video tagged once in front matter needs no repeated shortcode args; an explicit
argument still overrides. **Hugo forbids mixing positional and named params**, so always
call it all-named (`src=…`), never `{{< video "clip.mp4" poster=… >}}`. Markup is a `<figure
class="video-embed">`; CSS (`.video-embed`, responsive 16:9) lives in `main.css`. Body
images use the markdown render hook + lightbox; video has no markdown syntax, hence the
shortcode (and no lightbox — the player's own fullscreen control handles that). Demo: the
`welkom` post body + the `thema-gebruiken` project page. Game-linking of video resources
is documented under **Trophies → Linking content to games** (`trophy/gallery.html`).

## Route maps (GPX)

A **static, no-JS** route map rendered entirely at build time — no Leaflet/MapLibre,
no client runtime. `{{< route "track.gpx" >}}` embeds a map of a **GPX track** from
the current page bundle, with a distance/elevation/duration stats line.

Pipeline (all in Hugo templates):
- `_shortcodes/route.html` resolves the bundle resource (positional arg or `src=`) and
  calls `_partials/route/map.html`. It `warnf`s when the file/track is missing.
- `route/map.html` parses the GPX (XML) with `transform.Unmarshal`, projects each
  trackpoint to **Web Mercator** unit fractions, picks the largest integer zoom whose
  (padded) bounding box fits the target `width`×`height`, fetches the covering
  **OpenStreetMap raster tiles** via `resources.GetRemote` (Hugo caches these, so
  rebuilds do no network), and emits **one inline `<svg>`**: tiles as an `<image>`
  grid with the route as two stacked `<polyline>`s (white casing + coloured line) plus
  green start / red end `<circle>` markers. Tile fetch is wrapped in `try` — if a tile
  can't be fetched (e.g. an offline build) it's skipped and the CSS background shows, so
  the route still renders. The drawn polyline is downsampled to `maxPoints`.
- `route/stats.html` computes distance (haversine sum, km), elevation gain (sum of
  positive `<ele>` deltas, m) and duration (last−first `<time>`, `h:mm`) from the
  trackpoints; each value is dropped when its source data is absent.

**GPX parse shape** (Hugo's XML unmarshal): element attributes are prefixed with `-`
(so `index $pt "-lat"`, `"-lon"`); `<ele>`/`<time>` are direct children; **all values
are strings** (convert with `float`); `trk`/`trkseg`/`trkpt` are a slice when repeated
but a single map when there's only one — `map.html` normalises each with
`reflect.IsSlice`.

**FIT is not supported** (Hugo can't parse the binary format) — convert to GPX first
(e.g. `gpsbabel -i garmin_fit -f in.fit -o gpx -F out.gpx`).

Config (site params, all optional, under `params.route`): `tileURL` (default OSM
`https://tile.openstreetmap.org/{z}/{x}/{y}.png` — override for another provider /
self-hosted tiles), `userAgent` (HTTP `User-Agent` for tile fetches; default built
from `site.Title` + `site.BaseURL`), `attribution` (default `i18n "mapAttribution"`),
`width`/`height`
(`800`/`500`), `maxZoom` (`16`), `maxPoints` (`500`). **OSM attribution is mandatory**
and is rendered as the `<figcaption>`; OSM's tile policy discourages bulk use, so heavy
sites should point `tileURL` at their own/provider tiles. **OSM also serves a 403
"Access blocked" tile to clients whose `User-Agent` doesn't identify the app with a
valid contact** — the default UA resolves to `localhost` in dev, which OSM rejects, so
set `params.route.userAgent` to your app name + a real email/URL for production. An
existing block is IP-level and clears on its own once the offending requests stop. i18n keys (nl/en/fr):
`routeMap`, `routeDistance`, `routeElevation`, `routeDuration`, `mapAttribution`. CSS
lives in `main.css` (`.route-map`, `.route-stats`, `.route-attribution`). Demo:
`exampleSite/content/posts/rondje-amsterdam/` (a fake `track.gpx` + nl/en posts).

## Trophies

A data-driven, fully static feature for displaying game trophies/achievements
(PSN + Steam) exported to the throphies JSON format. **The theme provides only the
rendering**; the consuming site supplies the data + one content adapter + config.

### Theme side (rendering)
- Layouts: `layouts/trophies/section.html` (overview: stats dashboard + taxonomy
  filter links + completion-sorted, paginated game grid), `layouts/trophies/page.html`
  (per-game detail: a block per platform source with a trophy grid), and
  `layouts/platforms/term.html` + `layouts/trophytypes/term.html` (filter pages that
  reuse the game grid). *(Single pages use `page.html`, not `single.html`, per the
  modern convention.)*
- Partials in `layouts/_partials/trophy/`: `game-grid`, `game-card` (header art or a
  title-banner fallback when a source has no art, e.g. PSN), `progress` (Bulma bar,
  coloured by completion), `trophy-card` (icon greyed when locked, type badge, earned
  date, PSN rarity), `type-badge`, `stats` (dashboard aggregated from the generated
  pages' params — never re-reads the raw data), `image`, and `home-bar` (homepage
  strip of recently-earned trophies + a single full-width, compact hero banner for the
  most recent 100%-completed game: header art as background with overlay, 100% badge,
  title, completion date and a strip of that game's trophy icons; responsive).
- `home.html` calls `{{ partial "trophy/home-bar.html" . }}`; it renders nothing when
  the site has no trophies pages, so non-trophy sites are unaffected.
- `image.html` resolves images **local-first with remote fallback**: it tries a
  resource under `params.trophies.imageBase` (default `trophies`) at
  `<base>/<platform>/<id>/trophies/<basename(iconUrl)>` (trophy icons) or
  `<base>/<platform>/<id>/<kind>.jpg` (game art), and falls back to the remote URL
  from the data when the local file is absent. Swap the whole image strategy here.
- `loc.html` resolves a **localized data field** (the export wraps `title` / source
  `name` / trophy `name` + `description` as a language map `{en,nl,de}`) to one string
  for a language: `{{ partial "trophy/loc.html" (dict "value" $t.name "lang" site.Language.Lang) }}`.
  Fallback order is requested-lang → `en` → `nl` → `de` → first value, and a plain
  string passes through (back-compat with the old single-language export). `trophy-card`,
  `home-bar` and `page.html` call it at render time, so a trophy's name/description show
  in the visitor's language; the raw maps stay in page params (the adapter only
  pre-localizes the page **title**, since `.Title` must be a string).
- i18n keys (nl/en): `trophies`, `earned`, `locked`, `completion`, `totalEarned`,
  `trophyGames`, `byPlatform`, `byType`, `rarityOfPlayers`, `platform_{steam,psn}`,
  `trophyType_{platinum,gold,silver,bronze,achievement}`. CSS for trophies lives in
  `assets/css/main.css` (locked = grayscale, type-badge colours, grid, banner).

### Site side (data + glue) — see `exampleSite/`
- A data file (`data/<name>.json`) in the throphies export shape. The export is
  **multilingual**: a top-level `languages` array, and `title` / source `name` / trophy
  `name` + `description` are language maps (`{"en":…,"nl":…,"de":…}`, some keys may be
  absent). The theme's `trophy/loc.html` resolves these; old single-language exports
  (plain strings) still work.
- `content/trophies/_content.gotmpl` (default language) + `_content.en.gotmpl` (one per
  extra language) — thin **content adapters** that both call the shared
  `_partials/trophy-build.html`. That partial reads `hugo.Data.<name>` (note: `hugo.Data`,
  **not** the deprecated `site.Data`), computes per-game aggregates
  (`earned/total/pct/header/lastEarnedAt/typeEarned/typeTotal/platformEarned/platformTotal`)
  and `.AddPage`s one page per game **in the current language** (`.Site.Language.Lang`),
  pre-localizing the page title. `lastEarnedAt` (max earnedAt) drives the homepage
  "recently completed" ordering. `path` is **relative to the adapter's directory** (just
  the slug — do not prepend `trophies/`). Taxonomy terms are assigned by putting
  `platforms` and `trophytypes` arrays in `params`. A content adapter runs only for
  languages where it exists, so add a `_content.<lang>.gotmpl` (+ `_index.<lang>.md`) for
  each language you want trophies in.
- `content/trophies/_index.md` (+ `_index.<lang>.md` per extra language) — section
  title/intro.
- Config: `[taxonomies]` with `platform="platforms"` + `trophytype="trophytypes"`
  (keep `tag="tags"` so posts/projects still work), a menu entry, and
  `params.trophies.imageBase`.
- Trophies pages are generated **once per content language** (title + trophy
  names/descriptions localized via the data's language maps, with fallback). The
  language-agnostic numbers (earned/total/pct/dates) are identical across languages.

The `exampleSite` demo uses **fake data** (`data/trophies.json`) and tiny placeholder
images under `assets/trophies/` — never the real personal export. For real use, point
`data/all.json` at the export (symlink) and mount the real `images/` dir to
`assets/trophies` via a module mount; the local-first image partial picks it up
automatically, with CDN fallback.

### Linking content to games

Regular content (posts/projects/shorts) can reference trophy games, bidirectionally.
The link key is the game's **`matchKey`** (from the trophies data, e.g. `shadow realm`),
matched case-insensitively via `anchorize`. Trophies pages are generated **per content
language**, so game-page lookups prefer the **current** language (`site.GetPage` / the
shortcode's `$.Page.Site`) and fall back to the default-language site
(`index hugo.Sites 0`) when a translation is missing — an `/en/` post links to
`/en/trophies/<slug>/`, an unprefixed post to `/trophies/<slug>/`. The content adapter
must expose `matchKey` in the generated page params (`trophy-build.html` adds
`"matchKey" $game.matchKey`) for the backlink/screenshot queries to match against. The
`{{< trophy >}}` shortcode matches its trophy-name argument against the trophy's name in
**any** language, so an English name still resolves on a translated page.

- **Tag whole games** — `games = ["shadow realm", "pixel quest"]` in front matter.
  - In the article, `_partials/trophy/related-games.html` (called from `page.html`)
    renders "Gerelateerde games" badges linking to each game page.
  - On the game page, `_partials/trophy/backlinks.html` renders a "Genoemd in" section
    listing every page that references the game — either via its `games` front-matter
    array (`where … "Params.games" "intersect"`) **or** via an inline `{{< game >}}` /
    `{{< trophy >}}` shortcode or manual link (detected because the rendered `.Content`
    then contains this game's `RelPermalink`). Scoped to the game page's own language,
    so each language's game page lists that language's articles.
- **Tag media (screenshots + clips)** — give a page **resource** a `params.game` equal to
  a matchKey; `_partials/trophy/gallery.html` gathers every such **image** (`.Resources.ByType
  "image"`) and **video** (`.Resources.ByType "video"`, e.g. an `.mp4`) across the site
  into one combined **"Galerij"/"Gallery" block** on that game page — images as
  lightbox-zoomable thumbnails, videos as native `<video>` players. Both carry the **same
  caption** below the media (`<title> — <link back to the hosting article>`); clicking a
  screenshot enlarges it via the no-JS lightbox (`lb-gallery-<anchorized resource
  permalink>`). A video resource may set `params.poster` (a still image in the same bundle)
  shown before playback. The media still renders normally wherever the article uses it.
  The gallery gathers per content language (it scans `site.RegularPages`), so each
  language's game page lists that language's media.
- **Inline shortcodes** (`layouts/_shortcodes/`):
  - `{{< game "shadow realm" >}}` → compact clickable game embed (`trophy/game-embed.html`).
    Accepts multiple matchKeys (`{{< game "a" "b" "c" >}}`); with more than one it wraps
    the embeds in `.trophy-embed-grid` (responsive equal-height grid).
  - `{{< trophy "shadow realm" "Master of Shadows" >}}` → a single trophy card linked to
    its deep-link anchor on the game page. The first arg is the game matchKey; every arg
    after it is a trophy name, so `{{< trophy "shadow realm" "A" "B" "C" >}}` renders the
    cards in a `.trophy-inline-grid` (responsive grid). Each trophy on `trophies/page.html`
    gets `id="trophy-<platform>-<sourceId>-<trophyId>"`; `trophy-card.html` takes optional
    `anchor` (sets that id) and `link` (makes the name a link). Both shortcodes `warnf`
    when the game/trophy can't be resolved.

i18n keys (nl/en/fr): `mentionedIn`, `relatedGames`, `gallery`. CSS for the embed, inline
card, backlinks and gallery is in `main.css` (`.trophy-embed`, `.trophy-inline`,
`.trophy-mentions`, `.trophy-gallery`; `.trophy[id]` gets `scroll-margin-top`).

## CV (curriculum vitae)

A **data-driven, fully static** résumé page at `/cv`: a **header** (photo, name, job
title, contact + profile links + a "download as PDF" button), a **profile/"about"**
block, categorized **skills**, **spoken languages**, **work experience**,
**education & courses**, and **diplomas/certificates**. Like trophies, the theme provides
only the rendering; the consuming site supplies data files under `data/cv/` plus the CV
page's front matter. The page is **multilingual** — Hugo data is global (not
per-language), so translatable **data** fields are **language maps** (`{nl=…, en=…, fr=…}`)
resolved per language at render time by the **shared `_partials/trophy/loc.html`**
resolver (same fallback order). Non-translatable fields (skill names, company, dates)
stay plain strings. The **header/profile** are translated differently — they live in the
page's **front matter / body**, which is already per-language (`cv.md` / `cv.en.md` /
`cv.fr.md`), so they need no language maps.

### Theme side (rendering)
- Layout **`layouts/cv/page.html`** — rendered because the content page sets
  `type = "cv"` (modern convention: single → `page.html`, **not** `single.html`). It
  renders `cv/header.html`, then the profile block (the page `.Content`), then reads
  `hugo.Data.cv` for the remaining blocks via partials — each **skipped when its source
  is absent** (`with $cv.<name>` / `with .Content`), so a site without `data/cv/` renders
  just the header.
- Partials in **`layouts/_partials/cv/`**:
  - `header.html` — photo + name + `jobTitle` + `location`/`email`/`phone` (Iconoir
    `icon-text`) + a `buttons` row of profile links (`linkedin`/`github`/`website`) and
    a `[data-print]` "download as PDF" button. Reads the page front matter `params`
    (`name`/`jobTitle`/`location`/`email`/`phone`/`photo`/`links`), falling back to
    `site.Params.author.{name,avatar}`.
  - `skills.html` (categories → name + level tag; `level` ∈
    `beginner|intermediate|advanced|expert` → a Bulma tag colour + i18n label
    `skillLevel_<level>`), `languages.html` (spoken languages, same tag layout; `level`
    ∈ `native|fluent|advanced|intermediate|basic` → `langLevel_<level>`),
    `experience.html` (role/company/period/summary + optional highlights — `highlights`
    is a **language map of arrays**, and `loc.html` returns the matching array to range
    over), `education.html` (`studies` + `courses` sub-blocks), `certificates.html`
    (name/issuer/date + optional `url`), and the shared **`period.html`** (formats two
    `"YYYY-MM"` strings into a localized `"jan 2020 – heden"` range via `time.Format`,
    which localizes month names; an empty `end` renders the i18n `cvPresent` label).
- **Sidebar submenu** — each block carries an `id` (`cv-profile`/`cv-skills`/
  `cv-languages`/`cv-experience`/`cv-education`/`cv-certificates`), and
  `_partials/cv/toc.html` renders an anchor submenu in the same `aside.menu` a normal
  page uses for its TOC. Because the CV headings come from data (not markdown) they
  aren't in Hugo's `.TableOfContents`, so **`baseof.html` special-cases `eq .Type "cv"`**:
  it shows the aside (and keeps `main` at `is-8`) and renders `cv/toc.html` instead of
  the markdown TOC. The submenu lists only the blocks whose source exists, mirroring
  `page.html`.
- **Print / PDF** — the `[data-print]` button calls `window.print()` (handler in
  `assets/js/main.js`), and a `@media print` block in `main.css` hides the header/nav,
  footer, sidebar and the button so only the CV prints; `break-inside: avoid` keeps
  entries intact across pages.
- i18n keys (nl/en/fr): `cvProfile`, `cvSkills`, `cvLanguages`, `cvExperience`,
  `cvEducation`, `cvCourses`, `cvCertificates`, `cvPresent`, `cvWebsite`,
  `cvDownloadPdf`, `menu_cv`, `skillLevel_{beginner,intermediate,advanced,expert}` and
  `langLevel_{native,fluent,advanced,intermediate,basic}` (the submenu reuses
  `tableOfContents`). CSS lives in `main.css` (`.cv-header`/`.cv-photo`/`.cv-contact`,
  `.cv-block` incl. `scroll-margin-top`, `.cv-heading`, `.cv-skill-list`,
  `.cv-timeline`/`.cv-entry`, `.cv-highlights`, `.cv-courses`, `.cv-certificates`, plus
  the `@media print` rules).

### Site side (data + glue) — see `exampleSite/`
- Data files under **`data/cv/`** → `hugo.Data.cv.{skills,languages,experience,education,certificates}`:
  - `skills.toml` — `[[categories]]` each with a `title` language map and `[[…skills]]`
    (`name` + `level`).
  - `languages.toml` — `[[languages]]` with a `name` language map and a `level`.
  - `experience.toml` — `[[jobs]]` with plain `company`/`start`/`end` and language maps
    `role`, `summary`, optional `highlights` (map of arrays). Empty `end` ⇒ "present".
  - `education.toml` — `[[studies]]` (language-map `degree`/`institution` + `start`/`end`)
    and `[[courses]]` (plain `name`/`provider`/`year`).
  - `certificates.toml` — `[[certificates]]` with `name`/`issuer`/`date`, optional `url`.
- Content **`content/cv.md`** (+ `cv.en.md`, `cv.fr.md`) — front matter `title` +
  `type = "cv"` + the header `[params]` (`name`/`jobTitle`/`location`/`email`/`phone`/
  `photo`/`[params.links]`), and a body that becomes the **profile/"about"** block. One
  file per language (header text + profile are localized via the per-language file; data
  via the language maps).
- Config: a `[[menus.main]]` entry (`identifier = "menu_cv"`, `pageRef = "/cv"`, icon
  `iconoir-user`, colour `info` in the demo).
