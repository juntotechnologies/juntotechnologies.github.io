/** The document head: metadata, the theme script that runs before first paint, fonts and styles. */
import { escapeHtml } from "./escape.mjs"

const THEME_COLORS = { light: "#faf8f5", dark: "#171311" }

function themeColor(scheme) {
  return `<meta name="theme-color" media="(prefers-color-scheme: ${scheme})" content="${THEME_COLORS[scheme]}" />`
}

function social(site) {
  const title = escapeHtml(site.name)
  return [`<meta property="og:title" content="${title}" />`, `<meta property="og:description" content="${escapeHtml(site.description)}" />`, `<meta property="og:url" content="${site.url}" />`]
}

function metadata(site) {
  return [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<meta name="color-scheme" content="light dark" />',
    `<title>${escapeHtml(site.name)}</title>`,
    `<meta name="description" content="${escapeHtml(site.description)}" />`,
    `<link rel="canonical" href="${site.url}" />`,
    ...social(site),
    themeColor("light"),
    themeColor("dark"),
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

export function renderHead(site) {
  const lines = [...metadata(site), ...assets(site)]
  return `<head>\n    ${lines.join("\n    ")}\n  </head>`
}
