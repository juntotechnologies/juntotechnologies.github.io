/** Link rules. First-party links open in the same tab. External links open in a new tab and carry rel. */
import { escapeHtml } from "./escape.mjs"
import { icon } from "./icons.mjs"

const NEW_TAB = ' target="_blank" rel="noopener noreferrer"'
const NEW_TAB_NOTE = '<span class="visually-hidden"> (opens in a new tab)</span>'

export function externalAttributes() {
  return NEW_TAB
}

export function attributesFor(scope) {
  return scope === "external" ? NEW_TAB : ""
}

function endMark(scope) {
  return scope === "external" ? `${icon("arrow-up-right")}${NEW_TAB_NOTE}` : icon("arrow-right")
}

/** One link as an anchor. The scope of the link sets the tab rule and the end mark: an arrow right, or an arrow out with a screen-reader note. */
export function anchor(link, className) {
  const label = escapeHtml(link.label)
  return `<a class="${className}" href="${escapeHtml(link.href)}"${attributesFor(link.scope)}>${label}${endMark(link.scope)}</a>`
}
