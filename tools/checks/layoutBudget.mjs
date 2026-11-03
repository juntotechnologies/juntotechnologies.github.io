/** Pure steps of the layout check: lines in a heading, uneven outer margins, sideways scroll, reading order, button insets and card padding. */

export function linesOf(row) {
  return Math.round(row.height / row.lineHeight)
}

function hasTooManyLines(max, row) {
  return linesOf(row) > max
}

export function tooManyLines(rows, max) {
  return rows.filter(hasTooManyLines.bind(null, max))
}

export function marginsOf(frame, clientWidth) {
  return { left: frame.left, right: clientWidth - frame.right }
}

function isUneven(clientWidth, tolerance, frame) {
  const margins = marginsOf(frame, clientWidth)
  return Math.abs(margins.left - margins.right) > tolerance
}

export function unevenMargins(frames, clientWidth, tolerance) {
  return frames.filter(isUneven.bind(null, clientWidth, tolerance))
}

export function overflowBy(widths) {
  return Math.max(0, widths.scroll - widths.client)
}

export function describeHeading(width, max, row) {
  return `${width} px: heading "${row.text}" has ${linesOf(row)} lines; the most is ${max}`
}

export function describeMargins(width, clientWidth, frame) {
  const { left, right } = marginsOf(frame, clientWidth)
  return `${width} px: ${frame.selector} has a left gap of ${Math.round(left)} px and a right gap of ${Math.round(right)} px`
}

export function describeOverflow(width, pixels) {
  return `${width} px: the page scrolls sideways by ${pixels} px`
}

function hasSelector(selector, box) {
  return box.selector === selector
}

function boxFor(boxes, selector) {
  const found = boxes.find(hasSelector.bind(null, selector))
  if (!found) throw new Error(`no element matches ${selector}`)
  return found
}

function isMisordered(boxes, tolerance, pair) {
  const [above, below] = pair.map(boxFor.bind(null, boxes))
  return above.bottom > below.top + tolerance
}

export function misordered(boxes, pairs, tolerance) {
  return pairs.filter(isMisordered.bind(null, boxes, tolerance))
}

export function describeOrder(width, pair) {
  return `${width} px: ${pair[0]} ends below the top of ${pair[1]}`
}

function losesInset(row) {
  return row.left < row.min || row.right < row.min
}

export function tightButtons(rows) {
  return rows.filter(losesInset)
}

export function describeButton(width, row) {
  return `${width} px: control "${row.text}" has insets of ${Math.round(row.left)} and ${Math.round(row.right)} px; the least is ${row.min}`
}

function padOf(row) {
  return row.pad
}

export function distinctPads(rows) {
  return [...new Set(rows.map(padOf))]
}

function padLine(row) {
  return `${row.selector} ${row.pad}`
}

export function describePads(width, rows) {
  return `${width} px: cards differ in padding: ${[...new Set(rows.map(padLine))].join("; ")}`
}
