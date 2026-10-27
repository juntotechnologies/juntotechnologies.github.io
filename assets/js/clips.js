/** Clips: plays each demo clip only while it is on screen and the tab is visible. A visitor who asks for less motion or less data sees the still. */

const CLIPS = "video[data-clip]"
const OPTIONS = { threshold: 0.4 }
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

function shouldPlay(video) {
  return onScreen.has(video) && !document.hidden
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

function onVisibility() {
  document.querySelectorAll(CLIPS).forEach(sync)
}

function start() {
  const observer = new IntersectionObserver(onIntersect, OPTIONS)
  document.querySelectorAll(CLIPS).forEach(observer.observe.bind(observer))
  document.addEventListener("visibilitychange", onVisibility)
}

if ("IntersectionObserver" in window && !wantsStill()) start()
