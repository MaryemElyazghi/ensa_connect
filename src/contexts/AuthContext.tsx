
"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUserInContext: (updatedUserData: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'ensa-connect-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserString = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString) as User;
        // Potentially re-fetch user data here for freshness if needed
        // For now, we'll trust localStorage for simplicity in prototype
        setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userToStore } = userData; // Ensure password is not stored
    setUser(userToStore as User);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setLoading(false);
  }, []);

  const updateUserInContext = useCallback((updatedUserData: User) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userToStore } = updatedUserData; // Ensure password is not stored
    setUser(prevUser => {
      if (prevUser && prevUser.id === userToStore.id) {
        const newUserState = { ...prevUser, ...userToStore } as User;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUserState));
        return newUserState;
      }
      return prevUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserInContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
