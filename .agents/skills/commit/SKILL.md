---
name: commit
description: Create a git commit with all unstaged changes. Use this skill whenever the user asks to commit, make a commit, save changes to git, or says something like "commit this", "commit all changes". Always runs npm run check before committing and fixes any errors found.
---

The user wants to commit all current changes to git.

## Process

### Step 1: Run the quality check

Before doing anything else, run:

```bash
npm run check
```

If it fails, do not proceed. Invoke the `/check` skill to diagnose and automatically fix linting, typing, or unused code errors, then return to this workflow.

### Step 2: Review what will be committed

```bash
git status
git diff
```

Understand what changed so you can write an accurate commit message.

### Step 3: Stage all changes

```bash
git add -A
```

### Step 4: Write the commit message

Follow the conventional commits format:

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `style`

Pick the scope from the affected module or area (e.g. `auth`, `user`, `prisma`, `graphql`). Omit scope if changes are broad. Keep the description under 72 characters, imperative mood, no trailing period.

**Example:**
```
feat(auth): add refresh token rotation
fix(user): correct null check on profile update
chore: update dependencies
```

### Step 5: Commit

```bash
git commit -m "$(cat <<'EOF'
<your message here>
EOF
)"
```

### Step 6: Handle hook failures

If the pre-commit hook blocks the commit, invoke the `/check` skill to resolve the issues, re-stage with `git add -A`, and retry the commit.

## What NOT to do

- Never skip hooks with `--no-verify`
- Never commit if `npm run check` is failing
- Never use `git add .` with unreviewed files that might contain secrets (`.env`, credentials)
