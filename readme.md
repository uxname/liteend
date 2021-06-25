![](.github/img.png)

Simple lightweight GraphQL server on Node.JS 
which can be used as a basis backend for a new projects.
[Prisma.io](https://www.prisma.io) and SQLite (postgres and 
others DBMS available too) uses as base for data storage. 

# Get started
- `git clone https://github.com/uxname/liteend.git`
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
