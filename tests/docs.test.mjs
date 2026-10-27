/** Tests for the generated doc blocks: swapping a block and the tables from the data. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { hasBlock, replaceBlock } from "../tools/docs.mjs"
import { backlinkTable, entryBlock, projectTable } from "../tools/render/docTables.mjs"
import { data } from "./built.mjs"

const DOC = "before\n<!-- gen:x -->\nold\n<!-- /gen -->\nafter"

test("replaceBlock swaps only the marked block", () => {
  assert.equal(replaceBlock(DOC, "x", "new"), "before\n<!-- gen:x -->\nnew\n<!-- /gen -->\nafter")
})

test("replaceBlock leaves a document without the block as it is", () => {
  assert.equal(replaceBlock("plain", "x", "new"), "plain")
})

test("hasBlock finds a block by name", () => {
  assert.equal(hasBlock(DOC, "x"), true)
  assert.equal(hasBlock(DOC, "y"), false)
})

test("the backlink table has one row for each featured project", () => {
  const rows = backlinkTable(data).split("\n")
  assert.equal(rows.length, 2 + 2)
  assert.match(rows[2], /juntotechnologies\.com\/#cheminventory/)
})

test("each backlink entry points at its card on the hub", () => {
  const entries = JSON.parse(entryBlock(data).replace(/```json|```/g, ""))
  assert.equal(entries["bench-bridge"].href, `${data.site.url}#bench-bridge`)
  assert.equal(entries["cheminventory"].href, `${data.site.url}#cheminventory`)
})

test("the project table has one row for each project", () => {
  assert.equal(projectTable(data).split("\n").length, 2 + data.projects.projects.length)
})
