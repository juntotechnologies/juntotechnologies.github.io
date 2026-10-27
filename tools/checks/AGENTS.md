# tools/checks/

Commands that exit with code 1 when something drifts.

| File | Fails when | Needs network |
| --- | --- | --- |
| `drift.mjs` | A generated file differs from its source. It keeps the sitemap date that is on disk. | No |
| `agents.mjs` | A directory has no `AGENTS.md`. | No |
| `upstream.mjs` | The hub disagrees with a project's own source. | Yes |
| `links.mjs` | A link in the data does not answer. | Yes |

## Rules
- `upstreamHandlers.mjs` holds one pure handler for each check in `data/upstream.json`.
- Print one line for each fault. Name the file or project.
