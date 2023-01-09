import { Test, TestingModule } from '@nestjs/testing';
import { QueryResolver } from './query.resolver';

describe('QueryResolver', () => {
  let resolver: QueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryResolver],
    }).compile();

    resolver = module.get<QueryResolver>(QueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
