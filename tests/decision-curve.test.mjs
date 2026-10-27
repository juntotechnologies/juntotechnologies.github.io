/** Tests for the decision curve maths and the plot geometry that the build and the slider share. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { BOX, DOMAIN, LINES, areaFor, benefitAll, benefitModel, benefitNone, describe, formatBenefit, markerAt, normalCdf, pathFor, readout, thresholdAt, xAt, yAt } from "../assets/js/decision-curve.js"
import { linePath, round } from "../assets/js/svg-path.js"

const CURVE = { prevalence: 0.2, separation: 1.5 }
const NAMES = { model: "Model", all: "Treat all", none: "Treat none" }
const SAMPLES = [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5]

function isModelAtLeastBoth(t) {
  const model = benefitModel(CURVE, t)
  return model >= benefitNone() - 1e-9 && model >= benefitAll(CURVE, t) - 1e-9
}

test("normalCdf is 0.5 at zero and close to 0.975 at 1.96", () => {
  assert.equal(normalCdf(0), 0.5)
  assert.ok(Math.abs(normalCdf(1.96) - 0.975) < 1e-4)
  assert.ok(Math.abs(normalCdf(-1.96) - 0.025) < 1e-4)
})

test("at threshold 0 treating all and the model both give the prevalence, and treating none gives 0", () => {
  assert.deepEqual(readout(CURVE, 0), { model: 0.2, all: 0.2, none: 0 })
})

test("treating all gives net benefit 0 when the threshold equals the prevalence", () => {
  assert.ok(Math.abs(benefitAll(CURVE, 0.2)) < 1e-12)
  assert.ok(benefitAll(CURVE, 0.3) < 0)
})

test("a calibrated model never does worse than treating all or treating none", () => {
  assert.ok(SAMPLES.every(isModelAtLeastBoth))
})

test("the model line falls as the threshold rises", () => {
  assert.ok(benefitModel(CURVE, 0.1) > benefitModel(CURVE, 0.3))
})

test("every line has a handler", () => {
  assert.deepEqual(Object.keys(LINES).sort(), ["all", "model", "none"])
})

test("xAt and yAt map the domain corners onto the plot box", () => {
  assert.equal(xAt(0), BOX.left)
  assert.equal(xAt(DOMAIN.tMax), BOX.right)
  assert.equal(yAt(DOMAIN.nbMin), BOX.bottom)
  assert.equal(yAt(DOMAIN.nbMax), BOX.top)
})

test("a path starts at the first sample and has one point per sample", () => {
  const path = pathFor(CURVE, "model")
  assert.ok(path.startsWith(`M${round(xAt(0))} ${round(yAt(0.2))}`))
  assert.equal(path.split("L").length, Math.round(DOMAIN.tMax / 0.005) + 1)
})

test("the area closes along the line for treating none", () => {
  assert.ok(areaFor(CURVE).endsWith("Z"))
  assert.ok(areaFor(CURVE).includes(`L${round(xAt(DOMAIN.tMax))} ${round(yAt(0))}`))
})

test("formatBenefit shows two decimals and a true minus sign", () => {
  assert.equal(formatBenefit(0.2), "0.20")
  assert.equal(formatBenefit(-0.075), "−0.07")
  assert.equal(formatBenefit(-0.001), "0.00")
})

test("markerAt hides a marker that falls below the plot", () => {
  assert.equal(markerAt(0.1).visible, true)
  assert.equal(markerAt(-0.3).visible, false)
})

test("thresholdAt clamps to the plot and snaps to the step", () => {
  assert.equal(thresholdAt(0), 0)
  assert.equal(thresholdAt(1), DOMAIN.tMax)
  assert.equal(thresholdAt(xAt(0.25) / BOX.width), 0.25)
  assert.equal(thresholdAt(xAt(0.07) / BOX.width), 0.07)
})

test("describe names the threshold and each line with its value", () => {
  assert.equal(describe(NAMES, CURVE, 0), "Threshold 0.00. Model 0.20, Treat all 0.20, Treat none 0.00")
})

test("linePath joins rounded points", () => {
  assert.equal(linePath([[1.04, 2], [3, 4.46]]), "M1 2L3 4.5")
})
