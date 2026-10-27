/** Tests for the built page: ids and anchors, images, public-safety words, and each project card. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { data, html } from "./built.mjs"

const FEATURED = data.projects.projects.filter(isFeatured)
const FORBIDDEN = [/\$\s?\d/, /pricing/i, /\bprice/i, /part 11/i, /21 cfr/i, /open[- ]source/i]

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

test("each featured project has a card with its own id", () => {
  FEATURED.forEach(hasCard)
})

function hasCard(project) {
  assert.match(html, new RegExp(`<article class="project" id="${project.id}"`))
}

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

test("the Bench Bridge card says demo and sample data", () => {
  assert.match(html, /Sample data/)
  assert.match(html, /mock LIMS/)
})
