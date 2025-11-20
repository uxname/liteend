import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { AppModule } from '@/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const port = 4001; // Порт для тестов

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Запускаем приложение на реальном порту
    await app.listen(port);

    // Говорим Pactum-у, куда стучаться
    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    // Pactum style: читается как предложение
    return pactum.spec().get('/health').expectStatus(200).expectJsonLike({
      status: 'ok',
    });
  });
});
