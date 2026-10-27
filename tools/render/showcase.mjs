/** The projects section: one card with tabs and one panel for each featured project. */
import { escapeHtml } from "./escape.mjs"
import { actionRow, factList, noteLine, statusChip } from "./card.mjs"
import { sectionHead } from "./sectionHead.mjs"

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
const MARK = '<span class="mark" aria-hidden="true"></span>'

function isFeatured(project) {
  return project.tier === "featured"
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

function instrumentFact(project) {
  const count = (project.instruments ?? []).length
  if (!count) return []
  const word = COUNT_WORDS[count] ?? String(count)
  return [`${word[0].toUpperCase()}${word.slice(1)} instruments in the demo.`]
}

function flowStep(step, index) {
  return `<li class="flow__step" style="--i:${index}">${escapeHtml(step)}</li>`
}

function flowItem(project) {
  if (!project.flow) return ""
  const steps = project.flow.steps.map(flowStep).join("")
  return `<li class="facts__flow"><ol class="flow" aria-label="${escapeHtml(project.flow.label)}">${steps}</ol></li>`
}

function preview(project) {
  const { preview: shot, look } = project
  const image = `<img class="frame__image" src="${shot.file}" width="${shot.width}" height="${shot.height}" alt="${escapeHtml(shot.alt)}" loading="lazy" decoding="async" />`
  const bar = `<span class="frame__bar" aria-hidden="true"><i></i><i></i><i></i><span class="frame__host">${escapeHtml(look.host)}</span></span>`
  return `<div class="panel__preview"><div class="frame">${bar}${image}</div></div>`
}

function head(project) {
  const name = `<h3 class="panel__name">${MARK}${escapeHtml(project.name)}</h3>`
  return `<div class="panel__head">${statusChip(project)}${name}<p class="panel__summary">${escapeHtml(project.summary)}</p></div>`
}

function panel(project, index) {
  const selected = index === 0 ? " is-selected" : ""
  const wiring = `role="tabpanel" id="${project.id}" aria-labelledby="tab-${project.id}" style="${lookStyle(project.look)}"`
  const facts = factList([...instrumentFact(project), ...project.points], flowItem(project))
  const actions = `<div class="panel__actions">${actionRow(project)}${noteLine(project.note)}</div>`
  return `<article class="panel${selected}" ${wiring}>
          ${head(project)}
          ${preview(project)}
          ${facts}
          ${actions}
        </article>`
}

export function renderProjects(section, projects) {
  const featured = projects.filter(isFeatured)
  const panels = featured.map(panel).join("\n        ")
  return `<section class="section" id="projects" aria-labelledby="projects-title">
      ${sectionHead(section, "projects-title")}
      <div class="showcase card reveal" style="--i:1">
        ${tablist(section, featured)}
        <div class="panels">
        ${panels}
        </div>
      </div>
    </section>`
}
