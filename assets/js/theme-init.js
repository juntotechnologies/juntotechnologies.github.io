/** Sets data-theme before first paint, from the saved choice or the system setting. */
const THEMES = ["light", "dark"]

document.documentElement.dataset.theme = savedTheme() ?? systemTheme()

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
