/** Tests for the tab rule: first-party links stay in the tab, external links open a new one. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { anchor } from "../tools/render/links.mjs"
import { data, html } from "./built.mjs"

const ANCHOR = /<a\s[^>]*href="(https:\/\/[^"]+)"[^>]*>/g

function hostOf(href) {
  return new URL(href).host
}

function firstPartyLinks(project) {
  return [project.links.primary, ...project.links.secondary].filter(isFirstParty)
}

function isFirstParty(link) {
  return link.scope === "first-party"
}

function linkHost(link) {
  return hostOf(link.href)
}

const firstParty = new Set(data.projects.projects.flatMap(firstPartyLinks).map(linkHost))

test("anchor adds no target to a first-party link", () => {
  const out = anchor({ label: "Open", href: "https://example.com/", scope: "first-party" }, "x")
  assert.doesNotMatch(out, /target=/)
})

test("anchor opens an external link in a new tab with rel, an icon and a note", () => {
  const out = anchor({ label: "Src", href: "https://example.com/", scope: "external" }, "x")
  assert.match(out, /target="_blank" rel="noopener noreferrer"/)
  assert.match(out, /<svg/)
  assert.match(out, /\(opens in a new tab\)/)
})

function checkTag(tag) {
  const [, href] = tag.match(/href="([^"]+)"/)
  const opensNewTab = /target="_blank"/.test(tag)
  assert.equal(opensNewTab, !firstParty.has(hostOf(href)), `${href}: wrong tab rule`)
  if (opensNewTab) assert.match(tag, /rel="noopener noreferrer"/, `${href}: no rel`)
}

function whole(match) {
  return match[0]
}

test("each https link in the built page follows the tab rule", () => {
  const tags = [...html.matchAll(ANCHOR)].map(whole)
  assert.ok(tags.length >= 6)
  tags.forEach(checkTag)
})

test("the in-page links have no target", () => {
  for (const [tag] of html.matchAll(/<a\s[^>]*href="#[^"]*"[^>]*>/g)) assert.doesNotMatch(tag, /target=/)
})
