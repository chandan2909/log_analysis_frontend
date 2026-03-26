export default function LogTable({ entries, loading }) {
  const levelBadge = {
    ERROR: 'badge-danger',
    WARNING: 'badge-warning',
    INFO: 'badge-info',
    DEBUG: 'badge-info',
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 shimmer" />
        ))}
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div className="glass rounded-2xl text-center py-16 text-text-muted">
        <div className="text-5xl mb-4 animate-float">📋</div>
        <p className="text-lg font-medium">No log entries found</p>
        <p className="text-sm mt-1 text-text-muted/50">Try adjusting your filters or upload a log file</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-premium">
          <thead>
            <tr>
              <th className="text-left w-24">Level</th>
              <th className="text-left w-44">Timestamp</th>
              <th className="text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.id || index}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
              >
                <td>
                  <span className={`badge ${levelBadge[entry.level] || 'badge-info'}`}>
                    {entry.level}
                  </span>
                </td>
                <td className="text-text-muted font-mono text-xs">
                  {entry.timestamp || '—'}
                </td>
                <td className="text-text break-all font-mono text-xs leading-relaxed">
                  {entry.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
