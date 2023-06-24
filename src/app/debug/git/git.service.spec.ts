import * as console from 'node:console';

import { Test, TestingModule } from '@nestjs/testing';

import { GitService } from './git.service';

describe('GitService', () => {
  let service: GitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitService],
    }).compile();

    service = module.get<GitService>(GitService);
  });

  test('should work', () => {
    expect(service).toBeDefined();
    const result = service.getLastCommitInfo();
    console.log(result);
    expect(result).toBeDefined();
  });
});
