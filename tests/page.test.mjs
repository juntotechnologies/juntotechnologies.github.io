/** Tests for the built page: ids and anchors, images, public-safety words, and each project card. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { formatCount } from "../tools/render/stat.mjs"
import { data, html } from "./built.mjs"

const FEATURED = data.projects.projects.filter(isFeatured)
const FORBIDDEN = [/\$\s?\d/, /pricing/i, /\bprice/i, /part 11/i, /21 cfr/i]

function isFeatured(project) {
  return project.tier === "featured"
}

function fragmentOf(match) {
  return match[1]
}

test("each in-page link has a matching id", () => {
  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map(fragmentOf)
  const missing = targets.filter(lacksId)
  assert.deepEqual(missing, [])
})

function lacksId(id) {
  return !html.includes(`id="${id}"`)
}

test("each id appears once", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(fragmentOf)
  assert.equal(new Set(ids).size, ids.length)
})

test("each featured project has a tab panel with its own id", () => {
  FEATURED.forEach(hasPanel)
})

function hasPanel(project) {
  assert.match(html, new RegExp(`<article class="panel[^"]*" role="tabpanel" id="${project.id}"`))
}

test("each tab names its panel, and each panel names its tab", () => {
  FEATURED.forEach(isWired)
})

function isWired(project) {
  assert.match(html, new RegExp(`role="tab" id="tab-${project.id}" href="#${project.id}" aria-controls="${project.id}"`))
  assert.match(html, new RegExp(`id="${project.id}" aria-labelledby="tab-${project.id}"`))
}

test("the tab list has one selected tab and shows the first panel", () => {
  assert.equal(html.match(/aria-selected="true"/g).length, 1)
  assert.equal(html.match(/<article class="panel is-selected"/g).length, 1)
  assert.match(html, /role="tablist" aria-label="[^"]+"/)
})

test("the page has one h1 and a language", () => {
  assert.equal(html.match(/<h1[\s>]/g).length, 1)
  assert.match(html, /<html lang="en">/)
})

test("each image has an alt attribute and a size", () => {
  const images = html.match(/<img\s[^>]*>/g)
  assert.ok(images.length >= 3)
  images.forEach(hasAltAndSize)
})

function hasAltAndSize(tag) {
  assert.match(tag, /\salt="[^"]*"/, tag)
  assert.match(tag, /\swidth="\d+"/, tag)
  assert.match(tag, /\sheight="\d+"/, tag)
}

function checkForbidden(pattern) {
  assert.doesNotMatch(html, pattern, `the page matches ${pattern}`)
}

test("the page has no price, no Part 11 claim and no open source claim", () => {
  FORBIDDEN.forEach(checkForbidden)
})

test("the page loads no third-party script", () => {
  const sources = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(fragmentOf)
  assert.deepEqual(sources.filter(isRemote), [])
})

function isRemote(source) {
  return /^(https?:)?\/\//.test(source)
}

function cardOf(id) {
  return html.match(new RegExp(`<article class="panel[^"]*" role="tabpanel" id="${id}"[\\s\\S]*?</article>`))[0]
}

test("the Bench Bridge panel says demo and sample data, and never open source", () => {
  const panel = cardOf("bench-bridge")
  assert.match(panel, /Sample data/)
  assert.match(panel, /mock LIMS/)
  assert.doesNotMatch(panel, /open[- ]source/i)
})

function positionOf(id) {
  return html.indexOf(`id="${id}"`)
}

function ascending(a, b) {
  return a - b
}

function isFound(index) {
  return index > 0
}

test("the open source section names dcurves before bioeq and hct-equity", () => {
  const order = ["dcurves", "bioeq", "hct-equity"].map(positionOf)
  assert.deepEqual([...order].sort(ascending), order)
  assert.ok(order.every(isFound))
})

test("the dcurves entry states the verified facts and the measured download count", () => {
  const entry = data.downloads.dcurves
  assert.match(html, /Apache-2\.0 license/)
  assert.ok(html.includes(formatCount(entry.count)))
  assert.ok(html.includes(`Per ${entry.source}`))
})

test("the page states no star count and no other download count", () => {
  assert.doesNotMatch(html, /\bstars?\b/i)
  assert.equal(html.match(/class="stat"/g).length, 1)
})

test("the dcurves card links the decision curve analysis website", () => {
  assert.match(html, /href="https:\/\/mskcc-epi-bio\.github\.io\/decisioncurveanalysis\/"/)
})

test("the illustration says that it shows no real data", () => {
  assert.match(html, /Illustration only\. Not real data\./)
})
