/** The sticky header: the wordmark, the section links, the contact link and the theme switch. */
import { escapeHtml } from "./escape.mjs"
import { icon } from "./icons.mjs"

function navItem(item) {
  const modifier = item.primary ? " nav__link--contact" : ""
  return `<li><a class="nav__link${modifier}" href="${item.href}">${escapeHtml(item.label)}</a></li>`
}

function themeToggle() {
  return `<button class="theme-toggle" type="button" aria-label="Dark theme" aria-pressed="false" data-theme-toggle>
          <span class="theme-toggle__icon theme-toggle__icon--sun">${icon("sun")}</span>
          <span class="theme-toggle__icon theme-toggle__icon--moon">${icon("moon")}</span>
        </button>`
}

function wordmark(site) {
  return `<a class="wordmark" href="#top">
        <img class="wordmark__logo" src="${site.logo}" width="32" height="32" alt="" />
        <span class="wordmark__name">${escapeHtml(site.name)}</span>
      </a>`
}

export function renderHeader(site) {
  const items = site.nav.map(navItem).join("")
  return `<header class="header">
    <div class="header__inner">
      ${wordmark(site)}
      <nav class="nav" aria-label="Main"><ul class="nav__list">${items}</ul>
        ${themeToggle()}
      </nav>
    </div>
  </header>`
}
