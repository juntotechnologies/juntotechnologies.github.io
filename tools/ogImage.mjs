/** Image command: renders the social image from the data and saves it as a 1200 by 630 PNG. Run it after a change to the name, heading or colours. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { chromium } from "playwright"
import { loadData } from "./data/load.mjs"
import { inRoot } from "./paths.mjs"
import { ogHtml } from "./render/ogHtml.mjs"

const SETTLE_MS = 400

function assetUrls(data) {
  const font = pathToFileURL(inRoot("public/fonts/inter-latin.woff2")).href
  return { font, logo: pathToFileURL(inRoot(data.site.logo)).href, css: readFileSync(inRoot("tools/og.css"), "utf8") }
}

async function render(data, scratch) {
  const file = join(scratch, "og.html")
  writeFileSync(file, ogHtml(data, assetUrls(data)))
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: data.discovery.og.width, height: data.discovery.og.height } })
  await page.goto(pathToFileURL(file).href)
  await page.waitForTimeout(SETTLE_MS)
  await page.screenshot({ path: inRoot(data.discovery.og.image) })
  await browser.close()
}

async function main() {
  const data = loadData()
  const scratch = mkdtempSync(join(tmpdir(), "junto-og-"))
  await render(data, scratch)
  rmSync(scratch, { recursive: true })
  console.log(`wrote ${data.discovery.og.image}`)
}

await main()
