<p align="center">
  <a href="https://github.com/uxname/liteend" target="blank"><img src=".github/logo.png" width="400" alt="LiteEnd logo" /></a>
</p>

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/uxname/liteend)](https://github.com/uxname/liteend/stargazers)

Lightweight, fast, and easy-to-use backend app template for Node.js, based on [NestJS](https://nestjs.com/).
Uses [Prisma.io](https://www.prisma.io) and PostgreSQL as a base for data storage.

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
  - [System Endpoints](#system-endpoints)
    - [Logs](#logs)
    - [Database Admin Panel](#database-admin-panel)
- [Docker](#docker)
  -   [Docker Compose](#docker-compose)
  -   [Database Backup/Restore](#database-backuprestore)
- [Database Workflow (Prisma)](#database-workflow-prisma)
- [Code Quality](#code-quality)
  -   [Linting & Formatting](#linting--formatting)
  -   [Testing](#testing)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Show Your Support](#show-your-support)
- [License](#license)
- [Telemetry](#telemetry)

## Features

* **NestJS Framework:** Robust and scalable backend structure.
* **Prisma ORM:** Type-safe database access with PostgreSQL.
* **Docker Support:** Easy setup and deployment with Docker and Docker Compose.
* **Code Quality Tools:** Integrated Biome (linting/formatting) and Jest (testing).
* **Database Migrations:** Managed schema changes with Prisma Migrate.
* **Configuration Management:** Environment-based configuration using `.env` files.
* **Logging:** Configured logging with Log4js.
* **API Documentation:** Basic Swagger setup (can be expanded).
* **WebSockets:** Support for real-time communication.
* **Task Queues:** Bull module integration.
* **Email:** Mailer module integration.
* **GraphQL:** Apollo server integration.
* **Telemetry:** Optional usage data collection.

## Tech Stack

* **Language:** TypeScript
* **Framework:** NestJS
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Containerization:** Docker
* **Package Manager:** npm
* **Linting/Formatting:** BiomeJS
* **Testing:** Jest
* **Logging:** Log4js

## Prerequisites

* Node.js (Check `.nvmrc` or `package.json` engines section for specific version if available, otherwise use a recent
  LTS version)
* npm (usually comes with Node.js)
* Docker & Docker Compose (Optional, for containerized setup)
* Git

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
   Copy the example environment file and customize it for your needs.
   ```bash
   cp .env.example .env
   # Edit .env file with your specific configuration (database credentials, ports, etc.)
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Apply database migrations:**
   This command applies existing migrations to set up the database schema.
   ```bash
   npm run db:migrations:apply
   ```
   *Note: Ensure your PostgreSQL server (either local or Dockerized) is running and accessible according to your `.env`
   configuration.*

6. **(Optional) Seed the database:**
   If seed data is available, populate the database:
   ```bash
   npm run db:seed
   ```

## Usage

### Development

* **Run in watch mode:**
  The application will restart automatically on file changes.
  ```bash
  npm run start:dev
  ```

* **Run in debug mode:**
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
   Starts the application from the compiled code in the `dist` folder. Ensure `NODE_ENV` is set to `production`.
   ```bash
   npm run start:prod
   ```
   *Note: The `prestart:prod` script automatically runs `npm run db:migrations:apply` before starting.*

### System Endpoints

The application provides some built-in endpoints for debugging and administration:

#### Logs

* `/logs/`: View recent logs.
* `/logs/all`: View all logs.
* `/logs/error`: View error logs.
* *(See `src/common/logger-serve/logger-serve.controller.ts` for more)*

#### Database Admin Panel

* `/studio`: Access Prisma Studio for database browsing and manipulation.
* *Note: Prisma Studio might need specific configuration or to be run separately in some environments.*

## Docker

### Docker Compose

A `docker-compose.yml` file is provided for easy setup of the application and its database (PostgreSQL).

1. **Ensure `.env` is configured correctly**, especially `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and
   potentially ports if they conflict with existing services.

2. **Launch services:**
   Starts the application and database containers in detached mode.
   ```bash
   docker-compose up -d
   ```

3. **Rebuild and launch:**
   If you've made changes to the `Dockerfile` or need to rebuild images:
   ```bash
   docker-compose up -d --build
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Database Backup/Restore

Scripts and configurations might be available for database backup and restore using Docker. Refer to
`Dockerfile.database-backup` and potentially related npm scripts or documentation within the project.

* **Example Restore Command (Adapt as needed):**
  ```bash
  # Ensure the backup file exists in the designated backup volume/directory
  docker compose exec db_backup sh -c "npx tsx restore.ts postgres_YYYY-MM-DDTHH-MM-SS-MSZ.sql.gz"
  ```

## Database Workflow (Prisma)

Manage your database schema and migrations using Prisma CLI commands wrapped in npm scripts.

1. **Edit Schema:**
   Modify your data model in `prisma/schema.prisma`.

2. **Format Schema:**
   Apply Prisma formatting rules.
   ```bash
   npm run db:schema:format
   ```

3. **Create Migration:**
   Generate a new SQL migration file based on schema changes. **Provide a descriptive name** when prompted.
   ```bash
   npm run db:migrations:create
   ```
   *Review the generated migration file in the `prisma/migrations` directory.*

4. **Apply Migrations:**
   Apply pending migrations to the database.
   ```bash
   npm run db:migrations:apply
   ```

5. **Generate Prisma Client:**
   Update the Prisma Client library based on the schema (often run automatically after migrations).
   ```bash
   npm run db:gen
   ```

6. **Reset Database:** (Use with caution!)
   Resets the database, applies all migrations, and seeds data if applicable.
   ```bash
   npm run db:reset
   ```

7. **Push Schema Changes (Development Only):**
   Directly sync schema changes to the DB without creating a migration file. **Not recommended for production or
   collaborative environments.**
   ```bash
   npm run db:push
   ```

> For more detailed information, visit the [Prisma Documentation](https://www.prisma.io/docs/).

## Code Quality

> **TL;DR:** Run `npm run check` before **every** commit.

A Lefthook pre-commit hook is configured (`lefthook.yml`, `.husky/`) to run checks automatically.

### Linting & Formatting

* **Check code:**
  Uses BiomeJS to check for linting errors and formatting issues.
  ```bash
  npm run lint
  ```

* **Fix code:**
  Automatically fixes fixable linting and formatting issues.
  ```bash
  npm run lint:fix
  ```

* **Check TypeScript types:**
  ```bash
  npm run ts:check
  ```

* **Run all checks:**
  ```bash
  npm run check
  ```

### Testing

* **Run unit tests:**
  ```bash
  npm run test
  ```

* **Run unit tests in watch mode:**
  ```bash
  npm run test:watch
  ```

* **Run end-to-end (e2e) tests:**
  Ensure the application (and potentially database) is running.
  ```bash
  npm run test:e2e
  ```

* **Generate test coverage report:**
  ```bash
  npm run test:cov
  ```

## Configuration

Configuration is managed through environment variables loaded via `@nestjs/config`.

* A `.env.example` file provides a template for required variables.
* Copy `.env.example` to `.env` and fill in your specific values.
* Variables in `.env` will override system environment variables unless configured otherwise.
* Refer to `src/config/` or relevant configuration modules for details on available variables.

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/uxname/liteend/issues).

*(Consider adding a `CONTRIBUTING.md` file with more detailed guidelines if needed).*

## Show Your Support

Give a ⭐️ if this project helped you!

## License

Copyright © 2023 [uxname](https://github.com/uxname).
This project is [MIT](LICENSE) licensed.
