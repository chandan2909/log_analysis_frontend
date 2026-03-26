import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logService } from '../services/logService';
import Navbar from '../components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [rawContent, setRawContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('file');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setError('');
    setSuccess(null);
    setUploading(true);

    try {
      let result;
      if (activeTab === 'file' && file) {
        result = await logService.uploadFile(file);
      } else if (activeTab === 'paste' && rawContent.trim()) {
        result = await logService.uploadRaw(rawContent);
      } else {
        setError('Please select a file or paste log content');
        setUploading(false);
        return;
      }

      setSuccess(result);
      setTimeout(() => navigate(`/logs/${result.id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg grid-bg">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in mb-8">
          <h1 className="section-title text-2xl">Upload Logs</h1>
          <p className="section-subtitle">Upload a log file or paste raw log content for analysis</p>
        </div>

        {/* Tab Toggle — 30% glass surface, 10% accent active state */}
        <div className="flex rounded-xl overflow-hidden border border-border/50 mb-6 w-fit animate-slide-up glass">
          {[
            { key: 'file', label: 'Upload File', icon: '📁' },
            { key: 'paste', label: 'Paste Logs', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-primary/10 text-primary-light'
                  : 'text-text-muted hover:text-text hover:bg-surface-lighter/30'
              }`}
            >
              <span className="text-xs">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Card — 30% glass surface */}
        <div className="glass rounded-2xl p-8 animate-slide-up delay-100 card-hover">
          {activeTab === 'file' ? (
            <div
              className={`drop-zone rounded-2xl p-14 text-center cursor-pointer ${dragActive ? 'drop-zone-active' : ''} ${file ? 'border-success/30 bg-success/3' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.log"
                onChange={handleFileSelect}
                className="hidden"
              />
              {file ? (
                <div>
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-base font-semibold text-success-light">{file.name}</p>
                  <p className="text-sm text-text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-3 text-sm text-danger-light hover:text-danger transition-colors cursor-pointer"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-4 animate-float">📂</div>
                  <p className="text-base font-semibold text-text mb-1">Drop your log file here</p>
                  <p className="text-sm text-text-muted/50">or click to browse • .txt and .log files</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder={`Paste your log content here...\n\nExample:\n2024-01-15 10:30:45 ERROR NullPointerException in UserService\n2024-01-15 10:30:46 WARNING High memory usage detected\n2024-01-15 10:30:47 INFO Application started successfully`}
                className="input-premium w-full h-64 resize-y font-mono text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-text-muted/40">
                  {rawContent.split('\n').filter(l => l.trim()).length} lines
                </p>
                {rawContent && (
                  <button onClick={() => setRawContent('')} className="text-xs text-text-muted hover:text-danger-light transition-colors cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger/8 border border-danger/15 text-danger-light text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 rounded-lg bg-success/8 border border-success/15">
              <p className="text-success-light font-medium mb-1">✅ Upload successful!</p>
              <p className="text-sm text-text-muted">
                Parsed {success.totalEntries} entries • {success.errorCount} errors • {success.warningCount} warnings
              </p>
              <p className="text-xs text-text-muted/40 mt-1">Redirecting to log details...</p>
            </div>
          )}

          {/* Button — 10% accent */}
          <button
            id="upload-btn"
            onClick={handleUpload}
            disabled={uploading || (!file && !rawContent.trim())}
            className="btn-primary w-full mt-6 text-sm"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : '⚡ Upload & Analyze'}
          </button>
        </div>
      </main>
    </div>
  );
}
