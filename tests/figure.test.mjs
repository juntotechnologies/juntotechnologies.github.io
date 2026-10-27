/** Tests for the three open source figures: the markup each kind renders and the hooks that the slider script reads. */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { renderFigure } from "../tools/render/figure.mjs"
import { inRoot } from "../tools/paths.mjs"
import { data, html } from "./built.mjs"

const projects = data.projects.projects
const open = projects.filter(isOpen)
const script = readFileSync(inRoot("assets/js/curve.js"), "utf8")

function isOpen(project) {
  return project.tier === "more"
}

function kindOf(project) {
  return project.illustration.kind
}

function hasKind(kind, project) {
  return kindOf(project) === kind
}

function byKind(kind) {
  return open.find(hasKind.bind(null, kind))
}

function assertCaption(figure) {
  assert.match(figure, /Illustration only\. Not real data\./)
}

function assertHook(hook) {
  assert.ok(html.includes(`data-${hook}`), `data-${hook} is missing from the page`)
}

function hookOf(match) {
  return match[1]
}

test("each open source project has a figure that says it shows no real data", () => {
  const figures = open.map(renderFigure)
  assert.equal(figures.length, 3)
  figures.forEach(assertCaption)
})

test("the three projects use three different kinds of figure", () => {
  assert.deepEqual(open.map(kindOf).sort(), ["calibration", "decision-curve", "equivalence"])
})

test("the decision curve starts at threshold 0 with the net benefit of each line labelled", () => {
  const figure = renderFigure(byKind("decision-curve"))
  assert.match(figure, /data-value="model">0\.20</)
  assert.match(figure, /data-value="all">0\.20</)
  assert.match(figure, /data-value="none">0\.00</)
  assert.match(figure, /data-output>0\.00</)
})

test("the decision curve links to the decision curve analysis website from its caption", () => {
  const figure = renderFigure(byKind("decision-curve"))
  assert.match(figure, /figure__caption[^]*href="https:\/\/mskcc-epi-bio\.github\.io\/decisioncurveanalysis\/"/)
})

test("each hook that curve.js reads exists in the built page", () => {
  const hooks = [...script.matchAll(/\[data-([a-z]+)/g)].map(hookOf)
  assert.ok(hooks.length >= 5)
  hooks.forEach(assertHook)
})

test("the slider is a native range input that has a label", () => {
  assert.match(html, /<input class="curve__range" id="curve-threshold" type="range"[^>]*aria-label="Threshold probability"/)
})

test("the equivalence figure names its interval and limits from the data", () => {
  const figure = renderFigure(byKind("equivalence"))
  assert.match(figure, /90% CI/)
  assert.match(figure, /80–125% limits/)
  assert.match(figure, />80%</)
})

test("the calibration figure shows two groups and the reference without a race group name", () => {
  const figure = renderFigure(byKind("calibration"))
  assert.match(figure, /Group A/)
  assert.match(figure, /Group B/)
  assert.doesNotMatch(figure, /Black|White|Asian|Hispanic/i)
})

test("the open source section holds no fact list and no text-only entry", () => {
  const section = html.slice(html.indexOf('id="open-source"'), html.indexOf('id="team"'))
  assert.doesNotMatch(section, /class="facts"/)
  assert.equal(section.match(/<figure class="figure/g).length, 3)
})
