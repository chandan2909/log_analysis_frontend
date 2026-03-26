import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* 10% accent colors for chart data only */
const COLORS = ['#ef4444', '#f59e0b', '#818cf8', '#34d399', '#22d3ee', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-lg p-3 text-sm">
        <p className="text-text-muted text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ErrorsOverTimeChart({ data }) {
  const chartData = Object.entries(data || {}).map(([date, count]) => ({
    date,
    errors: count,
  }));

  if (!chartData.length) {
    return <EmptyChart message="No error timeline data available" icon="📈" />;
  }

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up delay-200 card-hover">
      <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <span className="text-xs">📈</span> Errors Over Time
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.4)" />
          <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="errors"
            stroke="#ef4444"
            fill="url(#errorGradient)"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#1e293b', fill: '#ef4444' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ErrorFrequencyChart({ data }) {
  const chartData = Object.entries(data || {}).map(([message, count]) => ({
    message: message.length > 35 ? message.substring(0, 35) + '...' : message,
    count,
  }));

  if (!chartData.length) {
    return <EmptyChart message="No error frequency data available" icon="📊" />;
  }

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up delay-300 card-hover">
      <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <span className="text-xs">📊</span> Top Error Patterns
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.4)" />
          <XAxis type="number" stroke="#475569" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="message" type="category" width={180} stroke="#475569" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Occurrences" radius={[0, 6, 6, 0]} barSize={18}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LevelDistributionChart({ errorCount, warningCount, infoCount }) {
  const data = [
    { name: 'Errors', value: errorCount, color: '#ef4444' },
    { name: 'Warnings', value: warningCount, color: '#f59e0b' },
    { name: 'Info', value: infoCount, color: '#818cf8' },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return <EmptyChart message="No level distribution data available" icon="🎯" />;
  }

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up delay-100 card-hover">
      <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <span className="text-xs">🎯</span> Log Level Distribution
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#334155', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ message, icon }) {
  return (
    <div className="glass rounded-2xl p-6 flex items-center justify-center h-[320px] card-hover">
      <div className="text-center text-text-muted">
        <div className="text-4xl mb-2 animate-float">{icon || '📉'}</div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
