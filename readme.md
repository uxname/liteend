![](.github/img.png)

Simple lightweight GraphQL server on Node.JS which can be used as a basis backend for a new projects.
[Prisma.io](https://www.prisma.io) and SQLite (postgres and others DBMS available too) uses as base for data storage.

# Get started

- `git clone ...`
- `npm install`
- `cp src/config/config_example.ts src/config/config.ts`
    - Edit `config.ts`
- Generate types: `npm run gen`
- Development run: `npm run dev`
- Production run: `npm start`

# Database workflow

- Change schema: `prisma/schema.prisma`
- Create migration: `npm run prisma:create`
- Deploy migration to database: `npm run prisma:deploy`

More info about using Prisma: https://www.prisma.io

# Structure description

```
.
├── prisma
│   ├── migrations            // Database migrations
│   └── schema.prisma         // Database schema
└── src
    ├── config
    │   └── config.ts         // App's config
    ├── index.ts              // Main entrypoint
    ├── resolver              // GraphQL API resolvers
    └── schema                // GraphQL API schema
```

# Package.json scripts

- `start` - Production start
- `dev` - Development start (auto restart on code changed)
- `prisma:deploy` - Write DB migrations to database
- `prisma:create` - Create new DB migration from prisma schema
- `prisma:gen` - Generate prisma client
- `prisma:studio` - Run database management tool
- `prisma:format` - Format prisma schema
- `gen` - Generate all needed files (`prisma:gen` + `ts:gen`)
- `ts:gen` - Generate typescript code types from GraphQL files
- `ts:check` - Validate typescript code
- `lint` - Check code by ESLint
- `check` - `ts:check` + `lint`
- `update` - Update `package.json` dependencies to newest versions  
