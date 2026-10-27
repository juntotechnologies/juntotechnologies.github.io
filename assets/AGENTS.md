# assets/

The files the browser loads. They ship as they are. There is no bundler.

## Layout
| Path | Job |
| --- | --- |
| `css/tokens.css` | Generated from `data/design.json`. Never edit it. |
| `css/site.css` | The styles. Colors come from tokens only. |
| `js/theme-init.js` | Sets the theme and the feature classes before first paint. Classic script. |
| `js/theme.js` | The theme toggle. ES module. |
| `js/tabs.js` | The project tabs: hash, keys and selection. ES module. |
| `js/reveal.js` | The scroll reveal. ES module. |
| `img/og.png` | The social image. `npm run og` writes it. |
| `img/projects/` | Preview images. `npm run previews` writes them. |
