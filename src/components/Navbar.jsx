import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload', icon: '📤' },
  ];

  return (
    <nav className="nav-premium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — 10% accent */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm shadow-md shadow-primary/20 group-hover:shadow-primary/30 transition-all">
              ⚡
            </div>
            <span className="text-lg font-bold text-text">
              Log<span className="text-primary-light">Analyzer</span>
            </span>
          </Link>

          {/* Nav Links — 30% surface active states */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'nav-link-active'
                      : 'text-text-muted hover:text-text hover:bg-surface-lighter/30'
                  }`}
                >
                  <span className="text-xs">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* User — 30% surface avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface-lighter flex items-center justify-center text-xs font-bold uppercase text-primary-light border border-border">
                {username?.charAt(0) || 'U'}
              </div>
              <span className="text-sm text-text-muted">{username}</span>
            </div>
            <div className="w-px h-5 bg-border hidden sm:block" />
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-danger-light hover:bg-danger/5 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
