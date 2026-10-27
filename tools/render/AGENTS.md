# tools/render/

Pure functions. Each takes data and returns a string. They read no file and use no network.

## Rules
- Escape each data value with `escape.mjs` before it enters HTML.
- Write links only through `links.mjs`, so the tab rule holds.
- Write icons only through `icons.mjs`.
- Add a test in `tests/` for each new renderer.
