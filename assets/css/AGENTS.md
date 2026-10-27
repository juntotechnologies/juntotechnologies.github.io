# assets/css/

## Rules
- Use `var(--token)` for color, radius, shadow and motion. A raw color fails a test.
- Name each property in a `transition`. Never write `transition: all`.
- Animate only `scale`, `opacity`, `filter` and color properties.
- Honor `prefers-reduced-motion`.
- Each touch target has a hit area of at least `var(--touch)`. A small link adds the area with a pseudo-element.
