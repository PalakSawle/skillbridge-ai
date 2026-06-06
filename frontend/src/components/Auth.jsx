import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import { Shield, Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authAPI.login({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
      } else {
        const data = await authAPI.register({ name, email, password, role });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel glow-indigo transition-all duration-300">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-brand-500/10 text-brand-400 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            SKILLBRIDGE <span className="text-brand-500">AI</span>
          </h2>
          <p className="text-dark-400 mt-2 text-sm">
            AI-powered Resume-to-Job Fit & Learning Roadmap Engine
          </p>
        </div>

        <div className="flex border-b border-dark-800 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              isLogin ? 'border-brand-500 text-white font-medium' : 'border-transparent text-dark-400'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              !isLogin ? 'border-brand-500 text-white font-medium' : 'border-transparent text-dark-400'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-dark-500">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-xl focus:ring-1 focus:ring-brand-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-dark-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-xl focus:ring-1 focus:ring-brand-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-dark-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-xl focus:ring-1 focus:ring-brand-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                User Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    role === 'student'
                      ? 'bg-brand-500/10 border-brand-500 text-white'
                      : 'bg-dark-900 border-dark-800 text-dark-400'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${role === 'student' ? 'opacity-100' : 'opacity-0'}`} />
                  Student / Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    role === 'admin'
                      ? 'bg-indigo-500/10 border-indigo-500 text-white'
                      : 'bg-dark-900 border-dark-800 text-dark-400'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${role === 'admin' ? 'opacity-100' : 'opacity-0'}`} />
                  Placement Cell
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-brand-600 hover:bg-brand-500 active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-150 flex items-center justify-center shadow-lg shadow-brand-500/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : isLogin ? (
              'Log In to Dashboard'
            ) : (
              'Register & Start Analyzing'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-dark-500">
          By signing in you agree to our Terms of Service & Privacy Policy
        </div>

      </div>
    </div>
  );
}
