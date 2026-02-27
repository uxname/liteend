import type { DevTool, DevToolCategory } from './tools';

interface DevLauncherViewProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroNote?: string;
  tools: DevTool[];
}

const UI_CONFIG = {
  TITLE: 'Platform Operations',
  SUBTITLE:
    'Centralized access to infrastructure, databases, and API environments.',
  NOTE: 'Authenticated Session Only',
};

const CATEGORY_STYLE: Record<DevToolCategory, { color: string; icon: string }> =
  {
    database: {
      color: 'text-blue-700 bg-blue-50 border-blue-300',
      icon: `<path d="M12 5c-3.866 0-7 1.343-7 3s3.134 3 7 3 7-1.343 7-3-3.134-3-7-3Z"/><path d="M5 8v5c0 1.657 3.134 3 7 3s7-1.343 7-3V8"/><path d="M5 13v5c0 1.657 3.134 3 7 3s7-1.343 7-3v-5"/>`,
    },
    queue: {
      color: 'text-purple-700 bg-purple-50 border-purple-300',
      icon: `<rect width="20" height="8" x="2" y="3" rx="2"/><rect width="20" height="8" x="2" y="13" rx="2"/><path d="M7 11v2"/><path d="M17 11v2"/>`,
    },
    api: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      icon: `<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/>`,
    },
    infra: {
      color: 'text-orange-700 bg-orange-50 border-orange-300',
      icon: `<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>`,
    },
    other: {
      color: 'text-zinc-700 bg-zinc-50 border-zinc-300',
      icon: `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
    },
  };

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        m
      ]!,
  );
}

function renderCard(tool: DevTool) {
  const cfg = CATEGORY_STYLE[tool.category] || CATEGORY_STYLE.other;

  return `
    <a href="${escapeHtml(tool.href)}" target="_blank" rel="noopener"
       class="group relative flex flex-col justify-between p-6 bg-white border border-zinc-300 rounded-2xl transition-all duration-300
              hover:border-black hover:ring-1 hover:ring-black hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1">

      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 flex items-center justify-center rounded-lg border ${cfg.color}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${cfg.icon}</svg>
          </span>
          <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-600">${escapeHtml(tool.category)}</span>
        </div>
        <div class="text-zinc-400 group-hover:text-black transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold text-zinc-900 mb-1 group-hover:underline decoration-2 underline-offset-4 truncate">${escapeHtml(tool.name)}</h3>
        <p class="text-sm leading-relaxed text-zinc-600 line-clamp-2">${escapeHtml(tool.description)}</p>
      </div>

      <div class="flex items-center gap-2 font-mono text-[11px] text-zinc-500 overflow-hidden shrink-0">
        <span class="shrink-0 text-zinc-400 font-bold">PATH:</span>
        <span class="truncate uppercase tracking-wider">${escapeHtml(tool.path || '/root')}</span>
      </div>
    </a>
  `;
}

export function renderDevLauncherView(props: DevLauncherViewProps): string {
  const title = props.heroTitle || UI_CONFIG.TITLE;
  const subtitle = props.heroSubtitle || UI_CONFIG.SUBTITLE;
  const note = props.heroNote || UI_CONFIG.NOTE;
  const toolsMarkup = props.tools.map(renderCard).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background: #ffffff; color: #000; }
        .grid-bg { background-image: radial-gradient(#d1d5db 1px, transparent 1px); background-size: 32px 32px; }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <div class="fixed inset-0 grid-bg -z-10 opacity-60"></div>

    <main class="flex-1 flex flex-col w-full max-w-[1600px] mx-auto p-4 sm:p-6 md:p-12 lg:p-16">

        <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 shrink-0">
            <div class="space-y-6">
                <div class="inline-flex items-center gap-3 px-3 py-1.5 border border-zinc-300 bg-zinc-50 rounded-lg shadow-sm">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span class="font-mono text-[11px] font-bold tracking-widest text-zinc-700 uppercase">${escapeHtml(note)}</span>
                </div>

                <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-black uppercase">
                    ${escapeHtml(title)}
                </h1>

                <p class="text-base sm:text-lg md:text-xl text-zinc-600 font-medium max-w-2xl leading-relaxed">
                    ${escapeHtml(subtitle)}
                </p>
            </div>

            <div class="hidden lg:flex flex-col items-end gap-1">
                <div class="text-[11px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Control Nodes</div>
                <div class="px-6 py-4 border-2 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <span class="text-3xl font-black">${props.tools.length}</span>
                    <span class="text-xs font-bold text-zinc-500 ml-2 uppercase">Active</span>
                </div>
            </div>
        </header>

        <section class="flex-1 pb-12 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                ${toolsMarkup}
            </div>
        </section>

    </main>

    <footer class="p-6 text-center border-t border-zinc-200 bg-white/50 backdrop-blur-sm mt-auto shrink-0">
        <p class="font-mono text-[11px] text-zinc-500 tracking-widest uppercase font-bold">
            Ops Dashboard • Precision Engineering Center
        </p>
    </footer>
</body>
</html>
  `;
}
