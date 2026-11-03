/** Check (browser): at each width in `fit.json`, no sideways scroll, no heading over the line limit, equal outer margins, blocks in reading order, buttons that keep their inset and cards that share one padding. Needs the Playwright browsers. */
import { describeButton, describeHeading, describeMargins, describeOrder, describeOverflow, describePads, distinctPads, misordered, overflowBy, tightButtons, tooManyLines, unevenMargins } from "./layoutBudget.mjs"

function headingRow(node) {
  const style = getComputedStyle(node)
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
  return { text: node.textContent.trim().slice(0, 40), height: node.getBoundingClientRect().height, lineHeight }
}

function frameRow(node) {
  const box = node.getBoundingClientRect()
  return { left: box.left, right: box.right }
}

function boxRow(node) {
  const box = node.getBoundingClientRect()
  return { top: box.top + window.scrollY, bottom: box.bottom + window.scrollY }
}

function buttonRow(node) {
  const box = node.getBoundingClientRect()
  const range = document.createRange()
  range.setStartBefore(node.firstChild)
  range.setEndAfter(node.querySelector(":scope > svg") ?? node.lastChild)
  const label = range.getBoundingClientRect()
  return { text: node.textContent.trim().slice(0, 40), left: label.left - box.left, right: box.right - label.right }
}

function padRow(node) {
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = getComputedStyle(node)
  return { pad: [paddingTop, paddingRight, paddingBottom, paddingLeft].join(" ") }
}

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

async function padsOf(page, selector) {
  return (await rowsOf(page, selector, padRow)).map(withSelector.bind(null, selector))
}

async function allPads(page, selectors) {
  return (await Promise.all(selectors.map(padsOf.bind(null, page)))).flat()
}

function withMin(min, row) {
  return { ...row, min }
}

async function insetsOf(page, [selector, min]) {
  return (await rowsOf(page, selector, buttonRow)).map(withMin.bind(null, min))
}

async function allInsets(page, minInset) {
  return (await Promise.all(Object.entries(minInset).map(insetsOf.bind(null, page)))).flat()
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
  const buttons = await allInsets(page, rules.minInset)
  return { widths, headings, buttons, pads: await allPads(page, rules.sameCardPad), frames: await allFrames(page, rules.frames), boxes: await orderedBoxes(page, rules.order) }
}

function faultsOf(rules, width, found) {
  const pixels = overflowBy(found.widths)
  const sideways = pixels ? [describeOverflow(width, pixels)] : []
  const headings = tooManyLines(found.headings, rules.maxHeadingLines).map(describeHeading.bind(null, width, rules.maxHeadingLines))
  const uneven = unevenMargins(found.frames, found.widths.client, rules.marginTolerance)
  const order = misordered(found.boxes, rules.order, rules.marginTolerance).map(describeOrder.bind(null, width))
  const tight = tightButtons(found.buttons).map(describeButton.bind(null, width))
  const pads = distinctPads(found.pads).length > 1 ? [describePads(width, found.pads)] : []
  return [...sideways, ...headings, ...uneven.map(describeMargins.bind(null, width, found.widths.client)), ...order, ...tight, ...pads]
}

async function faultsAt(browser, port, rules, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" })
  const faults = faultsOf(rules, width, await measure(page, rules))
  await context.close()
  return faults
}

export async function layoutFaults(browser, port, rules) {
  const perWidth = []
  for (const width of rules.widths) perWidth.push(await faultsAt(browser, port, rules, width))
  return perWidth.flat()
}
