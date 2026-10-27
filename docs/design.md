# Design notes

The hub is a calm, neutral frame. A project shows its own look only inside its preview and in one small mark.

## Rules

| Rule | Detail |
| --- | --- |
| One accent | The teal accent marks buttons, links, focus rings and the Live dot. A project color never colors a button. |
| Tokens | Each color, size, radius, shadow and timing comes from `data/design.json`. A raw color in `site.css` fails a test. |
| Spacing | Use the `space-*` tokens. One section gap separates each section. |
| Type | Use the `text-*` and `title-*` tokens. Three title sizes give the hierarchy: hero, section, card. |
| Layout | The top of `site.css` names the two breakpoints. Below the first, the page has one column. |
| Buttons | Buttons in one row share one width. They stack at full width when the row is too narrow. One primary button for each card. |
| Links | A first-party link ends with an arrow right. An external link ends with an arrow out and opens a new tab. |

## Phones

- Headings, chips and short copy are centred.
- Cards use the full width. Previews use the full width of the card.
- A list or a long text stays left-aligned inside a centred block.
- The team card is one column: photo, name, role, text.
- The footer is centred.

## Projects card

One card holds the featured projects. A tab list sits on top. Each project has one panel.

| Behavior | Detail |
| --- | --- |
| Roles | `tablist`, `tab` and `tabpanel`. Each tab names its panel with `aria-controls`. |
| Keys | Arrow left and right move between tabs. Home and End go to the first and last tab. |
| URL | The hash holds the project id. `#bench-bridge` opens the Bench Bridge tab. |
| Height | The panels share one grid cell. The card keeps the height of the tallest panel. |
| No script | All panels show in one column and the tab list is hidden. |

The panel `id` equals the project `id`. A backlink such as `#cheminventory` opens the right tab.

## Motion

Each effect animates `translate`, `transform`, `scale`, `opacity`, `filter`, a color, a shadow or a gradient position. No effect changes layout.

| Effect | Where | Keyframes or rule | Property |
| --- | --- | --- | --- |
| Scroll reveal | Each section head and card | `.reveal-on .reveal` | opacity, translate |
| Hero entrance | Hero | `rise` | opacity, translate, scale, filter |
| Grid drift | Hero art | `drift` | translate |
| Glow drift | Hero art | `glow` | opacity, scale, translate |
| Live dot pulse | Status chip | `pulse` | opacity, scale |
| Steps strip | Bench Bridge panel | `flow-glow` | opacity |
| Steps text | Bench Bridge panel | `flow-ink` | color |
| Tab indicator | Tab list | `.tabs__indicator` | translate |
| Panel crossfade | Project panels | `[data-tabs="live"] .panel` | opacity, translate |
| Card lift | dcurves entry, tiles | `.card--lift:hover` | transform, opacity |
| Arrow glide | Links | `.icon--arrow-right` | translate |
| Press | Buttons, tabs | `:active` | scale |
| Preview zoom | Preview frames | `.frame:hover .frame__image` | scale |
| Demo clip | Preview frames, played by `clips.js` while on screen in the selected panel | `.frame video[data-clip]` | video frames |
| Curve draw | dcurves illustration | `.curve__cover` | translate |
| Pointer glow | Buttons and cards | `--glow` | background image |
| Lit dots | Hero | `.hero__lit` | opacity, mask |
| Edge light | Main hero button | `sheen` | rotate |
| Accent word | Hero heading | `shimmer` | background position |
| Header edge | Header | `[data-scroll="away"] .header` | box shadow, border color |

Hover effects run only where a pointer can hover.

### Reduced motion

A visitor who asks for reduced motion sees a static page.

- The scroll reveal stays off. All content shows.
- The pointer glow does not follow the pointer. The edge light and the lit dots stay off.
- Each animation stops. Each transition lasts 0.01 ms.
- The curve cover is hidden, so the lines show at once.
- Each demo clip stays on its still and never loads. The same holds when the browser asks to save data.
- The tabs still work.

