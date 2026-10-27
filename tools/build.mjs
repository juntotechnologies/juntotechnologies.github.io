/** Build command: writes every generated file from the JSON data files. Run it after a data change. */
import { readFileSync, writeFileSync } from "node:fs"
import { loadData } from "./data/load.mjs"
import { generatedFiles } from "./files.mjs"
import { inRoot } from "./paths.mjs"

function readText(relative) {
  return readFileSync(inRoot(relative), "utf8")
}

function write([relative, content]) {
  writeFileSync(inRoot(relative), content)
  console.log(`wrote ${relative}`)
}

generatedFiles(loadData(), readText).forEach(write)
