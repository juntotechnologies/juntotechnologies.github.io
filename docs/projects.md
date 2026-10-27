# Projects

`data/projects.json` lists every project on the hub. The table below comes from that file. Run `npm run build` to refresh it.

<!-- gen:projects -->
| Project | Tier | Kind | Status | Primary link | Tab |
| --- | --- | --- | --- | --- | --- |
| ChemInventory | featured | Product | Live | https://cheminventory.co/ | first-party |
| Bench Bridge | featured | Demo | Sample data | https://bench-bridge.juntotechnologies.com/ | first-party |
| bioeq | more | Python package | MIT license | https://github.com/juntotechnologies/bioeq | external |
| hct-equity | more | Research code | Exploratory | https://github.com/juntotechnologies/hct-equity | external |
<!-- /gen -->

## Tiers

| Tier | Shown as | Fields it needs |
| --- | --- | --- |
| `featured` | A card with a preview of the project's own look | `look`, `preview`, `capture`, `backlink`, `points`, `note` |
| `more` | A row in "Code and research" | The common fields only |

## Rules for the public site

- Name no prospect and no customer. A public case study may name a customer only with consent.
- State no price.
- Make no claim of Part 11 compliance.
- Say what each project is. ChemInventory is live software. Bench Bridge is a demo with sample data and a mock LIMS.
- Write "Source on GitHub" for Bench Bridge. The repository has no license, so "open source" is wrong.
- Check each claim against the project's own repository before you publish it.

## Evidence

Each row names a claim in `data/projects.json` and the file that supports it. Checked on 2026-10-26.

| Claim location | Evidence |
| --- | --- |
| `cheminventory` points: chemicals, locations, orders, batch documents | Private repository `chem-inventory`. Server modules `inventory`, `orders` and `documents`. The demo table has a Location column. |
| `cheminventory` points: change history with user and time | `changeHistory` in `shared/platform/schema.ts`. It stores `userId` and `changeDate`. |
| `cheminventory` points: roles admin, manager, chemist | `shared/platform/access-control.ts`. |
| `cheminventory` note: demo resets | The banner on `demo.cheminventory.co`. |
| `cheminventory` look | `app/color-palette.css` in `chem-inventory-site`. `npm run check:upstream` compares it. |
| `bench-bridge` instruments | `shared/data/devices.json` in `bench-bridge`. `npm run check:upstream` compares it. |
| `bench-bridge` look | `design/tokens.json` in `bench-bridge`. `npm run check:upstream` compares it. |
| `bench-bridge` points and note | The live demo. Each run shows the capture, parse, normalize, map and deliver steps. The bridge kit drawings are concept drawings. |
| `bioeq` | Repository `bioeq`. MIT license. Modules `crossover2x2`, `parallel` and `replicate_crossover`. |
| `hct-equity` | Repository `hct-equity`. Its README says the work is exploratory, not peer reviewed, and uses synthetic Kaggle data. |

## Left out on purpose

| Item | Reason |
| --- | --- |
| `ClinPharmStats` | Its site does not link to Junto. Shaun decides. |
| A client site | Consent to list it is unknown. |
| Forks, tools and private code | They are not Junto products. |

## Checks

| Command | What it checks |
| --- | --- |
| `npm run check` | Lint, tests and generated files. It needs no network. |
| `npm run check:upstream` | The hub colors and instrument names against each project's own source. |
| `npm run check:links` | That each link in the data answers with a success code. |
