/** Puts the sections in order and returns the whole index.html. */
import { renderContact } from "./contact.mjs"
import { renderFooter } from "./footer.mjs"
import { renderHead } from "./head.mjs"
import { renderHeader } from "./header.mjs"
import { renderHero } from "./hero.mjs"
import { renderOpenSource } from "./openSource.mjs"
import { renderProjects } from "./showcase.mjs"
import { renderTeam } from "./team.mjs"

const SKIP_LINK = '<a class="skip-link" href="#main">Skip to content</a>'
const SCRIPTS = ['<script type="module" src="assets/js/theme.js"></script>', '<script type="module" src="assets/js/tabs.js"></script>', '<script type="module" src="assets/js/reveal.js"></script>']

function main(data) {
  const { site, projects } = data
  const parts = [renderHero(site.hero), renderProjects(site.projects, projects.projects), renderOpenSource(site.more, projects.projects), renderTeam(site.team), renderContact(site)]
  return `<main id="main" class="main">\n    ${parts.join("\n    ")}\n  </main>`
}

/** The whole page as one string. It has no script work to do before it shows. */
export function renderPage(data) {
  const { site } = data
  return `<!doctype html>
<html lang="en">
  ${renderHead(data)}
  <body id="top">
  ${SKIP_LINK}
  ${renderHeader(site)}
  ${main(data)}
  ${renderFooter(site)}
  ${SCRIPTS.join("\n  ")}
  </body>
</html>
`
}
