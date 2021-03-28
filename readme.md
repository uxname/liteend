![](.github/img.png)

Simple lightweight GraphQL server on Node.JS 
which can be used as a basis backend for new a new projects.
[Prisma.io](https://www.prisma.io) and SQLite (postgres and 
others DBMS available too) uses as base for data storage. 

# Get started
- `git clone https://github.com/uxname/liteend.git`
- `npm install`
- `cp src/config/config_example.js src/config/config.js`
  - Edit `config.js`
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
    │   └── config.js         // App's config
    ├── index.js              // Main entrypoint
    ├── resolver              // GraphQL API resolvers
    └── schema                // GraphQL API schema
```

# Telemetry

Telemetry helps better understand how many users are using the product.
Unlike many telemetry services, this telemetry implementation is 
intentionally limited in scope.

Data is collected in two scenarios that are described below.
- Information is only sent every 12 hours (sending is paused for 12 hours after any invocation)
- The data does not include any private data
