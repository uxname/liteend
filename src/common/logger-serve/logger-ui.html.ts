export const LOGGER_UI_HTML = `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiteEnd Log Viewer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        gray: { 750: '#2d3748', 850: '#1a202c', 950: '#0d1117' }
                    },
                    fontFamily: { mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'] }
                }
            }
        }
    </script>
    <style>
        body { background-color: #0f172a; color: #e2e8f0; }
        .scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #1e293b; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #64748b; }
        pre { white-space: pre-wrap; word-break: break-all; }
    </style>
</head>
<body class="h-screen overflow-hidden flex flex-col text-sm font-mono">
    <div id="app" class="h-full flex flex-col"></div>

    <script type="module">
        import { h, render } from 'https://esm.sh/preact@10.19.3';
        import { useState, useEffect, useMemo, useRef, useCallback } from 'https://esm.sh/preact@10.19.3/hooks';
        import htm from 'https://esm.sh/htm@3.1.1';

        const html = htm.bind(h);

        // --- Utils ---
        const PINO_LEVELS = {
            10: { label: 'TRACE', color: 'text-gray-500', bg: 'bg-gray-500/10' },
            20: { label: 'DEBUG', color: 'text-blue-400', bg: 'bg-blue-400/10' },
            30: { label: 'INFO', color: 'text-green-400', bg: 'bg-green-400/10' },
            40: { label: 'WARN', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            50: { label: 'ERROR', color: 'text-red-500', bg: 'bg-red-500/10' },
            60: { label: 'FATAL', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        };

        const formatDate = (ts) => {
            if (!ts) return '';
            try { return new Date(ts).toLocaleString('sv-SE'); } catch (e) { return ts; }
        };

        const generateId = () => Math.random().toString(36).substr(2, 9);

        const parseLine = (line) => {
            try {
                const json = JSON.parse(line);
                if (json.level && json.time) {
                    return {
                        isJson: true,
                        id: json.id || generateId(),
                        timestamp: json.time,
                        level: json.level,
                        msg: json.msg || json.message,
                        context: json.context || (json.req ? json.req.method + ' ' + json.req.url : 'System'),
                        raw: json
                    };
                }
                return { isJson: false, id: generateId(), raw: line };
            } catch (e) {
                return { isJson: false, id: generateId(), raw: line };
            }
        };

        // --- Components ---

        const LogItem = ({ item }) => {
            const [expanded, setExpanded] = useState(false);

            if (!item.isJson) {
                return html\`<div class="border-b border-slate-800 py-1 px-4 hover:bg-slate-800/50 text-slate-400 break-all text-[11px]">\${item.raw}</div>\`;
            }

            const levelConfig = PINO_LEVELS[item.level] || { label: 'UNK', color: 'text-gray-400', bg: 'bg-gray-500/10' };
            const msgClass = item.level >= 50 ? 'text-red-300' : 'text-slate-300';

            return html\`
                <div class="group border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <div class="flex items-start py-1 px-4 gap-3 cursor-pointer" onClick=\${() => setExpanded(!expanded)}>
                        <span class="shrink-0 w-32 text-slate-500 text-[10px] mt-0.5 font-sans">\${formatDate(item.timestamp)}</span>
                        <span class="shrink-0 w-14 text-center text-[10px] font-bold px-1 py-0.5 rounded \${levelConfig.color} \${levelConfig.bg}">
                            \${levelConfig.label}
                        </span>
                        <span class="shrink-0 text-[11px] text-indigo-400 w-24 truncate" title=\${item.context}>
                            \${item.context}
                        </span>
                        <span class="grow break-words font-sans text-[12px] \${msgClass}">
                            \${item.msg}
                        </span>
                        <span class="shrink-0 text-slate-600 text-[10px] mt-1 opacity-0 group-hover:opacity-100">\${expanded ? '▲' : '▼'}</span>
                    </div>
                    \${expanded && html\`
                        <div class="px-4 py-2 bg-slate-900/80 text-xs text-slate-400 overflow-x-auto border-t border-slate-800/50 mx-4 mb-2 rounded">
                            <pre>\${JSON.stringify(item.raw, null, 2)}</pre>
                        </div>
                    \`}
                </div>
            \`;
        };

        const App = () => {
            const [files, setFiles] = useState([]);
            const [selectedFile, setSelectedFile] = useState(null);
            const [logs, setLogs] = useState([]);
            const [loading, setLoading] = useState(false);
            const [error, setError] = useState(null);
            const [filter, setFilter] = useState('');
            const [autoRefresh, setAutoRefresh] = useState(false);
            const offsetRef = useRef(0);
            const autoRefreshRef = useRef(false);

            useEffect(() => { autoRefreshRef.current = autoRefresh; }, [autoRefresh]);

            const fetchFiles = async () => {
                console.log('Fetching files...');
                try {
                    const res = await fetch('/logs/api/list', {
                        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
                    });
                    if (!res.ok) throw new Error('Failed to load file list: ' + res.statusText);
                    const list = await res.json();
                    console.log('Files received:', list);
                    setFiles(list);
                    if (!selectedFile && list.length > 0) handleFileSelect(list[0]);
                } catch (e) {
                    console.error('Fetch files error:', e);
                    setError(e.message);
                }
            };

            const handleFileSelect = (file) => {
                setSelectedFile(file);
                setLogs([]);
                offsetRef.current = 0;
                setFilter('');
            };

            const fetchLogs = useCallback(async (isAuto = false) => {
                if (!selectedFile) return;
                if (!isAuto) setLoading(true);

                try {
                    // Use encodeURIComponent to handle paths with slashes safely
                    const url = '/logs/file/' + encodeURIComponent(selectedFile).replace(/%2F/g, '/') + '?start=' + offsetRef.current;
                    const res = await fetch(url);

                    if (res.status === 404) throw new Error('File not found');

                    const sizeHeader = res.headers.get('X-File-Size');
                    if (sizeHeader) {
                        const newSize = parseInt(sizeHeader, 10);
                        offsetRef.current = newSize;
                    }

                    const text = await res.text();

                    if (!text) {
                        setLoading(false);
                        return;
                    }

                    const lines = text.split('\\n').filter(l => l.trim());
                    const parsed = lines.map(parseLine);

                    setLogs(prev => {
                        const newChunkReversed = [...parsed].reverse();
                        return [...newChunkReversed, ...prev];
                    });

                    setError(null);
                } catch (e) {
                    console.error('Fetch logs error:', e);
                    if (!isAuto) setError(e.message);
                } finally {
                    setLoading(false);
                }
            }, [selectedFile]);

            useEffect(() => {
                if (selectedFile) {
                    offsetRef.current = 0;
                    setLogs([]);
                    fetchLogs(false);
                }
            }, [selectedFile]);

            useEffect(() => { fetchFiles(); }, []);

            useEffect(() => {
                const interval = setInterval(() => {
                    if (autoRefreshRef.current && selectedFile) {
                        fetchLogs(true);
                    }
                }, 3000);
                return () => clearInterval(interval);
            }, [selectedFile]);

            const filteredLogs = useMemo(() => {
                if (!filter) return logs;
                const lowerFilter = filter.toLowerCase();
                return logs.filter(l => {
                    if (l.isJson) {
                        return (l.msg && l.msg.toLowerCase().includes(lowerFilter)) ||
                               (l.context && l.context.toLowerCase().includes(lowerFilter)) ||
                               JSON.stringify(l.raw).toLowerCase().includes(lowerFilter);
                    }
                    return l.raw.toLowerCase().includes(lowerFilter);
                });
            }, [logs, filter]);

            return html\`
                <div class="flex flex-col h-full">
                    <header class="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between shrink-0 shadow-md z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 text-xs">L</div>
                            <h1 class="font-bold text-base text-slate-200 tracking-tight">LiteEnd <span class="text-slate-500 font-normal">Logs</span></h1>
                        </div>
                        <div class="flex items-center gap-4">
                            <label class="flex items-center gap-2 text-slate-400 text-xs cursor-pointer select-none hover:text-slate-200 transition-colors">
                                <input type="checkbox" class="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 accent-indigo-600"
                                    checked=\${autoRefresh}
                                    onChange=\${e => setAutoRefresh(e.target.checked)} />
                                <span>Auto-refresh</span>
                            </label>
                            <div class="relative group">
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-1.5 w-64 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
                                    value=\${filter}
                                    onInput=\${e => setFilter(e.target.value)}
                                />
                                \${filter && html\`<button onClick=\${() => setFilter('')} class="absolute right-2 top-1.5 text-slate-500 hover:text-white">×</button>\`}
                            </div>
                            <button onClick=\${() => fetchLogs(false)} class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-lg shadow-indigo-900/20">
                                Refresh
                            </button>
                        </div>
                    </header>

                    <div class="flex grow overflow-hidden">
                        <aside class="w-56 bg-[#0b101b] border-r border-slate-800 flex flex-col shrink-0">
                            <div class="p-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Log Files</div>
                            <div class="overflow-y-auto flex-1 px-2 pb-2 space-y-0.5 scrollbar-thin">
                                \${files.map(file => html\`
                                    <div
                                        onClick=\${() => handleFileSelect(file)}
                                        class="cursor-pointer px-3 py-2 rounded-md text-xs truncate transition-all duration-200 \${selectedFile === file ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}"
                                        title=\${file}
                                    >
                                        \${file}
                                    </div>
                                \`)}
                                \${files.length === 0 && html\`<div class="p-4 text-slate-600 text-xs text-center italic">No log files found</div>\`}
                            </div>
                        </aside>

                        <main class="flex-1 bg-[#0d1117] flex flex-col overflow-hidden relative">
                            \${error && html\`<div class="bg-red-500/10 border-b border-red-900/50 p-2 text-center text-red-400 text-xs">\${error}</div>\`}

                            <div class="flex-1 overflow-y-auto scrollbar-thin scroll-smooth">
                                \${loading && logs.length === 0 ? html\`
                                    <div class="flex flex-col items-center justify-center h-full text-slate-500 text-xs gap-2">
                                        <div class="w-5 h-5 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
                                        Loading...
                                    </div>
                                \` : html\`
                                    <div class="min-w-full pb-4">
                                        \${filteredLogs.map((item) => html\`<\${LogItem} key=\${item.id} item=\${item} />\`)}
                                        \${filteredLogs.length === 0 && !loading && html\`
                                            <div class="flex flex-col items-center justify-center h-64 text-slate-600 text-xs gap-2 opacity-50">No logs match your criteria</div>
                                        \`}
                                    </div>
                                \`}
                            </div>

                            <div class="bg-slate-900 border-t border-slate-800 px-4 py-1.5 text-[11px] text-slate-500 flex justify-between shrink-0 select-none z-10">
                                <span class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full \${autoRefresh ? 'bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}"></span>
                                    \${selectedFile || 'No file selected'}
                                </span>
                                <span class="font-mono">\${filteredLogs.length} / \${logs.length} events</span>
                            </div>
                        </main>
                    </div>
                </div>
            \`;
        };

        render(html\`<\${App} />\`, document.getElementById('app'));
    </script>
</body>
</html>
`;
