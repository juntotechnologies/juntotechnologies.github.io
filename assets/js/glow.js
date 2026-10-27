/** Pointer glow: writes the pointer position onto each target under it. CSS draws the light and eases it. */
import { offsetIn, px } from "./geometry.js"

const TARGETS = [
  { selector: ".button, .card", x: "--gx", y: "--gy" },
  { selector: ".hero", x: "--hx", y: "--hy" },
]
const HOVER = "(hover: hover) and (pointer: fine)"
const STILL = "(prefers-reduced-motion: reduce)"

function canFollow() {
  return matchMedia(HOVER).matches && !matchMedia(STILL).matches
}

function place(event, element, target) {
  const { x, y } = offsetIn(element.getBoundingClientRect(), event)
  element.style.setProperty(target.x, px(x))
  element.style.setProperty(target.y, px(y))
}

function follow(event, target) {
  const element = event.target.closest(target.selector)
  if (element) place(event, element, target)
}

function aim(event) {
  TARGETS.forEach(follow.bind(null, event))
}

if (canFollow()) document.addEventListener("pointermove", aim, { passive: true })
