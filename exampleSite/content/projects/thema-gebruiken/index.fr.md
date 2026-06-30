---
title: "Utiliser le thème"
date: 2026-06-30
tags: ["projet", "guide"]
description: "Un guide concis pour installer et configurer le thème DrogeBulma."
games: ["shadow realm", "pixel quest"]
---

DrogeBulma est un **thème Hugo** basé sur [Bulma](https://bulma.io/) et
[Iconoir](https://iconoir.com/) — pas un site autonome. Vous l'utilisez en l'attachant
comme thème à votre propre site Hugo. Cette page résume comment procéder.

## Installation

Ajoutez le thème à votre site sous `themes/drogebulma`. Le plus simple est un module
Hugo ou un sous-module git :

```bash
git submodule add https://github.com/tijder/drogebulma.git themes/drogebulma
```

Définissez ensuite le thème dans la configuration de votre site :

```toml
theme = "drogebulma"
```

Bulma et Iconoir sont **fournis** sous forme de fichiers dans `assets/css/` — il n'y a
aucune dépendance npm. Pour mettre Bulma à jour, remplacez `assets/css/bulma.css` par
une version plus récente.

## Lancer en local

- `hugo server -D` — serveur de développement avec brouillons. Les ressources sont alors
  non minifiées et sans empreinte, avec des sourcemaps JS.
- `hugo` — build de production : le CSS est minifié et doté d'empreintes avec des hachages
  SRI, le JS est construit via `js.Build`.

Vous voulez essayer le thème sans votre propre site ? Lancez la démo fournie :

```bash
cd exampleSite && hugo server
```

## Configuration

Le thème lit plusieurs paramètres optionnels depuis la configuration du site :

| Paramètre | Rôle |
|-----------|------|
| `params.description` | Description meta/OG par défaut |
| `params.image` | Image de partage par défaut |
| `params.twitter` | Identifiant `twitter:site` |
| `params.themeColor` | `<meta name="theme-color">` |
| `params.author.{name,handle,avatar}` | Identité d'auteur pour les shorts |
| `copyright` | Texte du pied de page |

Les textes d'interface traduisibles se trouvent dans `i18n/nl.toml`, `i18n/en.toml` et
`i18n/fr.toml`. Ajoutez tout nouveau texte comme clé i18n dans **chaque** langue, jamais
en dur.

## Organiser le contenu

La page d'accueil affiche trois sections de contenu, chacune avec sa propre mise en page :

- **`shorts`** — une grille de cartes (extraits façon réseau social, avec photo optionnelle).
- **`posts`** — des rangées pleine largeur (« Actualités »).
- **`projects`** — une grille de cartes (« Projets ») — comme cette page.

Ajoutez du contenu avec un front matter comme ci-dessus : un `title`, une `date`, des
`tags` et une `description` optionnelle. Placez une image dans le bundle (par ex.
`cover.jpg`) et elle apparaît automatiquement comme image de carte.

## Extras, exemple en direct

Le thème propose plusieurs briques statiques, sans JS. Voici un exemple **fonctionnel**
de chacune, directement sur cette page.

### Images

Les images du corps de texte s'utilisent en Markdown classique. Elles sont
automatiquement enveloppées dans une **lightbox** — cliquez pour agrandir, cliquez à
nouveau (ou sur l'arrière-plan) pour fermer. CSS pur, sans JS :

![Une image d'exemple](voorbeeld.jpg "Cliquez pour agrandir")

Toutes les options :

- **Texte alternatif** — le texte entre crochets : `![description](voorbeeld.jpg)`.
  Important pour l'accessibilité et le SEO.
- **Titre** — le texte facultatif entre guillemets : `![…](voorbeeld.jpg "titre")` ;
  sert de texte alternatif lorsque les crochets sont vides.
- **Ressource du bundle ou URL externe** — lorsque `src` pointe vers un fichier du bundle
  de la page, le thème lit sa largeur/hauteur intrinsèque (évite le décalage de mise en
  page) ; sinon l'URL est utilisée telle quelle.

Comme les vidéos, une image peut être **liée à un jeu** : donnez à l'image un
`params.game` (la matchKey) dans le front matter. La capture apparaît alors — avec les
vidéos taguées — dans le **bloc « Galerie »** sur la page du jeu, avec un lien vers cet
article. Un `title` sur la ressource devient sa légende dans cette galerie :

```toml
[[resources]]
  src = "screenshot.jpg"
  title = "Boss final vaincu"   # légende dans la galerie
  [resources.params]
    game = "shadow realm"
```

### Cartes d'itinéraire

`{{</* route "track.gpx" */>}}` dessine une trace GPX du bundle de la page en SVG inline
avec des tuiles OpenStreetMap, avec une ligne pour la distance, le dénivelé et la durée :

{{< route "track.gpx" >}}

### Vidéos

`{{</* video */>}}` intègre une vidéo lisible par le navigateur (généralement un `.mp4`)
du bundle de la page comme lecteur HTML5 natif — sans JS, sans lecteur externe :

{{< video src="voorbeeld.mp4" caption="Un MP4 du bundle de la page" >}}

Toutes les options (toutes **nommées** : Hugo n'autorise pas de mélanger paramètres
positionnels et nommés) :

- `src` — nom de la ressource vidéo dans le bundle de la page, ou une URL externe.
  **Obligatoire.**
- `poster` — image fixe affichée avant la lecture (ressource ou URL). Par défaut, le
  `params.poster` de la ressource.
- `caption` — légende sous le lecteur (`<figcaption>`). Par défaut, le `title` de la
  ressource — le même titre qu'utilise la galerie — pour ne le définir qu'une seule fois
  dans le front matter.
- `loop` — lecture en boucle (par défaut `false`).
- `autoplay` — lecture automatique ; implique `muted` (les navigateurs bloquent la
  lecture automatique avec son).
- `muted` — démarre en sourdine (par défaut `false`).

Un exemple complet :

```text
{{</* video src="intro.mp4" poster="cover.jpg" caption="Bande-annonce du jeu"
          loop=true autoplay=true muted=true */>}}
```

Comme les images, les vidéos peuvent être **liées à un jeu** : donnez à une ressource
vidéo un `params.game` (la matchKey) dans le front matter, et le clip apparaît — avec
les captures d'écran taguées — automatiquement dans le **bloc « Galerie »** sur la page
du jeu, avec un lien vers cet article. Un `params.poster` facultatif pointe vers une
image fixe du même bundle :

```toml
[[resources]]
  src = "boss-kill.mp4"
  [resources.params]
    game = "shadow realm"
    poster = "boss-kill.jpg"
```

### Lier des jeux

Référencez un jeu des données de trophées avec `{{</* game "shadow realm" */>}}` :

{{< game "shadow realm" >}}

Plusieurs jeux forment une grille — `{{</* game "shadow realm" "pixel quest" */>}}` :

{{< game "shadow realm" "pixel quest" >}}

### Afficher un trophée

`{{</* trophy "shadow realm" "Master of Shadows" */>}}` affiche une seule carte de
trophée, liée à son ancre sur la page du jeu :

{{< trophy "shadow realm" "Master of Shadows" >}}

### Liaison bidirectionnelle

Cette page possède `games = ["shadow realm", "pixel quest"]` dans son front matter. De ce
fait, un bloc **« Jeux liés »** apparaît automatiquement ci-dessous, et chaque page de jeu
mentionne ce guide sous **« Mentionné dans »** — sans que vous ayez à maintenir l'un ou
l'autre côté à la main.

### CV

Enfin, le thème rend une **page de CV statique, entièrement pilotée par les données** à
[`/cv`](/fr/cv/). Le thème ne fournit que le rendu ; votre site fournit les données et un
peu de front matter. Un CV se compose de ces blocs, chacun omis si sa source est absente :

- un **en-tête** avec photo, nom, intitulé de poste, coordonnées et liens de profil ;
- un bloc **profil/« à propos »** (le texte de la page de contenu elle-même) ;
- des **compétences** catégorisées avec un niveau, les **langues** parlées,
  l'**expérience professionnelle**, la **formation & les cours**, et les
  **diplômes/certificats**.

Vous remplissez le CV à deux endroits :

1. **Des fichiers de données** sous `data/cv/` — dans cette démo :
   `skills.toml`, `languages.toml`, `experience.toml`, `education.toml` et
   `certificates.toml`. Les données Hugo ne sont pas par langue, donc les champs
   traduisibles sont des **maps de langues** (`{nl=…, en=…, fr=…}`) résolues par langue ;
   les champs non traduisibles (noms de compétences, entreprise, dates) restent de
   simples chaînes.
2. **La page de contenu** `content/cv.md` (+ `cv.en.md`, `cv.fr.md`) — avec
   `type = "cv"`, les `[params]` de l'en-tête (`name`/`jobTitle`/`location`/`email`/
   `photo`/liens) et un corps qui devient le bloc profil. Un fichier par langue traduit
   l'en-tête et le profil.

La page reçoit dans la barre latérale un **sous-menu d'ancres** vers les blocs présents,
et le bouton **« Télécharger en PDF »** appelle `window.print()` — un bloc
`@media print` dans `main.css` masque alors la navigation, le pied de page et la barre
latérale pour n'imprimer que le CV. Consultez-la à [`/cv`](/fr/cv/).

## En savoir plus

La documentation complète se trouve dans `CLAUDE.md` à la racine du thème. Elle explique,
fonctionnalité par fonctionnalité, comment les templates, partials et shortcodes
fonctionnent ensemble.
