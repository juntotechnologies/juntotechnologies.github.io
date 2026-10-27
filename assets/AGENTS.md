# assets/

The files the browser loads. They ship as they are. There is no bundler.

## Layout
| Path | Job |
| --- | --- |
| `css/tokens.css` | Generated from `data/design.json`. Never edit it. |
| `css/site.css` | The styles. Colors come from tokens only. |
| `js/theme-init.js` | Sets the theme before first paint. Classic script. |
| `js/theme.js` | The theme toggle. ES module. |
| `img/projects/` | Preview images. `npm run previews` writes them. |
