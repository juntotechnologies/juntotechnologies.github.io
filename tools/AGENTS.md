# tools/

Node scripts that build, check and capture. They run on a developer machine. They never ship in the page.

## Layout
| Path | Job |
| --- | --- |
| `build.mjs` | Writes the generated files. |
| `files.mjs` | Maps the data to generated file contents. Pure. |
| `docs.mjs` | Swaps a `<!-- gen:name -->` block in Markdown. |
| `capturePreviews.mjs` | Saves a preview image of each featured project. |
| `data/` | Loads and validates the data files. |
| `render/` | Pure functions that write HTML, CSS and doc tables. |
| `checks/` | Commands that fail when something drifts. |
| `eslint/` | The local lint rule. |

## Rules
- One job for each function. No nested functions or arrow callbacks. Use a named function and `.bind`.
- Keep rendering pure. Reading and writing files stays in `build.mjs`, `drift.mjs` and `capturePreviews.mjs`.
- Pass dependencies in as arguments.
