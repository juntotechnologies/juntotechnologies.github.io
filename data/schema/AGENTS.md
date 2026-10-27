# data/schema/

JSON Schema, draft 2020-12, one file for each data file.

## Rules
- `tools/data/load.mjs` compiles each schema in strict mode.
- Set `additionalProperties` to `false` on each object.
- A new data field needs a schema change in the same commit.
