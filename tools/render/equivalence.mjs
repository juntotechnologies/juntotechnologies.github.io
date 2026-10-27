/** The bioequivalence illustration: a confidence interval and its point estimate against the equivalence limits. */
import { linePath, round } from "../../assets/js/svg-path.js"
import { captionLine, legendRow, plotFrame, tickRow } from "./plot.mjs"

const VIEW = { width: 320, height: 132 }
const AXIS = { min: 70, max: 140, left: 20, right: 300 }
const BAND = { top: 14, bottom: 118 }
const ROW = 66
const CAP = 6

function xFor(value) {
  const share = (value - AXIS.min) / (AXIS.max - AXIS.min)
  return round(AXIS.left + share * (AXIS.right - AXIS.left))
}

function vertical(className, value, top, bottom) {
  return `<path class="${className}" d="${linePath([[xFor(value), top], [xFor(value), bottom]])}" />`
}

function band(limits) {
  const [low, high] = limits.map(xFor)
  return `<rect class="plate__band" x="${low}" y="${BAND.top}" width="${round(high - low)}" height="${BAND.bottom - BAND.top}" rx="6" />`
}

function cap(value) {
  return vertical("line line--main", value, ROW - CAP, ROW + CAP)
}

function interval(bounds) {
  const bar = linePath([[xFor(bounds[0]), ROW], [xFor(bounds[1]), ROW]])
  return `<path class="line line--main" d="${bar}" />${bounds.map(cap).join("")}`
}

function limitLine(value) {
  return vertical("plate__limit", value, BAND.top, BAND.bottom)
}

function estimate(value) {
  const at = `cx="${xFor(value)}" cy="${ROW}"`
  return `<circle class="ping" ${at} r="6" /><circle class="dot dot--main" ${at} r="5" />`
}

function svg(illustration) {
  const centre = vertical("line line--ref", illustration.centre, BAND.top, BAND.bottom)
  const inner = `${band(illustration.limits)}${illustration.limits.map(limitLine).join("")}${centre}`
  const marks = `${interval(illustration.interval)}${estimate(illustration.estimate)}`
  return `<svg class="plate__svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}" aria-hidden="true" focusable="false">${inner}${marks}</svg>`
}

function tickOf(value) {
  return { x: xFor(value), label: `${value}%` }
}

function legendItems(illustration) {
  const [low, high] = illustration.limits
  return [{ role: "main", label: `${illustration.confidence}% CI` }, { role: "band", label: `${low}–${high}% limits` }]
}

export function renderEquivalence(illustration) {
  const ticks = tickRow(VIEW.width, [...illustration.limits, illustration.centre].map(tickOf))
  return `<figure class="figure plate">${plotFrame(svg(illustration))}${ticks}${legendRow(legendItems(illustration))}${captionLine(illustration.caption)}</figure>`
}
