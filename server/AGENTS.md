# server/

The dev server. It serves the repo root as static files. Netlify serves the live site, so this code never ships.

## Domain
- `npm run dev` binds to all interfaces and prints one link: the tailnet link.
- The tailnet name comes from `tailscale status` at start. Never write it in a file.
- `resolveFile` must refuse a path that leaves the repo root.

## Rules
- One job for each function. No nested functions.
- Add a test in `tests/` for each change to path or type handling.
