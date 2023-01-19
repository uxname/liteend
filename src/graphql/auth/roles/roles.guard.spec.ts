import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  test('should be defined', () => {
    expect(new RolesGuard([])).toBeDefined();
  });
});
