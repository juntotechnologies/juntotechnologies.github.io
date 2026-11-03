/** Pure steps of the phone fit check: the room below the sticky header, and the cards that do not fit it. */

export function roomBelow(viewportHeight, headerHeight) {
  return viewportHeight - headerHeight
}

function isTooTall(room, row) {
  return row.height > room
}

export function tooTall(rows, room) {
  return rows.filter(isTooTall.bind(null, room))
}

export function describe(room, row) {
  return `${row.selector} is ${Math.round(row.height)} px tall; the screen has ${Math.round(room)} px free below the header`
}
