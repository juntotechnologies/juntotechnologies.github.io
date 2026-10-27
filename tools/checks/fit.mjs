/** Check (browser): on an iPhone 15 Pro screen, each card named in `fit.json` is shorter than the screen below the sticky header. At each width, the page has no sideways scroll, no long heading and equal margins. Needs the Playwright browsers. */
import { createServer } from "node:http"
import { chromium, devices } from "playwright"
import { serveFile } from "../../server/static.mjs"
import { describe, roomBelow, tooTall } from "./fitBudget.mjs"
import { layoutFaults } from "./layout.mjs"
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

async function cardFaults(browser, port) {
  const { room, rows } = await measure(await open(browser, port))
  const faults = tooTall(rows, room)
  faults.forEach(report.bind(null, room))
  console.log(faults.length ? `${faults.length} card(s) too tall` : `fit ok: ${rows.length} cards fit ${Math.round(room)} px on ${rules.device}`)
  return faults.length
}

function reportLayout(line) {
  console.error(`layout: ${line}`)
}

async function layoutCheck(browser, port) {
  const { layout } = rules
  const faults = await layoutFaults(browser, port, layout)
  faults.forEach(reportLayout)
  console.log(faults.length ? `${faults.length} layout fault(s)` : `layout ok: ${layout.widths.join(", ")} px have no sideways scroll, no heading over ${layout.maxHeadingLines} lines, equal margins and the hero text below its title`)
  return faults.length
}

async function main() {
  const server = createServer(serveFile).listen(0, "127.0.0.1")
  const browser = await chromium.launch()
  const port = server.address().port
  const failed = (await cardFaults(browser, port)) + (await layoutCheck(browser, port))
  await browser.close()
  server.close()
  process.exitCode = failed ? 1 : 0
}

await main()
