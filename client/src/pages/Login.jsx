import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Hard reset to avoid browser autofill persisting across navigations
    setForm({ email: '', password: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        minHeight: '100vh',
      }}
      className="flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg"
          >
            ✈
          </div>
          <h1
            style={{
              background: 'linear-gradient(135deg, #10B981, #6EE7B7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="text-3xl font-bold"
          >
            TripMind
          </h1>
          <p className="text-gray-400 mt-2">Your AI-powered travel planner</p>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}
          className="rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to manage your trips</p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">
                Email address
              </label>
              <input
                type="email"
                autoComplete="off"
                defaultValue=""
                autoFocus
                id="tm-login-email"
                name="tm-login-email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 min-h-[44px]"
                required
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                defaultValue=""
                id="tm-login-password"
                name="tm-login-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 min-h-[44px]"
                required
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#374151' : 'linear-gradient(135deg, #10B981, #059669)',
              }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg mt-2 min-h-[44px]"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
