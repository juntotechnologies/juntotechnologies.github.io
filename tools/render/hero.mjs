/** The hero: one heading, one sentence and the areas of work. */
import { escapeHtml } from "./escape.mjs"

function chip(label) {
  return `<li class="chip">${escapeHtml(label)}</li>`
}

export function renderHero(hero) {
  return `<section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" class="hero__title">${escapeHtml(hero.heading)}</h1>
      <p class="hero__body">${escapeHtml(hero.body)}</p>
      <ul class="hero__areas" aria-label="Areas of work">${hero.expertise.map(chip).join("")}</ul>
    </section>`
}
