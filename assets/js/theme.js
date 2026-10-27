/** Theme switch: flips data-theme on the root element, saves the choice and follows the system when none is saved. */

const KEY = "theme"
const root = document.documentElement
const toggle = document.querySelector("[data-theme-toggle]")
const system = matchMedia("(prefers-color-scheme: dark)")

function save(theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* The choice then lasts for this visit only. */
  }
}

function isSaved() {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    return false
  }
}

function show(theme) {
  root.dataset.theme = theme
  toggle.setAttribute("aria-pressed", String(theme === "dark"))
}

function endSwitch() {
  root.classList.remove("theme-switching")
}

/** Turn every transition off for one frame, so the whole page changes at once. */
function apply(theme) {
  root.classList.add("theme-switching")
  show(theme)
  root.getBoundingClientRect()
  requestAnimationFrame(endSwitch)
}

function onToggle() {
  const next = root.dataset.theme === "dark" ? "light" : "dark"
  save(next)
  apply(next)
}

function onSystemChange(event) {
  if (!isSaved()) apply(event.matches ? "dark" : "light")
}

show(root.dataset.theme)
toggle.addEventListener("click", onToggle)
system.addEventListener("change", onSystemChange)
