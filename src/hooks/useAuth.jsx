import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('task_manager_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('task_manager_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync users database to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('task_manager_users', JSON.stringify(users));
  }, [users]);

  // Sync current user session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('task_manager_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('task_manager_current_user');
    }
  }, [user]);

  // Login handler
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }
    const { password: _, ...safeUser } = foundUser;
    setUser(safeUser);
    return safeUser;
  };

  // Register handler
  const register = (username, email, password) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered.');
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    
    // Auto-login registered user
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return safeUser;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  // Profile update handler
  const updateProfile = (updatedFields) => {
    if (!user) return;
    
    // If email is changing, make sure it is not taken by another user
    if (updatedFields.email && updatedFields.email !== user.email) {
      if (users.some((u) => u.email.toLowerCase() === updatedFields.email.toLowerCase() && u.id !== user.id)) {
        throw new Error('Email is already in use by another account.');
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...updatedFields } : u))
    );

    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
