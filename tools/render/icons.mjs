/** Inline SVG icons. Each icon takes its colour from the text colour around it. */

const ATTRIBUTES = 'width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'

const PATHS = {
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
}

/** The class `icon--<name>` lets CSS move one icon, such as the arrow that glides on hover. */
export function icon(name) {
  return `<svg class="icon icon--${name}" ${ATTRIBUTES}>${PATHS[name]}</svg>`
}
