/** Tests for the stylesheet: colors come from tokens, and each token that CSS reads exists. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { css, tokensCss } from "./built.mjs"

const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/
const LOOK_TOKENS = ["look-surface", "look-ink", "look-accent"]

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

test("each token that site.css reads is defined", () => {
  const used = new Set([...css.matchAll(/var\(--([a-z0-9-]+)/g)].map(tokenName))
  const missing = [...used].filter(isUndefined)
  assert.deepEqual(missing, [])
})

function isUndefined(name) {
  return !LOOK_TOKENS.includes(name) && !tokensCss.includes(`--${name}:`)
}

test("site.css honors reduced motion", () => {
  assert.match(css, /prefers-reduced-motion: reduce/)
})

test("the stretched card link stays above the preview, also while pressed", () => {
  assert.match(css, /\.project__primary::after \{[^}]*z-index: 1;/)
  assert.match(css, /\.project__primary:active \{\s*scale: none;/)
})
