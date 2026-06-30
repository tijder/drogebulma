# DrogeBulma

A multilingual [Hugo](https://gohugo.io/) theme built on [Bulma](https://bulma.io/)
CSS and [Iconoir](https://iconoir.com/) icons. The UI ships in Dutch, English and
French. Bulma and Iconoir are **vendored** (committed CSS, no npm dependency).

**Live demo:** <https://tijder.github.io/drogebulma/>

## Features

- **Multilingual** (nl/en/fr) with hreflang alternates and a header language switcher.
- **Responsive images** through Hugo's asset pipeline (cropped WebP, 1x/2x `srcset`,
  intrinsic dimensions to avoid layout shift).
- **SEO**: per-page meta, canonical, Open Graph / Twitter Cards and JSON-LD.
- **Section-driven homepage** (shorts / news / projects) plus auto table of contents.
- **No-JS extras**: a pure-CSS lightbox, native HTML5 `{{</* video */>}}` embeds, and
  static **GPX route maps** rendered at build time from OpenStreetMap tiles.
- **Trophies**: a data-driven PSN/Steam trophy showcase with backlinks and galleries.
- **CV**: a data-driven, printable résumé page.

## Requirements

- **Hugo extended ≥ 0.158.0** (the theme uses `.Language.Lang`/`.Direction`/`.Label`
  and the modern flat layout convention).

## Usage

Add the theme to your Hugo site (as a submodule, Hugo module, or by copying it into
`themes/drogebulma`) and set `theme = "drogebulma"` in your config.

A full, worked setup and configuration guide lives in the demo site itself:

👉 **[Using the theme](https://tijder.github.io/drogebulma/en/projects/thema-gebruiken/)**

It covers configuration params, content sections, the trophy/CV data shape, route maps
and the no-JS media features.

## Example site

`exampleSite/` is a runnable demo that doubles as the manual test harness. Run it from
the repo root:

```bash
cd exampleSite && hugo server
```

`exampleSite/themes/drogebulma` is a committed symlink back to the repo root, so Hugo
resolves `theme = "drogebulma"` to this checkout. (Equivalent without the symlink:
`hugo server --themesDir ../..`.)

## Deployment

A GitHub Actions workflow (`.github/workflows/gh-pages.yml`) builds `exampleSite/` and
publishes it to GitHub Pages on every push to `main`. Enable it under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## License

[GPLv3](LICENSE) © [tijder](https://github.com/tijder)
