/** The head of a section: one heading and one sentence. It fades in with the section. */
import { escapeHtml } from "./escape.mjs"

export function sectionHead(section, id) {
  const title = `<h2 id="${id}" class="section__title">${escapeHtml(section.heading)}</h2>`
  return `<div class="section__head reveal">${title}<p class="section__body">${escapeHtml(section.body)}</p></div>`
}
