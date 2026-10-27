# assets/js/

## Rules
- The page must work with JavaScript off. Each script only adds the theme toggle, the tabs or the scroll reveal.
- With JavaScript off, every panel and every section must show in full.
- A script sets `data-tabs` or `data-reveal` when it starts. `theme-init.js` drops the feature class when that mark is missing after 3 s.
- Wrap each `localStorage` call in `try`/`catch`. Storage can be blocked.
- No nested functions. Use a named function and `.bind`.
