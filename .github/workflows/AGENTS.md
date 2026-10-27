# .github/workflows/

GitHub Actions workflows for the hub.

## Workflows
| File | Job | Writes |
| --- | --- | --- |
| `refresh-downloads.yml` | Refresh `data/downloads.json` each month, rebuild, check and push to `main`. | `contents: write` |

## Rules
- Pin each action to a full commit SHA. Write the version in a comment on the same line.
- Give a workflow only the permissions it needs. Name each write permission in the table above.
- `refresh-downloads.yml` is the one workflow that pushes to `main` with no pull request. Shaun approved this on 2026-10-27 because a count refresh is low risk and easy to undo.
- `tests/workflow.test.mjs` fails when the schedule, the commands, the pins or the docs that name the workflow drift.
