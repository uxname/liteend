import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DotenvValidatorService } from './dotenv-validator.service';

describe('DotenvValidatorService', () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dotenv-test-'));
    process.chdir(tempDir);
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should skip validation in production without reading files', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => new DotenvValidatorService()).not.toThrow();
  });

  it('should not throw when env files have matching keys', () => {
    vi.stubEnv('NODE_ENV', 'test');
    fs.writeFileSync('.env', 'DB_URL=postgres://localhost\nAPI_KEY=secret\n');
    fs.writeFileSync('.env.example', 'DB_URL=\nAPI_KEY=\n');

    expect(() => new DotenvValidatorService()).not.toThrow();
  });

  it('should throw when .env has a key not in .env.example', () => {
    vi.stubEnv('NODE_ENV', 'test');
    fs.writeFileSync('.env', 'DB_URL=postgres://localhost\nEXTRA_VAR=value\n');
    fs.writeFileSync('.env.example', 'DB_URL=\n');

    expect(() => new DotenvValidatorService()).toThrow(
      'Environment variable "EXTRA_VAR" exists in .env but not in .env.example',
    );
  });

  it('should throw when .env.example has a key not in .env', () => {
    vi.stubEnv('NODE_ENV', 'test');
    fs.writeFileSync('.env', 'DB_URL=postgres://localhost\n');
    fs.writeFileSync('.env.example', 'DB_URL=\nMISSING_VAR=\n');

    expect(() => new DotenvValidatorService()).toThrow(
      'Environment variable "MISSING_VAR" exists in .env.example but not in .env',
    );
  });

  it('should ignore comments and empty lines when parsing keys', () => {
    vi.stubEnv('NODE_ENV', 'test');
    fs.writeFileSync('.env', '# comment\n\nDB_URL=postgres://localhost\n');
    fs.writeFileSync('.env.example', '# comment\n\nDB_URL=\n');

    expect(() => new DotenvValidatorService()).not.toThrow();
  });
});
