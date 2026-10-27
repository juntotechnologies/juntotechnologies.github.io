/** The team section: one card for each member, with a photo and a short biography. */
import { escapeHtml } from "./escape.mjs"
import { inlineMarkup } from "./markup.mjs"

function member(person) {
  return `<article class="person">
        <img class="person__photo" src="${person.image}" width="160" height="160" alt="${escapeHtml(person.alt)}" loading="lazy" decoding="async" />
        <div class="person__text">
          <h3 class="person__name">${escapeHtml(person.name)}</h3>
          <p class="person__role">${escapeHtml(person.role)}</p>
          <p class="person__bio">${inlineMarkup(person.bio)}</p>
        </div>
      </article>`
}

export function renderTeam(team) {
  return `<section class="section" id="team" aria-labelledby="team-title">
      <div class="section__head"><h2 id="team-title" class="section__title">${escapeHtml(team.heading)}</h2><p class="section__body">${escapeHtml(team.body)}</p></div>
      ${team.members.map(member).join("\n      ")}
    </section>`
}
