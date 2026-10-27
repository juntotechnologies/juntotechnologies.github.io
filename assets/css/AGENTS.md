# assets/css/

## Rules
- Use `var(--token)` for color, radius, shadow and motion. A raw color fails a test.
- Name each property in a `transition`. Never write `transition: all`.
- Animate only `translate`, `transform`, `scale`, `opacity`, `filter` and color properties. A test checks each `transition-property`.
- Put each hover effect in `@media (hover: hover) and (pointer: fine)`.
- Hide content only under `.reveal-on` or `.tabs-on`. Without them the page must show everything.
- Honor `prefers-reduced-motion`.
- Each touch target has a hit area of at least `var(--touch)`. A small link adds the area with a pseudo-element.
