/** Tests for HTML escaping and the inline markup of data text. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { escapeHtml } from "../tools/render/escape.mjs"
import { inlineMarkup } from "../tools/render/markup.mjs"

test("escapeHtml turns each special character into an entity", () => {
  assert.equal(escapeHtml(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;")
})

test("inlineMarkup makes bold text", () => {
  assert.equal(inlineMarkup("a **b** c"), "a <strong>b</strong> c")
})

test("inlineMarkup makes an external link that opens in a new tab", () => {
  const out = inlineMarkup("see [dcurves](https://example.com/x)")
  assert.match(out, /<a href="https:\/\/example.com\/x" target="_blank" rel="noopener noreferrer">dcurves<\/a>/)
})

test("inlineMarkup escapes markup in the text", () => {
  assert.equal(inlineMarkup("<script>x</script>"), "&lt;script&gt;x&lt;/script&gt;")
})

test("inlineMarkup ignores a link that is not https", () => {
  assert.equal(inlineMarkup("[x](javascript:alert(1))"), "[x](javascript:alert(1))")
})
