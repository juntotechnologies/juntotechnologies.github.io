/** Sets data-scroll on the root: "top" at the top of the page, "away" after it moves. The header reads it. */

const AWAY_AFTER_PX = 8
const root = document.documentElement

function state() {
  return scrollY > AWAY_AFTER_PX ? "away" : "top"
}

function update() {
  root.dataset.scroll = state()
}

addEventListener("scroll", update, { passive: true })
update()
