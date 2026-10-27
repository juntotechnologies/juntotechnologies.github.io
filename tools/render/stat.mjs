/** The download figure of one package: a rounded count, what it counts, who counted it and when. */
import { escapeHtml } from "./escape.mjs"

const STEP = 1000
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

/** A count under one thousand stays exact. A larger count rounds down to the thousand and ends in a plus. */
export function formatCount(count) {
  if (count < STEP) return String(count)
  return `${(Math.floor(count / STEP) * STEP).toLocaleString("en-US")}+`
}

export function formatDate(isoDate) {
  return DATE_FORMAT.format(new Date(`${isoDate}T00:00:00Z`))
}

function source(entry) {
  const when = `<time datetime="${entry.measured}">${formatDate(entry.measured)}</time>`
  return `<span class="stat__source">Per ${escapeHtml(entry.source)}, ${when}</span>`
}

export function renderDownloads(entry) {
  const value = `<strong class="stat__value">${formatCount(entry.count)}</strong>`
  const text = `<span class="stat__text"><span class="stat__label">${escapeHtml(entry.label)}</span>${source(entry)}</span>`
  return `<p class="stat">${value}${text}</p>`
}

/** The figure for a project that names an entry in downloads.json, or an empty string. */
export function statFor(downloads, project) {
  if (!project.downloads) return ""
  const entry = downloads[project.downloads]
  if (!entry) throw new Error(`${project.id}: no downloads entry "${project.downloads}"`)
  return renderDownloads(entry)
}
