# Project Context

## Purpose
This project is a high-performance, modular Node.js backend system designed for scalability and speed. It serves as the core API layer handling user profiles, authentication, file management, and background processing tasks.

## Tech Stack
- **Language:** TypeScript (Strict mode enabled in `tsconfig.json`).
- **Framework:** NestJS v11 with **Fastify Adapter** (configured in `src/main.ts`).
- **Database:** PostgreSQL v18.1 (managed via **Prisma ORM**, schema at `prisma/schema.prisma`).
- **API Interfaces:**
  - GraphQL (Mercurius driver, Code-First approach).
  - REST (Swagger/OpenAPI documentation available).
- **Async Processing:** Redis v8.4 & BullMQ (configured in `src/app/test-queue`).
- **Tooling:** Biome, Vitest, Docker.

## Project Conventions

### Code Style
- **Linter & Formatter:** We use **Biome** exclusively (no ESLint/Prettier).
  - *Reference:* Rules are defined in `biome.json`.
- **Validation:** **Zod** is the standard for DTOs and input validation.
  - *Reference:* See usage in `src/app/profile/types/profile-update.input.ts`.
- **Imports:** Use absolute paths with the `@/` alias.
  - *Reference:* Path mapping is configured in `tsconfig.json` and `knip.json`.
- **Environment Variables:** Strict validation is enforced at startup. Variables in `.env` must match keys in `.env.example`.
  - *Reference:* Logic located in `src/common/dotenv-validator/dotenv-validator.service.ts`.

### Architecture Patterns
- **Hybrid Transport:** The application supports both GraphQL and REST endpoints simultaneously.
  - *Reference:* `AppModule` setup in `src/app/app.module.ts`.
- **Global Error Handling:** A centralized filter normalizes both HTTP and Zod validation errors.
  - *Reference:* `src/common/all-exceptions-filter.ts`.
- **Structured Logging:** JSON-based logging via `nestjs-pino` with custom serializers.
  - *Reference:* Configuration in `src/common/logger/pino-config.ts`.
- **Modular Monolith:** Logic is separated into Feature Modules (`src/app/*`) and Shared Infrastructure (`src/common/*`).

### Testing Strategy
- **Unit & Integration:** Powered by **Vitest**.
  - *Reference:* Configuration in `vitest.config.ts`.
- **E2E Testing:** Uses **PactumJS** for HTTP request assertions.
  - *Reference:* See `test/app.e2e.spec.ts`.
- **Code Coverage:** Enforced via `npm run test:cov`.

### Git Workflow
- **Pre-commit Hooks:** **Lefthook** manages pre-commit checks (linting, type checking).
  - *Reference:* `package.json` scripts (`prepare`, `check`).
- **Build Metadata:** Commit hash and info are automatically saved to `dist/` during the build process.
  - *Reference:* `src/common/git-commit-saver.ts`.

## Domain Context
- **Authentication:** Relies on an external OIDC provider (validating JWTs via JWKS). A local mock mode is available for development (`OIDC_MOCK_ENABLED`).
  - *Reference:* `src/common/auth/jwt.strategy.ts` and `src/common/auth/jwt-auth.guard.ts`.
- **File Management:** Files are uploaded via multipart streams and stored locally, with metadata tracked in PostgreSQL.
  - *Reference:* `src/app/file-upload/file-upload.service.ts` (implements distinct directory hashing by date).
- **Observability:** Custom endpoints exist for viewing logs via a UI (`/logs`) and checking service health (`/health`).
  - *Reference:* `src/common/logger-serve` and `src/app/health`.

## Important Constraints
- **Fastify Compatibility:** The app uses `FastifyAdapter`. Middleware or libraries relying specifically on Express `req`/`res` objects may not work or require adapters.
- **GraphQL Complexity:** Query complexity is strictly limited to 1000 points to prevent DoS attacks.
  - *Reference:* Complexity logic in `src/app/app.module.ts`.
- **CSP & Security:** Content Security Policy (CSP) is currently disabled in `helmet` config (likely for dev tools/GraphQL Playground compatibility).
  - *Reference:* `src/main.ts`.

## External Dependencies
- **OIDC Provider:** The system requires a valid OIDC issuer (e.g., Auth0, Keycloak) unless running in Mock mode.
- **Infrastructure:**
  - **PostgreSQL** (Port defined in `.env`).
  - **Redis** (Port defined in `.env`).
  - *Reference:* Service definitions in `docker-compose.yml`.
