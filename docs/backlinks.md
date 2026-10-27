# Backlinks

Each featured project site links back to its card on the hub. The table below comes from `data/projects.json`. Run `npm run build` to refresh it.

<!-- gen:backlinks -->
| Project | Link to the hub card | Wording | Placement |
| --- | --- | --- | --- |
| ChemInventory | `https://juntotechnologies.com/#cheminventory` | A Junto Technologies project | Footer of cheminventory.co, below the copyright line. |
| Bench Bridge | `https://juntotechnologies.com/#bench-bridge` | Junto Technologies | Top bar, left of the fleet card. It shows an arrow and the words. On a narrow window it shows the arrow only. |
<!-- /gen -->

Each entry below holds the label and the address. The project copies its entry into its own labels file.

<!-- gen:backlink-entries -->
```json
{
  "cheminventory": {
    "label": "A Junto Technologies project",
    "href": "https://juntotechnologies.com/#cheminventory"
  },
  "bench-bridge": {
    "label": "Junto Technologies",
    "href": "https://juntotechnologies.com/#bench-bridge"
  }
}
```
<!-- /gen -->

Rules for the links are in [linking.md](linking.md).

## Status

| Project | Where the backlink is made | State |
| --- | --- | --- |
| ChemInventory | [Pull request 4 in `juntotechnologies/chem-inventory-site`](https://github.com/juntotechnologies/chem-inventory-site/pull/4) | Open. Not merged. |
| Bench Bridge | Not made. Proposal below. | Shaun decides. |

## ChemInventory

The pull request adds `links.hub` and a label to `UI_LABELS` in `app/ui-labels.tsx`. It renders a link in the footer of `app/page.tsx`. The link opens in the same tab.

## Bench Bridge proposal

This hub change does not edit `bench-bridge`. The steps below are the proposal.

Result: a small link at the left of the fleet card in the top bar. It shows an arrow and the words. Below 700 px wide, it shows the arrow only. The link keeps its accessible name.

1. Copy the `bench-bridge` entry above into `shared/data/copy.json` under the key `hub`.
2. Add the arrow path to `PATHS` in `client/ui/icons.ts`:

```ts
back: "M19 12H5M11 6l-6 6 6 6",
```

3. Add the link to `client/ui/header.ts` and put it first in `.topbar-end`:

```ts
function hubLink(): HTMLElement {
  const text = h("span", { class: "hub-link-text" }, [copy.hub.label])
  const attrs = { href: copy.hub.href, "aria-label": `Back to ${copy.hub.label}` }
  return h("a", { class: "hub-link", attrs }, [svg(icon("back"), "hub-link-icon"), text])
}
```

```ts
h("div", { class: "topbar-end" }, [hubLink(), fleetCard(clock), toggle])
```

4. Add the style to `client/styles.css`, after `.theme-toggle:hover`. It uses existing tokens only:

```css
.hub-link { display: flex; align-items: center; gap: 8px; min-height: var(--touch); padding: 0 14px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--panel); color: var(--ink-2); font: 500 11px var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; }
.hub-link:hover { color: var(--accent); }
@media (max-width: 699px) { .hub-link-text { display: none; } }
```

5. Add a test that the link points to `copy.hub.href` and has no `target` attribute.

Checked on 2026-10-27 in a scratch copy of `bench-bridge`: `tsc` and ESLint pass, all 219 tests pass, and the link shows at 1440 px and 390 px wide. The breakpoint must be `699px`. A test in `bench-bridge` allows only the sizes in `design/layout.json`.
