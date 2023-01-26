# Todo

- [ ] Implement run prisma:studio in project
- [ ] Move some services to separate modules (ex. Account, AccountSession, etc.)
- [ ] Migrate to some prisma DTO generator
- [ ] Implement GraphQL subscriptions
- [ ] Add database seed script
- [ ] Enable Helmet
- [ ] Replace DBeaver with some other DB admin panel supporting arm64 (ex. pgAdmin)
- [ ] GraphQL integration tests
- [ ] Add verification types, ex.: Email
- [ ] Create CLI for generating new config or change git repo url (liteend-cli generate-new-app or something like that)
  - [ ] Add CLI info to readme
  - [ ] Implement "npx liteend-cli generate-new-app" or something like that
- [ ] Implement start app with waiting for migration application (ex. via *.lock file)
- [ ] Add telemetry
- [ ] Add logger
  - [ ] Implement logging to DB, files or remote service
  - [ ] OR:
  - [ ] Implement online log viewer like http://logio.org
- [ ] Add i18n https://www.npmjs.com/package/nestjs-i18n
- [ ] Add error codes and api that exposes them
- [ ] (Maybe) Implement simple mock service module
- [ ] Improve readme file (add more info about project, add more examples, etc.)
- [ ] DELETE THIS FILE

# Todo LiteEnd-CLI

- [ ] Change git remote url always (when not specified - change it to "")
- [ ] Fix changing passwords in .env (pg won't accept it)
