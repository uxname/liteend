# Project Context

## Purpose
This project is a high-performance, modular Node.js backend system designed for scalability and speed. It serves as the core API layer handling user profiles, authentication, file management, and background processing tasks.

## Tech Stack
- **Language:** TypeScript (Strict mode enabled in `tsconfig.json`).
- **Framework:** NestJS with **Fastify Adapter** (configured in `src/main.ts`).
- **Database:** PostgreSQL (managed via **Prisma ORM**, schema at `prisma/schema.prisma`).
- **API Interfaces:**
  - **GraphQL:** Primary API standard (Mercurius driver, Code-First approach).
  - **REST:** Restricted usage (e.g., File Uploads, Webhooks, Health Checks).
- **Async Processing:** Redis & BullMQ (configured in `src/app/test-queue`).
- **Tooling:** Biome, Vitest, Docker.

## Project Conventions

### Code Style & Quality Assurance
- **Linter & Formatter:** We use **Biome** exclusively (no ESLint/Prettier).
  - *Reference:* Rules are defined in `biome.json`.
- **Validation:** **Zod** is the standard for DTOs and input validation.
  - *Reference:* See usage in `src/app/profile/types/profile-update.input.ts`.
- **Mandatory Checks:** Developers must run `npm run check` locally to detect and fix TypeScript, Linting, and Dead Code errors before finalizing tasks.
  - *Reference:* The `check` script in `package.json` runs `ts:check`, `lint:fix`, and `knip`.

### Database Workflow
To modify the database structure, follow this strict sequence to ensure the schema is applied and the client is regenerated:
1.  **Modify** `prisma/schema.prisma`.
2.  **Format** the schema: `npm run db:schema:format`.
3.  **Create Migration:** `npm run db:migrations:create`.
4.  **Apply Migration:** `npm run db:migrations:apply`.
  *   *Note:* The Prisma Client is only updated/regenerated after the migration is applied.

### Architecture Patterns
- **GraphQL First:** All core domain logic and client-facing APIs must be implemented via GraphQL Resolvers. REST Controllers are reserved solely for functionality that cannot be handled by GraphQL (e.g., binary file streams).
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

## Domain Context
- **Authentication:** The default OIDC provider is **Logto**. The system validates tokens via JWKS. A local mock mode is available for development (`OIDC_MOCK_ENABLED`).
  - *Reference:* `src/common/auth/jwt.strategy.ts`.
- **File Management:** Files are uploaded via multipart streams and stored locally, with metadata tracked in PostgreSQL.
  - *Reference:* `src/app/file-upload/file-upload.service.ts` (implements distinct directory hashing by date).
- **Observability:** Custom endpoints exist for viewing logs via a UI (`/logs`) and checking service health (`/health`).
  - *Reference:* `src/common/logger-serve` and `src/app/health`.

## Important Constraints
- **Fastify Compatibility:** The app uses `FastifyAdapter`. Middleware or libraries relying specifically on Express `req`/`res` objects may not work or require adapters.
- **GraphQL Complexity:** Query complexity is strictly limited to 1000 points to prevent DoS attacks.
  - *Reference:* Complexity logic in `src/app/app.module.ts`.
- **Environment Variables:** Strict validation is enforced at startup. Variables in `.env` must match keys in `.env.example`.
  - *Reference:* Logic located in `src/common/dotenv-validator/dotenv-validator.service.ts`.

## External Dependencies
- **Identity Provider:** Logto (or compatible OIDC provider).
- **Infrastructure:**
  - **PostgreSQL** (Port defined in `.env`).
  - **Redis** (Port defined in `.env`).
  - *Reference:* Service definitions in `docker-compose.yml`.
