export default function StatsCard({ title, value, icon, accent, delay = '0' }) {
  const iconColor = {
    primary: 'text-primary-light',
    danger: 'text-danger-light',
    warning: 'text-warning-light',
    success: 'text-success-light',
  };

  const valueColor = {
    primary: 'text-primary-light',
    danger: 'text-danger-light',
    warning: 'text-warning-light',
    success: 'text-success-light',
  };

  return (
    <div
      className={`stats-card accent-${accent} rounded-2xl p-5 animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-bold mt-1.5 animate-count ${valueColor[accent] || 'text-text'}`} style={{ animationDelay: `${Number(delay) + 0.2}s` }}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`text-3xl ${iconColor[accent] || ''} opacity-60`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
