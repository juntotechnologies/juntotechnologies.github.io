/** Tests for the heading helper that sets one accent word apart. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { emphasize } from "../tools/render/heading.mjs"

test("emphasize wraps the last match of the accent word", () => {
  assert.equal(emphasize("Make your lab modern", "modern"), 'Make your lab <span class="hero__accent">modern</span>')
})

test("emphasize leaves the heading plain when the word is missing or empty", () => {
  assert.equal(emphasize("Make your lab modern", "future"), "Make your lab modern")
  assert.equal(emphasize("Make your lab modern", undefined), "Make your lab modern")
})

test("emphasize escapes the text around the word", () => {
  assert.equal(emphasize("R&D now", "now"), 'R&amp;D <span class="hero__accent">now</span>')
})
