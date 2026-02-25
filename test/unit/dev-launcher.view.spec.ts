import { renderDevLauncherView } from '@/app/dev-launcher/dev-launcher.view';

it('renders the hero and tool cards in English', () => {
  const html = renderDevLauncherView({
    tools: [
      {
        name: 'Prisma Studio',
        description: 'Database GUI',
        href: 'https://localhost:5555',
        category: 'database',
      },
    ],
  });

  expect(html).toContain('Your Dev Ops Control Room');
  expect(html).toContain('Operational Tools');
  expect(html).toContain('Prisma Studio');
  expect(html).toContain('aria-label="Open Prisma Studio"');
});
