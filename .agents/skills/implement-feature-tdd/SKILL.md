---
name: implement-feature-tdd
description: Use this workflow to implement ANY new feature following Test-Driven Development strictly.
---

## Workflow Steps

1. **Write failing tests FIRST (RED)**:
   - Write E2E test for API boundaries (Controller/Resolver) using `/add-e2e-test` skill.
   - Run `npm run test:e2e` to verify it FAILS.
2. **Write implementation (GREEN)**:
   - Implement the minimum code required in the Controller/Resolver and Service to make the test pass.
3. **Verify**:
   - Run tests until they PASS.
4. **Refactor and Check (REFACTOR)**:
   - Run `npm run check` to fix linting and types.
   - Run `npm run test:cov` to ensure test coverage remains above 80%.

Do not write production code before writing the test assertions.
