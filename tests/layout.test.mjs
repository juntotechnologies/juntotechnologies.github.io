/** Tests for the pure steps of the layout check: heading lines, outer margins and sideways scroll. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { describeHeading, describeMargins, describeOverflow, linesOf, marginsOf, overflowBy, tooManyLines, unevenMargins } from "../tools/checks/layoutBudget.mjs"
import rules from "../tools/checks/fit.json" with { type: "json" }

function selectorOf(frame) {
  return frame.selector
}

const TWO = { text: "two lines", height: 80, lineHeight: 40 }
const THREE = { text: "three lines of heading", height: 123, lineHeight: 41 }

test("linesOf divides the height by the line height and rounds", () => {
  assert.equal(linesOf(TWO), 2)
  assert.equal(linesOf(THREE), 3)
  assert.equal(linesOf({ height: 41.6, lineHeight: 41 }), 1)
})

test("tooManyLines keeps only a heading above the limit", () => {
  assert.deepEqual(tooManyLines([TWO, THREE], 2), [THREE])
  assert.deepEqual(tooManyLines([TWO], 2), [])
})

test("marginsOf measures the gap to each screen edge", () => {
  assert.deepEqual(marginsOf({ left: 16, right: 374 }, 390), { left: 16, right: 16 })
})

test("unevenMargins keeps a block whose gaps differ by more than the tolerance", () => {
  const frames = [{ selector: ".even", left: 16, right: 374 }, { selector: ".left", left: 40, right: 374 }, { selector: ".near", left: 16, right: 373.5 }]
  assert.deepEqual(unevenMargins(frames, 390, 1).map(selectorOf), [".left"])
})

test("overflowBy is the sideways scroll, never negative", () => {
  assert.equal(overflowBy({ scroll: 412, client: 390 }), 22)
  assert.equal(overflowBy({ scroll: 390, client: 390 }), 0)
  assert.equal(overflowBy({ scroll: 380, client: 390 }), 0)
})

test("each fault line names the width and the cause", () => {
  assert.equal(describeHeading(360, 2, THREE), '360 px: heading "three lines of heading" has 3 lines; the most is 2')
  assert.equal(describeMargins(390, 390, { selector: ".x", left: 40, right: 374 }), "390 px: .x has a left gap of 40 px and a right gap of 16 px")
  assert.equal(describeOverflow(820, 12), "820 px: the page scrolls sideways by 12 px")
})

test("the rules name the four widths, the limit and the blocks to measure", () => {
  assert.deepEqual(rules.layout.widths, [360, 390, 820, 1440])
  assert.equal(rules.layout.maxHeadingLines, 2)
  assert.ok(rules.layout.frames.includes(".section"))
})
