/** Tests for the stylesheet: colors come from tokens, and each token that CSS reads exists. */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { inRoot } from "../tools/paths.mjs"
import { css, html, tokensCss } from "./built.mjs"

const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/
const LOOK_TOKENS = ["look-surface", "look-accent"]

function withoutComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "")
}

function tokenName(match) {
  return match[1]
}

test("site.css has no raw color", () => {
  assert.doesNotMatch(withoutComments(css), COLOR_LITERAL)
})

test("transition never uses all", () => {
  assert.doesNotMatch(css, /transition(-property)?:\s*all/)
})

test("each custom property that site.css reads is defined in tokens.css, in site.css or inline in the page", () => {
  const used = new Set([...css.matchAll(/var\(--([a-z0-9-]+)/g)].map(tokenName))
  const missing = [...used].filter(isUndefined)
  assert.deepEqual(missing, [])
})

function isUndefined(name) {
  return !LOOK_TOKENS.includes(name) && !tokensCss.includes(`--${name}:`) && !css.includes(`--${name}:`) && !css.includes(`@property --${name} `) && !html.includes(`--${name}:`)
}

test("site.css honors reduced motion", () => {
  assert.match(css, /prefers-reduced-motion: reduce/)
})

test("the stretched tile link stays above the tile", () => {
  assert.match(css, /\.tile__link::after \{[^}]*z-index: 1;/)
})

/** The last six repaint a small box: the header shadow, and the pointer glow that @property registers. None changes layout. */
const MOTION_PROPERTIES = ["opacity", "translate", "transform", "scale", "filter", "color", "background-color", "border-color", "visibility", "box-shadow", "--glow", "--gx", "--gy", "--hx", "--hy"]

function trimmed(name) {
  return name.trim()
}

function propertiesOf(match) {
  return match[1].split(",").map(trimmed)
}

function isNotMotion(name) {
  return !MOTION_PROPERTIES.includes(name)
}

function isNotMotionOrNone(name) {
  return name !== "none" && isNotMotion(name)
}

test("each transition names only properties that the GPU can composite, or a colour", () => {
  const lists = [...css.matchAll(/transition-property:\s*([^;]+);/g)].map(propertiesOf)
  assert.ok(lists.length > 5)
  assert.deepEqual(lists.flat().filter(isNotMotion), [])
})

test("each shorthand transition names a property", () => {
  const shorthand = [...css.matchAll(/\n\s+transition:\s*([a-z-]+)\s/g)].map(tokenName)
  assert.deepEqual(shorthand.filter(isNotMotionOrNone), [])
})

test("the panels share one grid cell, so the card never changes height", () => {
  assert.match(css, /\.tabs-on \.panel \{[^}]*grid-area: 1 \/ 1;/)
})

test("without the feature classes the page shows everything", () => {
  assert.doesNotMatch(css, /\n\.reveal \{[^}]*opacity: 0;/)
  assert.match(css, /\.reveal-on \.reveal \{[^}]*opacity: 0;/)
  assert.match(css, /\.tabs \{[^}]*display: none;/)
})

const DESIGN_DOC = readFileSync(inRoot("docs/design.md"), "utf8")

function motionSection() {
  return DESIGN_DOC.split("## Motion")[1].split("### Reduced motion")[0]
}

function ruleCell(line) {
  return line.split("|")[3].trim().replaceAll("`", "")
}

function isEffectRow(line) {
  return line.startsWith("| ") && line.includes("`")
}

function isMissingFromCss(rule) {
  return !css.includes(rule)
}

test("each effect in docs/design.md names a rule or keyframes that site.css holds", () => {
  const rules = motionSection().split("\n").filter(isEffectRow).map(ruleCell)
  assert.ok(rules.length >= 12)
  assert.deepEqual(rules.filter(isMissingFromCss), [])
})
