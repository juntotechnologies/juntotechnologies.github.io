/** The dates for the sitemap: the day of the last commit, and the date that the sitemap on disk already holds. */
import { execFileSync } from "node:child_process"
import { ROOT } from "./paths.mjs"

const DATE = /<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/

/** The day of the newest commit, as YYYY-MM-DD. */
export function dateOfLastCommit() {
  return execFileSync("git", ["log", "-1", "--format=%cs"], { cwd: ROOT, encoding: "utf8" }).trim()
}

/** The date inside a sitemap, so a check can compare everything but the date. */
export function dateInSitemap(text) {
  return DATE.exec(text)?.[1] ?? ""
}
