/** Check: fails when a directory has no AGENTS.md, so every directory states its own rules. */
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import shape from "../../code-shape.json" with { type: "json" }
import { ROOT } from "../paths.mjs"

function isListed(entry) {
  return entry.isDirectory() && !shape.agentsMdIgnore.includes(entry.name)
}

function entryPath(dir, entry) {
  return join(dir, entry.name)
}

function childDirs(dir) {
  return readdirSync(dir, { withFileTypes: true }).filter(isListed).map(entryPath.bind(null, dir))
}

function allDirs(dir) {
  return [dir, ...childDirs(dir).flatMap(allDirs)]
}

function lacksAgents(dir) {
  return !existsSync(join(dir, "AGENTS.md"))
}

function report(dir) {
  console.error(`missing AGENTS.md: ${dir.replace(ROOT, "./")}`)
}

const missing = allDirs(ROOT).filter(lacksAgents)
missing.forEach(report)
process.exitCode = missing.length ? 1 : 0
