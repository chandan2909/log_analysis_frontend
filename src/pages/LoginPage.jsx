import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isRegister) {
        response = await authService.register(username, email, password);
      } else {
        response = await authService.login(username, password);
      }
      login(response.token, response.username);
      navigate('/');
    } catch (err) {
      let msg = 'Something went wrong. Please try again.';
      try {
        const data = err.response?.data;
        if (typeof data === 'string') {
          msg = data;
        } else if (data?.message) {
          msg = data.message;
        } else if (data?.errors && typeof data.errors === 'object') {
          msg = Object.values(data.errors).join(', ');
        }
      } catch { /* fallback */ }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo — 10% accent icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg shadow-primary/20 mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-text tracking-tight">
            Log<span className="text-primary-light">Analyzer</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">AI-powered log analysis platform</p>
        </div>

        {/* Form Card — 30% glass surface */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-text mb-6">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger/8 border border-danger/15 text-danger-light text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Username</label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-premium"
                placeholder="Enter your username"
              />
            </div>

            {isRegister && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-premium"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-premium"
                placeholder="Enter your password"
              />
            </div>

            {/* Button — 10% accent */}
            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-text-muted hover:text-primary-light transition-colors cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-muted/40 mt-6">
          Secured with JWT • Built with Spring Boot & React
        </p>
      </div>
    </div>
  );
}
