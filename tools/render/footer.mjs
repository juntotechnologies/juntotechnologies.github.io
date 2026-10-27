/** The footer: the copyright line and the link to the public code. */
import { escapeHtml } from "./escape.mjs"
import { anchor } from "./links.mjs"

export function renderFooter(site) {
  const social = anchor({ ...site.social, scope: "external" }, "footer__link")
  return `<footer class="footer">
    <div class="footer__inner">
      <p class="footer__copy">© ${escapeHtml(site.name)}. ${escapeHtml(site.footer.copyright)}</p>
      <p class="footer__links">${social}</p>
    </div>
  </footer>`
}
