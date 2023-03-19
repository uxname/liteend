import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  test('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
