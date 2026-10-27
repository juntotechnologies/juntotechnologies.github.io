/** The picture of an open source project. Its kind picks the renderer from the table. */
import { renderCalibration } from "./calibration.mjs"
import { renderCurve } from "./curve.mjs"
import { renderEquivalence } from "./equivalence.mjs"

const RENDERERS = {
  "decision-curve": renderCurve,
  equivalence: renderEquivalence,
  calibration: renderCalibration,
}

export function renderFigure(project) {
  return RENDERERS[project.illustration.kind](project.illustration, project.links.learn)
}
