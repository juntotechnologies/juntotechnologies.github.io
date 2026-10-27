/** Capture command: takes one screenshot of each featured project's live site and saves it as a WebP preview. */
import { execFileSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright"
import { loadData } from "./data/load.mjs"
import { inRoot } from "./paths.mjs"

const QUALITY = "82"
const SETTLE_MS = 1500

function isFeatured(project) {
  return project.tier === "featured"
}

async function shoot(browser, project, png) {
  const { capture } = project
  const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height }, colorScheme: "light" })
  await page.goto(capture.url, { waitUntil: "networkidle" })
  await page.waitForTimeout(SETTLE_MS)
  await page.screenshot({ path: png, clip: capture.clip })
  await page.close()
}

function toWebp(project, png) {
  const { preview } = project
  const args = ["-quiet", "-q", QUALITY, "-resize", String(preview.width), String(preview.height), png, "-o", inRoot(preview.file)]
  execFileSync("cwebp", args)
}

async function capture(browser, scratch, project) {
  const png = join(scratch, `${project.id}.png`)
  await shoot(browser, project, png)
  toWebp(project, png)
  console.log(`wrote ${project.preview.file}`)
}

async function main() {
  const scratch = mkdtempSync(join(tmpdir(), "junto-previews-"))
  const browser = await chromium.launch()
  for (const project of loadData().projects.projects.filter(isFeatured)) await capture(browser, scratch, project)
  await browser.close()
  rmSync(scratch, { recursive: true })
}

await main()
