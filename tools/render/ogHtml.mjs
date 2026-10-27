/** The HTML of the social image: the logo, the site name, the hero heading and the description, on the light page colours. */
import { escapeHtml } from "./escape.mjs"

function declaration([name, token]) {
  return `--${name}: ${token.light};`
}

function rootVariables(color) {
  return `:root { ${Object.entries(color).map(declaration).join(" ")} }`
}

function fontFace(assets) {
  return `@font-face { font-family: "Inter"; src: url("${assets.font}") format("woff2"); font-weight: 100 900; }`
}

function body(site, assets) {
  const brand = `<div class="brand"><img src="${assets.logo}" alt="" />${escapeHtml(site.name)}</div>`
  const copy = `<div class="copy"><h1>${escapeHtml(site.hero.heading)}</h1><p>${escapeHtml(site.description)}</p></div>`
  return `<div class="dots"></div><div class="glow"></div>${brand}${copy}<div class="host">${escapeHtml(new URL(site.url).host)}</div>`
}

/** One document of 1200 by 630 pixels. The caller passes the stylesheet text and the file addresses of the font and the logo. */
export function ogHtml(data, assets) {
  const styles = [fontFace(assets), rootVariables(data.design.color), assets.css].join("\n")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><style>\n${styles}\n</style></head><body>${body(data.site, assets)}</body></html>`
}
