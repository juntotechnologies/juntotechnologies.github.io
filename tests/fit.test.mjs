/** Tests for the pure steps of the phone fit check. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { describe, roomBelow, tooTall } from "../tools/checks/fitBudget.mjs"
import rules from "../tools/checks/fit.json" with { type: "json" }

test("the room is the screen height minus the header", () => {
  assert.equal(roomBelow(659, 65), 594)
})

test("a card taller than the room is too tall; an equal card fits", () => {
  const rows = [{ selector: ".a", height: 594 }, { selector: ".b", height: 595 }]
  assert.deepEqual(tooTall(rows, 594), [{ selector: ".b", height: 595 }])
})

test("the fault line names the card and both heights", () => {
  assert.equal(describe(594, { selector: ".b", height: 595.4 }), ".b is 595 px tall; the screen has 594 px free below the header")
})

test("the rules name a device and the cards to measure", () => {
  assert.equal(rules.device, "iPhone 15 Pro")
  assert.ok(rules.cards.includes(".lead"))
})
