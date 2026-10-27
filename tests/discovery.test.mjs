/** Tests for the files that search engines and agents read: robots.txt, sitemap.xml, llms.txt, agents.txt, the structured data, the social tags and the social image. */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { generatedFiles } from "../tools/files.mjs"
import { structuredData } from "../tools/render/jsonld.mjs"
import { inRoot } from "../tools/paths.mjs"
import { data, html } from "./built.mjs"

const DATE = "2026-10-27"
const FILES = new Map(generatedFiles(data, readText, DATE))
const DISCOVERY = ["robots.txt", "sitemap.xml", "llms.txt", "agents.txt", ".well-known/agents.json"]
const FEATURED = data.projects.projects.filter(isFeatured)
const GRAPH = structuredData(data)["@graph"]
const FORBIDDEN_KEYS = ["offers", "aggregateRating", "ratingValue", "interactionStatistic", "price"]

function readText(relative) {
  return readFileSync(inRoot(relative), "utf8")
}

function isFeatured(project) {
  return project.tier === "featured"
}

function typeOf(node) {
  return node["@type"]
}

function textOf(path) {
  return FILES.get(path)
}

function containsEmail(path) {
  return textOf(path).includes(data.site.contact.email)
}

test("each discovery file exists in the generated set", () => {
  assert.deepEqual(DISCOVERY.filter(isMissing), [])
})

function isMissing(path) {
  return !FILES.has(path)
}

test("robots.txt allows each crawler and names the sitemap", () => {
  const robots = textOf("robots.txt")
  for (const name of data.discovery.crawlers) assert.match(robots, new RegExp(`User-agent: ${name.replace("*", "\\*")}\\nAllow: /`))
  assert.match(robots, new RegExp(`Sitemap: ${data.site.url}sitemap.xml`))
  for (const name of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]) assert.match(robots, new RegExp(`User-agent: ${name}`))
})

test("sitemap.xml lists the canonical address with a date", () => {
  const sitemap = textOf("sitemap.xml")
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  assert.match(sitemap, new RegExp(`<loc>${data.site.url}</loc><lastmod>${DATE}</lastmod>`))
})

test("llms.txt names each project and the booking link", () => {
  const llms = textOf("llms.txt")
  assert.match(llms, /^# Junto Technologies\n\n> /)
  for (const project of data.projects.projects) assert.match(llms, new RegExp(`\\[${project.name}\\]\\(${project.links.primary.href}\\)`))
  assert.match(llms, new RegExp(data.site.contact.bookingUrl))
})

test("agents.txt and agents.json state what an agent may and may not do", () => {
  const text = textOf("agents.txt")
  const json = JSON.parse(textOf(".well-known/agents.json"))
  for (const line of data.discovery.agents.may) assert.match(text, new RegExp(`Allow: ${line}`))
  for (const line of data.discovery.agents.mayNot) assert.match(text, new RegExp(`Disallow: ${line}`))
  assert.deepEqual(json.mayNotDo, data.discovery.agents.mayNot)
  assert.equal(json.url, data.site.url)
})

function leaksEmail(path) {
  return containsEmail(path)
}

test("no discovery file and no structured data holds the email address", () => {
  assert.deepEqual(DISCOVERY.filter(leaksEmail), [])
  assert.doesNotMatch(JSON.stringify(GRAPH), /@juntotechnologies|@[a-z]+\.[a-z]+/)
})

test("the structured data has the organization, the website and one application for each product", () => {
  const types = GRAPH.map(typeOf)
  assert.equal(types.filter(isOrganization).length, 1)
  assert.equal(types.filter(isWebsite).length, 1)
  assert.equal(types.filter(isApplication).length, FEATURED.length)
})

function isOrganization(type) {
  return type === "Organization"
}

function isWebsite(type) {
  return type === "WebSite"
}

function isApplication(type) {
  return type === "SoftwareApplication"
}

test("the structured data states no price, rating or count", () => {
  const text = JSON.stringify(GRAPH)
  for (const key of FORBIDDEN_KEYS) assert.doesNotMatch(text, new RegExp(`"${key}"`))
})

test("the page carries the structured data as valid JSON", () => {
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(script)
  const parsed = JSON.parse(script[1])
  assert.equal(parsed["@context"], "https://schema.org")
  assert.deepEqual(parsed["@graph"].map(typeOf), GRAPH.map(typeOf))
})

test("the head has Open Graph tags, Twitter tags, a canonical link and a theme color for each scheme", () => {
  for (const name of ["og:type", "og:title", "og:description", "og:url", "og:image", "og:image:width", "og:image:height", "og:image:alt"]) assert.match(html, new RegExp(`<meta property="${name}"`))
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) assert.match(html, new RegExp(`<meta name="${name}"`))
  assert.match(html, new RegExp(`<link rel="canonical" href="${data.site.url}" />`))
  assert.equal(html.match(/<meta name="theme-color"/g).length, 2)
  assert.match(html, new RegExp(`og:image" content="${data.site.url}${data.discovery.og.image}"`))
})

test("the social image is a PNG of 1200 by 630 pixels", () => {
  const header = readFileSync(inRoot(data.discovery.og.image)).subarray(0, 24)
  assert.equal(header.subarray(1, 4).toString(), "PNG")
  assert.equal(header.readUInt32BE(16), data.discovery.og.width)
  assert.equal(header.readUInt32BE(20), data.discovery.og.height)
})
