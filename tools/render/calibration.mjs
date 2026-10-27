/** The calibration illustration: how well predicted risk matches observed risk, for two groups, against perfect calibration. */
import { linePath } from "../../assets/js/svg-path.js"
import { captionLine, legendRow, plotFrame, tickRow } from "./plot.mjs"

const VIEW = { width: 320, height: 132 }
const BOX = { left: 32, right: 304, top: 10, bottom: 122 }
const SAMPLES = 21
const MARK_AT = 0.8
const ROLES = ["main", "side"]

function xFor(share) {
  return BOX.left + share * (BOX.right - BOX.left)
}

function yFor(share) {
  return BOX.bottom - share * (BOX.bottom - BOX.top)
}

function shareAt(_, index) {
  return index / (SAMPLES - 1)
}

function pointOf(group, share) {
  return [xFor(share), yFor(share ** group.exponent)]
}

function curve(group, index) {
  const points = Array.from({ length: SAMPLES }, shareAt).map(pointOf.bind(null, group))
  return `<path class="line line--${ROLES[index]}" d="${linePath(points)}" />`
}

function mark(group, index) {
  const [x, y] = pointOf(group, MARK_AT)
  return `<circle class="ping" cx="${x}" cy="${y}" r="6" /><circle class="dot dot--${ROLES[index]}" cx="${x}" cy="${y}" r="4.5" />`
}

function axis() {
  return `<path class="plate__axis" d="M${BOX.left} ${BOX.top}V${BOX.bottom}H${BOX.right}" />`
}

function reference() {
  return `<path class="line line--ref" d="${linePath([[xFor(0), yFor(0)], [xFor(1), yFor(1)]])}" />`
}

function svg(illustration) {
  const inner = `${axis()}${reference()}${illustration.groups.map(curve).join("")}${illustration.groups.map(mark).join("")}`
  return `<svg class="plate__svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}" aria-hidden="true" focusable="false">${inner}</svg>`
}

function legendGroup(group, index) {
  return { role: ROLES[index], label: group.label }
}

function legendItems(illustration) {
  return [...illustration.groups.map(legendGroup), { role: "ref", label: illustration.reference }]
}

export function renderCalibration(illustration) {
  const frame = plotFrame(svg(illustration), illustration.axes.y, { top: BOX.top, bottom: BOX.bottom, height: VIEW.height })
  const ticks = tickRow(VIEW.width, [{ x: (BOX.left + BOX.right) / 2, label: illustration.axes.x }])
  return `<figure class="figure plate">${frame}${ticks}${legendRow(legendItems(illustration))}${captionLine(illustration.caption)}</figure>`
}
