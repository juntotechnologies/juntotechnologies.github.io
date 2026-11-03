/** The projects sections: one card for the product in use, and one card with tabs for the concepts. Each panel shows the project's own picture and a short text. */
import { escapeHtml } from "./escape.mjs"
import { actionRow, noteLine, statusChip } from "./card.mjs"
import { sectionHead } from "./sectionHead.mjs"

const MARK = '<span class="mark" aria-hidden="true"></span>'

function isInUse(project) {
  return project.tier === "featured" && project.stage === "in-use"
}

function isConcept(project) {
  return project.tier === "featured" && project.stage === "concept"
}

function lookStyle(look) {
  return `--look-surface:${look.surface};--look-accent:${look.accent}`
}

function tab(project, index) {
  const selected = index === 0
  const state = `aria-selected="${selected}" tabindex="${selected ? 0 : -1}"`
  const wiring = `role="tab" id="tab-${project.id}" href="#${project.id}" aria-controls="${project.id}"`
  return `<a class="tabs__tab" ${wiring} ${state} style="${lookStyle(project.look)}">${MARK}${escapeHtml(project.name)}</a>`
}

function tablist(section, featured) {
  const indicator = '<span class="tabs__indicator" aria-hidden="true"></span>'
  const attributes = `role="tablist" aria-label="${escapeHtml(section.tabsLabel)}" style="--tabs:${featured.length}"`
  return `<div class="tabs" ${attributes}>${featured.map(tab).join("")}${indicator}</div>`
}

function flowStep(step, index) {
  return `<li class="flow__step" style="--i:${index}">${escapeHtml(step)}</li>`
}

function flowStrip(project) {
  if (!project.flow) return ""
  const steps = project.flow.steps.map(flowStep).join("")
  return `<ol class="flow" aria-label="${escapeHtml(project.flow.label)}">${steps}</ol>`
}

function clipSources(clip) {
  return `<source src="${clip.mp4}" type="video/mp4" /><source src="${clip.webm}" type="video/webm" />`
}

/* why: The still is the poster. The clip loads only when a script asks for it, so a still page costs no video bytes. */
function clipVideo(project) {
  const { preview: shot, clip } = project
  const flags = 'data-clip muted loop playsinline preload="none"'
  const size = `width="${shot.width}" height="${shot.height}"`
  return `<video class="frame__image" ${flags} poster="${shot.file}" ${size} role="img" aria-label="${escapeHtml(shot.alt)}">${clipSources(clip)}</video>`
}

function preview(project) {
  const bar = `<span class="frame__bar" aria-hidden="true"><i></i><i></i><i></i><span class="frame__host">${escapeHtml(project.look.host)}</span></span>`
  return `<div class="panel__preview"><div class="frame">${bar}${clipVideo(project)}</div></div>`
}

function head(project) {
  const name = `<h3 class="panel__name">${MARK}${escapeHtml(project.name)}</h3>`
  return `<div class="panel__head">${statusChip(project)}${name}<p class="panel__summary">${escapeHtml(project.summary)}</p></div>`
}

function panelBody(project) {
  const actions = `<div class="panel__actions">${actionRow(project)}${noteLine(project.note)}</div>`
  const text = `<div class="panel__text">${head(project)}${flowStrip(project)}${actions}</div>`
  return `${text}
          ${preview(project)}`
}

function tabPanel(project, index) {
  const selected = index === 0 ? " is-selected" : ""
  const wiring = `role="tabpanel" id="${project.id}" aria-labelledby="tab-${project.id}" style="${lookStyle(project.look)}"`
  return `<article class="panel${selected}" ${wiring}>
          ${panelBody(project)}
        </article>`
}

function soloPanel(project) {
  return `<article class="panel is-selected" id="${project.id}" style="${lookStyle(project.look)}">
          ${panelBody(project)}
        </article>`
}

function inUseSection(section, projects) {
  return `<section class="section" id="projects" aria-labelledby="projects-title">
      ${sectionHead(section, "projects-title")}
      <div class="showcase card reveal" style="--i:1">
        <div class="panels">
        ${projects.map(soloPanel).join("\n        ")}
        </div>
      </div>
    </section>`
}

function conceptsSection(section, projects) {
  return `<section class="section" id="concepts" aria-labelledby="concepts-title">
      ${sectionHead(section, "concepts-title")}
      <div class="showcase card reveal" style="--i:1">
        ${tablist(section, projects)}
        <div class="panels">
        ${projects.map(tabPanel).join("\n        ")}
        </div>
      </div>
    </section>`
}

export function renderProjects(section, projects) {
  return `${inUseSection(section, projects.filter(isInUse))}
    ${conceptsSection(section.concepts, projects.filter(isConcept))}`
}
