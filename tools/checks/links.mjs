/** Check (network): fails when a web link in index.html does not answer, or an in-page link has no target. */
import { readFileSync } from "node:fs"
import { inRoot } from "../paths.mjs"

const TIMEOUT_MS = 15000
const WEB_LINK = /\b(?:href|src)="(https:\/\/[^"]+)"/g
const PAGE_LINK = /\bhref="#([^"]+)"/g
const PAGE_ID = /\bid="([^"]+)"/g

function captured(match) {
  return match[1]
}

function matches(pattern, html) {
  return [...new Set([...html.matchAll(pattern)].map(captured))]
}

async function answers(url) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) })
    return response.status < 400 ? [] : [`${url}: HTTP ${response.status}`]
  } catch (error) {
    return [`${url}: ${error.message}`]
  }
}

function noTarget(name) {
  return `#${name} has no target`
}

function lacksTarget(ids, name) {
  return name === "top" ? false : !ids.includes(name)
}

function report(problem) {
  console.error(`link: ${problem}`)
}

async function main() {
  const html = readFileSync(inRoot("index.html"), "utf8")
  const ids = matches(PAGE_ID, html)
  const dead = matches(PAGE_LINK, html).filter(lacksTarget.bind(null, ids)).map(noTarget)
  const web = matches(WEB_LINK, html)
  const failed = [...dead, ...(await Promise.all(web.map(answers))).flat()]
  failed.forEach(report)
  console.log(failed.length ? `${failed.length} problem(s)` : `links ok: ${web.length} web links, ${ids.length} ids`)
  process.exitCode = failed.length ? 1 : 0
}

await main()
