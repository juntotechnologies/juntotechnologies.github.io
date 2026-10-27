/** Pure steps of the layout check: lines in a heading, uneven outer margins, sideways scroll and reading order. */

/** The number of text lines in a heading: its height over its line height. */
export function linesOf(row) {
  return Math.round(row.height / row.lineHeight)
}

function hasTooManyLines(max, row) {
  return linesOf(row) > max
}

/** The headings that wrap to more lines than `max`. Each row is { text, height, lineHeight }. */
export function tooManyLines(rows, max) {
  return rows.filter(hasTooManyLines.bind(null, max))
}

/** The gaps between a block and the two screen edges. */
export function marginsOf(frame, clientWidth) {
  return { left: frame.left, right: clientWidth - frame.right }
}

function isUneven(clientWidth, tolerance, frame) {
  const margins = marginsOf(frame, clientWidth)
  return Math.abs(margins.left - margins.right) > tolerance
}

/** The blocks whose left and right gaps differ by more than `tolerance` pixels. Each frame is { selector, left, right }. */
export function unevenMargins(frames, clientWidth, tolerance) {
  return frames.filter(isUneven.bind(null, clientWidth, tolerance))
}

/** How far the page scrolls sideways, in pixels. Zero when it does not. */
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

/** The pairs where the first block ends below the top of the second. Each box is { selector, top, bottom }. */
export function misordered(boxes, pairs, tolerance) {
  return pairs.filter(isMisordered.bind(null, boxes, tolerance))
}

export function describeOrder(width, pair) {
  return `${width} px: ${pair[0]} ends below the top of ${pair[1]}`
}
