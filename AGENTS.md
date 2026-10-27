# Junto Technologies hub

The public front page of Junto Technologies, at `https://juntotechnologies.com/`. It lists the Junto projects and links to each one. It is static HTML. Netlify serves the repo root.

The global rules in `~/AGENTS.md` apply here. This file adds the rules for this repo.

## Commands

| Command | Job |
| --- | --- |
| `npm run dev` | Serve the repo. It prints the tailnet link only. |
| `npm run build` | Write `index.html`, `assets/css/tokens.css` and the generated doc blocks from `data/`. |
| `npm run check` | Lint, test and check for stale generated files. Run it before every commit. |
| `npm run downloads` | Read the dcurves download count from its badge and write `data/downloads.json`. Needs network. The monthly workflow `.github/workflows/refresh-downloads.yml` runs it. Run it by hand to refresh early. |
| `npm run check:fit` | Fail when a card in `tools/checks/fit.json` is taller than an iPhone 15 Pro screen below the header. Needs the Playwright browsers. |
| `npm run previews` | Capture the preview image of each featured project from its live site. |
| `npm run og` | Render the social image `assets/img/og.png` from the data. |
| `npm run check:upstream` | Compare the hub with each project's own source. Needs network. |
| `npm run check:links` | Check that each link answers. Needs network. |

## Source of truth

| Fact | Lives in | Derived into |
| --- | --- | --- |
| Page text, contact, team, nav | `data/site.json` | `index.html` |
| Projects, links, look, backlinks | `data/projects.json` | `index.html`, `docs/projects.md`, `docs/backlinks.md` |
| Download counts, with source and date | `data/downloads.json` | `index.html` (the figure on the dcurves card) |
| Colors, shadows, radii, spacing, type, motion | `data/design.json` | `assets/css/tokens.css`, the token tables in `docs/design.md` |
| Crawlers, agent rules, social card | `data/discovery.json` | `robots.txt`, `sitemap.xml`, `llms.txt`, `agents.txt`, `.well-known/agents.json`, the head of `index.html` |
| Upstream checks | `data/upstream.json` | `tools/checks/upstream.mjs` |

Never edit a generated file. Change the source and run `npm run build`.

## Rules for the public site

- Name no prospect and no customer. A public case study may name a customer only with consent.
- State no price. Make no claim of Part 11 compliance.
- Say what each project is. Bench Bridge is a demo with sample data. Write "Source on GitHub", not "open source".
- Use "open source" only for a project with an open license.
- State no star count. State a download count only for dcurves. It comes from `data/downloads.json` and shows its source and date. The monthly workflow `.github/workflows/refresh-downloads.yml` refreshes it. `npm run downloads` still works by hand. Never state a count in a discovery file or in the structured data.
- On an iPhone 15 Pro screen, each card in `tools/checks/fit.json` must fit the screen below the sticky header. Run `npm run check:fit` after a change to a card or to its CSS.
- Never write the email address in a discovery file or in the structured data.
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

- Work on a branch. Open a pull request. Merge it after `npm run check` and `npm run check:fit` pass, the preview walk at 360, 390, 820 and 1440 px passes, and no review is open. Shaun authorized merges to `main` for this site on 2026-10-27. Walk the live site after the merge.
- Never merge or push to `main` for a change that touches the ChemInventory app or its demo. A production application serves other users, so Shaun reviews and merges that change. The marketing site `cheminventory.co` (repo `chem-inventory-site`) is free to publish: Shaun said so on 2026-10-27. A hub card about ChemInventory is hub work and follows the rule above.
- One exception to the pull request rule: the workflow `.github/workflows/refresh-downloads.yml` pushes the monthly download refresh straight to `main`. Shaun approved this on 2026-10-27. A count refresh is low risk and easy to undo.
- Netlify builds a preview for each pull request. Walk the preview before you report the work done.
- Netlify publishes the repo root. The discovery files sit at the root, so they answer at `/robots.txt` and the other root addresses.
- The live site changes after a merge. The `CNAME` file is from GitHub Pages and has no effect on Netlify.
