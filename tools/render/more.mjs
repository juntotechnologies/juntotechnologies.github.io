/** The list of smaller public projects: a name, two labels and one sentence each. */
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"

function isMore(project) {
  return project.tier === "more"
}

function row(project) {
  const link = anchor({ ...project.links.primary, label: project.name }, "more__link")
  return `<li class="more__row" id="${project.id}">
        <div class="more__name">${link}</div>
        <p class="more__meta"><span class="chip chip--label">${escapeHtml(project.kind)}</span><span class="chip chip--label">${escapeHtml(project.status)}</span></p>
        <p class="more__summary">${escapeHtml(project.summary)}</p>
      </li>`
}

export function renderMore(section, projects) {
  const rows = projects.filter(isMore).map(row).join("\n      ")
  return `<section class="section" id="code" aria-labelledby="code-title">
      <div class="section__head"><h2 id="code-title" class="section__title">${escapeHtml(section.heading)}</h2><p class="section__body">${escapeHtml(section.body)}</p></div>
      <ul class="more">
      ${rows}
      </ul>
    </section>`
}
