/** Command: reads each download count from its badge and writes data/downloads.json. Run it, then npm run build. Needs network. */
import { readFileSync, writeFileSync } from "node:fs"
import { parseBadgeCount, refreshedEntry } from "./badge.mjs"
import { inRoot } from "./paths.mjs"

const FILE = "data/downloads.json"

function today() {
  return new Date().toISOString().slice(0, 10)
}

async function refresh(date, [key, entry]) {
  const response = await fetch(entry.badge)
  if (!response.ok) throw new Error(`${key}: the badge answered ${response.status}`)
  const next = refreshedEntry(entry, parseBadgeCount(await response.text()), date)
  console.log(`${key}: ${entry.count} -> ${next.count} (${source(next)})`)
  return [key, next]
}

function source(entry) {
  return `${entry.source}, ${entry.measured}`
}

async function main() {
  const current = JSON.parse(readFileSync(inRoot(FILE), "utf8"))
  const next = await Promise.all(Object.entries(current).map(refresh.bind(null, today())))
  writeFileSync(inRoot(FILE), `${JSON.stringify(Object.fromEntries(next), null, 2)}\n`)
}

main()
