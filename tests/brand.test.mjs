/** Test: public copy never uses a banned brand word, so Junto stays the lab modernizer and not a software shop. */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import brand from "../tools/checks/brand.json" with { type: "json" }
import { inRoot } from "../tools/paths.mjs"

const SCRIPT_BLOCK = /<script[\s\S]*?<\/script>/g

function copyOf(file) {
  return readFileSync(inRoot(file), "utf8").replace(SCRIPT_BLOCK, "")
}

function wordPattern(word) {
  return new RegExp(`\\b${word}\\b`, "i")
}

function assertWithout(file, word) {
  assert.doesNotMatch(copyOf(file), wordPattern(word), `${file} uses the banned word "${word}"`)
}

function assertFileClean(file) {
  brand.banned.forEach(assertWithout.bind(null, file))
}

test("public copy has no banned brand word", () => {
  brand.files.forEach(assertFileClean)
})
