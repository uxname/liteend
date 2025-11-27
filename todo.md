# TODO

## General

- [ ] (db_backup) Throw error when pg_dump not found database but no error message in logs
- [ ] Change log levels to: verbose, debug, info, warn, error
- [ ] Make logs format as JSON
- [ ] Make run db and redis as non-root user
- [ ] Implement db backup tool
- [ ] Add rate limiter
- [ ] Add rate limiter for /studio and /board
- [ ] GraphQL integration tests
- [ ] (Maybe) Implement simple mock service module
- [ ] Improve readme file (add more info about project, add more examples, etc.)
- [ ] Add log rotation into docker-compose.yml
- [ ] DELETE THIS FILE

## OIDC Migration todo

- [ ] Clear project: remove any, remove russian comments
- [ ] Fix prisma studio proxy
- [ ] ```
  throw new mercurius.ErrorWithProps('User not found', {
        code: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
      ```
