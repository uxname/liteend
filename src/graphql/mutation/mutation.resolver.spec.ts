import { Test, TestingModule } from '@nestjs/testing';
import { MutationResolver } from './mutation.resolver';

describe('MutationResolver', () => {
  let resolver: MutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MutationResolver],
    }).compile();

    resolver = module.get<MutationResolver>(MutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
