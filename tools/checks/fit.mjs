/** Check (browser): on an iPhone 15 Pro screen, each card named in `fit.json` is shorter than the screen below the sticky header. Needs the Playwright browsers. */
import { createServer } from "node:http"
import { chromium, devices } from "playwright"
import { serveFile } from "../../server/static.mjs"
import { describe, roomBelow, tooTall } from "./fitBudget.mjs"
import rules from "./fit.json" with { type: "json" }

function rowOf(selector, box) {
  return { selector, height: box.height }
}

async function boxOf(node) {
  return node.boundingBox()
}

async function rowsFor(page, selector) {
  const boxes = await Promise.all((await page.locator(selector).all()).map(boxOf))
  return boxes.map(rowOf.bind(null, selector))
}

async function measure(page) {
  const header = await boxOf(page.locator(rules.header))
  const rows = (await Promise.all(rules.cards.map(rowsFor.bind(null, page)))).flat()
  return { room: roomBelow(page.viewportSize().height, header.height), rows }
}

async function open(browser, port) {
  const context = await browser.newContext({ ...devices[rules.device], reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" })
  return page
}

function report(room, row) {
  console.error(`fit: ${describe(room, row)}`)
}

async function main() {
  const server = createServer(serveFile).listen(0, "127.0.0.1")
  const browser = await chromium.launch()
  const { room, rows } = await measure(await open(browser, server.address().port))
  const faults = tooTall(rows, room)
  faults.forEach(report.bind(null, room))
  console.log(faults.length ? `${faults.length} card(s) too tall` : `fit ok: ${rows.length} cards fit ${Math.round(room)} px on ${rules.device}`)
  await browser.close()
  server.close()
  process.exitCode = faults.length ? 1 : 0
}

await main()
