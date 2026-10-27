# data/

The JSON sources of truth for the hub. `tools/build.mjs` derives every other file from them.

## Rules
- Change a fact here. Never change a copy of it.
- Each file has a schema in `data/schema/`. Run `npm run check` after a change.
- Write colors as `#rrggbb` in `projects.json`. `design.json` also allows `rgba()` and `oklch()`.
- A project `id` must not change. Backlinks use it as the panel address.
- `downloads.json` holds a measured count, its source and its date. Change it only with `npm run downloads`. A count has one source and one method.
- `discovery.json` holds the crawlers, the agent rules and the social card. Never write an email address in it.
