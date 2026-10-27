/** The illustration of a decision curve: three lines on two axes, with a legend and a label that says it shows no real data. */
import { escapeHtml } from "./escape.mjs"

const LEGEND_KEYS = ["model", "all", "none"]
const PATHS = {
  area: "M44 44C124 46 184 58 232 92S312 142 344 148H44Z",
  axis: "M44 16V196H344",
  none: "M44 148H344",
  all: "M44 44 330 176",
  model: "M44 44C124 46 184 58 232 92S312 142 344 148",
}

function line(name) {
  return `<path class="curve__${name}" d="${PATHS[name]}" />`
}

function legendItem(label, index) {
  const swatch = `<span class="legend__swatch legend__swatch--${LEGEND_KEYS[index]}" aria-hidden="true"></span>`
  return `<li class="legend__item">${swatch}${escapeHtml(label)}</li>`
}

function plot() {
  const lines = Object.keys(PATHS).map(line).join("")
  return `<div class="curve__plot"><svg class="curve__svg" viewBox="0 0 360 212" aria-hidden="true" focusable="false">${lines}</svg><span class="curve__cover" aria-hidden="true"></span></div>`
}

/** The cover hides the lines until the entry shows. It then slides away, so the lines appear to draw. */
export function renderCurve(illustration) {
  const caption = `<strong>${escapeHtml(illustration.title)}</strong><span>${escapeHtml(illustration.caption)}</span>`
  const legend = `<ul class="legend">${illustration.legend.map(legendItem).join("")}</ul>`
  return `<figure class="curve">${plot()}${legend}<figcaption class="curve__caption">${caption}</figcaption></figure>`
}
