/** Parts that the three illustrations share: the plot frame with its reveal cover, the caption and the legend. */
import { escapeHtml } from "./escape.mjs"

export function percent(part, whole) {
  return `${Math.round((part / whole) * 10000) / 100}%`
}

/** The label that runs up the y axis. `span` is { top, bottom, height }: the plot area in the units of the SVG. */
function yLabel(text, span) {
  const style = `--plot-top: ${percent(span.top, span.height)}; --plot-span: ${percent(span.bottom - span.top, span.height)}`
  return `<span class="figure__y" style="${style}">${escapeHtml(text)}</span>`
}

/** The SVG sits in a frame. The cover hides it until the card shows, then slides away, so the lines appear to draw. */
export function plotFrame(svg, label = "", span = null) {
  const axis = label ? yLabel(label, span) : ""
  return `<div class="figure__plot">${svg}${axis}<span class="figure__cover" aria-hidden="true"></span></div>`
}

function tickAt(width, tick) {
  return `<span class="plate__tick" style="left: ${percent(tick.x, width)}">${escapeHtml(tick.label)}</span>`
}

/** A row of labels under the plot. Each tick is { x, label }, with x in the units of the SVG. */
export function tickRow(width, ticks) {
  return `<div class="plate__ticks" aria-hidden="true">${ticks.map(tickAt.bind(null, width)).join("")}</div>`
}



/** The label that says the picture shows no real data, then any extra markup, such as a link. */
export function captionLine(text, extra = "") {
  return `<figcaption class="figure__caption"><span>${escapeHtml(text)}</span>${extra}</figcaption>`
}

export function swatch(role) {
  return `<span class="legend__swatch legend__swatch--${role}" aria-hidden="true"></span>`
}

function legendItem(item) {
  return `<li class="legend__item">${swatch(item.role)}${escapeHtml(item.label)}</li>`
}

/** A row of line samples with their names. Each item is { role, label }. */
export function legendRow(items) {
  return `<ul class="legend">${items.map(legendItem).join("")}</ul>`
}
