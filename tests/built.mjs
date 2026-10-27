/** Test helper: the validated data and the built page, loaded once for all tests. */
import { readFileSync } from "node:fs"
import { loadData } from "../tools/data/load.mjs"
import { inRoot } from "../tools/paths.mjs"

export const data = loadData()
export const html = readFileSync(inRoot("index.html"), "utf8")
export const css = readFileSync(inRoot("assets/css/site.css"), "utf8")
export const tokensCss = readFileSync(inRoot("assets/css/tokens.css"), "utf8")
