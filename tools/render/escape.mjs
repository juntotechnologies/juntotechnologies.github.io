/** Escapes text for HTML, so data never becomes markup by accident. */

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

function entity(char) {
  return ENTITIES[char]
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, entity)
}
