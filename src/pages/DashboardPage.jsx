import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logService } from '../services/logService';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { ErrorsOverTimeChart, ErrorFrequencyChart, LevelDistributionChart } from '../components/ChartPanel';

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [analysisData, logsData] = await Promise.all([
        logService.getAnalysisSummary(),
        logService.getLogs(),
      ]);
      setAnalysis(analysisData);
      setLogs(logsData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg grid-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="section-title text-2xl">Dashboard</h1>
            <p className="section-subtitle">Overview of your log analysis</p>
          </div>
          <Link to="/upload" className="btn-primary text-sm flex items-center gap-2">
            <span>📤</span> Upload Logs
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 shimmer" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards — 30% surface + 10% accent stripe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatsCard title="Total Entries" value={analysis?.totalEntries || 0} icon="📋" accent="primary" delay="0" />
              <StatsCard title="Errors" value={analysis?.errorCount || 0} icon="🔴" accent="danger" delay="0.1" />
              <StatsCard title="Warnings" value={analysis?.warningCount || 0} icon="⚠️" accent="warning" delay="0.2" />
              <StatsCard title="Info" value={analysis?.infoCount || 0} icon="ℹ️" accent="success" delay="0.3" />
            </div>

            {/* Charts — 30% glass panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
              <LevelDistributionChart errorCount={analysis?.errorCount || 0} warningCount={analysis?.warningCount || 0} infoCount={analysis?.infoCount || 0} />
              <ErrorsOverTimeChart data={analysis?.errorsOverTime} />
            </div>

            <div className="mb-8">
              <ErrorFrequencyChart data={analysis?.errorFrequency} />
            </div>

            {/* Root Causes — 30% glass panel */}
            {analysis?.rootCauses?.length > 0 && (
              <div className="glass rounded-2xl p-6 mb-8 animate-slide-up delay-400 card-hover">
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

            {/* Recent Logs — 30% glass table */}
            <div className="glass rounded-2xl p-6 animate-slide-up card-hover">
              <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                <span className="text-sm">📁</span> Recent Uploads
              </h3>
              {logs.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <div className="text-4xl mb-3 animate-float">📂</div>
                  <p className="font-medium mb-1">No logs uploaded yet</p>
                  <p className="text-sm text-text-muted/50 mb-4">Upload a log file to start analyzing</p>
                  <Link to="/upload" className="btn-primary text-sm inline-flex items-center gap-2">
                    Upload your first log →
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-premium">
                    <thead>
                      <tr>
                        <th className="text-left">File</th>
                        <th className="text-left">Entries</th>
                        <th className="text-left">Errors</th>
                        <th className="text-left">Warnings</th>
                        <th className="text-left">Uploaded</th>
                        <th className="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="font-medium text-text">{log.fileName}</td>
                          <td className="text-text-muted">{log.totalEntries}</td>
                          <td><span className="badge badge-danger">{log.errorCount}</span></td>
                          <td><span className="badge badge-warning">{log.warningCount}</span></td>
                          <td className="text-text-muted text-sm">{new Date(log.uploadedAt).toLocaleDateString()}</td>
                          <td>
                            <Link to={`/logs/${log.id}`} className="text-sm text-primary-light hover:text-primary font-medium transition-colors">
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
