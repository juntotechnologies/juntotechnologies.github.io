/** Parts that the project panels and the open source entries share: the status chip, the note and the buttons. */
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"

function statusDot(project) {
  return project.live ? '<span class="chip__dot" aria-hidden="true"></span>' : ""
}

/** One line: the kind of project, then its status. A live project shows a pulsing dot. */
export function statusChip(project) {
  const kind = `<span class="chip__kind">${escapeHtml(project.kind)}</span>`
  return `<p class="chip">${kind}<span class="chip__status">${statusDot(project)}${escapeHtml(project.status)}</span></p>`
}

export function noteLine(text) {
  return `<p class="note">${escapeHtml(text)}</p>`
}

function secondary(link) {
  return anchor(link, "button button--quiet")
}

/** One primary button and the secondary buttons. They share one row of equal width, or stack on a narrow screen. */
export function actionRow(project) {
  const primary = anchor(project.links.primary, "button button--primary")
  return `<p class="actions">${[primary, ...project.links.secondary.map(secondary)].join("")}</p>`
}
