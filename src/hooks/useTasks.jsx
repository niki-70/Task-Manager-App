import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { user } = useAuth();
  
  const [allTasks, setAllTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('task_manager_tasks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync tasks database to localStorage
  useEffect(() => {
    localStorage.setItem('task_manager_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  // Seed default tasks for a new user if they have 0 tasks in the system
  useEffect(() => {
    if (user) {
      const userTasksCount = allTasks.filter((t) => t.userId === user.id).length;
      if (userTasksCount === 0) {
        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);
        
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(now.getDate() + 5);

        const defaultTasks = [
          {
            id: `tsk_def1_${Date.now()}`,
            userId: user.id,
            title: '🚀 Design Task Manager Dashboard',
            description: 'Refine layout structure using glassmorphism, harmonious HSL/OKLCH color themes, and circular progress widgets.',
            status: 'in-progress',
            priority: 'high',
            dueDate: twoDaysFromNow.toISOString().split('T')[0],
            createdAt: now.toISOString(),
          },
          {
            id: `tsk_def2_${Date.now()}`,
            userId: user.id,
            title: '🔒 Implement User Authentication',
            description: 'Configure clean simulated authentication state with custom hooks using localStorage-backed account creation and sessions.',
            status: 'completed',
            priority: 'medium',
            dueDate: yesterday.toISOString().split('T')[0],
            createdAt: yesterday.toISOString(),
          },
          {
            id: `tsk_def3_${Date.now()}`,
            userId: user.id,
            title: '🧪 Write Automated Integration Tests',
            description: 'Implement simple script-based validation schemas for UI flows and state handlers to keep components robust.',
            status: 'todo',
            priority: 'low',
            dueDate: fiveDaysFromNow.toISOString().split('T')[0],
            createdAt: now.toISOString(),
          }
        ];

        setAllTasks((prev) => [...prev, ...defaultTasks]);
      }
    }
  }, [user, allTasks]);

  // Filter tasks to only include the logged-in user's tasks
  const tasks = user ? allTasks.filter((t) => t.userId === user.id) : [];

  // Add a task
  const addTask = (taskData) => {
    if (!user) throw new Error('Unauthenticated user cannot create tasks.');

    const newTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setAllTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  // Update a task
  const updateTask = (taskId, updatedFields) => {
    setAllTasks((prev) =>
      prev.map((t) => (t.id === taskId && t.userId === user?.id ? { ...t, ...updatedFields } : t))
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setAllTasks((prev) => prev.filter((t) => !(t.id === taskId && t.userId === user?.id)));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
