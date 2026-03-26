export default function FilterBar({ level, setLevel, keyword, setKeyword }) {
  const levels = [
    { key: '', label: 'ALL', color: 'bg-primary/10 text-primary-light' },
    { key: 'ERROR', label: 'ERROR', color: 'bg-danger/10 text-danger-light' },
    { key: 'WARNING', label: 'WARN', color: 'bg-warning/10 text-warning-light' },
    { key: 'INFO', label: 'INFO', color: 'bg-info/10 text-primary-light' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Level Filter — 30% glass surface, 10% accent active state */}
      <div className="flex rounded-xl overflow-hidden border border-border/50 glass">
        {levels.map((l) => {
          const isActive = l.key === level;
          return (
            <button
              key={l.key}
              onClick={() => setLevel(l.key)}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider transition-all cursor-pointer border-r border-border/30 last:border-r-0 ${
                isActive ? l.color : 'text-text-muted hover:text-text hover:bg-surface-lighter/30'
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Input — 30% surface */}
      <div className="relative flex-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/40 text-sm">🔍</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search log messages..."
          className="input-premium w-full pl-10"
        />
      </div>
    </div>
  );
}
