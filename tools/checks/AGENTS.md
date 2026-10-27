# tools/checks/

Commands that exit with code 1 when something drifts.

| File | Fails when | Needs network |
| --- | --- | --- |
| `drift.mjs` | A generated file differs from its source. It keeps the sitemap date that is on disk. | No |
| `agents.mjs` | A directory has no `AGENTS.md`. | No |
| `upstream.mjs` | The hub disagrees with a project's own source. | Yes |
| `fit.mjs` | A card is taller than the screen below the header on the device. `fit.json` names both. | No (uses a browser) |
| `links.mjs` | A link in the data does not answer. | Yes |

## Rules
- `fitBudget.mjs` holds the pure steps of the fit check. `fit.json` names the device and the cards.
- `brand.json` names the banned brand words and the files to scan. `tests/brand.test.mjs` reads it.
- `upstreamHandlers.mjs` holds one pure handler for each check in `data/upstream.json`.
- Print one line for each fault. Name the file or project.
