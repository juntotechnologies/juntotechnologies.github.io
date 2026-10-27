/** Tests for the download refresh: the badge parser and the next data entry. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { parseBadgeCount, refreshedEntry } from "../tools/badge.mjs"

const ENTRY = { package: "p", count: 10, measured: "2026-01-01" }

test("the parser reads the last number in a badge", () => {
  assert.equal(parseBadgeCount("<text>downloads</text><text>79704</text><text>79704</text>"), 79704)
})

test("the parser reads a number with commas", () => {
  assert.equal(parseBadgeCount("<title>x</title><text>1,234,567</text>"), 1234567)
})

test("the parser returns -1 when the badge holds no number", () => {
  assert.equal(parseBadgeCount("<svg><text>downloads</text></svg>"), -1)
})

test("the next entry keeps every field but the count and the date", () => {
  assert.deepEqual(refreshedEntry(ENTRY, 25, "2026-02-02"), { package: "p", count: 25, measured: "2026-02-02" })
})

test("a count that is not a whole number stops the refresh", () => {
  assert.throws(refreshedEntry.bind(null, ENTRY, -1, "2026-02-02"), /p: the badge held no count/)
  assert.throws(refreshedEntry.bind(null, ENTRY, 1.5, "2026-02-02"), /the badge held no count/)
})
