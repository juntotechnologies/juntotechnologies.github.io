/** Inline markup for data text: **bold** and [label](https://link). All other text is escaped. */
import { escapeHtml } from "./escape.mjs"
import { externalAttributes } from "./links.mjs"

const BOLD = /\*\*([^*]+)\*\*/g
const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g

function bold(_match, text) {
  return `<strong>${text}</strong>`
}

function link(_match, label, href) {
  return `<a href="${href}"${externalAttributes()}>${label}</a>`
}

export function inlineMarkup(text) {
  return escapeHtml(text).replace(BOLD, bold).replace(LINK, link)
}
