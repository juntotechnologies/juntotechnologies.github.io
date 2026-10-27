/** Pure steps of the download refresh: read the count from a badge and make the next data entry. */

const COUNT = />([0-9][0-9,]*)</g

function countOf(match) {
  return Number(match[1].replaceAll(",", ""))
}

/** The last number in the badge text. A badge that holds no number returns -1. */
export function parseBadgeCount(text) {
  const numbers = [...text.matchAll(COUNT)].map(countOf)
  return numbers.length ? numbers.at(-1) : -1
}

/** The entry with a new count and date. A count that is not a whole number stops the refresh. */
export function refreshedEntry(entry, count, measured) {
  if (!Number.isInteger(count) || count < 0) throw new Error(`${entry.package}: the badge held no count`)
  return { ...entry, count, measured }
}
