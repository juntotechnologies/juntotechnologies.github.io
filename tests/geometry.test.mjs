/** Tests for the pointer geometry that the glow script uses. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { offsetIn, px } from "../assets/js/geometry.js"

const BOX = { left: 100, top: 40 }

test("offsetIn measures from the top left corner of the box", () => {
  assert.deepEqual(offsetIn(BOX, { clientX: 130, clientY: 90 }), { x: 30, y: 50 })
})

test("offsetIn is negative when the pointer sits left of or above the box", () => {
  assert.deepEqual(offsetIn(BOX, { clientX: 90, clientY: 30 }), { x: -10, y: -10 })
})

test("px rounds to a whole pixel and adds the unit", () => {
  assert.equal(px(12.6), "13px")
  assert.equal(px(-0.4), "0px")
})
