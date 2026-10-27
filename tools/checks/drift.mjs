/** Check: fails when a generated file on disk differs from what the data files produce. The sitemap date is the one value that git sets, so it keeps the date on disk. */
import { existsSync, readFileSync } from "node:fs"
import { loadData } from "../data/load.mjs"
import { generatedFiles } from "../files.mjs"
import { dateInSitemap } from "../lastModified.mjs"
import { inRoot } from "../paths.mjs"

function readText(relative) {
  return readFileSync(inRoot(relative), "utf8")
}

function isStale([relative, content]) {
  return !existsSync(inRoot(relative)) || readText(relative) !== content
}

function report([relative]) {
  console.error(`stale: ${relative}. Run npm run build.`)
}

function sitemapDate() {
  return existsSync(inRoot("sitemap.xml")) ? dateInSitemap(readText("sitemap.xml")) : ""
}

const stale = generatedFiles(loadData(), readText, sitemapDate()).filter(isStale)
stale.forEach(report)
process.exitCode = stale.length ? 1 : 0
