/** Loads each JSON data file once and checks it against its JSON Schema. Bad data stops the build. */
import { readFileSync } from "node:fs"
import Ajv from "ajv/dist/2020.js"
import { inRoot } from "../paths.mjs"

const SOURCES = [
  { key: "site", data: "data/site.json", schema: "data/schema/site.schema.json" },
  { key: "projects", data: "data/projects.json", schema: "data/schema/projects.schema.json" },
  { key: "discovery", data: "data/discovery.json", schema: "data/schema/discovery.schema.json" },
  { key: "design", data: "data/design.json", schema: "data/schema/design.schema.json" },
  { key: "upstream", data: "data/upstream.json", schema: "data/schema/upstream.schema.json" },
]

export function readJson(relative) {
  return JSON.parse(readFileSync(inRoot(relative), "utf8"))
}

function describe(error) {
  return `${error.instancePath || "/"} ${error.message}`
}

function validated(ajv, source) {
  const check = ajv.compile(readJson(source.schema))
  const data = readJson(source.data)
  if (!check(data)) throw new Error(`${source.data}: ${check.errors.map(describe).join("; ")}`)
  return [source.key, data]
}

/** Every data file, validated: { site, projects, discovery, design, upstream }. */
export function loadData() {
  const ajv = new Ajv({ allErrors: true, strict: true })
  return Object.fromEntries(SOURCES.map(validated.bind(null, ajv)))
}
