# assets/js/

## Rules
- The page must work with JavaScript off. Each script only adds a feature: the theme toggle, the tabs, the scroll reveal, the pointer glow, the demo clips or the dcurves slider.
- With JavaScript off, every panel and every section must show in full.
- A script sets `data-tabs` or `data-reveal` when it starts. `theme-init.js` drops the feature class when that mark is missing after 3 s.
- Wrap each `localStorage` call in `try`/`catch`. Storage can be blocked.
- No nested functions. Use a named function and `.bind`.
- Keep pure maths in its own module, such as `decision-curve.js`. The build imports it, so the page and the script draw the same curves. Such a module touches no DOM.
