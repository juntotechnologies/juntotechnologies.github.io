/** Static file handler for the dev server: maps a request path to a file under the repo root. */
import { readFile } from "node:fs/promises"
import { extname, resolve, sep } from "node:path"
import mime from "./mime.json" with { type: "json" }
import { ROOT } from "../tools/paths.mjs"

const FALLBACK_TYPE = "application/octet-stream"

/** The file that a URL path names, or null when the path leaves the repo root. */
export function resolveFile(urlPath) {
  const name = decodeURIComponent(new URL(urlPath, "http://host").pathname)
  const file = resolve(ROOT, `.${name === "/" ? "/index.html" : name}`)
  return file.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep) ? file : null
}

export function contentType(file) {
  return mime[extname(file)] ?? FALLBACK_TYPE
}

function send(response, status, headers, body) {
  response.writeHead(status, headers)
  response.end(body)
}

function failure(response, error) {
  const missing = error.code === "ENOENT" || error.code === "EISDIR"
  send(response, missing ? 404 : 500, { "Content-Type": "text/plain" }, missing ? "Not found" : "Server error")
}

export async function serveFile(request, response) {
  const file = resolveFile(request.url)
  if (!file) return send(response, 403, { "Content-Type": "text/plain" }, "Forbidden")
  try {
    send(response, 200, { "Content-Type": contentType(file) }, await readFile(file))
  } catch (error) {
    failure(response, error)
  }
}
