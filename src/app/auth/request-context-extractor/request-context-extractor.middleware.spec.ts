import { RequestContextExtractorMiddleware } from '@/app/auth/request-context-extractor/request-context-extractor.middleware';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('RequestContextExtractorMiddleware', () => {
  test('should be defined', () => {
    expect(
      new RequestContextExtractorMiddleware(new PrismaService()),
    ).toBeDefined();
  });
});
