[//]: # (todo improve readme)

<p align="center">
  <a href="https://github.com/uxname/liteend" target="blank"><img src=".github/logo.png" width="400" alt="LiteEnd logo" /></a>
</p>

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
![License](https://img.shields.io/badge/License-MIT-brightgreen)
![Stars](https://img.shields.io/github/stars/uxname/liteend)


Lightweight template for a backend applications, based on [NestJS](https://nestjs.com).
[Prisma.io](https://www.prisma.io) and PostgreSQL uses as base for data storage.

## 📃 Get started (TL;DR)

```shell
# Init project
$ git clone https://github.com/uxname/liteend.git && cd liteend && cp .env.example .env && npm i

# (Optional) Change git repo url
$ git remote set-url origin <NEW_URL_HERE>

# Deploy database: 
$ npm run db:migrations:apply

# Seed DB: 
$ npm run db:seed

# Development run: 
$ npm run start:dev

# Production build: 
$ npm run build

# Production run: 
$ npm start:prod
```

### 💧 System endpoints

There available debug endpoints for view project information (ex.: logs and DB data)

#### Logs

```shell
/logs/ # View logs
/logs/all # View all logs
/logs/error # View error logs
# Etc. See src/common/logger-serve/logger-serve.controller.ts
```

#### Database admin panel

```shell
/studio # Prisma Studio
```

### 🥡 Docker-compose

```shell
# Launch
$ docker-compose up -d

# Rebuild and launch
$ docker-compose up -d --build
```

### 📦 Database workflow

```shell
# Edit schema: 
$ prisma/schema.prisma

# Format schema: 
$ npm run db:schema:format

# Create migration: 
$ npm run db:migrations:create

# Deploy migrations to database: 
$ npm run db:migrations:apply

# Restore database backup (file should be in backup directory):
$ docker compose exec db_backup sh -c "npx tsx restore.ts postgres_2025-01-01T22-05-05-448Z.sql.gz"
```

> More info about using Prisma: https://www.prisma.io

## 🍀 Code quality

> TL;DR: Run `npm run check` before **every** commit

### ✅ Tests

```shell
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

The project has [ESLint](https://eslint.org/) configured, which checks the code for errors and warnings, and See
also `tsconfig.json` for proper assembly and compilation of types. To check the code for errors and warnings - run the
command `npm run check`.
Prettier is also configured to format the code, run `npm run format` to format the code (but ESLint will still check it)
.

In addition, the project has a pre-commit hook configured to check the code for errors and warnings before each commit.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to
check [issues page](https://github.com/uxname/liteend/issues).

## 💪 Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [uxname@gmail.com](https://github.com/uxname).<br />
This project is [MIT](https://mit-license.org/) licensed.

## 🔍 Telemetry

The LiteEnd project collects telemetry data to help improve the product and enhance user experience. Telemetry data
collected includes information such as product name, version, architecture, operating system, NodeJS version, a unique
instance identifier, and launch timestamp.

The telemetry data collected is used to understand how users are using the product and to identify any issues or areas
for improvement. All telemetry data collected is treated as confidential and is never shared with third parties.

To opt-out of telemetry, users can set the `DISABLE_TELEMETRY` environment variable to `true` when running LiteEnd.
