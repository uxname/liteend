import { describe, expect, it } from 'vitest';
import { LoggerServeController } from './logger-serve.controller';

const getIsValidFilePath =
  (controller: LoggerServeController) => (filePath: string) =>
    (
      controller as unknown as { isValidFilePath(p: string): boolean }
    ).isValidFilePath(filePath);

describe('LoggerServeController', () => {
  const controller = new LoggerServeController();
  const isValid = getIsValidFilePath(controller);

  describe('isValidFilePath (path traversal guard)', () => {
    it('should block traversal via ../../', () => {
      expect(isValid('../../etc/passwd')).toBe(false);
    });

    it('should block traversal via ../ to a sibling directory', () => {
      expect(isValid('../uploads/secret.png')).toBe(false);
    });

    it('should block absolute path injection', () => {
      expect(isValid('/etc/passwd')).toBe(false);
    });

    it('should block traversal targeting .env', () => {
      expect(isValid('../../.env')).toBe(false);
    });

    it('should allow a flat filename', () => {
      expect(isValid('app.log')).toBe(true);
    });

    it('should allow a nested path within the logs directory', () => {
      expect(isValid('2026/04/22/app.log')).toBe(true);
    });

    it('should allow a filename with dots that does not traverse', () => {
      expect(isValid('my.service.log')).toBe(true);
    });
  });
});
