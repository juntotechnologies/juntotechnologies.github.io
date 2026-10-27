/** Clips: plays each demo clip only while it is on screen, in the selected panel, with the tab visible. A visitor who asks for less motion or less data sees the still. */

const CLIPS = "video[data-clip]"
const PANEL = ".panel"
const SELECTED = "is-selected"
const OPTIONS = { threshold: 0.4 }
const root = document.documentElement
const onScreen = new Set()

function wantsStill() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(navigator.connection?.saveData)
}

function ignore() {
  return undefined
}

function play(video) {
  video.muted = true
  video.play()?.catch(ignore)
}

/** With live tabs the panels overlap, so a clip in an unselected panel counts as hidden. */
function isShown(video) {
  if (!root.classList.contains("tabs-on")) return true
  return video.closest(PANEL)?.classList.contains(SELECTED) ?? true
}

function shouldPlay(video) {
  return onScreen.has(video) && isShown(video) && !document.hidden
}

function sync(video) {
  if (shouldPlay(video)) play(video)
  else video.pause()
}

function track(entry) {
  if (entry.isIntersecting) onScreen.add(entry.target)
  else onScreen.delete(entry.target)
  sync(entry.target)
}

function onIntersect(entries) {
  entries.forEach(track)
}

function syncAll() {
  document.querySelectorAll(CLIPS).forEach(sync)
}

function watchPanel(watcher, panel) {
  watcher.observe(panel, { attributes: true, attributeFilter: ["class"] })
}

function start() {
  const observer = new IntersectionObserver(onIntersect, OPTIONS)
  document.querySelectorAll(CLIPS).forEach(observer.observe.bind(observer))
  document.addEventListener("visibilitychange", syncAll)
  document.querySelectorAll(PANEL).forEach(watchPanel.bind(null, new MutationObserver(syncAll)))
}

if ("IntersectionObserver" in window && !wantsStill()) start()
