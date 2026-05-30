import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { User, Mail, Save, Calendar, CheckSquare, Award } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { tasks } = useTasks();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Stats
  const totalCreated = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const completionPercentage = totalCreated > 0 ? Math.round((completedCount / totalCreated) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim()) {
      setError('Username and Email fields cannot be blank.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate premium user responsiveness
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateProfile({ username, email });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarGradient = (name) => {
    const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const gradients = [
      'from-violet-500 to-fuchsia-500',
      'from-emerald-400 to-cyan-500',
      'from-amber-400 to-pink-500',
      'from-blue-500 to-indigo-500',
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Title */}
      <div className="border-b border-neutral-800/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 mb-1">
          Profile Settings
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Customize your credentials and view your achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Side: Avatar Panel & Achievement Stats */}
        <div className="space-y-6">
          
          {/* Avatar Premium Display Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm flex flex-col items-center text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br font-black text-3xl text-white shadow-xl border border-neutral-800/60 mb-4 animate-in zoom-in-50 duration-500`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-100 ${getAvatarGradient(user?.username)}`} />
              <span className="relative z-10">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-100">{user?.username}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-neutral-400 bg-neutral-800/40 px-2.5 py-1 rounded-lg">
              <Calendar size={12} />
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : 'Recently'}</span>
            </div>
          </div>

          {/* Achievement stats grid */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-1.5 border-b border-neutral-800/40 pb-2">
              <Award size={15} className="text-violet-400" />
              Your Achievements
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase">Tasks Created</span>
                <span className="text-2xl font-black text-neutral-200 mt-1 block">{totalCreated}</span>
              </div>
              <div className="p-3 bg-neutral-950/20 border border-neutral-850 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase">Tasks Completed</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{completedCount}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="text-neutral-400">Total Completion Ratio</span>
                <span className="text-violet-400">{completionPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${completionPercentage}%` }}
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Account Settings Form (2 cols) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-neutral-200 mb-5">Account Credentials</h2>

            {/* Error or Success Panels */}
            {error && (
              <div className="mb-4.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400 font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
                  Display Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-colors focus:border-violet-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-2.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 transition-colors focus:border-violet-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-800/40 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
