/** The structured data in the head: the organization, the website and one software entry for each product. */

const CONTEXT = "https://schema.org"

function isFeatured(project) {
  return project.tier === "featured"
}

function idOf(site, name) {
  return `${site.url}#${name}`
}

function organization({ site, discovery }) {
  const contact = { "@type": "ContactPoint", contactType: discovery.structured.contactType, url: site.contact.bookingUrl }
  return { "@type": "Organization", "@id": idOf(site, "organization"), name: site.name, url: site.url, logo: `${site.url}${site.logo}`, description: site.description, sameAs: [site.social.href], contactPoint: contact }
}

function website({ site }) {
  return { "@type": "WebSite", "@id": idOf(site, "website"), name: site.name, url: site.url, description: site.description, inLanguage: "en", publisher: { "@id": idOf(site, "organization") } }
}

function application(data, project) {
  const { site, discovery } = data
  const { applicationCategory, operatingSystem } = discovery.structured
  const base = { "@type": "SoftwareApplication", "@id": idOf(site, project.id), name: project.name, url: project.links.primary.href, description: project.summary }
  return { ...base, applicationCategory, operatingSystem, publisher: { "@id": idOf(site, "organization") } }
}

/** The whole graph as one object. It has no price, no rating and no count. */
export function structuredData(data) {
  const products = data.projects.projects.filter(isFeatured).map(application.bind(null, data))
  return { "@context": CONTEXT, "@graph": [organization(data), website(data), ...products] }
}

/** One script tag. The "<" character is escaped, so no data value can close the tag. */
export function jsonLdScript(data) {
  const json = JSON.stringify(structuredData(data)).replaceAll("<", "\\u003c")
  return `<script type="application/ld+json">${json}</script>`
}
