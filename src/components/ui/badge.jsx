import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, variant = 'default', className, ...props }) {
  const styles = {
    // Priorities
    high: 'bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    medium: 'bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    low: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    
    // Statuses
    todo: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
    'in-progress': 'bg-violet-500/10 text-violet-400 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
    completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 line-through decoration-emerald-500/40',
    
    // General
    default: 'bg-neutral-500/10 text-neutral-300 border border-neutral-500/20',
    primary: 'bg-primary/10 text-primary border border-primary/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 select-none backdrop-blur-sm',
        styles[variant] || styles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
