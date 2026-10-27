/** Tests for the contrast math and for each text and background pair that data/design.json declares. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { contrast } from "../tools/contrast.mjs"
import { data } from "./built.mjs"

const THEMES = ["light", "dark"]

test("black on white is 21 to 1", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21)
})

test("the order of the two colors does not matter", () => {
  assert.equal(contrast("#2a211d", "#faf8f5"), contrast("#faf8f5", "#2a211d"))
})

function check(theme, pair) {
  const text = data.design.color[pair.text][theme]
  const ground = data.design.color[pair.on][theme]
  assert.ok(contrast(text, ground) >= pair.min, `${theme}: ${pair.text} on ${pair.on} is below ${pair.min}`)
}

for (const theme of THEMES) {
  test(`each declared pair meets its minimum in the ${theme} theme`, () => {
    data.design.pairs.forEach(check.bind(null, theme))
  })
}
