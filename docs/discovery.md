# Discovery files

Search engines and agents read these files. `npm run build` writes each one from `data/`.

## Files

| File | Job | Source |
| --- | --- | --- |
| `robots.txt` | Allows each crawler, AI crawlers included. Names the sitemap. | `data/discovery.json` |
| `sitemap.xml` | Lists the canonical address and the date of the last commit. | `data/site.json`, git |
| `llms.txt` | A short Markdown summary for language models. | `data/site.json`, `data/projects.json` |
| `agents.txt` | What an agent may and may not do here. | `data/discovery.json` |
| `.well-known/agents.json` | The same rules as JSON. | `data/discovery.json` |
| `assets/img/og.png` | The social image, 1200 by 630 pixels. `npm run og` writes it. | `data/site.json`, `data/design.json` |
| `index.html` head | Title, description, canonical link, theme colors, Open Graph tags, Twitter tags and JSON-LD. | `data/site.json`, `data/projects.json`, `data/discovery.json` |

## Where the files live

Netlify publishes the repo root. A file in `public/` is served at `/public/...`. For that reason each discovery file sits at the repo root.

After a deploy, check each address on the deploy preview:

| Address | Content type |
| --- | --- |
| `/robots.txt` | `text/plain` |
| `/sitemap.xml` | `application/xml` or `text/xml` |
| `/llms.txt` | `text/plain` |
| `/agents.txt` | `text/plain` |
| `/.well-known/agents.json` | `application/json` |

## Structured data

The JSON-LD holds one `Organization`, one `WebSite` and one `SoftwareApplication` for each featured project.

- It states no price, no rating, no star count and no download count.
- It names no prospect and no customer.
- It holds no email address. The contact link is the booking link.

## Rules

- Never write the email address in a discovery file. A test fails when it appears.
- The sitemap date is the one value that git sets. `drift.mjs` keeps the date on disk and compares the rest.
- Run `npm run og` after a change to the site name, the hero heading, the description or the colors.
- Add a crawler to `data/discovery.json`. Never edit `robots.txt`.
