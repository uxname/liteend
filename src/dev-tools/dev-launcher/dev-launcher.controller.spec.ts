import { Test } from '@nestjs/testing';
import { DevLauncherController } from './dev-launcher.controller';

it('serves cached html with correct headers', async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [DevLauncherController],
  }).compile();
  const controller = moduleRef.get(DevLauncherController);

  const html = controller.getDevPage();
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('target="_blank"');

  const second = controller.getDevPage();
  expect(second).toBe(html);
});
