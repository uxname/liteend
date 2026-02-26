import { renderDevLauncherView } from '@/app/dev-launcher/dev-launcher.view';

it('renders the hero and tool cards in English', () => {
  const html = renderDevLauncherView({
    heroTitle: 'Dev Ops Control Room',
    tools: [
      {
        name: 'Prisma Studio',
        description: 'Database GUI',
        href: 'https://localhost:5555',
        category: 'database',
      },
    ],
  });

  expect(html).toContain('Dev Ops Control Room');
  expect(html).toContain('Prisma Studio');
});
