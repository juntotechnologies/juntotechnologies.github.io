/** The contact band: one heading, one sentence, and the two ways to reach Shaun. */
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"
import { icon } from "./icons.mjs"

function mailLink(site) {
  const label = `${icon("mail")}${escapeHtml(site.contactBand.emailLabel)}`
  return `<a class="button button--large button--primary" href="mailto:${escapeHtml(site.contact.email)}">${label}</a>`
}

function bookingLink(site) {
  const link = { label: site.contactBand.bookingLabel, href: site.contact.bookingUrl, scope: "external" }
  return anchor(link, "button button--large button--quiet")
}

export function renderContact(site) {
  const text = `<div class="contact__text"><h2 id="contact-title" class="contact__title">${escapeHtml(site.contactBand.heading)}</h2><p class="contact__body">${escapeHtml(site.contactBand.body)}</p></div>`
  return `<section class="section contact" id="contact" aria-labelledby="contact-title">
      <div class="contact__box reveal">
        ${text}
        <p class="actions contact__actions">${mailLink(site)}${bookingLink(site)}</p>
      </div>
    </section>`
}
