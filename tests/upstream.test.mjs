/** Tests for the upstream handlers: each compares what the hub states with a project's own source text. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { HANDLERS } from "../tools/checks/upstreamHandlers.mjs"

const PROJECT = { id: "p", look: { surface: "#eff6ff", ink: "#1e3a8a", accent: "#3b82f6" }, instruments: ["Balance", "HPLC"] }
const PALETTE = "--palette-blue-50: 239 246 255;\n--palette-navy: 30 58 138;\n--palette-blue: 59 130 246;\n"

test("the instrument check passes when the names match", () => {
  assert.deepEqual(HANDLERS["bench-bridge-instruments"](PROJECT, JSON.stringify([{ name: "Balance" }, { name: "HPLC" }])), [])
})

test("the instrument check names both lists when they differ", () => {
  const faults = HANDLERS["bench-bridge-instruments"](PROJECT, JSON.stringify([{ name: "Balance" }]))
  assert.equal(faults.length, 1)
  assert.match(faults[0], /hub says Balance, HPLC; project says Balance/)
})

test("the color check passes when the palette matches", () => {
  assert.deepEqual(HANDLERS["cims-colors"](PROJECT, PALETTE), [])
})

test("the color check reports the key that differs", () => {
  const faults = HANDLERS["cims-colors"](PROJECT, PALETTE.replace("59 130 246", "0 0 0"))
  assert.deepEqual(faults, ["p look.accent: hub says #3b82f6, project says #000000"])
})

test("the Bench Bridge color check reads the token file", () => {
  const tokens = { color: { paper: { value: "#eff6ff" }, ink: { value: "#1e3a8a" }, accent: { value: "#3b82f6" } } }
  assert.deepEqual(HANDLERS["bench-bridge-colors"](PROJECT, JSON.stringify(tokens)), [])
})
