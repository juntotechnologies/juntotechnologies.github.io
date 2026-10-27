/** The open source section: one lead entry, then the other public code as tiles. Each entry shows its own picture. */
import { escapeHtml } from "./escape.mjs"
import { actionRow, noteLine, statusChip } from "./card.mjs"
import { renderFigure } from "./figure.mjs"
import { anchor } from "./links.mjs"
import { sectionHead } from "./sectionHead.mjs"
import { statFor } from "./stat.mjs"

function isOpen(project) {
  return project.tier === "more"
}

function isLead(project) {
  return project.lead === true
}

function isTile(project) {
  return !isLead(project)
}

function lead(downloads, project) {
  return `<article class="lead card card--lift reveal" id="${project.id}" style="--i:1">
        <div class="lead__text">
          ${statusChip(project)}
          <h3 class="lead__name">${escapeHtml(project.name)}</h3>
          <p class="lead__summary">${escapeHtml(project.summary)}</p>
          ${statFor(downloads, project)}
          ${actionRow(project)}
          ${noteLine(project.note)}
        </div>
        ${renderFigure(project)}
      </article>`
}

function tile(project, index) {
  const link = anchor({ ...project.links.primary, label: project.name }, "tile__link")
  return `<article class="tile card card--lift reveal" id="${project.id}" style="--i:${index + 2}">
        ${renderFigure(project)}
        ${statusChip(project)}
        <h3 class="tile__name">${link}</h3>
        <p class="tile__summary">${escapeHtml(project.summary)}</p>
      </article>`
}

export function renderOpenSource(section, projects, downloads) {
  const open = projects.filter(isOpen)
  const tiles = open.filter(isTile).map(tile).join("\n        ")
  return `<section class="section" id="open-source" aria-labelledby="open-source-title">
      ${sectionHead(section, "open-source-title")}
      <div class="open">
        ${open.filter(isLead).map(lead.bind(null, downloads)).join("")}
        <div class="tiles">
        ${tiles}
        </div>
      </div>
    </section>`
}
