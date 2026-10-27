# Projects

`data/projects.json` lists every project on the hub. The table below comes from that file. Run `npm run build` to refresh it.

<!-- gen:projects -->
| Project | Tier | Kind | Status | Primary link | Tab |
| --- | --- | --- | --- | --- | --- |
| ChemInventory | featured | Product | Live | https://cheminventory.co/ | first-party |
| Bench Bridge | featured | Demo | Sample data | https://bench-bridge.juntotechnologies.com/ | first-party |
| dcurves | more | Python package | Apache-2.0 license | https://github.com/MSKCC-Epi-Bio/dcurves | external |
| bioeq | more | Python package | MIT license | https://github.com/juntotechnologies/bioeq | external |
| hct-equity | more | Research code | Exploratory | https://github.com/juntotechnologies/hct-equity | external |
<!-- /gen -->

## Tiers

| Tier | Shown as | Fields it needs |
| --- | --- | --- |
| `featured` | A tab and a panel with a preview of the project's own look | `look`, `preview`, `capture`, `backlink`, `points`, `note` |
| `more` | A tile in "Open source" | The common fields only |
| `more` with `lead` | The large entry at the top of "Open source", with an illustration | `points`, `note`, `illustration` |

Optional fields: `live` shows a pulsing dot in the status chip. `flow` shows the steps strip. `instruments` gives the count in the first fact.

## Rules for the public site

- Name no prospect and no customer. A public case study may name a customer only with consent.
- State no price.
- Make no claim of Part 11 compliance.
- Say what each project is. ChemInventory is live software. Bench Bridge is a demo with sample data and a mock LIMS.
- Write "Source on GitHub" for Bench Bridge. The repository has no license, so "open source" is wrong.
- Use "open source" only for a project that has an open license. The evidence rows below name each license.
- State no star count. State a download count only for dcurves, from `data/downloads.json`, with its source and date.
- Check each claim against the project's own repository before you publish it.

## Evidence

Each row names a claim in `data/projects.json` and the file that supports it. Checked on 2026-10-27.

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
| `bench-bridge` steps strip and instrument count | The pipeline strip in the live demo shows Capture, Parse, Normalize, Map and Deliver. The strip on the hub shows the first, second and last step. The count comes from `instruments`. |
| `dcurves` description and license | `gh api repos/MSKCC-Epi-Bio/dcurves`: Python package for decision curve analysis, Apache-2.0 license. The PyPI page lists the same license. |
| `dcurves` points | Its README: binary and survival outcomes, net benefit, interventions avoided, `pip install dcurves`. `dcurves/plot_graphs.py` plots net benefit against the threshold probability, with the reference lines "all" and "none". |
| `dcurves` documentation link | `https://mskcc-epi-bio.github.io/dcurves/` answers with HTTP 200. |
| `dcurves` DCA website link | `https://mskcc-epi-bio.github.io/decisioncurveanalysis/` answers with HTTP 200 and the title "DCA: Homepage". The repository `MSKCC-Epi-Bio/decisioncurveanalysis` lists `decisioncurveanalysis.org` as its homepage, and that address redirects with HTTP 301 to the Pages address. Shaun is the top contributor of the repository (`gh api repos/MSKCC-Epi-Bio/decisioncurveanalysis/contributors`). |
| `dcurves` download count | `data/downloads.json`. The count is the total on the pepy.tech badge for the dcurves package on PyPI. The card shows it rounded down to the thousand, with the source and the date. The monthly workflow `.github/workflows/refresh-downloads.yml` refreshes it. `npm run downloads` still works by hand. |
| `dcurves` note | Shaun is the top contributor of the repository, and his biography on the hub says he created it. The repository sits in the `MSKCC-Epi-Bio` organization. |
| `dcurves` illustration | A drawing of the shape of a decision curve. It holds no data. The page labels it "Illustration only. Not real data." |
| `bioeq` | Repository `bioeq`. MIT license. Modules `crossover2x2`, `parallel` and `replicate_crossover`. |
| `hct-equity` | Repository `hct-equity`. MIT license. Its README says the work is exploratory, not peer reviewed, and uses synthetic Kaggle data. |

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
