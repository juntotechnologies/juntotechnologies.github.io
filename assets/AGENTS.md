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
| `js/glow.js` | Writes the pointer position onto buttons, cards and the hero. CSS draws the light. ES module. |
| `js/geometry.js` | Pure helpers for `glow.js`. `tests/geometry.test.mjs` tests them. |
| `js/scroll-state.js` | Sets `data-scroll` to `top` or `away` on the root. The header reads it. ES module. |
| `js/clips.js` | Plays each demo clip only while it is on screen. It leaves the still for reduced motion and data saving. ES module. |
| `video/` | Demo clips. `npm run clips` writes them. |
| `img/og.png` | The social image. `npm run og` writes it. |
| `img/projects/` | Preview images. `npm run previews` writes them. |
