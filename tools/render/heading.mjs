/** Sets one word of a heading apart, so the page can give that word its own look. */
import { escapeHtml } from "./escape.mjs"

const ACCENT_CLASS = "hero__accent"

function wrap(word) {
  return `<span class="${ACCENT_CLASS}">${escapeHtml(word)}</span>`
}

/** The heading as HTML. The last match of the word gets the accent class. A missing word leaves the heading plain. */
export function emphasize(heading, word) {
  const at = word ? heading.lastIndexOf(word) : -1
  if (at < 0) return escapeHtml(heading)
  const after = heading.slice(at + word.length)
  return `${escapeHtml(heading.slice(0, at))}${wrap(word)}${escapeHtml(after)}`
}
