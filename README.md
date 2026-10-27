# Junto Technologies

The public hub for Junto Technologies: `https://juntotechnologies.com/`.

It shows each Junto project as a card that previews the project's own look. The hub itself is a calm, neutral frame.

## Run it

```bash
npm install
npm run dev
```

`npm run dev` prints one link, the tailnet link. Open it from any device on the tailnet.

## Change it

| To change | Edit | Then run |
| --- | --- | --- |
| Page text, contact, team | `data/site.json` | `npm run build` |
| A project or its links | `data/projects.json` | `npm run build` |
| A color, radius or motion value | `data/design.json` | `npm run build` |
| A preview image | none | `npm run previews` |

Never edit `index.html`, `assets/css/tokens.css` or a generated block in `docs/`. The build writes them.

Run `npm run check` before each commit.

## Docs

| File | Content |
| --- | --- |
| [docs/linking.md](docs/linking.md) | Where links open, deep links, how to add a project |
| [docs/backlinks.md](docs/backlinks.md) | The link from each project site back to the hub |
| [docs/projects.md](docs/projects.md) | Project list, public-site rules, evidence for each claim |

## Deploy

Netlify serves the repo root at `juntotechnologies.com`. It builds a preview for each pull request. Check the preview before a merge. The live site changes after the merge.

## License

See [LICENSE](LICENSE).
