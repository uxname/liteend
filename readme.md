![](.github/img.png)

Simple lightweight GraphQL server on Node.JS which can be used as a basis backend for a new projects.
[Prisma.io](https://www.prisma.io) and SQLite (postgres and others DBMS available too) uses as base for data storage.

# Get started (TL;DR)

- `git clone ...`
- `npm install`
- `cp src/config/config_example.ts src/config/config.ts`
    - Edit `config.ts`
- Generate types: `npm run gen`
- Development run: `npm run dev`
- Production run: `npm start`

## Docker-compose

To launch the project in a Docker container, run the command `docker-compose up -d`

## Database workflow

- Edit schema: `prisma/schema.prisma`
- Format schema: `npm run prisma:format`
- Create (and deploy) migration: `npm run prisma:create`
- Deploy only migration to database: `npm run prisma:deploy`

> More info about using Prisma: https://www.prisma.io

### Database admin panel in docker

The project has an admin panel configured to work with the database, available by default on the `5000`
port: http://localhost:5000

**Important:** In production mode, be sure to set up a password for the database admin page

The default SQLite database path is `/opt/data/data.sqlite3`.

# Structure description

The main project directory is `src`. Brief overview of its structure:

- **/config** - directory with project settings, contains `config.ts` (not in git) and `config_example.ts` (in git)
- **/core** - directory with main modules of project, the main application logic are implemented here
- **/generated** - generated project modules, it is **not recommended** to change files in this directory manually
- **/resolver** - directory with GraphQL query handlers
- **/resolver/guard** - directory with request handlers for protecting or processing requests (similar to middleware)
- **/schema** - directory with GraphQL API schemas
- **/test** - directory with project tests
- **/index.ts** - the main project file, it defines the configuration and starts the application

The database schema is described in the `prisma/schema.prisma` file. It is a line in
format [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema), which is a description of the
database schema, based on this schema will be created database migrations and tables

# Code quality

> TL;DR: Run `npm run check` before **every** commit

The project has [ESLint](https://eslint.org/) configured, which checks the code for errors and warnings, and See
also `tsconfig.json` for proper assembly and compilation of types. To check the code for errors and warnings, and also
format it according to the configured rules - run the command `npm run check`

# package.json scripts

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
- `test` - Run tests
