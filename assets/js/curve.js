/** Decision curve slider: moves the vertical line and the dots, and writes the net benefit of each line at the threshold. */
import { describe, formatBenefit, markerAt, readout, thresholdAt, xAt } from "./decision-curve.js"
import { round } from "./svg-path.js"

const FIGURES = "[data-curve]"
const RANGE = "[data-range]"
const LIVE = "curve--live"
const TOUCHED = "is-touched"

function curveOf(figure) {
  return { prevalence: Number(figure.dataset.prevalence), separation: Number(figure.dataset.separation) }
}

function moveDot(figure, benefits, name) {
  const marker = markerAt(benefits[name])
  const dot = figure.querySelector(`[data-dot="${name}"]`)
  dot.setAttribute("cy", marker.y)
  dot.style.visibility = marker.visible ? "visible" : "hidden"
}

function writeValue(figure, benefits, name) {
  figure.querySelector(`[data-value="${name}"]`).textContent = formatBenefit(benefits[name])
}

function show(figure, t) {
  const curve = curveOf(figure)
  const benefits = readout(curve, t)
  const names = Object.keys(benefits)
  figure.querySelector("[data-probe]").setAttribute("transform", `translate(${round(xAt(t))} 0)`)
  names.forEach(moveDot.bind(null, figure, benefits))
  names.forEach(writeValue.bind(null, figure, benefits))
  figure.querySelector("[data-output]").textContent = t.toFixed(2)
  figure.querySelector(RANGE).setAttribute("aria-valuetext", describe(JSON.parse(figure.dataset.names), curve, t))
}

function onInput(figure, event) {
  figure.classList.add(TOUCHED)
  show(figure, Number(event.target.value))
}

function isOnThumb(event) {
  return event.target.matches(RANGE)
}

/** A press or a drag on the plot sets the threshold. The thumb moves itself. */
function scrub(figure, event) {
  if (event.buttons !== 1 || isOnThumb(event)) return
  const box = figure.querySelector(".figure__plot").getBoundingClientRect()
  const range = figure.querySelector(RANGE)
  range.value = thresholdAt((event.clientX - box.left) / box.width)
  range.dispatchEvent(new Event("input"))
}

function grab(figure, event) {
  if (!isOnThumb(event)) event.currentTarget.setPointerCapture(event.pointerId)
  scrub(figure, event)
}

function start(figure) {
  const stage = figure.querySelector(".curve__stage")
  figure.querySelector(RANGE).addEventListener("input", onInput.bind(null, figure))
  stage.addEventListener("pointerdown", grab.bind(null, figure))
  stage.addEventListener("pointermove", scrub.bind(null, figure))
  figure.classList.add(LIVE)
  show(figure, Number(figure.querySelector(RANGE).value))
}

document.querySelectorAll(FIGURES).forEach(start)
