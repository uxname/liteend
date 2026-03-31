---
name: check
description: Run npm run check to verify the project passes TypeScript, Biome, and Knip checks. Report errors without auto-fixing.
---

The user wants to verify the liteend project passes all code quality checks.

## What to do

Run the check pipeline and report the results:

```bash
cd /home/dex/Документы/Work/liteend
npm run check
```

## What the pipeline checks

`npm run check` runs three tools in parallel via `run-p`:

1. **`tsc --noEmit`** — TypeScript type checking
2. **`biome check --write`** — Linting + formatting (auto-fixes formatting, flags lint errors)
3. **`knip --production`** — Unused exports, files, and dependencies

## Reporting results

- If all checks pass: confirm the project is clean
- If there are errors: list them grouped by tool (TypeScript / Biome / Knip), and briefly describe what needs to be fixed
- Do NOT auto-fix unless the user explicitly asks — use `/check-and-fix` for that
