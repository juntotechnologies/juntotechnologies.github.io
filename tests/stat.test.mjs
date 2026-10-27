/** Tests for the download figure: rounding, the date, the markup and the lookup by project. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { formatCount, formatDate, renderDownloads, statFor } from "../tools/render/stat.mjs"

const ENTRY = { label: "PyPI downloads", count: 79704, measured: "2026-10-27", source: "pepy.tech" }

test("a count rounds down to the thousand and ends in a plus", () => {
  assert.equal(formatCount(79704), "79,000+")
  assert.equal(formatCount(1000), "1,000+")
  assert.equal(formatCount(123456), "123,000+")
})

test("a count under one thousand stays exact", () => {
  assert.equal(formatCount(999), "999")
  assert.equal(formatCount(0), "0")
})

test("the date reads day, short month and year", () => {
  assert.equal(formatDate("2026-10-27"), "27 Oct 2026")
  assert.equal(formatDate("2026-01-05"), "5 Jan 2026")
})

test("the figure names the count, what it counts, the source and the date", () => {
  const html = renderDownloads(ENTRY)
  assert.match(html, /<strong class="stat__value">79,000\+<\/strong>/)
  assert.match(html, /PyPI downloads/)
  assert.match(html, /Per pepy\.tech, <time datetime="2026-10-27">27 Oct 2026<\/time>/)
})

test("the figure escapes its text", () => {
  assert.match(renderDownloads({ ...ENTRY, source: "a<b" }), /a&lt;b/)
})

test("a project with no downloads key has no figure", () => {
  assert.equal(statFor({}, { id: "p" }), "")
})

test("a project that names a missing entry stops the build", () => {
  assert.throws(statFor.bind(null, {}, { id: "p", downloads: "nope" }), /no downloads entry "nope"/)
})

test("a project that names an entry gets its figure", () => {
  assert.match(statFor({ p: ENTRY }, { id: "p", downloads: "p" }), /class="stat"/)
})
