/** The hero: one heading, one sentence, two buttons and the areas of work. Soft art sits behind it. */
import { escapeHtml } from "./escape.mjs"

const ART = '<div class="hero__art" aria-hidden="true"><span class="hero__dots"></span><span class="hero__glow"></span></div>'

function area(label) {
  return `<li>${escapeHtml(label)}</li>`
}

function action(item) {
  const kind = item.primary ? "button--primary" : "button--quiet"
  return `<a class="button button--large ${kind}" href="${item.href}">${escapeHtml(item.label)}</a>`
}

function areas(hero) {
  const label = `<p id="areas-label" class="hero__areas-label">${escapeHtml(hero.areasLabel)}</p>`
  return `<div class="hero__areas">${label}<ul class="hero__areas-list" aria-labelledby="areas-label">${hero.expertise.map(area).join("")}</ul></div>`
}

function aside(hero) {
  const actions = `<p class="actions hero__actions">${hero.actions.map(action).join("")}</p>`
  return `<div class="hero__aside"><p class="hero__body">${escapeHtml(hero.body)}</p>${actions}</div>`
}

export function renderHero(hero) {
  const title = `<h1 id="hero-title" class="hero__title">${escapeHtml(hero.heading)}</h1>`
  return `<section class="hero" aria-labelledby="hero-title">
      ${ART}
      <div class="hero__layout">${title}${aside(hero)}</div>
      ${areas(hero)}
    </section>`
}
