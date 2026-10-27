/** Markdown tables for the generated doc blocks. Each table comes from data/projects.json. */

function cell(text) {
  return String(text).replaceAll("|", "\\|")
}

function row(cells) {
  return `| ${cells.map(cell).join(" | ")} |`
}

function rule() {
  return "---"
}

function table(head, rows) {
  return [row(head), row(head.map(rule)), ...rows.map(row)].join("\n")
}

function isFeatured(project) {
  return project.tier === "featured"
}

function backlinkRow(site, project) {
  return [project.name, `\`${site.url}#${project.id}\``, project.backlink.text, project.backlink.placement]
}

/** One row for each featured project: the hub address to link to, the wording, and where it goes. */
export function backlinkTable(data) {
  const featured = data.projects.projects.filter(isFeatured)
  return table(["Project", "Link to the hub card", "Wording", "Placement"], featured.map(backlinkRow.bind(null, data.site)))
}

function entry(site, project) {
  return [project.id, { label: project.backlink.text, href: `${site.url}#${project.id}` }]
}

/** The label and address of each backlink as JSON. A project copies its entry into its own labels file. */
export function entryBlock(data) {
  const featured = data.projects.projects.filter(isFeatured)
  const entries = Object.fromEntries(featured.map(entry.bind(null, data.site)))
  return ["```json", JSON.stringify(entries, null, 2), "```"].join("\n")
}

function projectRow(project) {
  const { primary } = project.links
  return [project.name, project.tier, project.kind, project.status, primary.href, primary.scope]
}

export function projectTable(data) {
  return table(["Project", "Tier", "Kind", "Status", "Primary link", "Tab"], data.projects.projects.map(projectRow))
}

function colorRow([name, token]) {
  return [`\`--${name}\``, token.light, token.dark, token.use]
}

/** One row for each color token: the name, the light value, the dark value and the use. */
export function colorTable(data) {
  return table(["Token", "Light", "Dark", "Use"], Object.entries(data.design.color).map(colorRow))
}

function fixedRow([name, value]) {
  return [`\`--${name}\``, `\`${value}\``]
}

/** One row for each fixed token: spacing, type, radius, motion and layout. */
export function tokenTable(data) {
  return table(["Token", "Value"], Object.entries(data.design.fixed).map(fixedRow))
}
