/** The featured projects: one card each, with its own look, its facts and its links. */
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"

function listItem(text) {
  return `<li>${escapeHtml(text)}</li>`
}

function chip(label) {
  return `<span class="chip chip--label">${escapeHtml(label)}</span>`
}

function lookStyle(look) {
  return `--look-surface:${look.surface};--look-ink:${look.ink};--look-accent:${look.accent}`
}

function instrumentPoint(project) {
  const names = project.instruments ?? []
  return names.length ? [`Instruments in the demo: ${names.join(", ")}.`] : []
}

function pointList(project) {
  const items = [...instrumentPoint(project), ...project.points]
  return `<ul class="project__points">${items.map(listItem).join("")}</ul>`
}

function secondaryLink(link) {
  return anchor(link, "button button--quiet project__secondary")
}

function isFeatured(project) {
  return project.tier === "featured"
}

function actions(project) {
  const primary = anchor(project.links.primary, "button button--primary project__primary")
  const secondary = project.links.secondary.map(secondaryLink)
  return `<p class="project__actions">${[primary, ...secondary].join("")}</p>`
}

function preview(project) {
  const { preview: shot, look } = project
  const image = `<img class="frame__image" src="${shot.file}" width="${shot.width}" height="${shot.height}" alt="${escapeHtml(shot.alt)}" loading="lazy" decoding="async" />`
  const bar = `<span class="frame__bar" aria-hidden="true"><i></i><i></i><i></i><span class="frame__host">${escapeHtml(look.host)}</span></span>`
  return `<div class="project__preview"><div class="frame">${bar}${image}</div></div>`
}

function body(project) {
  return `<div class="project__body">
          <p class="project__meta">${chip(project.kind)}${chip(project.status)}</p>
          <h3 class="project__name"><span class="project__mark" aria-hidden="true"></span>${escapeHtml(project.name)}</h3>
          <p class="project__summary">${escapeHtml(project.summary)}</p>
          ${pointList(project)}
          <p class="project__note">${escapeHtml(project.note)}</p>
          ${actions(project)}
        </div>`
}

export function renderProject(project) {
  return `<article class="project" id="${project.id}" style="${lookStyle(project.look)}">
        ${body(project)}
        ${preview(project)}
      </article>`
}

export function renderProjects(section, projects) {
  const cards = projects.filter(isFeatured).map(renderProject).join("\n      ")
  return `<section class="section" id="projects" aria-labelledby="projects-title">
      <div class="section__head"><h2 id="projects-title" class="section__title">${escapeHtml(section.heading)}</h2><p class="section__body">${escapeHtml(section.body)}</p></div>
      ${cards}
    </section>`
}
