import React from 'react';
import { Calendar, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from './badge';
import { Card } from './card';
import { cn } from '@/lib/utils';

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isCompleted = task.status === 'completed';

  const handleCheckboxToggle = () => {
    onStatusChange(task.id, isCompleted ? 'todo' : 'completed');
  };

  // Check if task is overdue
  const isOverdue = !isCompleted && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 gap-0 py-5',
        'bg-neutral-900/40 border-neutral-800 backdrop-blur-sm shadow-none',
        'hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-900/70',
        'hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
        isCompleted && 'opacity-70 border-neutral-900/50 bg-neutral-950/20'
      )}
    >
      {/* Background visual accent glow on hover */}
      <div 
        className={cn(
          "absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none",
          task.priority === 'high' ? 'bg-red-500' :
          task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
        )} 
      />

      <div className="flex items-start gap-4">
        {/* Animated Custom Checkbox */}
        <button
          onClick={handleCheckboxToggle}
          className="mt-1 cursor-pointer text-neutral-500 hover:text-violet-400 active:scale-95 transition-all duration-200"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-in zoom-in-50 duration-200" />
          ) : (
            <Circle className="h-5 w-5 text-neutral-600 hover:text-neutral-400 transition-colors" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={task.priority}>{task.priority} Priority</Badge>
            <Badge variant={task.status}>{task.status.replace('-', ' ')}</Badge>
          </div>

          <h3
            className={cn(
              'text-base font-bold tracking-tight text-neutral-100 mb-1 transition-all duration-200 truncate',
              isCompleted && 'line-through text-neutral-500'
            )}
          >
            {task.title}
          </h3>

          <p
            className={cn(
              'text-sm text-neutral-400 mb-4 pr-2 font-normal',
              isCompleted && 'text-neutral-500'
            )}
          >
            {task.description || 'No description provided.'}
          </p>

          <div className="flex items-center justify-between border-t border-neutral-800/60 pt-3">
            {/* Due Date Indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs text-neutral-400 font-medium',
                isOverdue && 'text-red-400 font-semibold'
              )}
            >
              <Calendar size={13} />
              <span>
                {task.dueDate} {isOverdue && '(Overdue)'}
              </span>
            </div>

            {/* Edit / Delete Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
                title="Edit task"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
