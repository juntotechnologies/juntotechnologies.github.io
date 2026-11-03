# Plan: Hub shows all projects

Status: planned; build 2026-11-03

Branch: `docs/hub-all-projects` (this doc). Build on same PR.

## Goal

juntotechnologies.com = 1 place to see + find all Junto work. ChemInventory = only product in use. Others = concepts being explored + built.

## Proposed page

| Section | Project | Kind + status | Links |
|---|---|---|---|
| In use | ChemInventory | Product, Live | Site, demo (unchanged) |
| Concepts | Bench Bridge | Concept, working demo w/ sample data | Demo, source |
| Concepts | Flexscope | Concept: low-cost single-use ENT scope, iPhone | Site; survey link, see below |
| Concepts | OptoLab | Concept: iPhone macro eye imaging + AI review | New landing page, source |
| Open source | dcurves, bioeq, hct-equity | Unchanged | Unchanged |

## Decisions + recs

| Item | Rec | Why |
|---|---|---|
| Positioning | Keep "Make your lab modern" hero on ChemInventory + Bench Bridge. Add 1 line: also exploring low-cost clinical imaging | Scope + eye imaging aren't lab tools; hero alone misdescribes them |
| OptoLab landing page | Yes: static page at `optolab.juntotechnologies.com`, in OptoLab repo, same 1-screen pattern as Bench Bridge | Hub rule: each project has own site; repo README alone doesn't match |
| OptoLab repo home | Stay under `shaunporwal` for now | Transfer changes URLs; not needed for Pages + subdomain |
| Survey link | Add only after cousin checks clips. Label "For ENT clinicians" | Public link draws non-ENT answers |
| Survey analysis | Before link goes public: verdict counts ENT roles only (flexscope repo) | Today `minRaters` + accuracy count every session |
| Medical wording | Each clinical card + page: "Concept. Not a medical device. Not for patient care." No accuracy or diagnostic claims | Stop-list: medical/regulatory claims |
| Bench Bridge kind | Keep rule: say demo w/ sample data | Existing hub rule |

## Needs Shaun

- [ ] OptoLab eye images + demo video (`docs/assets/`, `arcus-senilis.jpg`, `eye-error.jpg`): whose eyes; OK on a public marketing page?
- [ ] Add DNS CNAME `optolab` → `shaunporwal.github.io` at Squarespace Domains
- [ ] Read final public copy on the Netlify preview before merge

## Implementation Checklist

Hub (this repo):

- [ ] `data/schema/`: add kind `Concept` + section grouping
- [ ] `data/projects.json`: Flexscope + OptoLab; Bench Bridge moves to Concepts
- [ ] `data/site.json`: hero body, description, 1 line on concepts
- [ ] Previews + clips: `npm run previews`, `npm run clips`
- [ ] `docs/projects.md` evidence per claim, checked vs each repo
- [ ] `data/upstream.json` + `data/discovery.json`: new projects
- [ ] Backlinks: Flexscope + OptoLab pages link back to hub
- [ ] OG image: `npm run og`

OptoLab repo:

- [ ] Static landing page + Pages + custom domain
- [ ] Wording matches README; concept + not-for-care line

Flexscope repo:

- [ ] Analysis: ENT roles only for verdict; test
- [ ] Survey link added to Flexscope site + hub after cousin check

## Rules this must keep

- No word "software" in public copy (`tools/checks/brand.json`), no price, no Part 11 claim, no customer name
- "Source on GitHub", not "open source", w/o open license: Flexscope + OptoLab licenses unchecked; OptoLab has none on GitHub
- Cards fit iPhone 15 Pro screen: `npm run check:fit`

## Smoke Tests

- [ ] **Find everything from the hub** · as visitor, Netlify preview, 360-1440 px
  1. Open home.
  2. Tell which project is in use vs concept.
  3. Open each project + come back.

  **Pass if:**
  - ChemInventory alone reads as in use
  - Each concept card opens its site + shows the concept line
  - No sideways scroll; cards fit

## Non-Goals

- Redesign, new products, pricing.
