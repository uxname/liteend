---
name: update-deps
description: Use this skill when the user asks to update dependencies, upgrade packages, update npm packages, or keep the project up to date. Trigger phrases: "update dependencies", "upgrade packages", "npm update", "update npm".
version: 1.1.0
---

# Update Dependencies

Updates project dependencies using the project's interactive update workflow.

## Update Command

```bash
npm run update
```

This does:
1. `npm-check-updates -u` — bumps all versions in `package.json` to latest
2. `rimraf node_modules package-lock.json` — cleans old install
3. `npm i` — fresh install with new versions
4. `npm run lint:fix && npm run check` — auto-fix and verify (postupdate hook)

**This updates ALL dependencies at once.** It's aggressive — see selective update below for safer approach.

## Selective Update (Safer)

To update specific packages only:

```bash
npx ncu -u @nestjs/common @nestjs/core   # Update specific packages
npm install                                 # Reinstall
npm run check                               # Verify
```

To preview what would change without applying:

```bash
npx ncu   # Shows available updates without modifying package.json
```

## High-Risk Packages (Extra Caution)

These packages often have breaking changes — read the changelog before updating:

| Package | Why risky |
|---|---|
| `@nestjs/*` | Core API changes, decorator signatures, module registration |
| `@prisma/client`, `prisma` | Migration system, client API, adapter changes |
| `fastify` | Plugin API changes, lifecycle hooks |
| `bullmq`, `@nestjs/bullmq` | Job queue API, worker configuration |
| `mercurius`, `@nestjs/graphql` | GraphQL schema generation, resolver signatures |
| `@biomejs/biome` | New lint rules that fail existing code |
| `typescript` | Stricter type checking may break existing code |
| `zod`, `nestjs-zod` | Validation API changes |

## After Updating

1. Run `npm run check` — fixes lint issues and validates types
2. Run `npm run test` — ensure no regressions
3. Run `npm run build` — verify production build works
4. Check dev mode for runtime errors: `npm run start:dev`

## If Something Breaks

Revert specific packages:

```bash
# Reinstall a specific version
npm install fastify@5.8.4

# Or revert package.json and reinstall
git checkout package.json
npm install
```

## Overrides

The project uses `overrides` in `package.json` to force specific transitive dependency versions.

### What are overrides?

`overrides` force npm to use a specific version of a transitive dependency regardless of what parent packages request. Example:

```json
{
  "overrides": {
    "fastify": "5.8.4"
  }
}
```

### When to add overrides

- A transitive dependency has a known vulnerability
- The upstream package maintainer hasn't updated the dependency
- The fix is a patch version (low risk of breaking changes)

### When to remove overrides

After each `npm run update`, check if overrides are still needed:

1. Temporarily remove an override from `package.json`
2. Run `npm install`
3. Run `npm audit` — if the vulnerability disappears, the override is no longer needed
4. Run `npm run check` — make sure nothing broke
5. If clean, commit the removal

### Maintenance schedule

- **After every `npm run update`**: review overrides, remove obsolete ones
- **Monthly**: run `npm audit` and check if remaining overrides can be dropped
- **Quarterly**: audit all remaining overrides with `npm ls <package>` to see which parent still needs them

### Finding which override is still needed

```bash
# See which package depends on the overridden package
npm ls fastify
```

If no parent package requires the specific version, the override is safe to remove.

## Checklist

- [ ] Preview changes with `npx ncu` before applying
- [ ] Check changelogs of high-risk packages
- [ ] `npm run check` passes after update
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] Review and clean up `overrides` section
- [ ] Commit `package.json` and `package-lock.json` together