### Without JavaScript

- Each section and each panel shows in full.
- Each preview shows its still. The clip needs the script.
- `theme-init.js` sets the feature classes `tabs-on` and `reveal-on`. Without them the page shows everything.
- A feature class goes after 3 s when its script has not started.

## Tokens

Both tables come from `data/design.json`. Run `npm run build` to refresh them.

<!-- gen:colors -->
| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | #faf8f5 | #171311 | The page |
| `--surface` | #ffffff | #211b18 | A card |
| `--sunken` | #f2ede6 | #1c1613 | A quiet band behind cards |
| `--ink` | #2a211d | #f3ede6 | Text |
| `--ink-2` | #5b4c45 | #c2b5aa | Secondary text |
| `--ink-3` | #74665e | #a1948a | Captions and labels |
| `--line` | rgba(42, 33, 29, 0.12) | rgba(243, 237, 230, 0.12) | A hairline border |
| `--brand` | #674a40 | #d9b8a6 | The Junto brown, for the wordmark |
| `--accent` | #1f6f70 | #7fd0d1 | Links, focus and the primary button |
| `--accent-strong` | #14494a | #a9e3e4 | A link or a button on hover |
| `--accent-soft` | rgba(31, 111, 112, 0.14) | rgba(127, 208, 209, 0.18) | Focus ring and the target highlight |
| `--on-accent` | #ffffff | #0c1f1f | Text on the accent colour |
| `--image-outline` | oklch(0 0 0 / 0.1) | oklch(1 0 0 / 0.1) | A 1 px outline on an image |
| `--glow-tint` | rgba(31, 111, 112, 0.16) | rgba(127, 208, 209, 0.2) | The light that follows the pointer on a card or a quiet button |
| `--glow-on-accent` | rgba(255, 255, 255, 0.3) | rgba(255, 255, 255, 0.34) | The same light on the primary button |
| `--sheen` | rgba(255, 255, 255, 0.9) | rgba(255, 255, 255, 0.8) | The light that circles the main button |
<!-- /gen -->

<!-- gen:tokens -->
| Token | Value |
| --- | --- |
| `--radius-xs` | `6px` |
| `--radius-sm` | `10px` |
| `--radius-md` | `14px` |
| `--radius-lg` | `22px` |
| `--radius-pill` | `999px` |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `24px` |
| `--space-6` | `32px` |
| `--space-7` | `48px` |
| `--space-8` | `64px` |
| `--space-9` | `96px` |
| `--gutter` | `clamp(16px, 5vw, 32px)` |
| `--shell` | `72rem` |
| `--section-gap` | `clamp(72px, 10vw, 120px)` |
| `--grid-12` | `repeat(12, minmax(0, 1fr))` |
| `--touch` | `44px` |
| `--action-min` | `12.5rem` |
| `--font-sans` | `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| `--text-2xs` | `0.6875rem` |
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.875rem` |
| `--text-md` | `1rem` |
| `--text-lg` | `1.125rem` |
| `--text-xl` | `1.25rem` |
| `--title-3` | `clamp(1.375rem, 1.25rem + 0.5vw, 1.625rem)` |
| `--title-2` | `clamp(1.75rem, 1.35rem + 1.7vw, 2.625rem)` |
| `--title-1` | `clamp(2.375rem, 1.5rem + 4.4vw, 4.5rem)` |
| `--motion-fast` | `0.15s` |
| `--motion-base` | `0.2s` |
| `--motion-enter` | `0.3s` |
| `--motion-reveal` | `0.55s` |
| `--motion-stagger` | `70ms` |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `--ease-icon` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--reveal-distance` | `12px` |
| `--glow-size` | `220px` |
| `--motion-glow` | `0.4s` |
| `--motion-follow` | `0.22s` |
| `--sheen-duration` | `6s` |
| `--shimmer-duration` | `7s` |
<!-- /gen -->
