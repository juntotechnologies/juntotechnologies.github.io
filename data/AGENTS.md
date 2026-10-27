# data/

The JSON sources of truth for the hub. `tools/build.mjs` derives every other file from them.

## Rules
- Change a fact here. Never change a copy of it.
- Each file has a schema in `data/schema/`. Run `npm run check` after a change.
- Write colors as `#rrggbb` in `projects.json`. `design.json` also allows `rgba()` and `oklch()`.
- A project `id` must not change. Backlinks use it as the card address.
