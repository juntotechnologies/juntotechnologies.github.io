/** Runs before first paint. Sets data-theme and the feature classes, and drops a feature class when its script never starts. */
const THEMES = ["light", "dark"]
const FAILSAFE_MS = 3000
const root = document.documentElement

root.dataset.theme = savedTheme() ?? systemTheme()
root.classList.add("tabs-on")
if (canReveal()) root.classList.add("reveal-on")
setTimeout(releaseUnready, FAILSAFE_MS)

function savedTheme() {
  try {
    const saved = localStorage.getItem("theme")
    return THEMES.includes(saved) ? saved : null
  } catch {
    return null
  }
}

function systemTheme() {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** The scroll reveal needs IntersectionObserver, and it stays off for a visitor who asks for less motion. */
function canReveal() {
  return "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Each script marks its feature, with data-tabs or data-reveal. A feature that is not ready after the delay shows all its content. */
function releaseUnready() {
  if (!root.dataset.tabs) root.classList.remove("tabs-on")
  if (!root.dataset.reveal) root.classList.remove("reveal-on")
}
