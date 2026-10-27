/** Tabs for the projects card: shows one panel at a time, keeps the choice in the URL hash and moves with the arrow keys. */

const root = document.documentElement
const list = document.querySelector('[role="tablist"]')
const tabs = list ? [...list.querySelectorAll('[role="tab"]')] : []
const MOVES = { ArrowRight: nextIndex, ArrowLeft: previousIndex, Home: firstIndex, End: lastIndex }

function nextIndex(current) {
  return (current + 1) % tabs.length
}

function previousIndex(current) {
  return (current + tabs.length - 1) % tabs.length
}

function firstIndex() {
  return 0
}

function lastIndex() {
  return tabs.length - 1
}

function panelOf(tab) {
  return document.getElementById(tab.getAttribute("aria-controls"))
}

function mark(index, tab, position) {
  const on = position === index
  tab.setAttribute("aria-selected", String(on))
  tab.tabIndex = on ? 0 : -1
  panelOf(tab).classList.toggle("is-selected", on)
}

/** Show one panel. The tab list holds the index for the CSS that slides the indicator. */
function select(index) {
  tabs.forEach(mark.bind(null, index))
  list.style.setProperty("--tab", String(index))
}

function choose(index) {
  select(index)
  history.replaceState(null, "", `#${panelOf(tabs[index]).id}`)
}

function hasId(id, tab) {
  return tab.getAttribute("aria-controls") === id
}

/** A hash that names a project selects its tab. Any other hash leaves the choice as it is. */
function applyHash() {
  const index = tabs.findIndex(hasId.bind(null, location.hash.slice(1)))
  if (index >= 0) select(index)
}

function onClick(event) {
  event.preventDefault()
  choose(tabs.indexOf(event.currentTarget))
}

function onKey(event) {
  const move = MOVES[event.key]
  if (!move) return
  event.preventDefault()
  const index = move(tabs.indexOf(event.currentTarget))
  choose(index)
  tabs[index].focus()
}

function wire(tab) {
  tab.addEventListener("click", onClick)
  tab.addEventListener("keydown", onKey)
}

function enableMotion() {
  root.dataset.tabs = "live"
}

/** The motion starts one frame later, so a deep link does not slide the indicator at load. */
function start() {
  tabs.forEach(wire)
  applyHash()
  window.addEventListener("hashchange", applyHash)
  root.dataset.tabs = "ready"
  requestAnimationFrame(enableMotion)
}

if (tabs.length > 1) start()
