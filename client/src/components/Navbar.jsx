import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            >
              ✈
            </div>
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #6EE7B7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              className="text-xl font-bold"
            >
              TripMind
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-emerald-300' : 'text-gray-300 hover:text-emerald-400'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/upload"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-emerald-300' : 'text-gray-300 hover:text-emerald-400'
                      }`
                    }
                  >
                    Upload
                  </NavLink>

                  <div className="hidden lg:flex items-center gap-2 text-gray-300">
                    <div
                      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      aria-hidden="true"
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>

                  <div
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                    className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    title={user.name}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm min-h-[44px]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-emerald-300' : 'text-gray-300 hover:text-emerald-400'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px] inline-flex items-center"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden pb-4 animate-slideUp">
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3">
              {user ? (
                <div className="space-y-1">
                  <NavLink
                    to="/"
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] ${
                        isActive ? 'text-emerald-300 bg-white/5' : 'text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/upload"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] ${
                        isActive ? 'text-emerald-300 bg-white/5' : 'text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    Upload
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] text-red-200 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] ${
                        isActive ? 'text-emerald-300 bg-white/5' : 'text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] text-white"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
