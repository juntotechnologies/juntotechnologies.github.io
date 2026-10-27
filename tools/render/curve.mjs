/** The decision curve illustration: three lines, a threshold slider and the net benefit of each line at that threshold. */
import { BOX, DOMAIN, STEP, areaFor, formatBenefit, markerAt, pathFor, readout, xAt } from "../../assets/js/decision-curve.js"
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"
import { captionLine, percent, plotFrame, swatch } from "./plot.mjs"

const ROLES = { model: "main", all: "side", none: "ref" }
const DRAW_ORDER = ["none", "all", "model"]
const READ_ORDER = ["model", "all", "none"]
const START = 0
const SLIDER_ID = "curve-threshold"

function clipPath() {
  const { left, top, right, bottom } = BOX
  return `<clipPath id="curve-clip"><rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" /></clipPath>`
}

function line(curve, name) {
  return `<path class="line line--${ROLES[name]}" d="${pathFor(curve, name)}" />`
}

function lines(curve) {
  const area = `<path class="curve__area" d="${areaFor(curve)}" />`
  return `<g clip-path="url(#curve-clip)">${area}${DRAW_ORDER.map(line.bind(null, curve)).join("")}</g>`
}

function dot(curve, name) {
  const marker = markerAt(readout(curve, START)[name])
  const hidden = marker.visible ? "" : ' style="visibility: hidden"'
  return `<circle class="dot dot--${ROLES[name]}" data-dot="${name}" cx="0" cy="${marker.y}" r="4.5"${hidden} />`
}

/** The vertical line, the ping ring on the axis and one dot per line. A script moves the group along the axis. */
function probe(curve) {
  const rule = `<line class="curve__rule" x1="0" x2="0" y1="${BOX.top}" y2="${BOX.bottom}" />`
  const ping = `<circle class="ping" cx="0" cy="${BOX.bottom}" r="7" />`
  const dots = DRAW_ORDER.map(dot.bind(null, curve)).join("")
  return `<g data-probe transform="translate(${xAt(START)} 0)">${rule}${ping}${dots}</g>`
}

function svg(curve) {
  const axis = `<path class="curve__axis" d="M${BOX.left} ${BOX.top}V${BOX.bottom}H${BOX.right}" />`
  const inner = `<defs>${clipPath()}</defs>${lines(curve)}${axis}${probe(curve)}`
  return `<svg class="curve__svg" viewBox="0 0 ${BOX.width} ${BOX.height}" aria-hidden="true" focusable="false">${inner}</svg>`
}

function slider(axes) {
  const attributes = `id="${SLIDER_ID}" type="range" min="0" max="${DOMAIN.tMax}" step="${STEP}" value="${START}"`
  return `<input class="curve__range" ${attributes} data-range aria-label="${escapeHtml(axes.x)}" />`
}

function readoutItem(curve, names, name) {
  const value = formatBenefit(readout(curve, START)[name])
  const term = `<dt>${swatch(ROLES[name])}${escapeHtml(names[name])}</dt>`
  return `<div class="readout__item">${term}<dd data-value="${name}">${value}</dd></div>`
}

function readoutList(curve, names) {
  return `<dl class="readout">${READ_ORDER.map(readoutItem.bind(null, curve, names)).join("")}</dl>`
}

function axisRow(axes) {
  const output = `<output class="curve__output" for="${SLIDER_ID}" data-output>${START.toFixed(2)}</output>`
  return `<p class="curve__x"><span>${escapeHtml(axes.x)}</span>${output}</p>`
}

function frameStyle() {
  const left = percent(BOX.left, BOX.width)
  const right = percent(BOX.width - BOX.right, BOX.width)
  return `--plot-left: ${left}; --plot-right: ${right}; --axis-at: ${percent(BOX.bottom, BOX.height)}`
}

function data(illustration) {
  const names = escapeHtml(JSON.stringify(illustration.lines))
  return `data-curve data-prevalence="${illustration.prevalence}" data-separation="${illustration.separation}" data-names="${names}"`
}

/** The learn link sits in the caption, so the card holds no explanation of net benefit. */
export function renderCurve(illustration, learn) {
  const frame = plotFrame(svg(illustration), illustration.axes.y, { top: BOX.top, bottom: BOX.bottom, height: BOX.height })
  const stage = `<div class="curve__stage">${frame}${slider(illustration.axes)}</div>`
  const caption = captionLine(illustration.caption, anchor(learn, "figure__link"))
  const body = `${stage}${axisRow(illustration.axes)}${readoutList(illustration, illustration.lines)}${caption}`
  return `<figure class="figure curve" ${data(illustration)} style="${frameStyle()}">${body}</figure>`
}
