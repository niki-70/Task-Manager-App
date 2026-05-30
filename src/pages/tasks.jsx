import React, { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { TaskCard } from '@/components/ui/task-card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  LayoutGrid, 
  ListTodo,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate-asc'); // dueDate-asc, dueDate-desc, createdAt-desc

  // View Mode: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState('kanban');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null if adding new task

  // Modal Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('medium');
  const [formStatus, setFormStatus] = useState('todo');
  const [formDueDate, setFormDueDate] = useState('');

  // Handle open modal for creating
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
    setFormStatus('todo');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormDueDate(task.dueDate);
    setIsModalOpen(true);
  };

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const taskData = {
      title: formTitle,
      description: formDescription,
      priority: formPriority,
      status: formStatus,
      dueDate: formDueDate,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  // Quick move status handler for kanban arrows
  const moveTaskStatus = (taskId, currentStatus, direction) => {
    const statuses = ['todo', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < statuses.length) {
      updateTask(taskId, { status: statuses[newIndex] });
    }
  };

  // Filtering & Sorting Process
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            task.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate-asc') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'dueDate-desc') {
        return new Date(b.dueDate) - new Date(a.dueDate);
      } else if (sortBy === 'createdAt-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header and View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 mb-1">
            Task Management
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            Manage, organize, and sort your active workflow boards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle Group */}
          <div className="flex rounded-xl border border-neutral-800 bg-neutral-950/40 p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                viewMode === 'kanban'
                  ? 'bg-violet-600/15 text-violet-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              )}
            >
              <LayoutGrid size={14} />
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                viewMode === 'list'
                  ? 'bg-violet-600/15 text-violet-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              )}
            >
              <ListTodo size={14} />
              List View
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-neutral-900/10 border border-neutral-800/40 rounded-2xl p-4 backdrop-blur-sm">
        
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-850 bg-neutral-950/20 py-2 pl-9.5 pr-4 text-xs text-neutral-200 placeholder-neutral-500 transition-all focus:border-violet-500/40 focus:bg-neutral-950/40 focus:outline-none"
          />
        </div>

        {/* Status Filter (only active in list view) */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
            <Filter size={14} />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={viewMode === 'kanban'}
            className="w-full rounded-xl border border-neutral-850 bg-neutral-950/20 py-2 pl-9.5 pr-4 text-xs text-neutral-200 focus:border-violet-500/40 focus:outline-none appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
            <Layers size={14} />
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-neutral-850 bg-neutral-950/20 py-2 pl-9.5 pr-4 text-xs text-neutral-200 focus:border-violet-500/40 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500 pointer-events-none">
            <ArrowUpDown size={14} />
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-neutral-850 bg-neutral-950/20 py-2 pl-9.5 pr-4 text-xs text-neutral-200 focus:border-violet-500/40 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="dueDate-asc">Due Date: Soonest</option>
            <option value="dueDate-desc">Due Date: Latest</option>
            <option value="createdAt-desc">Created: Newest</option>
          </select>
        </div>

      </div>

      {/* Main Board Area */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {['todo', 'in-progress', 'completed'].map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status);
            const statusLabel = 
              status === 'todo' ? 'To Do' :
              status === 'in-progress' ? 'In Progress' : 'Completed';
            
            const columnColor =
              status === 'todo' ? 'border-t-neutral-500 bg-neutral-500/5' :
              status === 'in-progress' ? 'border-t-violet-500 bg-violet-500/5' : 'border-t-emerald-500 bg-emerald-500/5';

            return (
              <div
                key={status}
                className={cn(
                  'rounded-2xl border border-neutral-800 border-t-4 p-5 min-h-[500px] flex flex-col',
                  columnColor
                )}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between mb-5 border-b border-neutral-800/40 pb-3">
                  <h3 className="text-sm font-bold text-neutral-200 tracking-tight flex items-center gap-2">
                    {statusLabel}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] text-neutral-400 font-extrabold">
                      {columnTasks.length}
                    </span>
                  </h3>
                </div>

                {/* Column Cards Stack */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-44 border border-dashed border-neutral-800/60 rounded-xl flex items-center justify-center text-center p-4">
                      <p className="text-xs text-neutral-500 font-medium">No tasks in this board</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div key={task.id} className="relative group/kanban">
                        <TaskCard
                          task={task}
                          onEdit={handleOpenEditModal}
                          onDelete={deleteTask}
                          onStatusChange={updateTask}
                        />

                        {/* Kanban Quick Movement Overlay Arrow Helpers */}
                        <div className="absolute right-4.5 top-4 flex gap-1 opacity-0 group-hover/kanban:opacity-100 transition-opacity duration-300">
                          {status !== 'todo' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, task.status, -1)}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-neutral-200 transition-colors"
                              title="Move back"
                            >
                              <ArrowLeft size={10} />
                            </button>
                          )}
                          {status !== 'completed' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, task.status, 1)}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-neutral-200 transition-colors"
                              title="Move forward"
                            >
                              <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        filteredTasks.length === 0 ? (
          <div className="h-64 border border-dashed border-neutral-800/80 rounded-2xl flex flex-col items-center justify-center text-center p-8">
            <span className="text-3xl mb-2">🔍</span>
            <h3 className="text-sm font-bold text-neutral-300">No tasks found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-[250px]">
              Try adjusting your active searches or filters, or create a brand new task.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={deleteTask}
                onStatusChange={updateTask}
              />
            ))}
          </div>
        )
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border border-neutral-800 bg-neutral-900/95 backdrop-blur-xl text-neutral-100 rounded-2xl max-w-lg p-6 [&>button]:text-neutral-400 [&>button]:hover:text-neutral-100">
          <DialogHeader className="border-b border-neutral-800 pb-3 mb-2 flex flex-col gap-1">
            <DialogTitle className="text-lg font-bold text-neutral-100">
              {editingTask ? '📝 Edit Task' : '🚀 Add Task'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form to configure task title, description, priority, status, and due date.
            </DialogDescription>
          </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Code auth forms"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2 px-3.5 text-xs text-neutral-200 placeholder-neutral-500 transition-colors focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
              Description
            </label>
            <textarea
              placeholder="Provide a brief task description..."
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2 px-3.5 text-xs text-neutral-200 placeholder-neutral-500 transition-colors focus:border-violet-500/50 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
                Priority
              </label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2 px-3 text-xs text-neutral-250 focus:border-violet-500/50 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2 px-3 text-xs text-neutral-250 focus:border-violet-500/50 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 pl-0.5">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2 px-3.5 text-xs text-neutral-220 focus:border-violet-500/50 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800/40">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    </div>
  );
}
