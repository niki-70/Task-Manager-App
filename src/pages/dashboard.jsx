import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  CalendarDays,
  PlusCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, updateTask } = useTasks();
  const navigate = useNavigate();

  // Metrics Logic
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Due Soon Tasks (incomplete tasks sorted by dueDate ascending)
  const dueSoonTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Priority counts for priority distribution
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriorityCount = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'low').length;

  const getPriorityPercentage = (count) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Hello Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 mb-1.5">
            Hello, {user?.username || 'User'}! 👋
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            Here's an overview of your tasks and productivity today.
          </p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="self-start px-4.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle size={16} />
          Create New Task
        </button>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-400">Total Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800/60 text-neutral-300">
              <CalendarDays size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-100">{totalCount}</span>
            <span className="text-xs text-neutral-500 font-medium">created</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-400">Active Pending</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-100">{pendingCount}</span>
            <span className="text-xs text-neutral-500 font-medium">in progress / todo</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-400">Completed Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-100">{completedCount}</span>
            <span className="text-xs text-neutral-500 font-medium">tasks done</span>
          </div>
        </div>

        {/* Completion Rate with Premium Circular Look */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-400">Completion Rate</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{completionRate}%</span>
            </div>
          </div>

          {/* Premium Circular SVG Progress Indicator */}
          <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-violet-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${completionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp size={14} className="text-violet-400" />
            </div>
          </div>
        </div>

      </div>

      {/* Main section double panel: Priority Distribution + Due Soon */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Priority distribution block (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-neutral-200 mb-1">Priority Distribution</h2>
          <p className="text-xs text-neutral-500 mb-6">Percentage of tasks by urgency level</p>

          {totalCount === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm text-neutral-500">
              No task distributions to display.
            </div>
          ) : (
            <div className="space-y-5.5">
              {/* High */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-red-400">High Priority</span>
                  <span className="text-neutral-400">{highPriorityCount} ({getPriorityPercentage(highPriorityCount)}%)</span>
                </div>
                <div className="h-2 w-full bg-neutral-800/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getPriorityPercentage(highPriorityCount)}%` }}
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-amber-400">Medium Priority</span>
                  <span className="text-neutral-400">{mediumPriorityCount} ({getPriorityPercentage(mediumPriorityCount)}%)</span>
                </div>
                <div className="h-2 w-full bg-neutral-800/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getPriorityPercentage(mediumPriorityCount)}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Low */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-emerald-400">Low Priority</span>
                  <span className="text-neutral-400">{lowPriorityCount} ({getPriorityPercentage(lowPriorityCount)}%)</span>
                </div>
                <div className="h-2 w-full bg-neutral-800/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getPriorityPercentage(lowPriorityCount)}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Due Soon Task Panel (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-neutral-200">Due Soon</h2>
              <Link
                to="/tasks"
                className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group"
              >
                View all tasks
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="text-xs text-neutral-500 mb-6">Incomplete tasks sorted by closest due date</p>

            {dueSoonTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl mb-2">🎉</span>
                <h3 className="text-sm font-bold text-neutral-300">All caught up!</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">You have no active pending tasks due soon.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {dueSoonTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-850 bg-neutral-950/20 hover:bg-neutral-950/45 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox trigger */}
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => updateTask(task.id, { status: 'completed' })}
                        className="h-4.5 w-4.5 rounded-md border-neutral-800 bg-neutral-900/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-neutral-900 cursor-pointer"
                        title="Mark complete"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-neutral-200 truncate group-hover:text-neutral-100">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-red-400 font-semibold">{task.dueDate}</span>
                          <Badge variant={task.priority} className="text-[9px] px-1.5 py-0">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/tasks')}
                      className="px-3 py-1 text-xs font-semibold text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-all"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
