/** Generated blocks in Markdown: finds the block that a name marks and swaps its content. */

function pattern(name) {
  return new RegExp(`(<!-- gen:${name} -->)[\\s\\S]*?(<!-- /gen -->)`)
}

function swap(content, _match, open, close) {
  return `${open}\n${content}\n${close}`
}

export function hasBlock(text, name) {
  return pattern(name).test(text)
}

export function replaceBlock(text, name, content) {
  return text.replace(pattern(name), swap.bind(null, content))
}
