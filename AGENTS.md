# Junto Technologies hub

The public front page of Junto Technologies, at `https://juntotechnologies.com/`. It lists the Junto projects and links to each one. It is static HTML. Netlify serves the repo root.

The global rules in `~/AGENTS.md` apply here. This file adds the rules for this repo.

## Commands

| Command | Job |
| --- | --- |
| `npm run dev` | Serve the repo. It prints the tailnet link only. |
| `npm run build` | Write `index.html`, `assets/css/tokens.css` and the generated doc blocks from `data/`. |
| `npm run check` | Lint, test and check for stale generated files. Run it before every commit. |
| `npm run previews` | Capture the preview image of each featured project from its live site. |
| `npm run check:upstream` | Compare the hub with each project's own source. Needs network. |
| `npm run check:links` | Check that each link answers. Needs network. |

## Source of truth

| Fact | Lives in | Derived into |
| --- | --- | --- |
| Page text, contact, team, nav | `data/site.json` | `index.html` |
| Projects, links, look, backlinks | `data/projects.json` | `index.html`, `docs/projects.md`, `docs/backlinks.md` |
| Colors, shadows, radii, motion | `data/design.json` | `assets/css/tokens.css` |
| Upstream checks | `data/upstream.json` | `tools/checks/upstream.mjs` |

Never edit a generated file. Change the source and run `npm run build`.

## Rules for the public site

- Name no prospect and no customer. A public case study may name a customer only with consent.
- State no price. Make no claim of Part 11 compliance.
- Say what each project is. Bench Bridge is a demo with sample data. Write "Source on GitHub", not "open source".
- Check each claim against the project's repository. Record the evidence in `docs/projects.md`.
- Never write the tailnet name in a file. `server/tailnet.mjs` reads it from `tailscale status`.
- The hub has no login. The agent sign-in rule does not apply.
- `.npmrc` sets `loglevel=silent`, so `npm run dev` prints only the tailnet link. A failed command still exits with a non-zero code.

## Links

First-party links open in the same tab. External links open in a new tab. See `docs/linking.md`.

## Code

- Each file starts with one `/** ... */` line that states its job.
- ESLint enforces the limits in `code-shape.json`. It also bans nested functions.
- Colors in CSS come from tokens. A raw color in `site.css` fails a test.
- `data/schema/` holds the schemas. `tools/data/load.mjs` validates each file once.

## Delivery

- Work on a branch. Open a pull request. Only Shaun merges.
- Netlify builds a preview for each pull request. Walk the preview before you report the work done.
- The live site changes after a merge. The `CNAME` file is from GitHub Pages and has no effect on Netlify.
