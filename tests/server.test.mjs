/** Tests for the dev server: path handling, content types and the tailnet name parser. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { ROOT } from "../tools/paths.mjs"
import { contentType, resolveFile } from "../server/static.mjs"
import { parseSelf } from "../server/tailnet.mjs"

test("resolveFile maps the root path to index.html", () => {
  assert.equal(resolveFile("/"), `${ROOT}index.html`)
})

test("resolveFile maps a nested path under the repo root", () => {
  assert.equal(resolveFile("/assets/css/site.css"), `${ROOT}assets/css/site.css`)
})

test("resolveFile refuses a path that leaves the repo root", () => {
  assert.equal(resolveFile("/..%2f..%2fetc/passwd"), null)
})

test("resolveFile keeps a dot-dot path that the URL parser resolves inside the root", () => {
  assert.equal(resolveFile("/%2e%2e/%2e%2e/etc/passwd"), `${ROOT}etc/passwd`)
})

test("contentType knows the file types of the site", () => {
  assert.match(contentType("a.html"), /text\/html/)
  assert.match(contentType("a.css"), /text\/css/)
  assert.match(contentType("a.webp"), /image\/webp/)
  assert.equal(contentType("a.unknown"), "application/octet-stream")
})

test("parseSelf returns the tailnet name without a trailing dot and the first address", () => {
  const raw = JSON.stringify({ Self: { DNSName: "box.example.ts.net.", TailscaleIPs: ["100.64.0.1", "fd7a::1"] } })
  assert.deepEqual(parseSelf(raw), { name: "box.example.ts.net", ip: "100.64.0.1" })
})
