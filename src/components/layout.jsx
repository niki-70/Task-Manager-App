import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  CheckSquare, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('task_manager_theme');
    if (stored) return stored;
    return 'dark'; // Default to dark mode for rich ambient aesthetics
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('task_manager_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Predefined avatar gradient based on initials
  const getAvatarGradient = (username) => {
    const hash = username ? username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const gradients = [
      'from-violet-500 to-fuchsia-500',
      'from-emerald-400 to-cyan-500',
      'from-amber-400 to-pink-500',
      'from-blue-500 to-indigo-500',
    ];
    return gradients[hash % gradients.length];
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Task List', path: '/tasks', icon: CheckSquare },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col font-sans select-none antialiased">
      {/* Decorative ambient color spots (glassmorphism feel) */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none dark:bg-violet-600/10" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-fuchsia-600/5 blur-[120px] pointer-events-none dark:bg-fuchsia-600/10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/40 bg-neutral-950/65 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform duration-300 group-hover:scale-105">
                  <Layers size={18} className="text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-neutral-50 to-neutral-200 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-400 group-hover:text-neutral-100 transition-colors">
                  Vortex<span className="text-violet-500">Tasks</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent',
                        isActive
                          ? 'bg-violet-600/10 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                          : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Actions (Theme toggle, Profile avatar) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-100 transition-all duration-200 cursor-pointer active:scale-95"
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* User Dropdown Profile mock */}
              {user && (
                <div className="flex items-center gap-3 pl-3 border-l border-neutral-800/60">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-neutral-200 leading-tight">
                      {user.username}
                    </span>
                    <span className="text-xs text-neutral-500">{user.email}</span>
                  </div>
                  <Link to="/profile" title="View Profile">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-sm text-white shadow-md border border-neutral-800/40 cursor-pointer hover:opacity-90 active:scale-95 transition-all",
                      getAvatarGradient(user.username)
                    )}>
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-transparent p-2 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/10 transition-all duration-200 cursor-pointer active:scale-95"
                    title="Logout account"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Actions / Toggle */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={toggleTheme}
                className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-all duration-200"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-all"
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800/60 bg-neutral-950/95 p-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-violet-600/15 text-violet-400 border border-violet-500/10'
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="my-2 border-t border-neutral-800/40" />

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-sm text-white",
                    getAvatarGradient(user.username)
                  )}>
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-200">{user.username}</span>
                    <span className="text-xs text-neutral-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {children}
      </main>
    </div>
  );
}
