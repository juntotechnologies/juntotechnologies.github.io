/** Check (network): fails when a fact that the hub restates has changed in the project that owns it. */
import { loadData } from "../data/load.mjs"
import { HANDLERS } from "./upstreamHandlers.mjs"

const TIMEOUT_MS = 15000

async function fetchText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

function isProject(id, project) {
  return project.id === id
}

async function mismatches(projects, entry) {
  const project = projects.find(isProject.bind(null, entry.project))
  return HANDLERS[entry.check](project, await fetchText(entry.url))
}

function report(line) {
  console.error(`drift: ${line}`)
}

async function main() {
  const { projects, upstream } = loadData()
  const found = (await Promise.all(upstream.map(mismatches.bind(null, projects.projects)))).flat()
  found.forEach(report)
  console.log(found.length ? `${found.length} mismatch(es)` : `upstream ok: ${upstream.length} sources match`)
  process.exitCode = found.length ? 1 : 0
}

await main()
