/** The document head: metadata, social tags, structured data, the theme script that runs before first paint, fonts and styles. */
import { escapeHtml } from "./escape.mjs"
import { jsonLdScript } from "./jsonld.mjs"

function themeColor(design, scheme) {
  return `<meta name="theme-color" media="(prefers-color-scheme: ${scheme})" content="${design.color.bg[scheme]}" />`
}

function property(name, value) {
  return `<meta property="${name}" content="${escapeHtml(String(value))}" />`
}

function named(name, value) {
  return `<meta name="${name}" content="${escapeHtml(String(value))}" />`
}

function propertyPair([name, value]) {
  return property(name, value)
}

/** The text alternative of the social image: the site name and the hero heading, as the image shows them. */
export function ogAlt(site) {
  return `${site.name}. ${site.hero.heading}.`
}

function openGraph({ site, discovery }) {
  const { og } = discovery
  const pairs = [["og:type", og.type], ["og:site_name", site.name], ["og:title", site.name], ["og:description", site.description], ["og:url", site.url]]
  const image = [["og:image", `${site.url}${og.image}`], ["og:image:width", og.width], ["og:image:height", og.height], ["og:image:alt", ogAlt(site)]]
  return [...pairs, ...image].map(propertyPair)
}

function twitter({ site, discovery }) {
  const { og } = discovery
  const pairs = [["twitter:card", og.card], ["twitter:title", site.name], ["twitter:description", site.description], ["twitter:image", `${site.url}${og.image}`], ["twitter:image:alt", ogAlt(site)]]
  return pairs.map(namedPair)
}

function namedPair([name, value]) {
  return named(name, value)
}

function metadata(data) {
  const { site } = data
  return [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<meta name="color-scheme" content="light dark" />',
    `<title>${escapeHtml(site.name)}</title>`,
    named("description", site.description),
    `<link rel="canonical" href="${site.url}" />`,
    ...openGraph(data),
    ...twitter(data),
    themeColor(data.design, "light"),
    themeColor(data.design, "dark"),
  ]
}

function assets(site) {
  return [
    `<link rel="icon" type="image/png" href="${site.favicon}" />`,
    '<link rel="preload" href="public/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />',
    '<script src="assets/js/theme-init.js"></script>',
    '<link rel="stylesheet" href="assets/css/tokens.css" />',
    '<link rel="stylesheet" href="assets/css/site.css" />',
  ]
}

export function renderHead(data) {
  const lines = [...metadata(data), ...assets(data.site), jsonLdScript(data)]
  return `<head>\n    ${lines.join("\n    ")}\n  </head>`
}
