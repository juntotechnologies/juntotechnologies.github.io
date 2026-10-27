/** The generated files as path and content pairs. Reading and writing stay in the callers. */
import { renderPage } from "./render/page.mjs"
import { renderTokens } from "./render/tokens.mjs"
import { agentsJson, agentsTxt, llmsTxt, robotsTxt, sitemapXml } from "./render/discovery.mjs"
import { backlinkTable, colorTable, entryBlock, projectTable, tokenTable } from "./render/docTables.mjs"
import { replaceBlock } from "./docs.mjs"

const DOC_FILES = [
  { path: "docs/backlinks.md", blocks: [{ name: "backlinks", render: backlinkTable }, { name: "backlink-entries", render: entryBlock }] },
  { path: "docs/projects.md", blocks: [{ name: "projects", render: projectTable }] },
  { path: "docs/design.md", blocks: [{ name: "colors", render: colorTable }, { name: "tokens", render: tokenTable }] },
]

function fillBlock(data, text, block) {
  return replaceBlock(text, block.name, block.render(data))
}

function docFile(data, readText, doc) {
  return [doc.path, doc.blocks.reduce(fillBlock.bind(null, data), readText(doc.path))]
}

function discoveryFiles(data, lastModified) {
  return [
    ["robots.txt", robotsTxt(data)],
    ["sitemap.xml", sitemapXml(data, lastModified)],
    ["llms.txt", llmsTxt(data)],
    ["agents.txt", agentsTxt(data)],
    [".well-known/agents.json", agentsJson(data)],
  ]
}

/** Every generated file: the page, the tokens, the discovery files and the generated blocks inside the docs. */
export function generatedFiles(data, readText, lastModified) {
  const page = [["index.html", renderPage(data)], ["assets/css/tokens.css", renderTokens(data.design)]]
  return [...page, ...discoveryFiles(data, lastModified), ...DOC_FILES.map(docFile.bind(null, data, readText))]
}
