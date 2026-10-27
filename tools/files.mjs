/** The generated files as path and content pairs. Reading and writing stay in the callers. */
import { renderPage } from "./render/page.mjs"
import { renderTokens } from "./render/tokens.mjs"
import { backlinkTable, entryBlock, projectTable } from "./render/docTables.mjs"
import { replaceBlock } from "./docs.mjs"

const DOC_FILES = [
  { path: "docs/backlinks.md", blocks: [{ name: "backlinks", render: backlinkTable }, { name: "backlink-entries", render: entryBlock }] },
  { path: "docs/projects.md", blocks: [{ name: "projects", render: projectTable }] },
]

function fillBlock(data, text, block) {
  return replaceBlock(text, block.name, block.render(data))
}

function docFile(data, readText, doc) {
  return [doc.path, doc.blocks.reduce(fillBlock.bind(null, data), readText(doc.path))]
}

/** Every generated file: index.html, the tokens and the generated blocks inside the docs. */
export function generatedFiles(data, readText) {
  return [["index.html", renderPage(data)], ["assets/css/tokens.css", renderTokens(data.design)], ...DOC_FILES.map(docFile.bind(null, data, readText))]
}
