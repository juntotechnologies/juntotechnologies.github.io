/** Tests for the download refresh workflow: the monthly schedule, the write permission, the commands, the pins and the docs that name it. */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { inRoot } from "../tools/paths.mjs"

const WORKFLOW = ".github/workflows/refresh-downloads.yml"
const DOCS = ["AGENTS.md", "docs/projects.md", "data/AGENTS.md", "tools/AGENTS.md"]
const MONTHLY = /^\s+- cron: "\d{1,2} \d{1,2} \d{1,2} \* \*"$/m
const PINNED = /uses: [\w./-]+@[0-9a-f]{40} # v\d/
const PERMISSION = /^\s+[\w-]+: (read|write)$/
const COMMANDS = ["npm ci", "npm run downloads", "npm run build", "npm run check"]

function read(relative) {
  return readFileSync(inRoot(relative), "utf8")
}

function isPermission(line) {
  return PERMISSION.test(line)
}

function usesAction(line) {
  return line.includes("uses:")
}

function placeOf(text, command) {
  return text.indexOf(`run: ${command}\n`)
}

function isFound(place) {
  return place > 0
}

function ascending(a, b) {
  return a - b
}

function assertPinned(line) {
  assert.match(line, PINNED)
}

function assertNamesWorkflow(doc) {
  assert.ok(read(doc).includes(WORKFLOW), `${doc} must name ${WORKFLOW}`)
}

test("the workflow runs on a monthly schedule and by hand", () => {
  const text = read(WORKFLOW)
  assert.match(text, MONTHLY)
  assert.match(text, /^ {2}workflow_dispatch:$/m)
})

test("the workflow may write file contents and nothing else", () => {
  assert.deepEqual(read(WORKFLOW).split("\n").filter(isPermission), ["  contents: write"])
})

test("the workflow installs, refreshes, builds and checks, in that order", () => {
  const places = COMMANDS.map(placeOf.bind(null, read(WORKFLOW)))
  assert.ok(places.every(isFound), "a command is missing")
  assert.deepEqual([...places].sort(ascending), places)
})

test("every action in the workflow is pinned to a full commit SHA with its version", () => {
  const uses = read(WORKFLOW).split("\n").filter(usesAction)
  assert.ok(uses.length > 0)
  uses.forEach(assertPinned)
})

test("each doc that describes the refresh names the workflow file", () => {
  DOCS.forEach(assertNamesWorkflow)
})
