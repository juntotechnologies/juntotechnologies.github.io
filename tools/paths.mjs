/** Absolute paths for the repo root and the files that the tools read and write. */
import { fileURLToPath } from "node:url"
import { join } from "node:path"

export const ROOT = fileURLToPath(new URL("../", import.meta.url))

export function inRoot(relative) {
  return join(ROOT, relative)
}
