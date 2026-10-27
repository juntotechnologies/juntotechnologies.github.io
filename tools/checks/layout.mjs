/** Check (browser): at each width in `fit.json`, no sideways scroll, no heading over the line limit, equal outer margins and blocks in reading order. Needs the Playwright browsers. */
import { describeHeading, describeMargins, describeOrder, describeOverflow, misordered, overflowBy, tooManyLines, unevenMargins } from "./layoutBudget.mjs"

/** Runs in the page. It reads one heading: its words, its height and its line height. */
function headingRow(node) {
  const style = getComputedStyle(node)
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
  return { text: node.textContent.trim().slice(0, 40), height: node.getBoundingClientRect().height, lineHeight }
}

/** Runs in the page. It reads where one block starts and ends. */
function frameRow(node) {
  const box = node.getBoundingClientRect()
  return { left: box.left, right: box.right }
}

/** Runs in the page. It reads where one block sits from the top of the page. */
function boxRow(node) {
  const box = node.getBoundingClientRect()
  return { top: box.top + window.scrollY, bottom: box.bottom + window.scrollY }
}

/** Runs in the page. It reads the width of the page and of the screen. */
function pageWidths() {
  return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }
}

function readNode(read, node) {
  return node.evaluate(read)
}

async function rowsOf(page, selector, read) {
  return Promise.all((await page.locator(selector).all()).map(readNode.bind(null, read)))
}

function withSelector(selector, row) {
  return { ...row, selector }
}

async function framesOf(page, selector) {
  return (await rowsOf(page, selector, frameRow)).map(withSelector.bind(null, selector))
}

async function allFrames(page, selectors) {
  return (await Promise.all(selectors.map(framesOf.bind(null, page)))).flat()
}

async function boxesOf(page, selector) {
  return (await rowsOf(page, selector, boxRow)).map(withSelector.bind(null, selector)).slice(0, 1)
}

async function orderedBoxes(page, pairs) {
  return (await Promise.all(pairs.flat().map(boxesOf.bind(null, page)))).flat()
}

async function measure(page, rules) {
  const widths = await page.evaluate(pageWidths)
  const headings = await rowsOf(page, rules.headings, headingRow)
  return { widths, headings, frames: await allFrames(page, rules.frames), boxes: await orderedBoxes(page, rules.order) }
}

function faultsOf(rules, width, found) {
  const pixels = overflowBy(found.widths)
  const sideways = pixels ? [describeOverflow(width, pixels)] : []
  const headings = tooManyLines(found.headings, rules.maxHeadingLines).map(describeHeading.bind(null, width, rules.maxHeadingLines))
  const uneven = unevenMargins(found.frames, found.widths.client, rules.marginTolerance)
  const order = misordered(found.boxes, rules.order, rules.marginTolerance).map(describeOrder.bind(null, width))
  return [...sideways, ...headings, ...uneven.map(describeMargins.bind(null, width, found.widths.client)), ...order]
}

async function faultsAt(browser, port, rules, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" })
  const faults = faultsOf(rules, width, await measure(page, rules))
  await context.close()
  return faults
}

/** Every layout fault at every width in the rules, as lines of text. */
export async function layoutFaults(browser, port, rules) {
  const perWidth = []
  for (const width of rules.widths) perWidth.push(await faultsAt(browser, port, rules, width))
  return perWidth.flat()
}
