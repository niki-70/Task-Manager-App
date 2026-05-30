import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Layers, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate delay for high premium responsiveness feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85svh] flex flex-col items-center justify-center p-4 relative select-none">
      {/* Background visual accent glow on registration card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

      {/* Card container */}
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/45 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-3">
            <Layers className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-100">Create Account</h2>
          <p className="text-sm text-neutral-500 mt-1">Get started in seconds</p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 font-medium animate-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:border-violet-500/50 focus:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-violet-600/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:border-violet-500/50 focus:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-violet-600/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:border-violet-500/50 focus:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-violet-600/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:border-violet-500/50 focus:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-violet-600/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Register Account
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-5 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition-colors pl-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
