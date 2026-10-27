# Linking rules

The hub links to each Junto project. Each project site links back to the hub.

## Terms

| Term | Meaning |
| --- | --- |
| Hub | This site, `juntotechnologies.com`. |
| First-party link | A link to a site that Junto runs. `scope` is `first-party` in `data/projects.json`. |
| External link | A link to any other site, such as GitHub. `scope` is `external`. |
| Backlink | A link from a project site to its card on the hub. |

## Where each link opens

| Link | Opens in | Reason |
| --- | --- | --- |
| First-party link | Same tab | The visitor moves from one Junto site to another. The back button returns to the hub. |
| Backlink | Same tab | Same reason. The visitor returns to the hub card. |
| In-page link, such as `#projects` | Same tab | The page scrolls. |
| External link | New tab | The hub stays open. |
| `mailto:` link | Mail app | The browser decides. |

## External links

Each external link has three parts:

1. `target="_blank"` and `rel="noopener noreferrer"`.
2. An arrow icon after the label.
3. Hidden text "(opens in a new tab)" for screen readers.

`tools/render/links.mjs` writes these parts. A first-party link has none of them.

## Deep links

Each project card has an `id`. The `id` equals the project `id` in `data/projects.json`.

- `https://juntotechnologies.com/#cheminventory` scrolls to the ChemInventory card.
- `https://juntotechnologies.com/#bench-bridge` scrolls to the Bench Bridge card.
- The target card gets a highlight through the CSS `:target` rule.

A project `id` must not change. A change breaks every backlink to that card.

## Backlink rules

- Use the address in the table in [backlinks.md](backlinks.md).
- Open the hub in the same tab. Do not add `target`.
- Keep the backlink small. It must not compete with the project's own navigation.
- Style the backlink with the project's own tokens. Do not copy hub colors into a project.
- Put the label and address in the project's labels file. Do not write them in markup.

## Add a project

1. Add an entry to `data/projects.json`. Follow `data/schema/projects.schema.json`.
2. Run `npm run previews`. It saves a preview image for each featured project.
3. Run `npm run build`. It writes `index.html`, `assets/css/tokens.css` and the generated doc blocks.
4. Run `npm run check`. Fix each failure.
5. Add the backlink to the project site. Use the entry in [backlinks.md](backlinks.md).
6. Add the evidence for each claim to [projects.md](projects.md).
