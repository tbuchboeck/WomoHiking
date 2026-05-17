# Proposed workflows (require `workflow` OAuth scope to install)

Files in this directory are GitHub Actions workflow definitions that the
overnight Reflexion loop (2026-05-17) prepared but **could not commit** to
`.github/workflows/` directly. The local gh OAuth token lacks the
`workflow` scope, which GitHub requires for any change under
`.github/workflows/*.yml`.

## How to install

```bash
# 1. Grant the workflow scope to your local gh CLI:
gh auth refresh -s workflow

# 2. Move the workflow into place:
mv docs/proposed/link-check.yml .github/workflows/link-check.yml

# 3. Commit and push:
git add .github/workflows/link-check.yml docs/proposed/
git commit -m "ci: install link-health workflow (from docs/proposed/)"
git push
```

The README badge in the top-level `README.md` is already linking at
`actions/workflows/link-check.yml/badge.svg?branch=main` — it will go
red ("workflow not found") until the move + commit above happens.

## Contents

- `link-check.yml` — weekly link-health CI per GOAL.md Phase 6.
  Full rationale + threshold tuning notes in `LEARNED.md` (iter 2 + iter 8).
