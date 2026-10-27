/** The team section: one card for each member, with a photo and a short biography. */
import { escapeHtml } from "./escape.mjs"
import { inlineMarkup } from "./markup.mjs"
import { sectionHead } from "./sectionHead.mjs"

function photo(person) {
  return `<img class="person__photo" src="${person.image}" width="${person.imageSize}" height="${person.imageSize}" alt="${escapeHtml(person.alt)}" loading="lazy" decoding="async" />`
}

function member(person) {
  return `<article class="person card reveal" style="--i:1">
        ${photo(person)}
        <div class="person__text">
          <h3 class="person__name">${escapeHtml(person.name)}</h3>
          <p class="person__role">${escapeHtml(person.role)}</p>
          <p class="person__bio">${inlineMarkup(person.bio)}</p>
        </div>
      </article>`
}

export function renderTeam(team) {
  return `<section class="section" id="team" aria-labelledby="team-title">
      ${sectionHead(team, "team-title")}
      ${team.members.map(member).join("\n      ")}
    </section>`
}
