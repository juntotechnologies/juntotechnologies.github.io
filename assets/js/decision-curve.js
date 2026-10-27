/** Decision curve maths and plot geometry. Pure functions, so the build and the page draw the same curves. */
import { linePath, round } from "./svg-path.js"

export const DOMAIN = { tMax: 0.5, nbMin: -0.05, nbMax: 0.22 }
export const BOX = { width: 360, height: 176, left: 32, right: 348, top: 12, bottom: 164 }
export const STEP = 0.01
const SAMPLE = 0.005
const MINUS = "−"

/** Error function, after Abramowitz and Stegun 7.1.26. The error stays under 1.5e-7. */
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
  return Math.sign(x) * (1 - poly * Math.exp(-x * x))
}

export function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function logit(p) {
  return Math.log(p / (1 - p))
}

function odds(t) {
  return t / (1 - t)
}

/** Net benefit of treating everyone. It starts at the prevalence and falls below zero. */
export function benefitAll(curve, t) {
  return curve.prevalence - (1 - curve.prevalence) * odds(t)
}

export function benefitNone() {
  return 0
}

/** The score cutoff at which a calibrated binormal model reaches the threshold probability. */
function cutoffAt(curve, t) {
  return (logit(t) - logit(curve.prevalence) + curve.separation ** 2 / 2) / curve.separation
}

/** Net benefit of a calibrated model whose scores are normal, with a gap of `separation` between the two groups. */
export function benefitModel(curve, t) {
  if (t === 0) return curve.prevalence
  const cutoff = cutoffAt(curve, t)
  const truePositive = curve.prevalence * (1 - normalCdf(cutoff - curve.separation))
  const falsePositive = (1 - curve.prevalence) * (1 - normalCdf(cutoff))
  return truePositive - falsePositive * odds(t)
}

export const LINES = { model: benefitModel, all: benefitAll, none: benefitNone }

export function xAt(t) {
  return BOX.left + (t / DOMAIN.tMax) * (BOX.right - BOX.left)
}

export function yAt(benefit) {
  const share = (benefit - DOMAIN.nbMin) / (DOMAIN.nbMax - DOMAIN.nbMin)
  return BOX.bottom - share * (BOX.bottom - BOX.top)
}

function point(curve, name, t) {
  return [xAt(t), yAt(LINES[name](curve, t))]
}

function thresholdAtIndex(_, index) {
  return index * SAMPLE
}

function thresholds() {
  return Array.from({ length: Math.round(DOMAIN.tMax / SAMPLE) + 1 }, thresholdAtIndex)
}

/** The SVG path of one line, sampled along the whole threshold range. */
export function pathFor(curve, name) {
  return linePath(thresholds().map(point.bind(null, curve, name)))
}

/** The region between the model line and the line for treating none. */
export function areaFor(curve) {
  const base = round(yAt(0))
  return `${pathFor(curve, "model")}L${round(xAt(DOMAIN.tMax))} ${base}L${round(xAt(0))} ${base}Z`
}

function entryAt(curve, t, name) {
  return [name, LINES[name](curve, t)]
}

/** Net benefit of each line at one threshold. */
export function readout(curve, t) {
  return Object.fromEntries(Object.keys(LINES).map(entryAt.bind(null, curve, t)))
}

/** Two decimals, with a true minus sign. A value that rounds to zero shows no sign. */
export function formatBenefit(value) {
  const text = Math.abs(value).toFixed(2)
  return value < 0 && Number(text) !== 0 ? `${MINUS}${text}` : text
}

/** Where a marker sits on its line, and whether the line is still inside the plot there. */
export function markerAt(benefit) {
  return { y: round(yAt(benefit)), visible: benefit >= DOMAIN.nbMin && benefit <= DOMAIN.nbMax }
}

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value))
}

/** The threshold under a pointer. `fraction` is the pointer position across the plot box, from 0 to 1. */
export function thresholdAt(fraction) {
  const x = fraction * BOX.width
  const share = clamp((x - BOX.left) / (BOX.right - BOX.left), 0, 1)
  return Number((Math.round((share * DOMAIN.tMax) / STEP) * STEP).toFixed(2))
}

function phrase(names, values, key) {
  return `${names[key]} ${formatBenefit(values[key])}`
}

/** One sentence for a screen reader: the threshold, then each line with its net benefit. */
export function describe(names, curve, t) {
  const parts = Object.keys(LINES).map(phrase.bind(null, names, readout(curve, t)))
  return `Threshold ${t.toFixed(2)}. ${parts.join(", ")}`
}
