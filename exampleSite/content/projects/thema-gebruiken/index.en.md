---
title: "Using the theme"
date: 2026-06-30
tags: ["project", "guide"]
description: "A concise guide to setting up and configuring the DrogeBulma theme."
games: ["shadow realm", "pixel quest"]
---

DrogeBulma is a **Hugo theme** built on [Bulma](https://bulma.io/) and
[Iconoir](https://iconoir.com/) — not a standalone website. You use it by attaching it
as a theme to your own Hugo site. This page summarises how to do that.

## Installing

Add the theme to your site under `themes/drogebulma`. The simplest way is a Hugo module
or a git submodule:

```bash
git submodule add https://github.com/tijder/drogebulma.git themes/drogebulma
```

Then set the theme in your site configuration:

```toml
theme = "drogebulma"
```

Bulma and Iconoir are **vendored** as files in `assets/css/` — there is no npm
dependency. To upgrade Bulma, replace `assets/css/bulma.css` with a newer release.

## Running locally

- `hugo server -D` — development server with drafts. Assets are then unminified and
  un-fingerprinted, with JS sourcemaps.
- `hugo` — production build: CSS is minified and fingerprinted with SRI hashes, JS is
  built via `js.Build`.

Want to try the theme without your own site? Run the bundled demo:

```bash
cd exampleSite && hugo server
```

## Configuration

The theme reads a number of optional parameters from the site configuration:

| Param | Purpose |
|-------|---------|
| `params.description` | Default meta/OG description |
| `params.image` | Default social-share image |
| `params.twitter` | `twitter:site` handle |
| `params.themeColor` | `<meta name="theme-color">` |
| `params.author.{name,handle,avatar}` | Author identity for shorts |
| `copyright` | Footer text |

Translatable UI strings live in `i18n/nl.toml`, `i18n/en.toml` and `i18n/fr.toml`. Add
new text as an i18n key in **every** language, never inline.

## Organising content

The homepage renders three content sections, each with its own layout:

- **`shorts`** — a card grid (social-post snippets with an optional photo).
- **`posts`** — full-width rows ("News").
- **`projects`** — a card grid ("Projects") — like this page.

Add content with front matter as above: a `title`, `date`, `tags` and an optional
`description`. Place an image in the bundle (e.g. `cover.jpg`) and it appears
automatically as the card image.

## Extras, live example

The theme offers several static, no-JS building blocks. Below is a **working** example
of each, right on this page.

### Images

Images in the body use plain Markdown. They are automatically wrapped in a **lightbox** —
click to enlarge, click again (or on the backdrop) to close. Pure CSS, no JS:

![A sample image](voorbeeld.jpg "Click to enlarge")

All options:

- **Alt text** — the text between the brackets: `![description](voorbeeld.jpg)`. Important
  for accessibility and SEO.
- **Title** — the optional quoted text: `![…](voorbeeld.jpg "title")`; used as the alt
  text when the brackets are empty.
- **Bundle resource or external URL** — when `src` points to a file in the page bundle,
  the theme reads its intrinsic width/height (avoids layout shift); otherwise the URL is
  used as-is.

Like videos, an image can be **linked to a game**: give the image a `params.game` (the
matchKey) in front matter. The screenshot then appears — alongside any tagged videos — in
the **"Gallery" block** on the game page, linking back to this article. A `title` on the
resource becomes its caption in that gallery:

```toml
[[resources]]
  src = "screenshot.jpg"
  title = "Final boss down"   # caption in the gallery
  [resources.params]
    game = "shadow realm"
```

### Route maps

`{{</* route "track.gpx" */>}}` draws a GPX track from the page bundle as an inline SVG
with OpenStreetMap tiles, plus a line for distance, elevation gain and duration:

{{< route "track.gpx" >}}

### Videos

`{{</* video */>}}` embeds a browser-playable video (typically an `.mp4`) from the page
bundle as a native HTML5 player — no JS, no external player:

{{< video src="voorbeeld.mp4" caption="An MP4 from the page bundle" >}}

All options (all **named**: Hugo does not allow mixing positional and named parameters):

- `src` — filename of the video resource in the page bundle, or an external URL.
  **Required.**
- `poster` — a still image shown before playback (resource or URL). Falls back to the
  resource's `params.poster`.
- `caption` — caption below the player (`<figcaption>`). Falls back to the resource's
  `title` — the same title the gallery uses — so you only set it once in front matter.
- `loop` — loop playback (default `false`).
- `autoplay` — autoplay; implies `muted` (browsers block sound-on autoplay).
- `muted` — start muted (default `false`).

A full example:

```text
{{</* video src="intro.mp4" poster="cover.jpg" caption="Game trailer"
          loop=true autoplay=true muted=true */>}}
```

Like images, videos can be **linked to a game**: give a video resource a `params.game`
(the matchKey) in front matter and the clip appears — alongside any tagged screenshots —
automatically in the **"Gallery" block** on that game's page, linking back to this
article. An optional `params.poster` points to a still image in the same bundle:

```toml
[[resources]]
  src = "boss-kill.mp4"
  [resources.params]
    game = "shadow realm"
    poster = "boss-kill.jpg"
```

### Linking games

Reference a game from the trophies data with `{{</* game "shadow realm" */>}}`:

{{< game "shadow realm" >}}

Several games land in a grid — `{{</* game "shadow realm" "pixel quest" */>}}`:

{{< game "shadow realm" "pixel quest" >}}

### Showing a trophy

`{{</* trophy "shadow realm" "Master of Shadows" */>}}` renders a single trophy card,
linked to its anchor on the game page:

{{< trophy "shadow realm" "Master of Shadows" >}}

### Bidirectional linking

This page has `games = ["shadow realm", "pixel quest"]` in its front matter. As a result
a **"Related games"** block appears automatically below, and every game page lists this
guide under **"Mentioned in"** — without you maintaining either side by hand.

### CV

Finally, the theme renders a fully **data-driven, static résumé page** at
[`/cv`](/en/cv/). The theme provides only the rendering; your site supplies the data and
a little front matter. A CV is made up of these blocks, each skipped when its source is
absent:

- a **header** with photo, name, job title, contact details and profile links;
- a **profile/"about"** block (the text of the content page itself);
- categorised **skills** with a level, spoken **languages**, **work experience**,
  **education & courses**, and **diplomas/certificates**.

You fill the CV in two places:

1. **Data files** under `data/cv/` — in this demo:
   `skills.toml`, `languages.toml`, `experience.toml`, `education.toml` and
   `certificates.toml`. Hugo data is not per-language, so translatable fields are
   **language maps** (`{nl=…, en=…, fr=…}`) resolved per language; non-translatable
   fields (skill names, company, dates) stay plain strings.
2. **The content page** `content/cv.md` (+ `cv.en.md`, `cv.fr.md`) — with
   `type = "cv"`, the header `[params]` (`name`/`jobTitle`/`location`/`email`/`photo`/
   links) and a body that becomes the profile block. One file per language translates
   the header and profile.

The page gets an **anchor submenu** in the sidebar to the blocks that exist, and the
**"Download as PDF"** button calls `window.print()` — a `@media print` block in
`main.css` then hides the navigation, footer and sidebar so only the CV prints. View it
at [`/cv`](/en/cv/).

## Learn more

The full documentation lives in `CLAUDE.md` at the theme's root. It explains, per
feature, how the templates, partials and shortcodes work together.
