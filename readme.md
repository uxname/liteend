# [![LiteEnd logo](assets/logo.png)](https://github.com/uxname/liteend)

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/uxname/liteend)](https://github.com/uxname/liteend/stargazers)

Lightweight, fast, and easy-to-use backend app template for Node.js, based on [NestJS](https://nestjs.com/).
Uses [Prisma.io](https://www.prisma.io) and PostgreSQL as a base for data storage, Redis for caching/queues, and OIDC for authentication.

## ⚡️ TL;DR — Quick Start

Start a new project based on LiteEnd in seconds. This command downloads the template (without git history), sets up the environment file, and installs dependencies.

### One-line initialization

Replace `my-app` with your project name:

```bash
npx degit uxname/liteend my-app && cd my-app && git init && cp .env.example .env && npm install
```

### What's next?

1. **Database:** Update `.env` with your credentials and run `docker-compose up -d`.
2. **Migrations:** Run `npm run db:migrations:apply`.
3. **Run:** `npm run start:dev`.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
  - [API Documentation (Swagger)](#api-documentation-swagger)
  - [System Endpoints](#system-endpoints)
    - [Health Check](#health-check)
    - [Logs](#logs)
    - [Database Admin Panel](#database-admin-panel-prisma-studio)
- [Docker](#docker)
  - [Overview](#overview)
  - [Docker Compose Usage](#docker-compose-usage)
  - [Accessing Services](#accessing-services)
  - [Database Backup/Restore](#database-backuprestore)
  - [Viewing Logs](#viewing-logs)
- [Database Workflow (Prisma)](#database-workflow-prisma)
- [Code Quality](#code-quality)
  - [Linting & Formatting](#linting--formatting)
  - [Testing](#testing)
- [Configuration](#configuration)
  - [Key Environment Variables](#key-environment-variables)
- [Internationalization (i18n)](#internationalization-i18n)
- [Contributing](#contributing)
- [Show Your Support](#show-your-support)
- [License](#license)

## Features

- **NestJS Framework:** Robust and scalable backend structure.
- **Prisma ORM:** Type-safe database access with PostgreSQL.
- **Redis Integration:** Support for caching and background jobs using Bull queues.
- **Docker Support:** Easy setup and deployment with Docker and Docker Compose (App, PostgreSQL, Redis, Admin UIs, Backup).
- **Code Quality Tools:** Integrated Biome (linting/formatting) and Vitest (testing).
- **Authentication:** Secure OIDC (OpenID Connect) integration (Logto, Auth0, etc.) with lazy user registration.
- **Database Migrations:** Managed schema changes with Prisma Migrate.
- **Configuration Management:** Environment-based configuration using `.env` files.
- **Logging:** High-performance structured logging with Pino (file rotation included).
- **API Documentation:** Basic Swagger UI setup.
- **WebSockets:** Support for real-time communication.
- **Task Queues:** Bull module integration.
- **Email:** Mailer module integration.
- **GraphQL:** Apollo server integration.
- **Health Checks:** Endpoint for monitoring application status.
- **Automated DB Backups:** Scheduled database backups via a dedicated Docker service.
- **Internationalization (i18n):** Support for multiple languages.

## Tech Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Caching/Queues:** Redis
- **Containerization:** Docker, Docker Compose
- **Package Manager:** npm
- **Linting/Formatting:** BiomeJS
- **Testing:** Vitest, Pactum
- **Logging:** Pino
- **Admin Tools (via Docker):** pgAdmin 4, Redis Commander

## Prerequisites

- **Node.js:** Use a recent LTS version (e.g., 18.x, 20.x). Check project specifics if needed.
- **npm:** Usually comes with Node.js.
- **Git:** For cloning the repository.
- **Docker & Docker Compose:** (Recommended) For easy environment setup and running PostgreSQL/Redis.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/uxname/liteend.git
   cd liteend
   ```

2. **(Optional) Change Git remote URL:**

   ```bash
   git remote set-url origin <YOUR_NEW_GIT_REPOSITORY_URL>
   ```

3. **Set up environment variables:**
   Copy the example environment file and customize it.

   ```bash
   cp .env.example .env
   # Edit .env file with your specific configuration (database credentials, ports, Redis details, etc.)
   # See the 'Configuration' section below for key variables.
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **(If using Docker - Recommended)** **Start external services (Database & Redis):**
   Ensure Docker Desktop or Docker Engine/Compose is running.

   ```bash
   docker-compose up -d db redis
   # Wait a few seconds for the database and Redis to initialize.
   ```

   *Note: If you are **not** using Docker, ensure PostgreSQL and Redis are installed, running, and accessible according to your `.env` configuration.*

6. **Apply database migrations:**
   This command applies existing migrations to set up the database schema.

   ```bash
   npm run db:migrations:apply
   ```

7. **(Optional) Seed the database:**
   If seed data is available, populate the database:

   ```bash
   npm run db:seed
   ```

## Usage

### Development

- **Run in watch mode:**
  The application will restart automatically on file changes. Requires database and Redis to be running.

  ```bash
  npm run start:dev
  ```

- **Run in debug mode:**
  Starts the application with the Node.js inspector enabled.

  ```bash
  npm run start:debug
  ```

### Production

1. **Build the application:**
   This compiles TypeScript to JavaScript and performs checks.

   ```bash
   npm run build
   ```

2. **Run the production build:**
   Starts the application from the compiled code in the `dist` folder. Ensure `NODE_ENV` is set to `production`. Requires database and Redis to be running.

   ```bash
   npm run start:prod
   ```

   *Note: The `prestart:prod` script automatically runs `npm run db:migrations:apply` before starting.*

### API Documentation (Swagger)

Once the application is running (e.g., via `npm run start:dev`), the Swagger UI for API documentation is available at:

`http://localhost:<PORT>/swagger`

Replace `<PORT>` with the application port specified in your `.env` file (default is 4000).

### System Endpoints

The application provides built-in endpoints for monitoring and administration:

#### Health Check

- `/health`: Returns the application status. Used by Docker healthcheck. Example response: `{"status":"ok",...}`

#### Logs

- `/logs/`: View recent logs (requires credentials from `.env`).
- `/logs/all`: View all logs.
- `/logs/error`: View error logs.
- *(See `src/common/logger-serve/logger-serve.controller.ts` for more)*

#### Database Admin Panel (Prisma Studio)

- `/studio`: Access Prisma Studio for database browsing and manipulation (runs alongside the NestJS app). Requires credentials from `.env`.

#### Task Queue Dashboard (Bull Board)

- `/board`: Access the Bull Board UI to monitor background job queues (e.g., email sending). Requires credentials from `.env`.

#### GraphQL Debug Query

- **Query:** `debug`: A GraphQL query available in the main GraphQL endpoint (`/graphql`) that returns system information like application version, uptime, and the last git commit.

## Docker

### Overview

The `docker-compose.yml` file defines the following services for a complete development/testing environment:

- `app`: The main NestJS application container.
- `db`: PostgreSQL database container.
- `redis`: Redis container (for Bull queues, caching).
- `db_admin`: pgAdmin 4 container, a web UI for managing PostgreSQL.
- `redis_admin`: Redis Commander container, a web UI for managing Redis.
- `db_backup`: A dedicated container that performs scheduled backups of the PostgreSQL database.

### Docker Compose Usage

1. **Start all services:**
   Launches the app, database, Redis, and admin UIs in detached mode.

   ```bash
   docker-compose up -d
   ```

2. **Start only specific services (e.g., DB and Redis):**
   Useful during initial setup or if running the app locally.

   ```bash
   docker-compose up -d db redis
   ```

3. **Stop all services:**

   ```bash
   docker-compose down
   ```

4. **Rebuild and start services:**
   If you've made changes to `Dockerfile` or need to rebuild images:

   ```bash
   docker-compose up -d --build
   ```

### Accessing Services

- **Application:** `http://localhost:<PORT>` (See `PORT` in `.env`)
- **pgAdmin (DB Admin):** `http://localhost:<DB_ADMIN_PORT>` (See `DB_ADMIN_PORT`, `DB_ADMIN_EMAIL`, `DB_ADMIN_PASSWORD` in `.env` for login)
- **Redis Commander (Redis Admin):** `http://localhost:<REDIS_ADMIN_PORT>` (See `REDIS_ADMIN_PORT`, `REDIS_ADMIN_USER`, `REDIS_ADMIN_PASSWORD` in `.env` for login)
- **Prisma Studio (DB Admin via App):** `http://localhost:<PORT>/studio` (See `PORT`, `PRISMA_STUDIO_LOGIN`, `PRISMA_STUDIO_PASSWORD` in `.env` for login)
- **Bull Board (Task Queues):** `http://localhost:<PORT>/board` (See `PORT`, `BULL_BOARD_LOGIN`, `BULL_BOARD_PASSWORD` in `.env` for login)

### Database Backup/Restore

- The `db_backup` service automatically creates compressed PostgreSQL backups.
- **Configuration:** Schedule (`BACKUP_INTERVAL`), rotation (`BACKUP_ROTATION`), format, etc., are defined in `docker-compose.yml` for the `db_backup` service.
- **Location:** Backups are stored in the volume mapped to `./data/database_backups` on the host machine.
- **Manual Restore Example:**

  ```bash
  # Ensure the backup file exists in ./data/database_backups/
  # Replace '...' with the actual backup filename
  docker compose exec db_backup sh -c "npx tsx restore.ts postgres_YYYY-MM-DDTHH-MM-SS-MSZ.sql.gz"
  ```

  *(Refer to `db-backup-tool/restore.ts` or related scripts for details)*

### Viewing Logs

You can view logs for individual services:

```bash
docker-compose logs app
docker-compose logs db
docker-compose logs redis
# Use '-f' to follow logs in real-time
docker-compose logs -f app
```

## Database Workflow (Prisma)

Manage your database schema and migrations using Prisma CLI commands wrapped in npm scripts.

1. **Edit Schema:** Modify `prisma/schema.prisma`.
2. **Format Schema:** `npm run db:schema:format`
3. **Create Migration:** `npm run db:migrations:create` (Provide a descriptive name when prompted). Review the generated SQL in `prisma/migrations`.
4. **Apply Migrations:** `npm run db:migrations:apply`
5. **Generate Prisma Client:** `npm run db:gen` (Often run automatically).
6. **Reset Database (Caution!):** `npm run db:reset`
7. **Push Schema (Dev Only!):** `npm run db:push` (Directly syncs schema, bypasses migrations).

> **Note:** For a typical development workflow, you will mostly use `npm run db:migrations:create` and `npm run db:migrations:apply`.
>
> For more details, visit the [Prisma Documentation](https://www.prisma.io/docs/).

## Code Quality

> **TL;DR:** Run `npm run check` (linter + type-check) before **every** commit.

A Lefthook pre-commit hook is configured (`lefthook.yml`) to run checks automatically.

### Linting & Formatting

- **Check code (BiomeJS):** `npm run lint`
- **Fix code (BiomeJS):** `npm run lint:fix`
- **Check TypeScript types:** `npm run ts:check`
- **Run all checks:** `npm run check`

### Testing

- **Run unit tests:** `npm run test`
- **Run unit tests (watch mode):** `npm run test:watch`
- **Run e2e tests:** `npm run test:e2e` (Requires running app/db)
- **Generate coverage report:** `npm run test:cov`

## Configuration

Configuration is managed via environment variables loaded by `@nestjs/config` from a `.env` file.

- Copy `.env.example` to `.env`.
- Fill in your specific values in `.env`.

### Key Environment Variables

These are some of the most important variables in `.env.example` to configure:

- `NODE_ENV`: Set to `development` or `production`.
- `PORT`: The port the NestJS application will listen on.
- `OIDC_ISSUER`: The URL of the OIDC provider (e.g., Logto).
- `OIDC_AUDIENCE`: The API identifier defined in the OIDC provider.
- `OIDC_JWKS_URI`: The URL to the JSON Web Key Set (JWKS) of the provider.
- `DATABASE_URL`: The full connection string for PostgreSQL.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`: Individual database connection parameters.
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis connection details.
- `MAILER_...`: Email sending configuration (SMTP details).
- `DB_ADMIN_PORT`, `DB_ADMIN_EMAIL`, `DB_ADMIN_PASSWORD`: pgAdmin access details.
- `REDIS_ADMIN_PORT`, `REDIS_ADMIN_USER`, `REDIS_ADMIN_PASSWORD`: Redis Commander access details.
- `PRISMA_STUDIO_LOGIN`, `PRISMA_STUDIO_PASSWORD`: Credentials for the Prisma Studio web UI (`/studio`).
- `BULL_BOARD_LOGIN`, `BULL_BOARD_PASSWORD`: Credentials for the Bull Board web UI (`/board`).
- `LOGS_ADMIN_PANEL_USER`, `LOGS_ADMIN_PANEL_PASSWORD`: Credentials for the protected log viewer (`/logs`).

*(Refer to `.env.example` for the full list and `src/config/` for validation schemas).*

## Internationalization (i18n)

The project uses `nestjs-i18n` for handling multiple languages.

- Language files (JSON format) are located in `src/i18n/`.
- Add new language directories (e.g., `src/i18n/de/`) and translation files as needed.

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/uxname/liteend/issues).

## Show Your Support

Give a ⭐️ if this project helped you!

## License

Copyright © 2023 [uxname](https://github.com/uxname).
This project is [MIT](LICENSE) licensed.
