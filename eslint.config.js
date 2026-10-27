/** ESLint config: code shape limits, no nested functions, and the file docstring rule. */
import js from "@eslint/js"
import globals from "globals"
import shape from "./code-shape.json" with { type: "json" }
import fileDocstring from "./tools/eslint/file-docstring.js"

const MESSAGE_NESTED = "Define functions at top level; never inside another function."
const NESTED_FUNCTION = { selector: ":function :function", message: MESSAGE_NESTED }

const SHAPE_LIMITS = {
  complexity: ["error", shape.maxComplexity],
  "max-depth": ["error", shape.maxDepth],
  "max-params": ["error", shape.maxParams],
  "max-lines-per-function": ["error", { max: shape.maxFunctionLines, skipBlankLines: true, skipComments: true }],
  "no-restricted-syntax": ["error", NESTED_FUNCTION],
}

const CODE_FILES = ["**/*.{js,mjs}"]
const DOCSTRING = { plugins: { local: { rules: { "file-docstring": fileDocstring } } }, rules: { "local/file-docstring": "error" } }

export default [
  { ignores: ["node_modules", "proof", "public"] },
  js.configs.recommended,
  { files: CODE_FILES, languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: SHAPE_LIMITS },
  { files: CODE_FILES, ...DOCSTRING },
  { files: ["assets/js/theme-init.js"], languageOptions: { sourceType: "script" } },
  { files: ["tests/**"], rules: { "max-lines-per-function": "off" } },
]
