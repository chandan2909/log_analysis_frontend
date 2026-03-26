import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { logService } from '../services/logService';
import Navbar from '../components/Navbar';
import LogTable from '../components/LogTable';
import FilterBar from '../components/FilterBar';
import StatsCard from '../components/StatsCard';
import { ErrorsOverTimeChart, ErrorFrequencyChart, LevelDistributionChart } from '../components/ChartPanel';

export default function LogDetailPage() {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [entries, setEntries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [level, setLevel] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [activeView, setActiveView] = useState('entries');

  useEffect(() => {
    loadLogData();
  }, [id]);

  useEffect(() => {
    loadEntries();
  }, [id, level, keyword]);

  const loadLogData = async () => {
    try {
      setLoading(true);
      const [logData, analysisData] = await Promise.all([
        logService.getLog(id),
        logService.getAnalysis(id),
      ]);
      setLog(logData);
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Failed to load log:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    try {
      setEntriesLoading(true);
      const data = await logService.getLogEntries(id, level, keyword);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-bg">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-6 w-48 shimmer rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 shimmer" />)}
          </div>
          <div className="h-96 shimmer" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg grid-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <Link to="/" className="text-sm text-primary-light hover:text-primary mb-2 inline-flex items-center gap-1 transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="section-title text-xl">{log?.fileName || 'Log Details'}</h1>
            <p className="section-subtitle">
              Uploaded {log?.uploadedAt ? new Date(log.uploadedAt).toLocaleString() : ''}
            </p>
          </div>

          {/* View Toggle — 30% glass, 10% accent active */}
          <div className="flex rounded-xl overflow-hidden border border-border/50 glass">
            {[
              { key: 'entries', label: 'Entries', icon: '📋' },
              { key: 'charts', label: 'Charts', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  activeView === tab.key
                    ? 'bg-primary/10 text-primary-light'
                    : 'text-text-muted hover:text-text hover:bg-surface-lighter/30'
                }`}
              >
                <span className="text-xs">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats — 30% surface with 10% accent stripe */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total" value={analysis?.totalEntries || 0} icon="📋" accent="primary" delay="0" />
          <StatsCard title="Errors" value={analysis?.errorCount || 0} icon="🔴" accent="danger" delay="0.1" />
          <StatsCard title="Warnings" value={analysis?.warningCount || 0} icon="⚠️" accent="warning" delay="0.2" />
          <StatsCard title="Info" value={analysis?.infoCount || 0} icon="ℹ️" accent="success" delay="0.3" />
        </div>

        {activeView === 'entries' ? (
          <div className="animate-fade-in">
            <FilterBar level={level} setLevel={setLevel} keyword={keyword} setKeyword={setKeyword} />
            <LogTable entries={entries} loading={entriesLoading} />
            <div className="mt-4 text-sm text-text-muted/50">
              Showing {entries.length} entries
              {level && <span className="badge badge-info ml-2">{level}</span>}
              {keyword && <span className="text-text-muted/30 ml-2">• "{keyword}"</span>}
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <LevelDistributionChart errorCount={analysis?.errorCount || 0} warningCount={analysis?.warningCount || 0} infoCount={analysis?.infoCount || 0} />
              <ErrorsOverTimeChart data={analysis?.errorsOverTime} />
            </div>
            <ErrorFrequencyChart data={analysis?.errorFrequency} />

            {analysis?.rootCauses?.length > 0 && (
              <div className="glass rounded-2xl p-6 card-hover">
                <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="text-sm">🧠</span> Root Cause Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.rootCauses.map((rc, i) => (
                    <div key={i} className="rounded-xl bg-surface-light/40 border border-border/50 p-4 hover:border-primary/15 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-danger-light">{rc.pattern}</span>
                        <span className="badge badge-danger">{rc.occurrences}×</span>
                      </div>
                      <p className="text-sm text-warning-light mb-1">⚡ {rc.cause}</p>
                      <p className="text-xs text-text-muted leading-relaxed">{rc.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
